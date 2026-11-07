# ♻️ ReciclaBrasil v2.0 — Plataforma Auditada de Reciclagem & Observatório de E-Waste

Uma plataforma web moderna, acessível, responsiva e completa para mapeamento de ecopontos de reciclagem e conscientização sobre o descarte responsável de resíduos, com foco especial em **Lixo Eletrônico (E-Waste)**.

A versão **2.0** traz um sistema completo de **Auditoria e Moderação Administrativa** para aprovação de novos pontos cadastrados pela comunidade, persistência com **LocalStorage**, **Observatório de E-Waste (Brasil vs. Mundo)**, integração de iniciativas globais com links oficiais e calculadora de impacto ecológico.

---

## 📸 Funcionalidades Principais

### 1. 🛡️ Gestão Administrativa & Auditoria de Pontos (Moderação)
- **Fila de Submissão Segura**: Quando qualquer usuário cadastra um novo ponto, ele é enviado para a fila de auditoria com status `pendente` e não polui o mapa público antes da checagem.
- **Painel de Moderação com Contador em Tempo Real**: Notificação no header com o total de pontos aguardando revisão.
- **Ações do Administrador/Auditor**:
  - **✔ Aprovar e Publicar**: Transfere o ponto para o mapa público instantaneamente com feedback via toast notification.
  - **✏️ Editar Dados**: Permite corrigir nome, endereço, categoria ou coordenadas antes da aprovação.
  - **✖ Rejeitar**: Remove a submissão irregular ou duplicada da fila.
- **Persistência Local (LocalStorage)**: Separação automática entre pontos oficiais/aprovados e itens pendentes de auditoria.

### 2. 📊 Observatório de Lixo Eletrônico (Brasil vs. Mundo)
- **Dados Oficiais (The Global E-waste Monitor / UNITAR)**:
  - Comparativo detalhado de geração anual, média per capita e taxas de reciclagem formal.
  - Alerta sobre o desperdício de mais de R$ 1,5 bilhão/ano em minerais preciosos descartados incorretamente no Brasil.
- **Mineração Urbana & Economia Circular**: Gráficos e cards explicativos sobre a recuperação de Ouro, Cobre, Lítio e Cobalto.
- **Toxicidade e Saúde Pública**: Riscos associados a Chumbo (Pb), Mercúrio (Hg), Cádmio (Cd) e Retardantes de Chama (BFR).

### 3. 🌐 Vitrine de Iniciativas Oficiais com Links Diretos
- Cards interativos com filtro por escopo (**Brasil 🇧🇷** e **Internacionais 🌐**):
  - **Nacionais**: Green Eletron, ABREE, CEDIR USP, Coopermiti, Descarte Certo.
  - **Internacionais**: WEEE Forum, StEP Initiative, Basel Action Network (BAN), Global E-waste Monitor, Circular Electronics Initiative.

### 4. 🗺️ Mapa Interativo de Coleta & Calculadora de Impacto
- **Mapa Leaflet.js**: Filtros por materiais (Plástico, Papel, Vidro, Metal, Orgânico, Eletrônico e Baterias) com destaque visual e cards detalhados.
- **Calculadora Ecológica**: Estima a economia de água, energia elétrica, árvores salvas e redução de emissões de CO₂ baseada no peso e tipos de resíduos informados.
- **Guia CONAMA de Coleta Seletiva**: Padrão oficial de cores de lixeiras e orientações práticas de separação.

---

## 📁 Estrutura de Arquivos do Repositório

```text
reciclabrasil-github/
├── index.html          # Estrutura HTML5 semântica com modais e observatório
├── css/
│   └── style.css       # Estilização modular, responsiva (CSS3 com variáveis e Flexbox/Grid)
├── js/
│   ├── data.js         # Base de dados (ecopontos aprovados, fila de auditoria, métricas e entidades)
│   └── app.js          # Lógica do app, controle de estado, mapa Leaflet, auditoria e LocalStorage
├── .gitignore          # Arquivos e diretórios ignorados pelo Git
├── LICENSE             # Licença de código aberto (MIT)
└── README.md           # Documentação completa do projeto
```

---

## 🚀 Como Executar Localmente

### Opção 1: Direto no Navegador (Sem Instalação)
1. Dê um duplo clique no arquivo **`index.html`** no seu explorador de arquivos.
2. O site abrirá automaticamente no seu navegador padrão (Google Chrome, Edge, Firefox, Brave, Safari, etc.).

### Opção 2: Servidor Local Rápido (Python)
Se preferir rodar com um servidor HTTP local:
```bash
# Entre na pasta do projeto
cd reciclabrasil-github

# Inicie o servidor embutido do Python
python -m http.server 8000
```
Abra seu navegador no endereço: **`http://localhost:8000`**

### Opção 3: Extensão Live Server (VS Code)
1. Abra a pasta do projeto no **VS Code**.
2. Clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**.

---

## 📤 Como Subir este Projeto para o GitHub

### Método 1: Pelo Terminal / Linha de Comando (Recomendado)

1. Crie um novo repositório no seu GitHub (exemplo: `recicla-brasil-v2`).
2. No seu terminal, dentro da pasta `reciclabrasil-github`, execute os seguintes comandos:

```bash
# 1. Inicializa o repositório Git local
git init

# 2. Adiciona todos os arquivos ao controle de versão
git add .

# 3. Cria o primeiro commit
git commit -m "feat: release v2.0 - auditoria de pontos, observatório e-waste e local storage"

# 4. Define o branch principal como main
git branch -M main

# 5. Vincula o seu repositório remoto do GitHub (substitua com o link do seu repositório)
git remote add origin https://github.com/SEU-USUARIO/recicla-brasil-v2.git

# 6. Envia os arquivos para o GitHub
git push -u origin main
```

---

### Método 2: Pelo Navegador (Sem Terminal / Upload Manual)

1. Acesse [github.com/new](https://github.com/new) e crie um novo repositório (ex: `recicla-brasil-v2`). Deixe desmarcada a opção "Add a README file".
2. Na página inicial do repositório vazio, clique em **"uploading an existing file"** (ou "Upload files").
3. Arraste todos os arquivos da pasta (`index.html`, `README.md`, `LICENSE`, `.gitignore`, e as pastas `css` e `js`).
4. Digite a mensagem de commit: `feat: release v2.0` e clique no botão verde **"Commit changes"**.

---

## 🌐 Como Ativar o GitHub Pages (Hospedagem Gratuita na Web)

Você pode colocar seu site no ar gratuitamente pelo próprio GitHub:

1. Acesse o seu repositório no GitHub.
2. Vá na aba **Settings** (Configurações) > menu lateral **Pages**.
3. Em **Branch**, selecione `main` e a pasta `/ (root)`.
4. Clique em **Save**.
5. Aguarde cerca de 1 a 2 minutos. O GitHub gerará um link público para o seu site, no formato:
   `https://SEU-USUARIO.github.io/recicla-brasil-v2/`

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico**: Estruturação acessível com modais, formulários e seções contextuais.
- **CSS3 Moderno**: Variáveis CSS (Custom Properties), Flexbox, CSS Grid, tipografia fluida e responsividade total (Mobile First).
- **JavaScript Moderno (ES6+)**: Funções puras, manipulação eficiente do DOM, validações de formulário e persistência reativa com `window.localStorage`.
- **Leaflet.js & OpenStreetMap**: Renderização de mapas interativos, marcadores personalizados e popups informativos sem custos de API.
- **Font Awesome**: Ícones vetoriais leves e consistentes.

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE) — livre para uso educacional, acadêmico e comercial.
