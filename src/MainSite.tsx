import React, { useState, useEffect } from 'react';
import { MessageCircle, Check, Clock, Infinity, HeadphonesIcon, Rocket, Sliders, ShieldCheck, ArrowRight, Send, Menu, X, MonitorPlay, Users, Zap, Play, ChevronDown, Loader2 } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const DEFAULT_CONFIG = {
  logoUrl: "",
  whatsappNumber: "5571996647883",
  siteName: "JP Play",
  heroDescription: "Planos de streaming a partir de R$ {price} ou monte seu negócio como revendedor. Qualidade 4K, suporte 24h e ativação imediata.",
  streamingSectionDescription: "Acesso imediato a canais, filmes e séries em qualidade 4K. Sem fidelidade, cancele quando quiser.",
  revendaSectionDescription: "3 sistemas diferentes para você escolher o modelo que melhor se encaixa no seu perfil. Painel completo e suporte dedicado.",
  streamingMensal: "35",
  streamingMensalDesc: "Acesso completo por 30 dias.",
  streamingTrimestral: "60",
  streamingTrimestralDesc: "Acesso completo por 90 dias.",
  streamingSemestral: "100",
  streamingSemestralDesc: "Acesso completo por 180 dias.",
  streamingAnual: "170",
  streamingAnualDesc: "Acesso completo por 365 dias.",
  revendaMensalista: "150",
  revendaMensalistaDesc: "Acesso ao painel com criação ilimitada de revendas e clientes.",
  revendaPrePagoCredito: "3",
  revendaPrePagoDesc: "Compre créditos e use conforme sua demanda. Sem mensalidade fixa.",
  revendaPrePago10Creditos: "30,00",
  revendaPrePago1Credito: "3,00",
  revendaPosPagoAtivo: "4",
  revendaPosPagoAtivoFormatado: "4,00",
  revendaPosPagoDesc: "Pague apenas pelos clientes ativos. Cobrança todo dia 10."
};

const Marquee = () => {
  const items = [
    { icon: <MonitorPlay className="w-4 h-4 text-[#e50914]" />, text: "Filmes e Séries 4K" },
    { icon: <Zap className="w-4 h-4 text-[#e50914]" />, text: "Ativação Imediata" },
    { icon: <HeadphonesIcon className="w-4 h-4 text-[#e50914]" />, text: "Suporte 24h" },
    { icon: <Users className="w-4 h-4 text-[#e50914]" />, text: "Planos para Revenda" },
    { icon: <MonitorPlay className="w-4 h-4 text-[#e50914]" />, text: "+200 Canais" },
  ];

  return (
    <div className="w-full bg-[#0a0a0a] border-y border-zinc-800/50 py-3 overflow-hidden flex relative z-20">
      <div className="marquee-container">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center shrink-0">
            {items.map((item, j) => (
              <div key={j} className="flex items-center gap-2 px-8 text-sm font-medium text-zinc-400">
                {item.icon}
                {item.text}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function MainSite() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    plano: '',
    mensagem: ''
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setConfig({ ...DEFAULT_CONFIG, ...docSnap.data() });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching config:", error);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const WHATSAPP_NUMBER = config.whatsappNumber;
  const NOME_SITE = config.siteName;
  const HERO_DESC = config.heroDescription.replace("{price}", config.streamingMensal);
  const STREAMING_SECTION_DESC = config.streamingSectionDescription;
  const REVENDA_SECTION_DESC = config.revendaSectionDescription;

  const PRECOS = {
    streaming: {
      mensal: config.streamingMensal,
      mensalDesc: config.streamingMensalDesc,
      trimestral: config.streamingTrimestral,
      trimestralDesc: config.streamingTrimestralDesc,
      semestral: config.streamingSemestral,
      semestralDesc: config.streamingSemestralDesc,
      anual: config.streamingAnual,
      anualDesc: config.streamingAnualDesc,
    },
    revenda: {
      mensalista: config.revendaMensalista,
      mensalistaDesc: config.revendaMensalistaDesc,
      prePagoCredito: config.revendaPrePagoCredito,
      prePagoDesc: config.revendaPrePagoDesc,
      prePago10Creditos: config.revendaPrePago10Creditos,
      prePago1Credito: config.revendaPrePago1Credito,
      posPagoAtivo: config.revendaPosPagoAtivo,
      posPagoAtivoFormatado: config.revendaPosPagoAtivoFormatado,
      posPagoDesc: config.revendaPosPagoDesc,
    }
  };

  const openWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-red-500" /></div>;
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá! Meu nome é ${formData.nome}.%0A%0A*WhatsApp:* ${formData.whatsapp}%0A*Plano de interesse:* ${formData.plano}%0A*Mensagem:* ${formData.mensagem}`;
    openWhatsApp(decodeURIComponent(text));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-red-600/30">
      
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-zinc-800/50 py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Customizada */}
            <div className="flex items-center gap-2">
              {config.logoUrl ? (
                <img src={config.logoUrl} alt={NOME_SITE} className="h-12 object-contain" />
              ) : (
                <>
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 via-red-600 to-red-900 p-[2px] shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                    <div className="w-full h-full bg-[#0a0a0a] rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white ml-1" />
                    </div>
                  </div>
                  <span className="text-3xl font-black tracking-tighter text-white drop-shadow-md">
                    {NOME_SITE.substring(0, 2)}<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">{NOME_SITE.substring(2)}</span>
                  </span>
                </>
              )}
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#planos" className="text-zinc-300 hover:text-white transition-colors drop-shadow-md">Planos</a>
              <a href="#vantagens" className="text-zinc-300 hover:text-white transition-colors drop-shadow-md">Vantagens</a>
              <a href="#revendas" className="text-zinc-300 hover:text-white transition-colors drop-shadow-md">Revendas</a>
              <a href="#como-funciona" className="text-zinc-300 hover:text-white transition-colors drop-shadow-md">Como Funciona</a>
              <a href="#contato" className="text-zinc-300 hover:text-white transition-colors drop-shadow-md">Contato</a>
            </div>

            <div className="hidden md:block">
              <button 
                onClick={() => openWhatsApp(`Olá! Gostaria de assinar a ${NOME_SITE}.`)}
                className="bg-[#e50914] hover:bg-[#b80710] text-white px-6 py-2.5 rounded-full font-bold transition-all flex items-center gap-2 text-sm shadow-lg shadow-red-900/20"
              >
                <MessageCircle className="w-4 h-4" />
                Assinar Agora
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-zinc-300 p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-[#0f0f0f] border-b border-zinc-800 absolute w-full">
            <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
              <a href="#planos" onClick={() => setIsMenuOpen(false)} className="text-zinc-300 py-2">Planos</a>
              <a href="#vantagens" onClick={() => setIsMenuOpen(false)} className="text-zinc-300 py-2">Vantagens</a>
              <a href="#revendas" onClick={() => setIsMenuOpen(false)} className="text-zinc-300 py-2">Revendas</a>
              <a href="#como-funciona" onClick={() => setIsMenuOpen(false)} className="text-zinc-300 py-2">Como Funciona</a>
              <a href="#contato" onClick={() => setIsMenuOpen(false)} className="text-zinc-300 py-2">Contato</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section com Fundo de Cinema */}
      <section className="relative pt-40 pb-20 px-4 min-h-[80vh] flex flex-col justify-center">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop" 
            alt="Cinema" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]"></div>
          <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
            Sistema Profissional • Painel Completo • Suporte 24h
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tight drop-shadow-2xl">
            Assista tudo.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Venda mais.</span><br/>
            {NOME_SITE} para todos.
          </h1>
          
          <p className="text-zinc-300 max-w-2xl text-lg md:text-xl mb-10 drop-shadow-md">
            {HERO_DESC}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <a href="#planos" className="bg-[#e50914] hover:bg-[#b80710] text-white px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(229,9,20,0.4)]">
              <MonitorPlay className="w-5 h-5" />
              Assinar Agora
            </a>
            <a href="#revendas" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 border border-white/10">
              <Users className="w-5 h-5" />
              Ser Revendedor
            </a>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
            <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
                <MonitorPlay className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white">R$ {PRECOS.streaming.mensal}</div>
                <div className="text-xs text-zinc-400">Plano mensal</div>
              </div>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white">Revenda</div>
                <div className="text-xs text-zinc-400">A partir de R$ {PRECOS.revenda.prePagoCredito}</div>
              </div>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
                <HeadphonesIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white">24h</div>
                <div className="text-xs text-zinc-400">Suporte online</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <Marquee />

      {/* Quick Access Cards */}
      <section className="py-12 px-4 bg-[#0a0a0a] relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          <a href="#planos" className="group bg-[#121212] border border-zinc-800 hover:border-red-500/50 rounded-2xl p-6 flex items-center justify-between transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                <MonitorPlay className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Para assistir</h3>
                <p className="text-sm text-zinc-400">Planos a partir de R$ {PRECOS.streaming.mensal}/mês</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-red-500">
              Ver planos <ChevronDown className="w-4 h-4" />
            </div>
          </a>

          <a href="#revendas" className="group bg-[#121212] border border-zinc-800 hover:border-red-500/50 rounded-2xl p-6 flex items-center justify-between transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Para revender</h3>
                <p className="text-sm text-zinc-400">Monte seu negócio de streaming</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-red-500">
              Ver sistemas <ChevronDown className="w-4 h-4" />
            </div>
          </a>
        </div>
      </section>

      {/* Planos Streaming */}
      <section id="planos" className="pt-12 pb-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-900/30 bg-red-950/20 text-red-500 text-xs font-bold tracking-widest uppercase mb-8">
            <MonitorPlay className="w-4 h-4" />
            Para Assistir
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Escolha seu <span className="text-[#e50914]">plano de streaming</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg mb-16">
            {STREAMING_SECTION_DESC}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Mensal */}
            <div className="bg-[#121212] border border-[#e50914]/50 rounded-2xl p-8 relative shadow-[0_0_30px_-10px_rgba(229,9,20,0.3)] flex flex-col hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#e50914] text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                🔥 Mais Popular
              </div>
              <div className="text-sm font-bold tracking-widest text-zinc-400 mb-4 uppercase flex items-center gap-2">
                <Clock className="w-4 h-4" /> Mensal
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-zinc-400 font-bold">R$</span>
                <span className="text-5xl font-black">{PRECOS.streaming.mensal}</span>
                <span className="text-zinc-500 text-sm">/mês</span>
              </div>
              <p className="text-sm text-zinc-400 mb-8 pb-8 border-b border-zinc-800">{PRECOS.streaming.mensalDesc}</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                {['+200 canais ao vivo', 'Filmes e séries 4K', 'Suporte 24h', 'Ativação imediata'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-[#e50914]" /> {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => openWhatsApp(`Olá! Quero assinar o plano de streaming MENSAL (R$ ${PRECOS.streaming.mensal}).`)}
                className="w-full bg-[#e50914] hover:bg-[#b80710] text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> Assinar Mensal
              </button>
            </div>

            {/* Trimestral */}
            <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-8 flex flex-col hover:-translate-y-2 transition-transform duration-300">
              <div className="text-sm font-bold tracking-widest text-zinc-400 mb-4 uppercase flex items-center gap-2">
                <Clock className="w-4 h-4" /> Trimestral
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-zinc-400 font-bold">R$</span>
                <span className="text-5xl font-black">{PRECOS.streaming.trimestral}</span>
                <span className="text-zinc-500 text-sm">/3 meses</span>
              </div>
              <p className="text-sm text-zinc-400 mb-8 pb-8 border-b border-zinc-800">{PRECOS.streaming.trimestralDesc}</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                {['+200 canais ao vivo', 'Filmes e séries 4K', 'Suporte 24h', 'Ativação imediata'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-[#e50914]" /> {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => openWhatsApp(`Olá! Quero assinar o plano de streaming TRIMESTRAL (R$ ${PRECOS.streaming.trimestral}).`)}
                className="w-full bg-[#1a1a1a] hover:bg-[#222] text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> Assinar Trimestral
              </button>
            </div>

            {/* Semestral */}
            <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-8 flex flex-col hover:-translate-y-2 transition-transform duration-300">
              <div className="text-sm font-bold tracking-widest text-zinc-400 mb-4 uppercase flex items-center gap-2">
                <Clock className="w-4 h-4" /> Semestral
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-zinc-400 font-bold">R$</span>
                <span className="text-5xl font-black">{PRECOS.streaming.semestral}</span>
                <span className="text-zinc-500 text-sm">/6 meses</span>
              </div>
              <p className="text-sm text-zinc-400 mb-8 pb-8 border-b border-zinc-800">{PRECOS.streaming.semestralDesc}</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                {['+200 canais ao vivo', 'Filmes e séries 4K', 'Suporte 24h', 'Ativação imediata'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-[#e50914]" /> {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => openWhatsApp(`Olá! Quero assinar o plano de streaming SEMESTRAL (R$ ${PRECOS.streaming.semestral}).`)}
                className="w-full bg-[#1a1a1a] hover:bg-[#222] text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> Assinar Semestral
              </button>
            </div>

            {/* Anual */}
            <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-8 flex flex-col hover:-translate-y-2 transition-transform duration-300">
              <div className="text-sm font-bold tracking-widest text-zinc-400 mb-4 uppercase flex items-center gap-2">
                <Clock className="w-4 h-4" /> Anual
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-zinc-400 font-bold">R$</span>
                <span className="text-5xl font-black">{PRECOS.streaming.anual}</span>
                <span className="text-zinc-500 text-sm">/ano</span>
              </div>
              <p className="text-sm text-zinc-400 mb-8 pb-8 border-b border-zinc-800">{PRECOS.streaming.anualDesc}</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                {['+200 canais ao vivo', 'Filmes e séries 4K', 'Suporte 24h', 'Ativação imediata'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-[#e50914]" /> {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => openWhatsApp(`Olá! Quero assinar o plano de streaming ANUAL (R$ ${PRECOS.streaming.anual}).`)}
                className="w-full bg-[#1a1a1a] hover:bg-[#222] text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> Assinar Anual
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section id="vantagens" className="py-24 px-4 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-red-900/30 bg-red-950/20 text-red-500 text-xs font-bold tracking-widest uppercase mb-6">
              Por que {NOME_SITE}?
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Tudo que você precisa <br/><span className="text-[#e50914]">em um só lugar</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Para quem assiste e para quem revende — a plataforma mais completa do mercado.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <MonitorPlay />, title: "Painel Profissional", desc: "Interface completa e intuitiva para gerenciar todos os seus clientes e revendas em um só lugar." },
              { icon: <Infinity />, title: "Sem Limite de Clientes", desc: "Crie quantos clientes e revendas quiser. Seu negócio cresce sem restrições ou custos extras." },
              { icon: <HeadphonesIcon />, title: "Suporte 24 Horas", desc: "Equipe dedicada disponível todos os dias pelo WhatsApp. Problema resolvido na hora." },
              { icon: <Rocket />, title: "Ativação Imediata", desc: "Tudo automatizado. Seu painel ou acesso é liberado no mesmo instante após a confirmação." },
              { icon: <Sliders />, title: "Totalmente Personalizável", desc: "Defina seus próprios preços, crie pacotes customizados e tenha total controle do seu lucro." },
              { icon: <ShieldCheck />, title: "Sistema Estável", desc: "Servidores de alta performance garantindo 99.9% de uptime para você e seus clientes." }
            ].map((item, i) => (
              <div key={i} className="bg-[#0f0f0f] border border-zinc-800/50 p-8 rounded-2xl hover:border-zinc-700 transition-colors">
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-6 text-zinc-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revendas */}
      <section id="revendas" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Monte seu negócio de <span className="text-[#e50914]">streaming</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              {REVENDA_SECTION_DESC}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Mensalista */}
            <div className="bg-[#121212] border border-[#e50914]/30 rounded-2xl p-8 flex flex-col relative hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute top-6 right-6 bg-red-950/30 text-red-500 px-3 py-1 rounded-full text-xs font-bold border border-red-900/50">
                👑 Mais Completo
              </div>
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-6 text-zinc-300">
                <MonitorPlay className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-1">Mensalista</h3>
              <p className="text-zinc-500 text-sm mb-6">Painel {NOME_SITE} Mensalista</p>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-zinc-400 font-bold">R$</span>
                <span className="text-5xl font-black">{PRECOS.revenda.mensalista}</span>
                <span className="text-zinc-500 text-sm">/mês</span>
              </div>
              <p className="text-sm text-zinc-400 mb-8 pb-8 border-b border-zinc-800">{PRECOS.revenda.mensalistaDesc}</p>

              <ul className="space-y-4 mb-8 flex-1">
                {['Acesso ilimitado ao painel', 'Criação de revendas sem limite', 'Criação de clientes sem limite', 'Suporte via WhatsApp 24h', 'Ativação imediata'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-[#e50914]" /> {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => openWhatsApp(`Olá! Tenho interesse no painel de revenda MENSALISTA (R$ ${PRECOS.revenda.mensalista}/mês).`)}
                className="w-full bg-[#e50914] hover:bg-[#b80710] text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> Assinar Mensalista
              </button>
            </div>

            {/* Pré-Pago */}
            <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-8 flex flex-col relative hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute top-6 right-6 bg-zinc-800/50 text-zinc-300 px-3 py-1 rounded-full text-xs font-bold border border-zinc-700">
                ⏱ Mais Flexível
              </div>
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-6 text-zinc-300">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-1">Pré-Pago</h3>
              <p className="text-zinc-500 text-sm mb-6">Sistema Pré-Pago {NOME_SITE}</p>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-zinc-400 font-bold">R$</span>
                <span className="text-5xl font-black">{PRECOS.revenda.prePagoCredito}</span>
                <span className="text-zinc-500 text-sm">/crédito</span>
              </div>
              <p className="text-sm text-zinc-400 mb-8">{PRECOS.revenda.prePagoDesc}</p>

              <div className="bg-[#1a1a1a] rounded-xl p-4 mb-8 border border-zinc-800">
                <div className="text-xs font-bold text-zinc-500 uppercase mb-3 flex items-center gap-2">
                  <MonitorPlay className="w-4 h-4" /> Tabela de Créditos
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-300">10 créditos</span>
                  <span className="font-bold">R$ {PRECOS.revenda.prePago10Creditos}</span>
                </div>
                <div className="flex justify-between text-sm pb-3 border-b border-zinc-800 mb-3">
                  <span className="text-zinc-300">1 crédito</span>
                  <span className="font-bold">R$ {PRECOS.revenda.prePago1Credito}</span>
                </div>
                <div className="text-xs text-zinc-500 flex items-center gap-1 mb-1">
                  <div className="w-3 h-3 rounded-full bg-zinc-800 flex items-center justify-center text-[8px]">i</div>
                  1 crédito = 1 mês de acesso
                </div>
                <div className="text-xs text-zinc-500 flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-zinc-800 flex items-center justify-center text-[8px]">i</div>
                  2 conexões = 1 crédito
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {['Sem mensalidade fixa', 'Pague só o que usar', 'Painel completo incluso', 'Suporte via WhatsApp 24h'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-[#e50914]" /> {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => openWhatsApp("Olá! Tenho interesse no painel de revenda PRÉ-PAGO.")}
                className="w-full bg-[#1a1a1a] hover:bg-[#222] text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border border-zinc-800"
              >
                <MessageCircle className="w-5 h-5" /> Comprar Créditos
              </button>
            </div>

            {/* Pós-Pago */}
            <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-8 flex flex-col relative hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute top-6 right-6 bg-zinc-800/50 text-zinc-300 px-3 py-1 rounded-full text-xs font-bold border border-zinc-700">
                📈 Escale Mais
              </div>
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-6 text-zinc-300">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-1">Pós-Pago</h3>
              <p className="text-zinc-500 text-sm mb-6">Sistema Pós-Pago {NOME_SITE}</p>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-zinc-400 font-bold">R$</span>
                <span className="text-5xl font-black">{PRECOS.revenda.posPagoAtivo}</span>
                <span className="text-zinc-500 text-sm">/ativo/mês</span>
              </div>
              <p className="text-sm text-zinc-400 mb-8">{PRECOS.revenda.posPagoDesc}</p>

              <div className="bg-[#1a1a1a] rounded-xl p-4 mb-8 border border-zinc-800 space-y-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 text-zinc-500"><Users className="w-4 h-4" /></div>
                  <div>
                    <div className="text-sm font-bold text-zinc-200">R$ {PRECOS.revenda.posPagoAtivoFormatado} por ativo</div>
                    <div className="text-xs text-zinc-500">Só paga quem está usando</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5 text-zinc-500"><Clock className="w-4 h-4" /></div>
                  <div>
                    <div className="text-sm font-bold text-zinc-200">Pagamento todo dia 10</div>
                    <div className="text-xs text-zinc-500">Cobrança mensal automática</div>
                  </div>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {[`R$ ${PRECOS.revenda.posPagoAtivoFormatado} por cliente ativo`, '1 crédito = 2 telas (conexões)', 'Pague só pelos ativos', 'Cobrança todo dia 10', 'Painel completo incluso', 'Suporte via WhatsApp 24h'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-[#e50914]" /> {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => openWhatsApp("Olá! Tenho interesse no painel de revenda PÓS-PAGO.")}
                className="w-full bg-[#1a1a1a] hover:bg-[#222] text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border border-zinc-800"
              >
                <MessageCircle className="w-5 h-5" /> Ativar Pós-Pago
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-24 px-4 bg-[#050505]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-red-900/30 bg-red-950/20 text-red-500 text-xs font-bold tracking-widest uppercase mb-6">
            Simples Assim
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tight">
            Como começar a <br/><span className="text-[#e50914]">revender em 4 passos</span>
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {[
              { num: "01", icon: <MessageCircle className="w-5 h-5 text-[#e50914]" />, title: "Entre em Contato", desc: "Fale com a gente pelo WhatsApp e escolha o plano ideal para o seu negócio." },
              { num: "02", icon: <ShieldCheck className="w-5 h-5 text-[#e50914]" />, title: "Faça o Pagamento", desc: "Pagamento rápido e seguro. Confirmação em minutos." },
              { num: "03", icon: <MonitorPlay className="w-5 h-5 text-[#e50914]" />, title: "Acesse o Painel", desc: `Receba seus dados de acesso e entre no painel profissional ${NOME_SITE}.` },
              { num: "04", icon: <Rocket className="w-5 h-5 text-[#e50914]" />, title: "Comece a Faturar", desc: "Crie seus clientes e revendas e comece a lucrar imediatamente." }
            ].map((step, i, arr) => (
              <React.Fragment key={i}>
                <div className="bg-[#0f0f0f] border border-zinc-800/50 p-8 rounded-2xl w-full md:w-64 flex flex-col items-center text-center relative hover:border-zinc-700 transition-colors">
                  <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-4 font-black text-zinc-500">
                    {step.num}
                  </div>
                  <div className="mb-4">{step.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="hidden md:block text-zinc-800">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-red-900/30 bg-red-950/20 text-red-500 text-xs font-bold tracking-widest uppercase mb-6">
              Fale Conosco
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Pronto para <span className="text-[#e50914]">começar?</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-lg">
              Seja para assistir ou revender, entre em contato agora. Nossa equipe ativa seu acesso em minutos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Info Cards */}
            <div className="space-y-4">
              <div 
                onClick={() => openWhatsApp("Olá! Gostaria de tirar algumas dúvidas.")}
                className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#e50914] rounded-xl flex items-center justify-center text-white">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#e50914] tracking-widest uppercase mb-1">Atendimento Direto</div>
                    <div className="text-lg font-bold text-white">Falar no WhatsApp</div>
                    <div className="text-sm text-zinc-500">Clique para conversar</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
              </div>

              <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-zinc-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-0.5">Horário de Atendimento</div>
                  <div className="text-xs text-zinc-500">Todos os dias • 10h às 23h</div>
                </div>
              </div>

              <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-zinc-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-0.5">Ativação Rápida</div>
                  <div className="text-xs text-zinc-500">Painel ativo em minutos</div>
                </div>
              </div>

              <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-zinc-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-0.5">Pagamento Seguro</div>
                  <div className="text-xs text-zinc-500">Pix, cartão e boleto</div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-red-950/30 rounded-xl flex items-center justify-center text-[#e50914] border border-red-900/30">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Solicite seu acesso</h3>
                  <p className="text-xs text-zinc-500">Preencha e te respondemos no WhatsApp</p>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400">Nome</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Seu nome completo"
                      className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#e50914] transition-colors"
                      value={formData.nome}
                      onChange={e => setFormData({...formData, nome: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400">WhatsApp</label>
                    <input 
                      required
                      type="text" 
                      placeholder="(00) 00000-0000"
                      className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#e50914] transition-colors"
                      value={formData.whatsapp}
                      onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400">Plano de interesse</label>
                  <select 
                    required
                    className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#e50914] transition-colors appearance-none"
                    value={formData.plano}
                    onChange={e => setFormData({...formData, plano: e.target.value})}
                  >
                    <option value="" disabled>Selecione um plano</option>
                    <optgroup label="Streaming">
                      <option value={`Streaming Mensal (R$ ${PRECOS.streaming.mensal})`}>Streaming Mensal (R$ {PRECOS.streaming.mensal})</option>
                      <option value={`Streaming Trimestral (R$ ${PRECOS.streaming.trimestral})`}>Streaming Trimestral (R$ {PRECOS.streaming.trimestral})</option>
                      <option value={`Streaming Semestral (R$ ${PRECOS.streaming.semestral})`}>Streaming Semestral (R$ {PRECOS.streaming.semestral})</option>
                      <option value={`Streaming Anual (R$ ${PRECOS.streaming.anual})`}>Streaming Anual (R$ {PRECOS.streaming.anual})</option>
                    </optgroup>
                    <optgroup label="Revenda">
                      <option value={`Revenda Mensalista (R$ ${PRECOS.revenda.mensalista})`}>Revenda Mensalista (R$ {PRECOS.revenda.mensalista})</option>
                      <option value="Revenda Pré-Pago">Revenda Pré-Pago</option>
                      <option value="Revenda Pós-Pago">Revenda Pós-Pago</option>
                    </optgroup>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400">Mensagem <span className="text-zinc-600 font-normal">(opcional)</span></label>
                  <textarea 
                    rows={3}
                    placeholder="Alguma dúvida ou observação?"
                    className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#e50914] transition-colors resize-none"
                    value={formData.mensagem}
                    onChange={e => setFormData({...formData, mensagem: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#e50914] hover:bg-[#b80710] text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <MessageCircle className="w-5 h-5" /> Enviar pelo WhatsApp
                </button>
                <p className="text-center text-[10px] text-zinc-600 mt-4 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Seus dados são usados apenas para contato
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-zinc-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              {config.logoUrl ? (
                <img src={config.logoUrl} alt={NOME_SITE} className="h-8 object-contain opacity-80 hover:opacity-100 transition-opacity" />
              ) : (
                <>
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 via-red-600 to-red-900 p-[2px]">
                    <div className="w-full h-full bg-[#0a0a0a] rounded-full flex items-center justify-center">
                      <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="text-xl font-black tracking-tighter text-white">
                    {NOME_SITE.substring(0, 2)}<span className="text-[#e50914]">{NOME_SITE.substring(2)}</span>
                  </span>
                </>
              )}
            </div>
            <div className="text-zinc-500 text-sm">
              &copy; {new Date().getFullYear()} {NOME_SITE}. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
