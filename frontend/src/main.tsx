import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // <--- É aqui que chamamos o estilo, não escrevemos ele

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)