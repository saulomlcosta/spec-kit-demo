# Spec Kit Demo

Este repositorio e um projeto de demonstracao para aprender e praticar
Spec Driven Development usando o Spec Kit.

A ideia e usar um exemplo pequeno, mas realista, para exercitar o fluxo de
trabalho orientado por especificacao antes de partir para a implementacao:

1. Definir a constituicao do projeto.
2. Escrever a especificacao da feature.
3. Gerar o plano tecnico e artefatos de design.
4. Quebrar a implementacao em tarefas executaveis.
5. Usar os documentos gerados como fonte de verdade para o desenvolvimento.

## Feature de Exemplo

O exemplo deste repositorio e um organizador local de albuns de fotos.

A aplicacao planejada permite organizar fotos em albuns separados, agrupar os
albuns por data, reordenar albuns na pagina principal com drag-and-drop e
visualizar as fotos de cada album em uma interface de tiles.

Algumas decisoes tecnicas documentadas no plano:

- Vite com HTML, CSS e JavaScript vanilla sempre que possivel.
- Numero minimo de bibliotecas.
- Metadados em SQLite local.
- Fotos permanecem no dispositivo do usuario e nao sao enviadas para servicos remotos.
- Testes automatizados para regras de dados e fluxos de interface.

## Estrutura do Spec Kit

Os principais artefatos estao em:

- `.specify/memory/constitution.md`: principios e regras de governanca do projeto.
- `AGENTS.md`: orientacao local para agentes e ferramentas.
- `specs/001-organize-photo-albums/spec.md`: especificacao funcional da feature.
- `specs/001-organize-photo-albums/plan.md`: plano de implementacao.
- `specs/001-organize-photo-albums/research.md`: decisoes de pesquisa e alternativas consideradas.
- `specs/001-organize-photo-albums/data-model.md`: modelo de dados planejado.
- `specs/001-organize-photo-albums/contracts/local-app-contract.md`: contrato de comportamento local da aplicacao.
- `specs/001-organize-photo-albums/quickstart.md`: roteiro de validacao.
- `specs/001-organize-photo-albums/tasks.md`: tarefas de implementacao em ordem de execucao.

## Fluxo Usado

Este demo foi criado seguindo o fluxo:

```text
/speckit.constitution
/speckit.specify
/speckit.plan
/speckit.tasks
```

Cada etapa gera ou refina artefatos diferentes. O objetivo e manter o contexto
do projeto explicito, revisavel e versionado antes de escrever codigo de
producao.

## Status

Este repositorio contem os artefatos do Spec Kit e uma implementacao local de
referencia para a feature de organizador de albuns de fotos. As tarefas de
implementacao estao rastreadas em:

```text
specs/001-organize-photo-albums/tasks.md
```

## Como Rodar

Instale as dependencias e inicie o app local:

```powershell
npm install
npm run dev
```

Depois abra a URL local exibida pelo Vite/servidor Node.

Para validar:

```powershell
npm test
npm run test:e2e
```

## Privacidade Local

O demo foi planejado para manter fotos no dispositivo do usuario. O SQLite
local armazena metadados, como albuns, ordem de exibicao e caminhos locais de
arquivos. O app rejeita fontes remotas de fotos e nao implementa upload para
servicos externos.

## Objetivo de Aprendizado

Este projeto serve como referencia para estudar:

- como transformar uma ideia em especificacao;
- como registrar decisoes tecnicas antes da implementacao;
- como criar tarefas pequenas e rastreaveis por historia de usuario;
- como usar o Spec Kit para conduzir um ciclo de desenvolvimento orientado por especificacoes;
- como versionar cada etapa do processo para facilitar revisao e aprendizado.
