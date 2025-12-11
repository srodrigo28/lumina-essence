# PIX - Configuração e Uso

## Como configurar a chave Pix

1. Crie (ou edite) o arquivo `.env` na raiz do projeto e adicione a linha:

    VITE_PIX_KEY="sua-chave-pix-aqui"

   > **Atenção:** O Vite exige o prefixo `VITE_` para variáveis de ambiente acessíveis no frontend.

2. Salve o arquivo e reinicie o servidor de desenvolvimento (`npm run dev` ou `yarn dev`).

## Onde a chave Pix é utilizada

- O arquivo principal que utiliza a chave Pix é:
  - `PixCheckout.tsx`
    - Linha próxima ao topo: `const pixKey = import.meta.env.VITE_PIX_KEY;`
    - A chave é usada para gerar o QR Code e o código "copia e cola" do Pix.

## Como alterar a chave Pix

1. Edite o valor da variável `VITE_PIX_KEY` no arquivo `.env`.
2. Salve e reinicie o servidor de desenvolvimento.

## Onde a função Pix é chamada

- O componente `PixCheckout` é importado e utilizado em:
  - `App.tsx` (procure por `import PixCheckout` e `<PixCheckout ... />`)

## Resumo dos arquivos relacionados

- `.env` — configuração da chave Pix
- `PixCheckout.tsx` — lógica de geração e uso da chave Pix
- `App.tsx` — ponto de chamada do componente PixCheckout

---

Dúvidas? Consulte este documento ou o código-fonte dos arquivos citados.