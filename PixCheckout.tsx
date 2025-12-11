// Função utilitária para aplicar máscara de CPF
function maskPhone(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}
function maskCpf(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
}
// Obtém a chave Pix do .env (Vite exige prefixo VITE_)
const pixKey = import.meta.env.VITE_PIX_KEY;
// Função utilitária para montar o campo da chave Pix corretamente
function getPixField(key: string) {
  if (!key) return 'chave-pix-nao-configurada';
  const len = key.length.toString().padStart(2, '0');
  return len + key;
}
import React, { useState, useEffect } from 'react';
import { CartItem, CheckoutStatus, PixData, UserInfo } from './types';

interface PixCheckoutProps {
  cart: CartItem[];
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PixCheckout({ cart, total, onClose, onSuccess }: PixCheckoutProps) {
  const [status, setStatus] = useState<CheckoutStatus>(CheckoutStatus.IDLE);
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', email: '', cpf: '', phone: '' });
    // Número do WhatsApp para envio de confirmação
    // Função para abrir o WhatsApp Web com mensagem de confirmação
    const handleSendWhatsApp = () => {
      if (!userInfo.phone) {
        alert('Informe o telefone para confirmação!');
        return;
      }
      const phone = userInfo.phone.replace(/\D/g, '');
      const msg = encodeURIComponent(`Olá! Confirmação de compra no Lumina Essence para o telefone ${userInfo.phone}.`);
      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    };
  const [pixData, setPixData] = useState<PixData | null>(null);

  const handleGeneratePix = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(CheckoutStatus.GENERATING_PIX);

    // Simulate API call to payment gateway
    setTimeout(() => {
      const chavePixPayload = getPixField(pixKey);
      const mockPixData: PixData = {
        qrCodeBase64: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126580014BR.GOV.BCB.PIX01${chavePixPayload}5204000053039865405${total.toFixed(2).replace('.', '')}5802BR5913Lumina Essence6008Sao Paulo62070503***6304E2CA`,
        copyPasteKey: `00020126580014BR.GOV.BCB.PIX01${chavePixPayload}5204000053039865405${total.toFixed(2)}5802BR5913 Lumina Essence6008Sao Paulo62070503***6304E2CA`,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 mins
      };
      setPixData(mockPixData);
      setStatus(CheckoutStatus.WAITING_PAYMENT);
    }, 1500);
  };

  const handleCopy = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.copyPasteKey);
      alert('Chave Pix copiada!');
    }
  };

  const simulatePaymentSuccess = () => {
     setStatus(CheckoutStatus.SUCCESS);
     setTimeout(() => {
        onSuccess();
     }, 2000);
  }

  if (status === CheckoutStatus.SUCCESS) {
    return (
      <div className="text-center py-10">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-serif text-brand-800 mb-2">Pagamento Confirmado!</h3>
        <p className="text-stone-600">Seu pedido está sendo preparado com carinho.</p>
      </div>
    );
  }

  if (status === CheckoutStatus.WAITING_PAYMENT && pixData) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-serif text-brand-800">Pagamento via Pix</h3>
          <p className="text-sm text-stone-500">Escaneie o QR Code ou copie a chave abaixo</p>
          <div className="text-2xl font-bold text-brand-600 my-2">
            R$ {total.toFixed(2).replace('.', ',')}
          </div>
        </div>

        <div className="flex justify-center">
          <img src={pixData.qrCodeBase64} alt="QR Code Pix" className="border-4 border-brand-100 rounded-lg" />
        </div>

        <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-500 uppercase">Pix Copia e Cola</label>
            <div className="flex gap-2">
                <input 
                    readOnly 
                    value={pixData.copyPasteKey} 
                    className="flex-1 bg-stone-100 border border-stone-200 rounded px-3 py-2 text-xs text-stone-600 font-mono truncate"
                />
                <button 
                    onClick={handleCopy}
                    className="bg-brand-600 text-white px-4 py-2 rounded text-sm hover:bg-brand-700 transition"
                >
                    Copiar
                </button>
            </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded text-xs text-yellow-800 text-center">
           Aguardando confirmação do banco...
        </div>

        {/* Simulator Button for demo purposes */}
        <button 
            onClick={simulatePaymentSuccess}
            className="w-full mt-4 text-xs text-stone-400 hover:text-stone-600 underline"
        >
            (Simular Pagamento Aprovado)
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleGeneratePix} className="space-y-4">
      <div>
        <h3 className="text-xl font-serif text-brand-800 mb-4">Finalizar Compra</h3>
        <p className="text-sm text-stone-600 mb-4">Preencha seus dados para gerar o Pix.</p>
      </div>

      <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Telefone WhatsApp Confirmação</label>
                  <div className="flex gap-2">
                    <input
                      required
                      type="text"
                      placeholder="(11) 99999-9999"
                      className="w-full border border-stone-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-200 focus:border-brand-400 outline-none transition"
                      value={userInfo.phone || ''}
                      onChange={e => setUserInfo({
                        ...userInfo,
                        phone: maskPhone(e.target.value)
                      })}
                    />
                    <button
                      type="button"
                      className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition"
                      onClick={handleSendWhatsApp}
                    >
                      Enviar WhatsApp
                    </button>
                  </div>
                </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Nome Completo</label>
          <input
            required
            type="text"
            className="w-full border border-stone-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-200 focus:border-brand-400 outline-none transition"
            value={userInfo.name}
            onChange={e => setUserInfo({ ...userInfo, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">E-mail</label>
          <input
            required
            type="email"
            className="w-full border border-stone-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-200 focus:border-brand-400 outline-none transition"
            value={userInfo.email}
            onChange={e => setUserInfo({ ...userInfo, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">CPF</label>
          <input
            required
            type="text"
            placeholder="000.000.000-00"
            className="w-full border border-stone-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-200 focus:border-brand-400 outline-none transition"
            value={userInfo.cpf}
            onChange={e => setUserInfo({
              ...userInfo,
              cpf: maskCpf(e.target.value)
            })}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-stone-100">
        <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-stone-600">Total a pagar:</span>
            <span className="text-xl font-bold text-brand-700">R$ {total.toFixed(2).replace('.', ',')}</span>
        </div>
        <button
            type="submit"
            disabled={status === CheckoutStatus.GENERATING_PIX}
            className="w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
        >
            {status === CheckoutStatus.GENERATING_PIX ? 'Gerando Pix...' : 'Gerar Chave Pix'}
        </button>
      </div>
    </form>
  );
}
