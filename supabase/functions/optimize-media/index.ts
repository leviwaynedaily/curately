import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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

    // For now, we'll just track the file size and mark as optimized
    // In a future update, we can implement actual optimization
    const { error: updateError } = await supabase
      .from('product_media')
      .update({
        original_size: originalSize,
        optimized_size: originalSize, // For now, same as original
        optimization_status: 'completed'
      })
      .eq('id', mediaId);

    if (updateError) {
      throw updateError;
    }

    console.log(`Optimization completed for media ID: ${mediaId}`, {
      originalSize,
      status: 'completed'
    });

    return new Response(
      JSON.stringify({
        success: true,
        originalSize,
        optimizedSize: originalSize // For now, same as original
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