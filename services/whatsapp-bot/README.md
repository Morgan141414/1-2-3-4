Д# WhatsApp Bot API

A WhatsApp API client that allows you to create and manage multiple WhatsApp clients, send and receive messages, and more.

## Description

This project provides a REST API for interacting with WhatsApp using the [whatsapp-web.js](https://wwebjs.dev/) library. It allows you to create multiple WhatsApp clients, each with its own session, and manage them through a simple API.

## Features

- Create and manage multiple WhatsApp clients
- Send messages to WhatsApp contacts
- Get QR codes for client authentication
- Check client status and connection information
- Health check endpoint for monitoring

## Installation

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Steps

1. Clone the repository:
```bash
git clone https://gitlab.com/saphena/whatsapp-bot.git
cd whatsapp-bot
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

## Usage

### API Endpoints

#### Client Management

- **GET /api/clients** - Get a list of all clients
  ```bash
  curl -X GET http://localhost:3000/api/clients
  ```

- **POST /api/clients** - Create a new client
  ```bash
  curl -X POST http://localhost:3000/api/clients \
    -H "Content-Type: application/json" \
    -d '{"clientId": "client1"}'
  ```

- **DELETE /api/clients/:clientId** - Remove a client
  ```bash
  curl -X DELETE http://localhost:3000/api/clients/client1
  ```

#### WhatsApp Functionality

- **GET /api/qr/:clientId?** - Get the QR code for a client (defaults to 'default' client if not specified)
  ```bash
  curl -X GET http://localhost:3000/api/qr/client1
  ```

- **POST /api/send-message** - Send a message using a specific client
  ```bash
  curl -X POST http://localhost:3000/api/send-message \
    -H "Content-Type: application/json" \
    -d '{
      "clientId": "client1",
      "number": "1234567890",
      "message": "Hello from WhatsApp Bot!",
      "delay": 0
    }'
  ```

- **GET /api/status/:clientId?** - Get the status of a client (defaults to 'default' client if not specified)
  ```bash
  curl -X GET http://localhost:3000/api/status/client1
  ```

- **GET /api/health** - Check the health of all clients
  ```bash
  curl -X GET http://localhost:3000/api/health
  ```

### Example Workflow

1. Start the server
2. Create a new client with a unique ID
3. Get the QR code for the client and scan it with your WhatsApp mobile app
4. Once authenticated, you can send messages using the client

## How It Works

The application uses a `ClientManager` class to manage multiple WhatsApp clients. Each client is initialized with its own authentication session and can be used independently.

When a client is created, it generates a QR code that needs to be scanned with the WhatsApp mobile app to authenticate the session. Once authenticated, the client can be used to send messages and perform other WhatsApp operations.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [whatsapp-web.js](https://wwebjs.dev/) - The library used to interact with WhatsApp Web
