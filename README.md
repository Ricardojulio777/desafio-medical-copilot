# 🩺 Co-Pilot Médico (Fullstack Challenge)

Sistema de copiloto médico inteligente que transcreve consultas em tempo real, realiza diarização de falantes (Médico vs Paciente) e utiliza IA Generativa (Llama 3.3) para criar prontuários clínicos estruturados e PDF automático.

![Status](https://img.shields.io/badge/Status-Finalizado-green)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Groq%20AI-blue)

---

## 📦 Estrutura do Projeto

O repositório está organizado em duas camadas principais:
- **`frontend/`**: Aplicação React (Vite) com Tailwind CSS e reconhecimento de voz.
- **`backend/`**: API Node.js (Express) que gerencia a lógica de IA.

- ---

## 🚀 Instruções de Instalação e Execução

Para rodar o projeto, é necessário executar o Backend e o Frontend simultaneamente em terminais separados.

### 1. Configuração do Backend
Abra um terminal na raiz do projeto e execute:

```
bash
cd backend
npm install
```
# Crie o arquivo .env (veja a seção abaixo "Configuração da IA")
```
npm run dev
```


### 2. Configuração do Frontend
Abra um **segundo terminal** na raiz do projeto e execute:

```
bash
cd frontend
npm install
npm run dev
```

📍 **Acesse a aplicação em:** `http://localhost:5173`

---

## 🔑 Configuração da IA (API Key)

Este projeto utiliza a **Groq Cloud** para processamento de linguagem natural de alta performance.

1. Navegue até a pasta `backend/`.
2. Crie um arquivo chamado `.env`.
3. Adicione sua chave de API conforme abaixo:

```env
OPENAI_API_KEY=sua_chave_da_groq_aqui
```
---

## 📡 Documentação da API

O servidor roda na porta `3000`.

### `POST /api/diagnose`
Endpoint responsável por receber o texto bruto e retornar a análise clínica.

- **URL:** `http://localhost:3000/api/diagnose`
- **Formato:** JSON
- **Body da Requisição:**

  ```
  {
    "text": "Doutor, estou com dor de cabeça..."
  }
  ```

## 🛠️ Stack Tecnológica
- **Frontend:** React, TypeScript, Tailwind CSS, Lucide Icons, Web Speech API.
- **Backend:** Node.js, Express, TypeScript, OpenAI SDK (Adapter Groq).
- **IA:** Modelo `llama-3.3-70b-versatile`.

---

## ⚠️ Aviso Legal

Este projeto é uma prova de conceito (PoC) técnica. As sugestões médicas geradas pela IA servem apenas como auxílio à documentação e não substituem o julgamento clínico profissional.
