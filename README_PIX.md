## ⚡ Como Rodar o Projeto

Siga os passos abaixo para rodar o Lumina Essence na sua máquina:

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/lumina-essence.git
cd lumina-essence
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn
```

### 3. Configure a chave Pix

Crie (ou edite) o arquivo `.env` na raiz do projeto e adicione sua chave Pix:

```env
VITE_PIX_KEY="sua-chave-pix-aqui"
```

> **Atenção:** O Vite exige o prefixo `VITE_` para variáveis de ambiente acessíveis no frontend.

Após salvar o arquivo `.env`, reinicie o servidor de desenvolvimento para que a chave seja reconhecida.

### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

---

## 💸 Pagamento via Pix

O Lumina Essence permite pagamentos via Pix de forma simples e segura.

### Como funciona?
- Ao finalizar a compra, o usuário pode escolher pagar via Pix.
- O sistema gera um QR Code e um código "copia e cola" usando a chave Pix configurada no `.env`.
- O QR Code é exibido na tela para pagamento imediato.

### Como configurar a chave Pix
1. No arquivo `.env`, adicione ou edite a linha:
   ```env
   VITE_PIX_KEY="sua-chave-pix-aqui"
   ```
2. Salve e reinicie o servidor de desenvolvimento.

### Onde a chave Pix é utilizada?
- O arquivo principal é `PixCheckout.tsx`:
  - Linha próxima ao topo: `const pixKey = import.meta.env.VITE_PIX_KEY;`
  - A chave é usada para gerar o QR Code e o código "copia e cola" do Pix.
- O componente `PixCheckout` é chamado em `App.tsx`.

### Arquivos relacionados ao Pix
- `.env` — configuração da chave Pix
- `PixCheckout.tsx` — lógica de geração e uso da chave Pix
- `App.tsx` — ponto de chamada do componente PixCheckout

---
