/**
 * ENTRY POINT: Main
 * OBJETIVO: Inicialização do React no DOM.
 * POR QUE: É o arquivo de entrada que renderiza o componente raiz (App) 
 * no elemento 'root' do HTML e injeta os estilos globais.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
