import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
    baseURL: "https://api.groq.com/openai/v1" 
});

app.post('/api/diagnose', async (req, res) => {
    const { text } = req.body;
    
    if (!text) return res.status(400).json({ error: 'Texto é obrigatório' });

    try {
        console.log("🤖 Processando Diálogo e Clínica...");
        
        const completion = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile", 
            temperature: 0.1,
            messages: [
                {
                    role: "system",
                    content: `Você é um assistente médico inteligente (Co-Pilot).
                    
                    TAREFA 1: Analise o texto bruto da transcrição e separe o diálogo entre "Médico" e "Paciente" baseando-se no contexto (quem faz perguntas técnicas vs quem relata sintomas).
                    TAREFA 2: Gere os dados clínicos estruturados.

                    SAÍDA OBRIGATÓRIA (JSON puro):
                    {
                        "dialogo_estruturado": [
                            {"falante": "Médico", "texto": "Onde dói?"},
                            {"falante": "Paciente", "texto": "Na barriga."}
                        ],
                        "diagnostico_provavel": "Hipótese principal",
                        "doencas_associadas": ["CIDs prováveis"],
                        "exames_sugeridos": ["Lista de exames"],
                        "medicamentos_comuns": ["Lista de princípios ativos"]
                    }

                    Se o texto não tiver diálogo claro, deduza o melhor possível. Responda em PT-BR.`
                },
                { role: "user", content: text }
            ],
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;

        if (content) {
            const result = JSON.parse(content);
            res.json(result);
        } else {
            throw new Error("Resposta vazia");
        }

    } catch (error: any) {
        console.error('❌ Erro:', error);
        res.status(500).json({ error: 'Erro na IA', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`🩺 Servidor rodando na porta ${port}`);
});