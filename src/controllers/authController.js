import { supabase } from "../data/supabaseClient.js";
import validator from "validator";

export const registrarUsuario = async (req, res) => {
    try {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: "Corpo da requisição inválido" });
        };

        const { email, password, nome } = req.body;

        if (!email || !password || !nome) {
            return res.status(400).json({ 
                error: "Todos os campos são obrigatórios: email, password, nome" 
            });
        };

        if (!validator.isEmail(email)){
            return res.status(403).json({
                success: false,
                error: "Formato do Email inválido!"
            })
        }

        const { data: jaCadastrado, error: checkError } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .maybeSingle();
        
        if (checkError) {
            throw checkError;
        };

        if (jaCadastrado) {
            return res.status(403).json({
                success: false,
                error: "Email já cadastrado!"
            })
        };

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) throw authError;

        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert([{ 
                id: authData.user.id,
                email,
                name: nome,
                created_at: new Date().toISOString()
            }]);

        if (userError) throw userError;

        res.status(201).json({ 
            success: true,
            authData: {
                id: authData.user.id,
                email: authData.user.email
            },
            userData 
        });
        
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: error.message,
            details: error 
        });
    }
};

export const loginUsuario = async (req, res) => {
    try {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: "Corpo da requisição inválido" });
        };

        const { email, password } = req.body;

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) throw authError;

        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, name')
            .eq('id', authData.user.id)
            .single();

        if (userError) throw userError;

        res.status(200).json({
            success: true,
            user: {
                id: userData.id,
                email: userData.email,
                name: userData.name
            },
            session: authData.session
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            error: "Credenciais inválidas",
            details: error.message
        });
    };
};

export const validateToken = async (req, res) => {
    try {
        const authHearder = req.headers.authorization;
        if (!authHearder?.startsWith('Bearer ')) {
            return res.status(401).json({error: "Token não fornecido"});
        };

        const token = authHearder.split(' ')[1];

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({error: "Token inválido"})
        };

        return res.status(200).json({
            success: true,
            user: user,
            message: 'Token válido!'
        });
    } catch (error) {
        console.error(error, "Erro ao validar toke");
        res.status(500).json({error: "Erro interno no servidor"});
    };
};