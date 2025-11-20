# CO-PILOT MÉDICO (Fullstack Challenge)

Sistema de copiloto médico inteligente que transcreve consultas em tempo real, realiza diarização de falantes (Médico vs Paciente) e utiliza IA Generativa (Llama 3.3) para criar prontuários clínicos estruturados e PDF automático.

---

### ESTRUTURA DO PROJETO

- frontend/: Aplicação React (Vite) com Tailwind CSS.
- backend/: API Node.js (Express) que gerencia a IA.

---

### INSTRUÇÕES DE INSTALAÇÃO

Para rodar o projeto, você precisa de dois terminais abertos.

PASSO 1: BACKEND
1. Abra o terminal na pasta "backend"
2. Rode o comando: npm install
3. Crie um arquivo ".env" com a chave da API (veja abaixo)
4. Rode o comando: npm run dev

PASSO 2: FRONTEND
1. Abra outro terminal na pasta "frontend"
2. Rode o comando: npm install
3. Rode o comando: npm run dev

O projeto abrirá em: http://localhost:5173

---

### CONFIGURAÇÃO DA CHAVE (API KEY)

Este projeto usa a Groq Cloud.
1. Vá na pasta "backend"
2. Crie um arquivo chamado ".env"
3. Cole sua chave assim:
OPENAI_API_KEY=sua_chave_aqui

---

### DOCUMENTAÇÃO DA API

O servidor roda na porta 3000.

Endpoint: POST /api/diagnose
Recebe o áudio transcrito e retorna o JSON clínico.

Exemplo de envio:
{ "text": "Paciente com dor de cabeça..." }

---

### TECNOLOGIAS

- Frontend: React, TypeScript, Tailwind CSS, Web Speech API.
- Backend: Node.js, Express, OpenAI SDK (Adapter Groq).
- IA: Modelo llama-3.3-70b-versatile.