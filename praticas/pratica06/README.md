# RotinaIESB

Atividade Integradora — consolida os conteúdos das Aulas 02 a 06.
Disciplina: Programação para Dispositivos Móveis (React Native / Expo)
Professor: Marcelo Alves Farias — IESB

## Sobre o app

Organizador simples da rotina acadêmica: o aluno cadastra compromissos do
dia (aula, estudo, trabalho, lazer), visualiza a lista, marca como
concluído, remove itens, e tudo continua salvo mesmo depois de fechar o
app (persistência local com `AsyncStorage`).

## Comando usado para criar o projeto

```bash
npx create-expo-app@latest RotinaIESB --template blank
cd RotinaIESB
npx expo install @react-native-async-storage/async-storage react-native-safe-area-context
```

## Como rodar o projeto

```bash
cd pratica06
npm install
npx expo install --fix
npx expo start -c
```

Escaneie o QR Code com o Expo Go (Android) ou pressione `a` no terminal
para abrir no emulador Android.

## Estrutura de arquivos criados

```
pratica06/
├── App.js                       → estado, useEffects, orquestra tudo
├── labels.js                    → todos os rótulos de texto (export nomeado)
├── components/
│   ├── CompromissoInput.js      → TextInput + Pressable "Adicionar"
│   └── CompromissoList.js       → FlatList: concluir, remover, lista vazia
├── assets/
│   └── logo.png                 → imagem local usada no cabeçalho
├── app.json / package.json / index.js / .gitignore
```

## Mapa: onde está cada `useEffect` (App.js)

- **useEffect de CARGA** — logo após os `useState`, roda uma única vez
  (`[]` como dependência). Lê a chave `@rotina_iesb_compromissos` do
  `AsyncStorage`, faz `JSON.parse` e preenche o estado `compromissos`.
  Está em `try/catch`, com `Alert` amigável em caso de erro.

- **useEffect de SALVAMENTO** — logo abaixo do de carga, roda toda vez
  que `compromissos` muda (dependência `[compromissos, carregando]`).
  Faz `JSON.stringify` do array e grava na mesma chave. Tem a proteção
  `if (carregando) return` para não sobrescrever os dados salvos com um
  array vazio antes da primeira leitura terminar.

## Layout (Flexbox)

- Cabeçalho: `flexDirection: 'row'` com `Image` local + título + contador.
- Formulário: `flexDirection: 'row'`, `TextInput` com `width: '68%'`
  (percentual) e botão com `flex: 1` (ocupa o espaço restante).
- Lista: `flex: 1` para ocupar o restante vertical da tela.
- `justifyContent`/`alignItems` usados com intenção em cada bloco
  (comentados diretamente no código).

## Componentização e props

- **CompromissoInput.js** — recebe `value`, `onChangeText`, `onAdd` e
  `labels` como props. Componente controlado, sem estado próprio.
- **CompromissoList.js** — recebe `itens`, `onDelete`, `onToggle`,
  `tituloLista` e `listaVazia`. Usa `FlatList` com `ListEmptyComponent`
  para o estado de lista vazia (Desafio O4).

## Eventos e validação

- Não permite adicionar compromisso com texto vazio (`Alert.alert`).
- IDs únicos com `Date.now().toString()` — nunca o índice do array.
- Remoção sempre com `.filter`, sem mutar o array original (nunca
  `push`/`splice` direto no estado).
- `Pressable` com `android_ripple` no botão de adicionar, no item da
  lista (marcar concluído) e no botão de remover.

## Desafios opcionais implementados (2 de 4)

- **O2** — campo `concluido: boolean` em cada compromisso; tocar no
  texto do item marca/desmarca, com estilo riscado (`textDecorationLine:
  'line-through'`).
- **O3** — contador no cabeçalho: "X pendentes" (conta os itens com
  `concluido: false`).
- Bônus: **O4** também foi contemplado (FlatList + `ListEmptyComponent`
  para o estado de lista vazia).

## Prints

> Adicionar aqui os prints: tela vazia, tela com itens cadastrados, e
> depois de fechar/reabrir o app (mostrando a persistência funcionando).

- `assets/print-lista-vazia.png`
- `assets/print-lista-com-itens.png`
- `assets/print-apos-reabrir.png`

## Link do Pull Request

> Adicionar aqui o link do PR (branch sugerida: `feature/atividade03`).
