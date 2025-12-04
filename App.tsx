import React, { useState } from 'react';
import { PRODUCTS } from './constants';
import { Product, CartItem } from './types';
import Chat from './Chat';
import PixCheckout from './PixCheckout';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = ['Todos', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
  const filteredProducts = categoryFilter === 'Todos' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === categoryFilter);

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <h1 className="font-serif text-2xl font-bold bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
                Lumina Essence
                </h1>
            </div>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="hidden md:flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-brand-600 transition"
              >
                <span>Assistente Virtual</span>
              </button>
              
              <button 
                className="relative p-2 hover:bg-stone-50 rounded-full transition"
                onClick={() => setIsCartOpen(true)}
              >
                <svg className="w-6 h-6 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-brand-600 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=2070" 
            className="w-full h-full object-cover opacity-40"
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/80 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col justify-center min-h-[400px]">
          <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6 max-w-2xl">
            Descubra sua beleza natural
          </h2>
          <p className="text-lg text-stone-200 max-w-xl mb-8 font-light">
            Cosméticos premium e fragrâncias exclusivas selecionadas para realçar o que você tem de melhor.
          </p>
          <div className="flex gap-4">
            <button 
                onClick={() => {
                    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 bg-white text-brand-900 rounded-full font-medium hover:bg-brand-50 transition"
            >
              Ver Coleção
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main id="products" className="flex-grow max-w-7xl mx-auto px-4 py-16 w-full">
        {/* Filters */}
        <div className="flex justify-center mb-12 flex-wrap gap-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition duration-300 ${
                categoryFilter === cat 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' 
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="relative h-64 overflow-hidden bg-stone-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-800 uppercase tracking-wide shadow-sm">
                  {product.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">{product.name}</h3>
                <p className="text-stone-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                    {product.benefits.slice(0,2).map((b, i) => (
                        <span key={i} className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded-md">{b}</span>
                    ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-stone-900">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-stone-900 text-white p-3 rounded-full hover:bg-brand-600 transition shadow-lg shadow-stone-200"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-50 border-t border-stone-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="font-serif text-2xl font-bold text-brand-800 mb-4">Lumina Essence</h2>
            <p className="text-stone-500 mb-8">Elevando sua rotina de beleza com produtos selecionados.</p>
            <p className="text-xs text-stone-400">© 2024 Lumina Essence. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h2 className="font-serif text-xl font-bold text-stone-800">Seu Carrinho ({cartCount})</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-stone-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-4xl mb-4 block">🛍️</span>
                  <p className="text-stone-500">Seu carrinho está vazio.</p>
                  <button onClick={() => setIsCartOpen(false)} className="mt-4 text-brand-600 font-medium hover:underline">
                    Começar a comprar
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-stone-100" />
                    <div className="flex-1">
                      <h4 className="font-medium text-stone-900">{item.name}</h4>
                      <p className="text-stone-500 text-sm mb-2">{item.category}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-brand-600">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                        <div className="flex items-center gap-2 bg-stone-50 rounded-lg p-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded text-stone-500 transition">-</button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded text-stone-500 transition">+</button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-stone-300 hover:text-red-400 self-start">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-stone-100 bg-stone-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="text-2xl font-bold text-stone-900">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-brand-600 text-white py-4 rounded-xl font-medium shadow-lg shadow-brand-200 hover:bg-brand-700 hover:shadow-xl transition transform hover:-translate-y-0.5"
                >
                  Finalizar Compra
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-fade-in-up">
                <button 
                    onClick={() => setIsCheckoutOpen(false)} 
                    className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <PixCheckout 
                    cart={cart} 
                    total={cartTotal} 
                    onClose={() => setIsCheckoutOpen(false)} 
                    onSuccess={clearCart}
                />
            </div>
        </div>
      )}

      {/* Chat Widget */}
      <Chat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Chat FAB */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-brand-600 text-white p-4 rounded-full shadow-2xl hover:bg-brand-700 transition transform hover:scale-110 z-30 flex items-center gap-2 group"
        >
          <span className="text-2xl">✨</span>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium text-sm">
            Precisa de ajuda?
          </span>
        </button>
      )}
    </div>
  );
}
