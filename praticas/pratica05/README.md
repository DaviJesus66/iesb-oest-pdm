# MetasSemestre

Atividade — useState, props, componentização, Pressable, useEffect e
AsyncStorage.
Disciplina: Programação para Dispositivos Móveis (React Native / Expo)
Professor: Marcelo Alves Farias — IESB

## Sobre o app

App de metas de estudo do semestre. O aluno cadastra uma meta, pode marcar
como concluída (estilo riscado), remover, e tudo é salvo localmente com
`AsyncStorage` — os dados continuam lá mesmo depois de fechar e reabrir o
app.

## Comandos usados para criar o projeto

```bash
npx create-expo-app@latest MetasSemestre --template blank
cd MetasSemestre
npx expo install @react-native-async-storage/async-storage react-native-safe-area-context
```

## Como rodar o projeto

```bash
cd pratica05
npm install
npx expo start
```

Escaneie o QR Code com o Expo Go (Android) ou pressione `a` no terminal para
abrir no emulador Android.

## Organização do código

```
pratica05/
├── App.js                  → estado, useEffects, orquestra os componentes
├── components/
│   ├── MetaInput.js        → TextInput + Pressable "Adicionar"
│   └── MetaList.js         → FlatList das metas, concluir e remover
├── assets/                 → ícones do app
└── ...
```

### Componentização
- **MetaInput.js** — componente controlado. Recebe `value`, `onChangeText`
  e `onAdd` como props; não guarda nenhum estado próprio.
- **MetaList.js** — recebe `metas`, `onDelete` e `onToggle` como props.
  Usa `FlatList` (mais performático que `ScrollView` para listas, pois só
  renderiza os itens visíveis na tela).

### Onde está cada useEffect (App.js)

- **useEffect de CARGA** (linha ~30, logo após os `useState`): roda uma
  única vez, quando o componente `App` é montado (array de dependências
  `[]`). Ele lê a chave `@metas_semestre` do `AsyncStorage`, faz o
  `JSON.parse` e popula o estado `metas`. Está dentro de um `try/catch`
  para tratar erros de leitura com um `Alert`.

- **useEffect de SALVAMENTO** (logo abaixo do de carga): roda toda vez que
  o array `metas` muda (dependência `[metas, carregando]`). Faz o
  `JSON.stringify` do array e salva na mesma chave `@metas_semestre`. Há
  uma proteção (`if (carregando) return`) para não sobrescrever os dados
  salvos com um array vazio antes da carga inicial terminar.

### Validações e UX
- Não é possível adicionar meta com texto vazio (`Alert` de aviso).
- IDs únicos gerados com `Date.now().toString()` — nunca usamos o índice
  do array, que muda quando um item é removido.
- Remoção sempre com `filter`, sem mutar o array original.
- `Pressable` com `android_ripple` nos botões (Adicionar, Remover e no
  item da lista para marcar como concluído).

## Desafio opcional implementado
- Campo `concluida: boolean` em cada meta — toque no texto da meta para
  marcar/desmarcar (fica com estilo riscado).
- Contador no cabeçalho: "X pendentes / Y concluídas".

## Prints

> Adicionar aqui os prints: lista vazia, lista com itens, e depois de
> fechar/reabrir o app (mostrando que os dados persistiram).

- `assets/print-lista-vazia.png`
- `assets/print-lista-com-itens.png`
- `assets/print-apos-reabrir.png`

## Link do Pull Request

> Adicionar aqui o link do PR do projeto.
