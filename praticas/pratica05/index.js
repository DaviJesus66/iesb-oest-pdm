import { registerRootComponent } from "expo";

import App from "./App";

// registerRootComponent chama AppRegistry.registerComponent('main', () => App)
// e garante que o ambiente seja configurado corretamente,
// seja rodando no Expo Go ou em uma build nativa.
registerRootComponent(App);
