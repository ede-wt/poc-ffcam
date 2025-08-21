# FFCAM POC

## Installation

```sh
bun i
bun db:push
```

## Dev mode

```sh
bun dev
```

### Offline mode

Pas possible de tester le mode offline en dev cf https://github.com/vite-pwa/vite-plugin-pwa/issues/677#issuecomment-2032708162

Il faut build l'app

```sh
bun dev:api
```

```sh
bun build:client
bun preview:client
```

Go to http://localhost:4173/
