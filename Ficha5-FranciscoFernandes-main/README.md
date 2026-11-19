Ficha 5 – Redes de Comunicação

App React que vai buscar as cartas a um server Express, através de uma API em JSON. A app também permite acrescentar cartas através de um formulário, e o server guarda-as em `cartas.json`.

Como correr

São precisos dois terminais.

Terminal 1 (server):

```bash
cd server
npm install
npm run dev
```

O server fica em http://localhost:3000.

Terminal 2 (client):

```bash
cd client
npm install
npm run dev
```

A app fica em http://localhost:5173.

API

| Método | URL | O que recebe | O que responde |
| --- | --- | --- | --- |
| GET | `/api/cartas` | nada | a lista de cartas, com status 200 |
| GET | `/api/cartas/aleatoria` | nada | uma carta escolhida ao acaso, com status 200 |
| POST | `/api/cartas` | JSON com `name`, `type` e `attack` | a carta criada, com status 201 |

O POST responde 400 com uma mensagem de erro quando a carta não tem nome ou tipo.

Pergunta 3

Quando acrescentamos uma carta, o Network tab mostra dois pedidos para `/api/cartas`. O primeiro é o `OPTIONS`, enviado automaticamente pelo browser como preflight para confirmar se o server aceita o pedido POST com JSON e a origem da app. Depois aparece o `POST`, que envia a carta no body. O `OPTIONS` vem antes porque o pedido cruza origens e usa JSON, por isso o browser verifica primeiro as permissões CORS.

Pergunta 4

Nas três versões da aula, o server inicia com `node server.js`, o POST acontece, mas as cartas ainda ficam apenas no array em memória. Depois de desligar o server com Ctrl+C, esse array desaparece e a carta deixa de estar disponível. Quando o server passa a usar `cartas.json`, lê as cartas desse ficheiro ao arrancar e grava o array novamente em cada POST. Por isso, ao reiniciar, a carta continua lá.

Aluno: Francisco Fernandes
