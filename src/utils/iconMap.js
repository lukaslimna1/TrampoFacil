/**
 * UTIL: iconMap
 * OBJETIVO: Mapeamento inteligente de ícones baseado em palavras-chave.
 * POR QUE: Automatiza a escolha visual de ícones para vagas, garantindo que o card 
 * tenha uma representação gráfica condizente com o cargo sem esforço do recrutador.
 */
import { Code, Megaphone, DollarSign, PenTool, Users, LineChart, Truck, Phone, Briefcase } from 'lucide-react';

export function getIconForJobTitle(title) {
  const t = title.toLowerCase();

  if (t.includes('desenvolvedor') || t.includes('front') || t.includes('back') || t.includes('ti') || t.includes('programador') || t.includes('software')) {
    return Code;
  }
  if (t.includes('marketing') || t.includes('social media') || t.includes('growth')) {
    return Megaphone;
  }
  if (t.includes('vendas') || t.includes('comercial') || t.includes('sdr') || t.includes('closer')) {
    return DollarSign;
  }
  if (t.includes('design') || t.includes('ui') || t.includes('ux') || t.includes('arte')) {
    return PenTool;
  }
  if (t.includes('rh') || t.includes('recursos humanos') || t.includes('recrutador') || t.includes('tech recruiter')) {
    return Users;
  }
  if (t.includes('financeiro') || t.includes('contábil') || t.includes('analista financeiro') || t.includes('dados') || t.includes('data')) {
    return LineChart;
  }
  if (t.includes('logística') || t.includes('estoque') || t.includes('entregador') || t.includes('motorista')) {
    return Truck;
  }
  if (t.includes('atendimento') || t.includes('suporte') || t.includes('recepcionista')) {
    return Phone;
  }

  // Default icon se não encontrar keyword
  return Briefcase;
}
