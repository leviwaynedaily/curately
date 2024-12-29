import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import Sharp from 'https://esm.sh/sharp@0.32.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { mediaId } = await req.json();
    console.log(`Starting optimization for media ID: ${mediaId}`);

    // Get media record
    const { data: media, error: fetchError } = await supabase
      .from('product_media')
      .select('*')
      .eq('id', mediaId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Download original file
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('gallery_images')
      .download(media.file_path);

    if (downloadError) {
      throw downloadError;
    }

    const originalSize = fileData.size;
    let optimizedBuffer;
    let optimizedSize;

    if (media.media_type === 'image') {
      // Optimize image
      const sharp = Sharp(await fileData.arrayBuffer());
      
      // Convert to WebP format
      optimizedBuffer = await sharp
        .webp({ quality: 80 })
        .resize(1920, 1920, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toBuffer();
      
      optimizedSize = optimizedBuffer.length;

      // Upload optimized version
      const optimizedPath = media.file_path.replace(/\.[^/.]+$/, '.webp');
      
      const { error: uploadError } = await supabase.storage
        .from('gallery_images')
        .upload(optimizedPath, optimizedBuffer, {
          contentType: 'image/webp',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Update media record
      const { error: updateError } = await supabase
        .from('product_media')
        .update({
          file_path: optimizedPath,
          original_size: originalSize,
          optimized_size: optimizedSize,
          optimization_status: 'completed'
        })
        .eq('id', mediaId);

      if (updateError) {
        throw updateError;
      }
    }

    console.log(`Optimization completed for media ID: ${mediaId}`, {
      originalSize,
      optimizedSize,
      compressionRatio: optimizedSize ? (originalSize / optimizedSize).toFixed(2) : 'N/A'
    });

    return new Response(
      JSON.stringify({
        success: true,
        originalSize,
        optimizedSize
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Optimization failed:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});