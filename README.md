# Coda.ce bot WhatsApp

**Coda.ce bot** é o bot open-source oficial da comunidade Coda.ce, desenvolvido em JavaScript, utilizando `whatsapp-web.js` para integração com WhatsApp, Express para backend, PostgreSQL como banco de dados e Prisma ORM para manipulação do banco.

O objetivo do bot é automatizar a interação em grupos da comunidade, oferecendo comandos úteis, mensagens automáticas e ferramentas de moderação, tudo de forma modular e expansível.

## Funcionalidades Principais

- Resposta automática a comandos prefixados com `!`
- **Comandos iniciais:**
  - `!ping` – Retorna "pong"
  - `!ajuda` – Lista todos os comandos disponíveis
  - `!regras` – Exibe regras do grupo
  - `!info` – Mostra informações sobre a comunidade
  - `!apresentar` – Permite que usuários se apresentem e salva no banco
- Logs detalhados de execução de comandos
- Configurações específicas por grupo
- Preparado para rodar 24/7 em servidores ou VPS
- Sessão persistente via `LocalAuth` do `whatsapp-web.js`

## Arquitetura

O bot segue uma arquitetura modular:

```
whatsapp-web.js -> Handler de Mensagens -> Sistema de Comandos -> Ações do Bot
Express API -> Rotas e Painel (futuro)
Prisma -> Acesso ao PostgreSQL
```

### Componentes principais:

- **Client** (`client.js`): Inicializa o bot, eventos de QR code, autenticação e carregamento de comandos.
- **Handlers** (`messageHandler.js`): Interpreta mensagens recebidas e executa o comando correspondente.
- **Commands**: Cada comando é um módulo separado dentro da pasta `commands`, permitindo adição automática.
- **Utils** (`logger.js`): Registro de logs e informações importantes do bot.
- **Config** (`prisma.js`): Conexão com o banco de dados Supabase via Prisma.

## Estrutura do Projeto

```
codace-bot-whatsapp/
├─ src/
│  ├─ index.js          # Inicializa o bot
│  ├─ server.js         # Servidor Express
│  ├─ bot/
│  │  ├─ client.js
│  │  ├─ handlers/
│  │  │  └─ messageHandler.js
│  │  ├─ commands/
│  │  │  ├─ ping.js
│  │  │  ├─ ajuda.js
│  │  │  ├─ regras.js
│  │  │  ├─ info.js
│  │  │  └─ apresentar.js
│  ├─ config/
│  │  └─ prisma.js
│  ├─ utils/
│  │  └─ logger.js
├─ prisma/
│  └─ schema.prisma
├─ .env
├─ package.json
├─ README.md
```

## Setup do Ambiente

### 1. Instalar dependências

```bash
npm install whatsapp-web.js express dotenv prisma @prisma/client qrcode-terminal
npm install -D nodemon
```

### 2. Inicializar Prisma

```bash
npx prisma init
```

### 3. Configurar Banco

- Crie o banco Supabase e configure a variável `DATABASE_URL` no `.env`.
- Rode as migrations:

```bash
npx prisma migrate dev
```

### 4. Iniciar o Bot

```bash
npm run dev
```

- O terminal exibirá um QR Code para escanear no WhatsApp do número do bot.
- Após autenticação, o bot ficará pronto para uso.

## Licença

Este projeto é open-source e está disponível sob a licença MIT.

## Comunidade

Desenvolvido pela comunidade **Coda.ce**

---

**Nota:** Este bot é mantido pela comunidade e está em constante evolução. Sinta-se livre para contribuir com melhorias e novas funcionalidades!
