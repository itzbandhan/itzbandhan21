import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wcryldcvnqziilneabca.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjcnlsZGN2bnF6aWlsbmVhYmNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4OTE2NTksImV4cCI6MjA4MzQ2NzY1OX0.j5thkzdhdEJx3yf_E5vmbFrJ2fSb9x_XXv-CpQMli-8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
