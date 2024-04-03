import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://otqbhefsekdjnoflulhv.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90cWJoZWZzZWtkam5vZmx1bGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcwMDEzNTYsImV4cCI6MjAyMjU3NzM1Nn0.FRqjF9iwm94s0-IMDXKbP5oW0JCP1LWpp0A1NV9LpMo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
