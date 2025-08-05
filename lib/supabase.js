
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://ousjbsetekamtccyovct.supabase.co';
const supabaseAnonKey = 'sb_publishable_CWoNHUbkI5UV2mens3DyHQ_gj_6cYn8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)