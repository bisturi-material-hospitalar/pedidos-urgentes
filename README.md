# 🚀 Pedidos Urgentes

**Pedidos Urgentes** é uma plataforma web para gestão rápida de solicitações internas e atribuição de papéis (atendente, conferente, admin) com autenticação via Supabase. Ideal para equipes que precisam receber, encaminhar e acompanhar pedidos com agilidade.

---

## 📋 Sumário

- [🚀 Pedidos Urgentes](#-pedidos-urgentes)
  - [📋 Sumário](#-sumário)
  - [✨ Principais Funcionalidades](#-principais-funcionalidades)
  - [🛠 Tecnologias](#-tecnologias)
  - [🔧 Pré-requisitos](#-pré-requisitos)
  - [⚙️ Instalação e Configuração](#️-instalação-e-configuração)
  - [🔐 Variáveis de Ambiente](#-variáveis-de-ambiente)
  - [📦 Scripts Úteis](#-scripts-úteis)
  - [🚀 Deploy no Vercel](#-deploy-no-vercel)
  - [📁 Estrutura de Pastas](#-estrutura-de-pastas)
  - [🤝 Contribuição](#-contribuição)
  - [📄 Licença](#-licença)

---

## ✨ Principais Funcionalidades

- **Autenticação & Autorizações**  
  - Cadastro, login e logout via Supabase Auth  
  - Controle de papéis (roles): _atendente_, _conferente_ e _admin_

- **Gestão de Usuários**  
  - Listagem responsiva  
  - Inclusão, exclusão e alteração de papéis

- **UX/UI**  
  - Loader global estilizado  
  - Formulários e tabelas com acessibilidade e responsividade  
  - Feedback de erro e sucesso  

- **Deploy Automatizado**  
  - Integração contínua com GitHub  
  - Deploy automático na Vercel  

---

## 🛠 Tecnologias

- **Front-end**  
  - React 18 + Hooks  
  - Tailwind CSS  
  - Supabase (Auth & Postgres)  
- **CI/CD**  
  - GitHub Actions (opcional)  
  - Vercel  

---

## 🔧 Pré-requisitos

- Node.js ≥ 16  
- npm (ou Yarn)  
- Conta gratuita no [Supabase](https://supabase.com)  
- Conta gratuita no [Vercel](https://vercel.com)  

---

## ⚙️ Instalação e Configuração

1. **Clone o repositório**  

   ```bash
   git clone https://github.com/SEU_USUARIO/pedidos-urgentes.git
   cd pedidos-urgentes
   ```

2. **Instale dependências**

   ```bash
   npm install
   # ou
   yarn
   ```

3. **Defina variáveis de ambiente**
   Crie um arquivo `.env.local` na raiz:

  ```
   NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
  ```

4. **Inicie em modo de desenvolvimento**

   ```bash
   npm run dev
   # ou
   yarn dev
   ```

   Acesse: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Variáveis de Ambiente

| Chave                           | Descrição                      |
| ------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL do seu projeto Supabase    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase Auth |

> **IMPORTANTE:** Não compartilhe suas chaves de acesso em repositórios públicos!

---

## 📦 Scripts Úteis

```bash
# Desenvolvimento local
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção local
npm run start

# Verificar formatação e lint
npm run lint
```

---

## 🚀 Deploy no Vercel

1. Faça **push** do seu código para o GitHub.
2. Acesse [Vercel](https://vercel.com/dashboard) e clique em **“New Project”**.
3. Selecione seu repositório `pedidos-urgentes`.
4. Em **Environment Variables**, adicione:

   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Clique em **Deploy** — o Vercel cuidará do build e publicação automática.

---

## 📁 Estrutura de Pastas

```
.
├─ public/                  # Imagens, favicon
├─ src/
│  ├─ components/           # Componentes React reutilizáveis
│  ├─ contexts/             # AuthProvider e hooks
│  ├─ pages/                # Rotas (Next.js)
│  └─ styles/               # CSS e Tailwind config
│
├─ .env.local               # Variáveis de ambiente
├─ package.json
└─ README.md
```

---

## 🤝 Contribuição

1. Abra uma *issue* para sugerir melhorias ou reportar bugs.
2. Faça um *fork* e crie uma *branch* com sua feature:

   ```bash
   git checkout -b feature/nome-da-feature
   ```
3. Commit suas mudanças com mensagens claras.
4. Abra um *pull request* e aguarde revisão.

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

> **Pedidos Urgentes** – agilidade e transparência na gestão de demandas internas. <br/>
> Desenvolvido com 💚 por Bisturi Material Hospitalar.
