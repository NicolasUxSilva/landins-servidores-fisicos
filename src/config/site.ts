// Fatos institucionais e de contato da MSSERVER. Fonte: rodapé e páginas de
// msserver.com.br. Altere aqui, nunca nos componentes.

export const SITE = {
  name: 'MSSERVER',
  origin: 'https://msserver.com.br',
  // URL oficial da página de servidores no site da MSSERVER (ajuste se esta landing ganhar outra URL).
  canonical: 'https://msserver.com.br/servidores-dedicados-para-empresas/',
  // Versão da página para Portugal no site da MSSERVER (link no rodapé e hreflang).
  alternatePtPt: 'https://msserver.com.br/servidores-dedicados-para-empresas-pt/',
  title: 'Servidores Físicos para Empresas | Dell, HP e IBM | MSSERVER',
  description:
    'Servidores Dell, HP e IBM seminovos para empresas, com garantia padrão de 1 ano e extensão até 5 anos, suporte especializado e envio para todo o Brasil. Fale com a equipe pelo WhatsApp.',
  locale: 'pt_BR',
} as const;

export const CONTACT = {
  whatsappNumber: '5511985991837',
  whatsappDisplay: '(11) 98599-1837',
  phoneE164: '+551148585358',
  phoneDisplay: '(11) 4858-5358',
  emailCommercial: 'comercial@msserver.com.br',
  emailGeneral: 'contato@msserver.com.br',
  hours: 'Atendimento das 8h às 18h',
  address: {
    street: 'R. Salvador de Sá, 182',
    district: 'Santa Terezinha',
    city: 'Santo André',
    region: 'SP',
    country: 'BR',
  },
} as const;

export const SOCIAL = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/msserver/' },
  { name: 'Instagram', url: 'https://www.instagram.com/msserver/' },
  { name: 'YouTube', url: 'https://www.youtube.com/@msserversolucoesemservidor9811' },
  { name: 'Facebook', url: 'https://www.facebook.com/msserverinformatica/' },
] as const;

export const APP_STORES = {
  ios: 'https://apps.apple.com/br/app/msserver/id6444350263',
  android: 'https://play.google.com/store/apps/details?id=br.com.msserver',
} as const;

export const LINKS = {
  home: 'https://msserver.com.br/',
  about: 'https://msserver.com.br/sobre/',
  servers: 'https://msserver.com.br/servidores',
  privateCloud: 'https://msserver.com.br/nuvem-privada/',
  warranty: 'https://msserver.com.br/extencao-de-garantia',
  backup: 'https://msserver.com.br/backup-em-nuvem/',
  consulting: 'https://msserver.com.br/consultoria-em-implantacao-de-servidores/',
  app: 'https://msserver.com.br/aplicativo-ms-server/',
  cases: 'https://msserver.com.br/cases-de-sucesso/',
  blog: 'https://msserver.com.br/blog/',
  support: 'https://msserver.com.br/obter-suporte/',
  quote: 'https://msserver.com.br/orcamento/',
} as const;

export const ANALYTICS = {
  // Container GTM usado em msserver.com.br: GTM-KTDRRP3. Só é carregado quando
  // PUBLIC_GTM_ID é definido no build (por exemplo, nas variáveis da Vercel).
  gtmId: (import.meta.env.PUBLIC_GTM_ID as string | undefined) ?? '',
} as const;

export const whatsappUrl = (text: string) => `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(text)}`;

/** Mensagens pré-preenchidas do WhatsApp. */
export const WA = {
  // CTAs gerais: deixa claro para a equipe que o contato procura servidores físicos para empresa.
  general: 'Olá! Vim pela página de servidores físicos e procuro um servidor para a minha empresa.',
  // CTA da seção "Como funciona a compra".
  process: 'Olá! Vi como funciona a compra na página de servidores físicos e quero orientação para escolher o servidor da minha empresa.',
  model: (name: string, form: string, tier: string) =>
    `Olá! Vim pela página de servidores físicos e tenho interesse no ${name} (${form}, ${tier}). Pode me passar disponibilidade e valores para a minha empresa?`,
} as const;
