import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: './.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
    db: {
        schema: 'public',
    }, 
    auth: {
        persistSession: false,
    },
});


async function testConnection() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(1);
  
      if (error) throw error;
      console.log('✅ Conexão com Supabase estabelecida com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Falha na conexão com Supabase:', error.message);
      process.exit(1);
    };
};

testConnection();