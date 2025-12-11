export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  benefits: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export enum CheckoutStatus {
  IDLE = 'IDLE',
  GENERATING_PIX = 'GENERATING_PIX',
  WAITING_PAYMENT = 'WAITING_PAYMENT',
  SUCCESS = 'SUCCESS'
}

export interface UserInfo {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
}

export interface PixData {
  qrCodeBase64: string; // Typically a data URL for the image
  copyPasteKey: string;
  expiresAt: Date;
}
