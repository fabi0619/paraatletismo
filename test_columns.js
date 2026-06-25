import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qlytrcwytowverzetlkv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFseXRyY3d5dG93dmVyemV0bGt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjY2MTQsImV4cCI6MjA5NTUwMjYxNH0.cL-A9VtVjJ-PvBtHZ1T-mRgURSwI78SrkmSvmdkg_eg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const { data, error } = await supabase.from('para_profesores').select('*').limit(1);
  if (error) {
    console.error(error);
  } else {
    console.log("Columns on para_profesores:", data.length > 0 ? Object.keys(data[0]) : "No rows in table to inspect");
  }
}

test();
