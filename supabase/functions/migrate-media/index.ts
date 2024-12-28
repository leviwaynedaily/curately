import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log("Starting media migration...");

    // First, get all product media records
    const { data: mediaRecords, error: fetchError } = await supabase
      .from('product_media')
      .select('*');

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${mediaRecords?.length || 0} media records to migrate`);

    const results = [];
    
    // Process each media record
    for (const record of mediaRecords || []) {
      try {
        console.log(`Processing file: ${record.file_path}`);
        
        // Download from gallery_images
        const { data: fileData, error: downloadError } = await supabase
          .storage
          .from('gallery_images')
          .download(record.file_path);

        if (downloadError) {
          console.error(`Error downloading ${record.file_path}:`, downloadError);
          results.push({ path: record.file_path, status: 'error', error: downloadError });
          continue;
        }

        // Upload to product_media
        const { error: uploadError } = await supabase
          .storage
          .from('product_media')
          .upload(record.file_path, fileData, {
            contentType: fileData.type,
            upsert: true
          });

        if (uploadError) {
          console.error(`Error uploading ${record.file_path}:`, uploadError);
          results.push({ path: record.file_path, status: 'error', error: uploadError });
          continue;
        }

        results.push({ path: record.file_path, status: 'success' });
        console.log(`Successfully migrated: ${record.file_path}`);
      } catch (error) {
        console.error(`Error processing ${record.file_path}:`, error);
        results.push({ path: record.file_path, status: 'error', error: error.message });
      }
    }

    const summary = {
      total: results.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      details: results
    };

    console.log("Migration complete:", summary);

    return new Response(
      JSON.stringify(summary),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Migration failed:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})