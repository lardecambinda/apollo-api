import { createClient } from '@supabase/supabase-js'

// Dummy WebSocket to satisfy Supabase-js realtime client in Node 20 without installing 'ws' package
if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = class {} as any;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.warn('[SupabaseClient] Warning: Supabase URL or Key is missing. Storage uploads will fail.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
})

// Ensure the public 'posts' and 'transcriptions' buckets exist in the background
supabase.storage.listBuckets().then(({ data: buckets }) => {
  if (buckets) {
    if (!buckets.some(b => b.name === 'posts')) {
      supabase.storage.createBucket('posts', { public: true }).catch(() => {});
    }
    if (!buckets.some(b => b.name === 'transcriptions')) {
      supabase.storage.createBucket('transcriptions', { public: true }).catch(() => {});
    }
  }
}).catch(() => {});
