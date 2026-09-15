# MeuDiarioAcademico

Atividade 01 — Fundamentos de UI, Componentes e Layout
Disciplina: Programação para Dispositivos Móveis (React Native / Expo)
Professor: Marcelo Alves Farias — IESB

## Sobre o app

Tela inicial de cadastro rápido de disciplinas do semestre. Permite digitar o
nome de uma disciplina, visualizar um botão "Adicionar" e uma lista (estática)
das disciplinas já cadastradas no semestre.

## Comando usado para criar o projeto

```bash
npx create-expo-app@latest MeuDiarioAcademico --template blank
```

Em seguida, foi instalada a dependência de SafeAreaView atualizado:

```bash
npx expo install react-native-safe-area-context
```

## Como rodar o projeto

```bash
cd pratica03
npm install
npx expo start
```

Depois é só escanear o QR Code com o app Expo Go (Android) ou abrir no
emulador Android pressionando `a` no terminal.

## Organização do código

- **labels.js** — concentra todos os textos/rótulos da tela (título do app,
  placeholder do input, texto do botão, título da lista, rótulo do switch) e
  são exportados como constantes.
- **App.js** — importa os rótulos de `labels.js` e monta a interface:
  - `SafeAreaView` (de `react-native-safe-area-context`) envolvendo a tela.
  - Cabeçalho com o título do app.
  - Linha (`flexDirection: 'row'`) com `TextInput` (~70% de largura) e um
    `Pressable` como botão "Adicionar" (~30%, usando `flex`).
  - Um `Switch` "Mostrar apenas obrigatórias" (desafio opcional, ainda sem
    lógica de filtro).
  - Lista estática de disciplinas, renderizada com `.map`.
- **StyleSheet.create** — usado para todos os estilos (container, input,
  botão, item da lista), com comentários no próprio `App.js` explicando o
  porquê de cada `justifyContent`/`alignItems` escolhido.
- **Dimensões** — o input usa largura percentual (`width: '68%'`) e o botão
  usa `flex: 1` para ocupar o espaço restante da linha.

## Desafio opcional implementado

- Botão "Adicionar" feito com `Pressable` em vez de `Button`, com estilo
  diferente (`botaoPressionado`) quando pressionado.
- `Switch` "Mostrar apenas obrigatórias" adicionado (sem filtro real ainda).

## Prints da tela

> Adicionar aqui os prints da tela rodando no emulador Android ou no Expo Go.

- `assets/print-tela-inicial.png`

## Link do Pull Request

> Adicionar aqui o link do PR do projeto.
