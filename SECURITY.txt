# Security Policy

## Supported Versions

O projeto está em desenvolvimento ativo. As versões estáveis (marcadas com tags de release) receberão correções de segurança sempre que necessário.

| Versão | Suporte de Segurança |
|--------|------------------------|
| main   | Suporte ativo |
| dev    | Pode conter mudanças não revisadas |
| releases (v1.x+) | Suporte ativo |

---

## Reportando Vulnerabilidades

Se você encontrar um problema de segurança, não abra uma issue pública.

Envie o relatório diretamente para:

codace.contato@gmail.com

Ao enviar, inclua:

- Descrição clara da vulnerabilidade  
- Passo a passo para reproduzir  
- Impacto potencial  
- Sugestão opcional de correção  
- Material adicional relevante (logs, prints, PoC)

Responderemos em até 72 horas.

---

## Recomendações Importantes

Para manter o projeto seguro:

### 1. Tokens e Credenciais
- Nunca coloque tokens, QR codes ou sessões do WhatsApp no GitHub.
- Use sempre arquivos `.env` e garanta que `.env` e `/sessions` estejam incluídos no `.gitignore`.

### 2. Dependências
- As dependências devem estar sempre atualizadas.
- Pull requests que adicionam ou modificam bibliotecas externas devem ser revisados com atenção.

### 3. Contribuições
Antes de enviar código:
- Evite logs sensíveis
- Não exponha números de telefone, IDs internos ou informações pessoais
- Não envie arquivos de sessão, cache ou dados temporários

---

## Avaliação de Relatórios

Classificamos vulnerabilidades conforme o impacto:

| Nível | Descrição |
|------|-----------|
| Crítico | Permite acesso a dados sensíveis ou controle total do bot |
| Alto | Compromete o funcionamento ou causa danos sérios |
| Médio | Impacta funcionalidades específicas |
| Baixo | Problemas menores ou difíceis de explorar |

---

## Agradecimentos

Agradecemos à comunidade Coda.ce por apoiar a manutenção da segurança e qualidade do projeto.  
Se desejar reconhecimento público após a correção, informe no e-mail ao enviar o relatório.

