# Guia de Contribuição - CodaBot

Obrigado por considerar contribuir com o CodaBot! Este guia vai te ajudar a fazer sua primeira contribuição de forma simples e eficiente.

## Índice

- [Como Posso Contribuir?](#como-posso-contribuir)
- [Primeiros Passos](#primeiros-passos)
- [Configurando o Ambiente](#configurando-o-ambiente)
- [Fluxo de Trabalho](#fluxo-de-trabalho)
- [Padrões de Código](#padrões-de-código)
- [Estrutura de Comandos](#estrutura-de-comandos)
- [Commits e Pull Requests](#commits-e-pull-requests)
- [Testando Suas Alterações](#testando-suas-alterações)
- [Dúvidas?](#dúvidas)

---

## Como Posso Contribuir?

Existem várias formas de contribuir com o projeto:

### Para Iniciantes
- **Reportar bugs** - Encontrou um problema? Abra uma issue!
- **Melhorar documentação** - Corrija erros ou adicione exemplos
- **Ajudar na comunidade** - Responda dúvidas de outros contribuidores
- **Issues marcadas com `good-first-issue`** - Perfeitas para começar!

### Para Desenvolvedores
- **Implementar comandos** - Crie novos comandos para o bot
- **Corrigir bugs** - Resolva issues abertas
- **Adicionar features** - Implemente novas funcionalidades
- **Escrever testes** - Melhore a cobertura de testes
- **Melhorar UI** - Contribua com o dashboard web

---

## Primeiros Passos

### 1. Fork o Repositório

Clique no botão **Fork** no canto superior direito da página do GitHub.

### 2. Clone Seu Fork

```bash
git clone https://github.com/SEU-USUARIO/codabot.git
cd codabot
```

### 3. Adicione o Repositório Original como Upstream

```bash
git remote add upstream https://github.com/codace/codabot.git
```

### 4. Crie uma Branch para Sua Feature
Sempre crie sua branch a partir da branch dev e não da main.

```bash
git checkout dev
git pull upstream dev
git checkout -b feature/nome-da-sua-feature
```

**Convenção de nomes de branches:**
- `feature/` - Para novas funcionalidades
- `fix/` - Para correção de bugs
- `docs/` - Para alterações na documentação
- `refactor/` - Para refatoração de código
- `test/` - Para adição de testes

**Exemplos:**
```bash
git checkout -b feature/comando-ban
git checkout -b fix/ping-latency
git checkout -b docs/atualizar-readme
```

---

## Configurando o Ambiente

### Pré-requisitos

- **Node.js** v18 ou superior
- **PostgreSQL** (ou conta no Supabase)
- **WhatsApp** (para testar o bot)
- **Git**

### Instalação

1. **Instale as dependências:**

```bash
npm install
```

2. **Configure as variáveis de ambiente:**

Copie o arquivo `.env.example` e renomeie para `.env`:

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
PORT=3000
DATABASE_URL="postgresql://usuario:senha@localhost:5432/codabot"
SESSION_ID=codabot-dev
GROUP_ID_PRINCIPAL=seu_grupo_id_aqui
```

3. **Configure o banco de dados:**

```bash
npx prisma migrate dev
npx prisma generate
```

4. **Inicie o bot em modo de desenvolvimento:**

```bash
npm run dev
```

5. **Escaneie o QR Code** com seu WhatsApp de teste

**IMPORTANTE:** Use um número de WhatsApp diferente para desenvolvimento! Não use o número oficial do bot.

---

## Fluxo de Trabalho

### 1. Escolha uma Issue

- Navegue pelas [issues abertas](https://github.com/codace/codabot/issues)
- Procure por issues com a label `good-first-issue` se for sua primeira contribuição
- Comente na issue dizendo que você quer trabalhar nela

### 2. Mantenha Seu Fork Atualizado

Antes de começar a trabalhar, sincronize com o repositório principal:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 3. Desenvolva Sua Feature

- Faça commits pequenos e frequentes
- Teste suas alterações constantemente
- Siga os padrões de código do projeto

### 4. Envie Suas Alterações

```bash
git add .
git commit -m "feat: adiciona comando !ban"
git push origin feature/comando-ban
```

### 5. Abra um Pull Request

- Vá até seu fork no GitHub
- Clique em **"Compare & pull request"**
- Preencha o template de PR com detalhes
- Aguarde a revisão do código

---

## Commits e Pull Requests

### Padrão de Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(escopo): descrição curta

Descrição detalhada (opcional)
```

**Tipos principais:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Alterações na documentação
- `style`: Formatação, ponto e vírgula, etc (sem mudança de código)
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Tarefas de manutenção, atualizações de dependências

**Exemplos:**

```bash
git commit -m "feat: adiciona comando !ban para banir usuários"
git commit -m "fix: corrige latência do comando !ping"
git commit -m "docs: atualiza README com instruções de instalação"
git commit -m "refactor: melhora validação de permissões"
git commit -m "test: adiciona testes para comando !ajuda"
```

**Commits mais detalhados:**

```bash
git commit -m "feat(moderacao): adiciona sistema anti-spam

- Implementa contador de mensagens por usuário
- Adiciona ações progressivas (aviso, mute, ban)
- Cria configuração por grupo
- Adiciona logs de detecção"
```

## O Que NÃO Fazer

### Nunca Commite:

- Arquivos de sessão (`.wwebjs_auth/`)
- Arquivo `.env` com credenciais
- `node_modules/`
- Logs pessoais
- Números de telefone reais
- Tokens ou senhas

### Evite:

- PRs muito grandes (divida em PRs menores)
- Commits com mensagens vagas ("fix", "update", "changes")
- Alterar múltiplas funcionalidades não relacionadas no mesmo PR
- Copiar código de outros projetos sem atribuição
- Ignorar feedback dos revisores

