/**
 * CONTEXTO: ToastContextCore
 * OBJETIVO: Definição básica do contexto de notificações (Toasts).
 * POR QUE: Separa a definição do contexto da sua implementação para evitar 
 * dependências circulares e facilitar o acesso global às notificações.
 */
import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
