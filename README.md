# Jogo Educativo - O Ciclo da Água

[![Deploy](https://img.shields.io/badge/Acessar%20o%20Jogo-f05a41?style=for-the-badge)](https://arcoeducacaoteste.mvalentim.dev/)

*Teste Prático para a vaga de Analista de Desenvolvimento Pleno na Arco Educação.*

## 🎯 Sobre o Projeto

Este projeto é um Objeto Digital de Aprendizagem (ODA) interativo sobre o "Ciclo da Água". O objetivo era desenvolver um jogo de arrastar e soltar (drag-and-drop) totalmente dinâmico, com seu conteúdo sendo carregado a partir de um arquivo `jogo.json` externo. Este teste simula a criação de um recurso pedagógico e sua preparação para automação em larga escala.

## ✨ Funcionalidades

- **Carregamento Dinâmico:** Conteúdo do jogo (título, etapas, descrições) carregado 100% via `jogo.json`.
- **Mecânica Drag-and-Drop:** Arraste as descrições para as etapas correspondentes.
- **Validação e Feedback:** Feedback visual e sonoro instantâneo para acertos e erros.
- **Sistema de Pontuação:** Contador de acertos em tempo real.
- **Telas de Jogo:** Inclui tela inicial, tela principal do jogo e tela de conclusão.
- **Cor de fundo:** Optei por um degradê com as cores da intituição, azul e vermelho. Utilizei o mesmo efeito de Hover encontrado no site.
- **Recursos Extras Implementados:**
    - 🔉 Efeitos sonoros para acertos, erros e vitória.
    - ⏱️ Temporizador para registrar o tempo de conclusão.
    - ✨ Animações de feedback para uma experiência mais fluida.
    - 🎊 Animações de confete para celebrar vitórias.
  - ## 🚀 Tecnologias

- **HTML5**
- **CSS3** (com Flexbox e Animações Keyframes)
- **Bibliotecas Externas:** Utilização da biblioteca `tsParticles` para animações de confete.
- **Compatibilidade:** Testado e funcional em navegadores modernos (Chrome, Firefox, Edge, Safari).
- **Responsividade:** Design adaptável para diferentes tamanhos de tela.
- Optei por usar JS puro para realização do projeto pelo fato de obter total domínio sobre as tecnologias citadas no briefing.
## 🏁 Como Executar

Realizei o deploy do projeto na Vercel, [aqui](https://arcoeducacaoteste.mvalentim.dev/).

O projeto não requer um servidor ou dependências. Basta seguir os passos:

1. Clone o repositório:
   ```bash
   git clone [https://github.com/valentimm/testeArcoEducacao.git](https://github.com/valentimm/testeArcoEducacao.git)

## 🏗️ Estrutura e Escalabilidade

> **Pergunta:** Se este jogo precisasse ser replicado para dezenas de capítulos de diferentes disciplinas, como você organizaria sua estrutura e lógica para facilitar esse processo de automação?

A base para escalar este projeto seria aprofundar a separação entre **conteúdo**, **lógica** e **apresentação**. A abordagem atual, com o `jogo.json`, é o primeiro passo. Para dezenas de jogos, eu evoluiria a estrutura da seguinte forma:

**1. Arquitetura de Componentes:**
   - O jogo seria quebrado em componentes reutilizáveis (ex: `TelaInicial`, `AreaDoJogo`, `Placar`). A lógica do jogo "Ciclo da Água" seria uma implementação específica de um componente mais genérico, como um `QuizDragAndDrop`.

**2. Configuração via JSON Avançada:**
   - O `jogo.json` seria expandido para não apenas definir o *conteúdo*, mas também o *tipo* de jogo e seus *recursos*.
     ```json
     {
       "tipoDeJogo": "drag-and-drop",
       "titulo": "Capítulo 3 - O Ciclo da Água",
       "recursos": {
         "somAcerto": "/sounds/correct.mp3",
       },
       "etapas": [ ... ]
     }
     ```
   - Isso permitiria que uma mesma engine de jogo pudesse renderizar diferentes tipos de atividades (arrastar e soltar, múltipla escolha, etc.) apenas mudando a configuração JSON.

**3. Estrutura de Diretórios Escalável:**
   - Criaria uma estrutura de pastas organizada para abrigar os diferentes jogos:
     ```
     /games
       /biologia
         /capitulo-03-ciclo-agua
           - jogo.json
           - assets/
       /historia
         /capitulo-01-grandes-navegacoes
           - jogo.json
           - assets/
     ```

**4. Engine Centralizada:**
   - A lógica central do JavaScript não seria duplicada. Haveria uma "engine" principal responsável por ler o `jogo.json`, identificar o `tipoDeJogo` e carregar o template e a lógica apropriados para aquela atividade.

Essa abordagem transforma o processo de criação de um novo jogo em simplesmente criar uma nova pasta, adicionar os recursos e escrever um novo arquivo `jogo.json`, sem a necessidade de escrever novo código JavaScript, automatizando de fato a produção em larga escala.
