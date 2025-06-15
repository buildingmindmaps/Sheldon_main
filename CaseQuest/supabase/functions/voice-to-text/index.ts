
import { serve } from "std/http/server.ts";
import { decode } from "std/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // This is needed to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { audio } = await req.json(); // 'audio' is the base64 string
    if (!audio) {
      return new Response(JSON.stringify({ error: 'Missing audio data' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Decode the base64 audio string to a Uint8Array
    const audioBytes = decode(audio);

    // Create a Blob from the Uint8Array.
    // The client sends 'audio/webm', so we use that here.
    const audioBlob = new Blob([audioBytes], { type: 'audio/webm' });

    // Create FormData for Whisper API
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm'); // Use a matching filename
    formData.append('model', 'whisper-1');

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI Whisper API error:', errorText);
      return new Response(JSON.stringify({ error: `Error from OpenAI Whisper API: ${errorText}` }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const data = await response.json();
    const transcript = data.text || 'Transcription not available';

    return new Response(
      JSON.stringify({ text: transcript }), // Use 'text' to match client expectation
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );

  } catch (error) {
    console.error("Error processing request:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
