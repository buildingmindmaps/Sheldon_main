
import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = 'https://ojxncmydgspcxmtxosez.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeG5jbXlkZ3NwY3htdHhvc2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNjQ3MDMsImV4cCI6MjA2Mjc0MDcwM30.Mlei9UwNoYmbefINGbN5SFJoaC_1Ncr_9bReksCwJfQ'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
