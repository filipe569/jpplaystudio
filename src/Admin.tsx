import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { ShieldCheck, LogOut, Save, Loader2 } from 'lucide-react';

const ADMIN_EMAIL = "phillip.sukf@gmail.com";

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

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [config, setConfig] = useState<any>(DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
      
      if (currentUser?.email === ADMIN_EMAIL) {
        // Fetch config
        const docRef = doc(db, 'config', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setConfig({ ...DEFAULT_CONFIG, ...docSnap.data() });
        } else {
          // Initialize if not exists
          await setDoc(docRef, DEFAULT_CONFIG);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        console.log("Login cancelado pelo usuário.");
      } else {
        console.error("Erro ao fazer login", error);
        alert(`Erro ao fazer login: ${error.code} - ${error.message}`);
      }
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await setDoc(doc(db, 'config', 'main'), config);
      setMessage('Configurações salvas com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Erro ao salvar", error);
      setMessage('Erro ao salvar. Verifique se você tem permissão.');
    }
    setSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress as webp to save space (Firestore limit is 1MB)
        const compressedBase64 = canvas.toDataURL('image/webp', 0.8);
        setConfig({ ...config, logoUrl: compressedBase64 });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (loadingAuth) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin text-red-500" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-[#121212] border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center">
          <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h1>
          <p className="text-zinc-400 mb-8">Faça login com sua conta de administrador para configurar o site.</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-white text-black hover:bg-zinc-200 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-[#121212] border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center">
          <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Acesso Negado</h1>
          <p className="text-zinc-400 mb-8">O email {user.email} não tem permissão de administrador.</p>
          <button 
            onClick={handleLogout}
            className="w-full bg-zinc-800 text-white hover:bg-zinc-700 py-3 rounded-xl font-bold transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-800">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ShieldCheck className="text-red-500" /> Painel de Controle
            </h1>
            <p className="text-zinc-400 mt-1">Altere as informações e preços do site em tempo real.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-4 py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Configurações Gerais */}
          <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">Configurações Gerais</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-zinc-400 mb-2">Logo do Site (Imagem)</label>
                <div className="flex items-center gap-4">
                  {config.logoUrl && (
                    <img src={config.logoUrl} alt="Logo Preview" className="h-12 object-contain bg-black p-1 rounded" />
                  )}
                  <input 
                    type="file" accept="image/*" onChange={handleImageUpload}
                    className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">Selecione uma imagem para substituir o texto da logo no site.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-400 mb-2">Nome do Site</label>
                <input 
                  type="text" name="siteName" value={config.siteName} onChange={handleChange} required
                  className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-400 mb-2">Número do WhatsApp (com 55 e DDD)</label>
                <input 
                  type="text" name="whatsappNumber" value={config.whatsappNumber} onChange={handleChange} required
                  className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">Descrição do Hero (Início)</label>
              <textarea 
                name="heroDescription" value={config.heroDescription} onChange={handleChange} required rows={3}
                className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 resize-none"
              />
              <p className="text-[10px] text-zinc-500 mt-1">Dica: Use {"{price}"} para mostrar o preço mensal automaticamente.</p>
            </div>
          </div>

          {/* Preços Streaming */}
          <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">Streaming - Preços e Descrições</h2>
            <div className="mb-6">
              <label className="block text-sm font-bold text-zinc-400 mb-2">Descrição da Seção Streaming</label>
              <textarea 
                name="streamingSectionDescription" value={config.streamingSectionDescription} onChange={handleChange} required rows={2}
                className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 resize-none"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1">Mensal (R$)</label>
                    <input type="text" name="streamingMensal" value={config.streamingMensal} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1">Descrição Curta</label>
                    <input type="text" name="streamingMensalDesc" value={config.streamingMensalDesc} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1">Trimestral (R$)</label>
                    <input type="text" name="streamingTrimestral" value={config.streamingTrimestral} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1">Descrição Curta</label>
                    <input type="text" name="streamingTrimestralDesc" value={config.streamingTrimestralDesc} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1">Semestral (R$)</label>
                    <input type="text" name="streamingSemestral" value={config.streamingSemestral} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1">Descrição Curta</label>
                    <input type="text" name="streamingSemestralDesc" value={config.streamingSemestralDesc} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1">Anual (R$)</label>
                    <input type="text" name="streamingAnual" value={config.streamingAnual} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1">Descrição Curta</label>
                    <input type="text" name="streamingAnualDesc" value={config.streamingAnualDesc} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preços Revenda */}
          <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">Revenda - Preços e Descrições</h2>
            <div className="mb-6">
              <label className="block text-sm font-bold text-zinc-400 mb-2">Descrição da Seção Revenda</label>
              <textarea 
                name="revendaSectionDescription" value={config.revendaSectionDescription} onChange={handleChange} required rows={2}
                className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 resize-none"
              />
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Mensalista (R$)</label>
                  <input type="text" name="revendaMensalista" value={config.revendaMensalista} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Descrição Mensalista</label>
                  <input type="text" name="revendaMensalistaDesc" value={config.revendaMensalistaDesc} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Pré-Pago (Destaque R$)</label>
                  <input type="text" name="revendaPrePagoCredito" value={config.revendaPrePagoCredito} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Descrição Pré-Pago</label>
                  <input type="text" name="revendaPrePagoDesc" value={config.revendaPrePagoDesc} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Pós-Pago (Destaque R$)</label>
                  <input type="text" name="revendaPosPagoAtivo" value={config.revendaPosPagoAtivo} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Descrição Pós-Pago</label>
                  <input type="text" name="revendaPosPagoDesc" value={config.revendaPosPagoDesc} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-zinc-800">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">Pré-Pago: 10 Créditos</label>
                <input type="text" name="revendaPrePago10Creditos" value={config.revendaPrePago10Creditos} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">Pré-Pago: 1 Crédito</label>
                <input type="text" name="revendaPrePago1Credito" value={config.revendaPrePago1Credito} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">Pós-Pago: Formatado</label>
                <input type="text" name="revendaPosPagoAtivoFormatado" value={config.revendaPosPagoAtivoFormatado} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#121212] border border-zinc-800 rounded-2xl p-6 sticky bottom-4 z-10 shadow-2xl">
            <div className="text-green-500 font-bold">{message}</div>
            <button 
              type="submit"
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
