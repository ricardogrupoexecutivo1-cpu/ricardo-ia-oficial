import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bcmizhybctzsoxfugjvv.supabase.co'
const supabaseAnonKey = 'sb_publishable_kPvfSEWnqyYhlIfh6ThcTg_Qt6nxJCG'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)