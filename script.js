import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jplabypqlbviskgkxapf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwbGFieXBxbGJ2aXNrZ2t4YXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxMTg2NTgsImV4cCI6MjA1MzY5NDY1OH0.yWbJOxhJRZ0eI-IAQr2tRMK3rTHGTrYbw4Q9xp1d9XI';
const supabase = createClient(supabaseUrl, supabaseKey);

const videoNames = [];
const videoSources = [];

async function fetchData() {
    const { data, error } = await supabase
        .from('videos')
        .select('video_name, video_links'); // Select only needed fields

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    // Populate the arrays
    data.forEach(video => {
        videoNames.push(video.video_name);
        videoSources.push(video.video_links);
    });

    console.log('Video Names:', videoNames);
    console.log('Video Sources:', videoSources);
}

fetchData();
