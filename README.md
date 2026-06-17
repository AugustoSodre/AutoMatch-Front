# 🚗 AutoMatch - Frontend

Bem-vindo ao **AutoMatch**, a interface inteligente para encontrar o seu carro ideal! Este projeto é o frontend da aplicação, desenvolvido com Angular, focado em proporcionar uma experiência de usuário (UX) fluida e moderna durante o processo de descoberta e recomendação de veículos.

## Funcionalidades Principais

- **Wizard de Recomendação (Quiz):** Um formulário interativo de 4 etapas que coleta preferências demográficas, financeiras, técnicas e prioridades de IA (Economia, Potência, Conforto, Segurança).
- **Dashboard de Matches:** Visualização clara dos veículos recomendados, com porcentagem de compatibilidade calculada por Deep Learning.
- **UI Premium:** Interface limpa, responsiva e com feedback visual dinâmico (Selection Cards, Sliders estilizados).
- **Integração em Tempo Real:** Comunicação direta com o backend para processamento de matches e persistência de dados.

## 🛠️ Stack Tecnológica

- **Framework:** [Angular 14+](https://angular.io/)
- **Estilização:** SCSS + Bootstrap 5 (Layout responsivo)
- **Formulários:** Reactive Forms (com validações customizadas)
- **Gerenciamento de Estado:** Services com RxJS Observables
- **Comunicação:** HttpClient (REST API)

## 📂 Estrutura de Pastas Relevante

```text
src/app/
├── matches/               # Dashboard e cards de visualização de veículos
├── new-match-wizard/      # Componente do Quiz inteligente (Onboarding)
├── systems-services/      # Serviços de integração (Account, Car, etc.)
├── car.interface.ts       # Definição do contrato de dados do veículo
└── app-routing.module.ts  # Configuração de rotas (Lazy Loading)
```

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js (v16+)
- Angular CLI (`npm install -g @angular/cli@14`)

### Instalação
1. Entre na pasta do projeto:
   ```bash
   cd AutoMatch-Front
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
4. Acesse `http://localhost:4200` no seu navegador.

## 🔗 Conexão com o Ecossistema

Este frontend consome a API do **AutoMatch-Back** (porta 3000). Para que as recomendações funcionem, certifique-se de que o backend e o serviço de IA estejam rodando simultaneamente.

---
Desenvolvido pela equipe AutoMatch.
