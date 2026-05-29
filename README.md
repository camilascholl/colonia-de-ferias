# Colônia de Férias - No Lugar do Outro

Site institucional da **Colônia de Férias 2026 - No Lugar do Outro**, com página inicial, informações do evento, programação, lotes de inscrição e formulário integrado ao Google Sheets para controle da secretaria.

## Visão Geral

O projeto foi feito com HTML, CSS e JavaScript puro, sem necessidade de build ou instalação de dependências.

Principais recursos:

- Página inicial responsiva
- Seções de sobre, programação, inscrições e informações importantes
- Página separada para inscrição
- Formulário com validação de campos obrigatórios
- Modal de confirmação após envio
- Botão para chamar a secretaria no WhatsApp
- Integração com Google Sheets via Google Apps Script
- Pronto para publicar no GitHub Pages

## Estrutura

```text
.
├── index.html              # Página principal do site
├── inscricao.html          # Página do formulário de inscrição
├── styles.css              # Estilos gerais e responsividade
├── script.js               # Menu mobile, formulário e modal
├── google-apps-script.js   # Código para integrar o formulário ao Google Sheets
├── images/                 # Imagens e logos do site
└── README.md
```

```

## Integração com Google Sheets

O formulário de inscrição envia os dados para uma planilha usando Google Apps Script.

### 1. Criar a planilha

Crie uma planilha no Google Sheets para receber as inscrições.

### 2. Criar o Apps Script

Na planilha:

1. Vá em `Extensões > Apps Script`.
2. Apague o código inicial.
3. Cole o conteúdo de `google-apps-script.js`.
4. Salve o projeto.

### 3. Publicar como App da Web

No Apps Script:

1. Clique em `Implantar > Nova implantação`.
2. Escolha o tipo `App da Web`.
3. Configure:
   - Executar como: `Eu`
   - Quem pode acessar: `Qualquer pessoa`
4. Clique em `Implantar`.
5. Autorize as permissões.
6. Copie a URL gerada.

### 4. Configurar a URL no site

No arquivo `script.js`, cole a URL do Apps Script nesta constante:

```js
const GOOGLE_SCRIPT_URL = 'COLE_A_URL_AQUI';
```

Depois disso, cada envio do formulário em `inscricao.html` será registrado na aba `Inscrições` da planilha.

## Campos Enviados para a Planilha

O formulário salva:

- Enviado em
- Lote
- Nome da criança
- Idade
- Nome do responsável
- WhatsApp
- Igreja ou convidado
- Restrição alimentar
- Observações
- Autorização

## Fluxo de Inscrição

1. A pessoa acessa o site.
2. Clica em `Inscrever no 1º lote`.
3. Preenche o formulário em `inscricao.html`.
4. Ao enviar, os dados vão para o Google Sheets.
5. Um modal confirma o envio.
6. A pessoa pode clicar em `Chamar no WhatsApp` para falar com a secretaria.

## Atualizando o Site no GitHub


## Observações

- O 2º lote está visualmente bloqueado no site.
- Para liberar o 2º lote, edite o card correspondente em `index.html`.
- O número de WhatsApp ainda pode ser ajustado em `script.js`, `index.html` e `inscricao.html`.

