import pkg from 'whatsapp-web.js';

const {Client, LocalAuth} = pkg;
import qrcode from 'qrcode-terminal';
import express from 'express';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const app = express();
app.use(express.json());

// Client manager to store and manage multiple WhatsApp clients
class ClientManager {
    constructor() {
        this.clients = new Map();
        this.qrCodes = new Map();
    }

    // Restore clients from wwebjs_auth directory
    async restoreClients() {
        try {
            // Get the directory path for .wwebjs_auth
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const authDir = path.join(__dirname, '..', '.wwebjs_auth');

            // Check if the directory exists
            if (!fs.existsSync(authDir)) {
                console.log('📁 No .wwebjs_auth directory found. No clients to restore.');
                return;
            }

            // Read all subdirectories
            const dirs = fs.readdirSync(authDir);

            // Filter directories that start with "session-"
            const sessionDirs = dirs.filter(dir => dir.startsWith('session-'));

            if (sessionDirs.length === 0) {
                console.log('📁 No client sessions found in .wwebjs_auth directory.');
                return;
            }

            console.log(`🔄 Found ${sessionDirs.length} client session(s). Restoring...`);

            // Restore each client
            for (const sessionDir of sessionDirs) {
                // Extract client ID from directory name (remove "session-" prefix)
                const clientId = sessionDir.substring(8);

                console.log(`🔄 Restoring client: ${clientId}`);

                // Create a new client with this ID
                try {
                    this.createClient(clientId);
                } catch (error) {
                    console.error(`❌ Error restoring client ${clientId}:`, error);
                }
            }
        } catch (error) {
            console.error('❌ Error restoring clients:', error);
        }
    }

    // Create a new client with the given ID
    createClient(clientId) {
        if (this.clients.has(clientId)) {
            throw new Error(`Client with ID ${clientId} already exists`);
        }

        const client = new Client({
            authStrategy: new LocalAuth({
                clientId: clientId
            }),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            }
        });

        // Set up event listeners for this client
        client.on('qr', (qr) => {
            console.log(`🔗 QR код получен для клиента ${clientId}, сканируйте его в WhatsApp:`);
            this.qrCodes.set(clientId, qr);
            qrcode.generate(qr, {small: true});
            console.log('📱 Откройте WhatsApp > Настройки > Связанные устройства > Связать устройство');
        });

        client.on('ready', () => {
            console.log(`✅ WhatsApp клиент ${clientId} готов к работе!`);
            console.log(`📞 Подключен как: ${client.info?.pushname || 'Unknown'}`);
        });

        client.on('authenticated', () => {
            console.log(`🔐 WhatsApp аутентификация успешна для клиента ${clientId}`);
        });

        client.on('auth_failure', (msg) => {
            console.error(`❌ Ошибка аутентификации WhatsApp для клиента ${clientId}:`, msg);
        });

        client.on('disconnected', (reason) => {
            console.log(`🔌 WhatsApp клиент ${clientId} отключен:`, reason);
            // Remove client from the manager when disconnected
            this.removeClient(clientId);
        });

        // Initialize the client
        client.initialize();

        // Store the client in the map
        this.clients.set(clientId, client);
        return client;
    }

    // Get a client by ID
    getClient(clientId) {
        return this.clients.get(clientId);
    }

    // Get all clients
    getAllClients() {
        return Array.from(this.clients.entries()).map(([id, client]) => ({
            id,
            info: client.info || null,
            connected: client.info ? true : false
        }));
    }

    // Remove a client by ID
    async removeClient(clientId) {
        const client = this.clients.get(clientId);
        if (client) {
            try {
                await client.destroy();

                // Delete session information from .wwebjs_auth directory
                try {
                    const __dirname = path.dirname(fileURLToPath(import.meta.url));
                    const sessionDir = path.join(__dirname, '..', '.wwebjs_auth', `session-${clientId}`);

                    if (fs.existsSync(sessionDir)) {
                        // Delete the session directory recursively
                        fs.rmSync(sessionDir, {recursive: true, force: true});
                        console.log(`🗑️ Deleted session information for client ${clientId}`);
                    }
                } catch (error) {
                    console.error(`❌ Error deleting session information for client ${clientId}:`, error);
                }
            } catch (error) {
                console.error(`Error destroying client ${clientId}:`, error);
            }
            this.clients.delete(clientId);
            this.qrCodes.delete(clientId);
            return true;
        }
        return false;
    }

    // Get QR code for a client
    getQRCode(clientId) {
        return this.qrCodes.get(clientId);
    }
}

// Create a client manager instance
const clientManager = new ClientManager();

// Restore clients from wwebjs_auth directory
(async () => {
    try {
        await clientManager.restoreClients();
    } catch (error) {
        console.error('❌ Error during client restoration:', error);
    }
})();

// Create a default client
// const defaultClientId = 'default';
// clientManager.createClient(defaultClientId);

// Индикатор печати
async function sendTypingIndicator(chatId, clientId) {
    try {
        const client = clientManager.getClient(clientId);
        if (!client) {
            throw new Error(`Client with ID ${clientId} not found`);
        }

        const chat = await client.getChatById(chatId);
        await chat.sendStateTyping();
    } catch (error) {
        console.error(`❌ Ошибка отправки индикатора печати для клиента ${clientId}:`, error);
        throw error;
    }
}

// API endpoints for client management

// Get all clients
app.get('/api/clients', (req, res) => {
    try {
        const clients = clientManager.getAllClients();
        res.json({
            success: true,
            clients: clients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Create a new client
app.post('/api/clients', (req, res) => {
    const {clientId} = req.body;

    if (!clientId) {
        return res.status(400).json({
            success: false,
            error: 'Client ID is required'
        });
    }

    try {
        const client = clientManager.createClient(clientId);
        res.status(201).json({
            success: true,
            message: `Client ${clientId} created successfully`,
            clientId: clientId
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Delete a client
app.delete('/api/clients/:clientId', async (req, res) => {
    const {clientId} = req.params;

    try {
        const result = await clientManager.removeClient(clientId);
        if (result) {
            res.json({
                success: true,
                message: `Client ${clientId} removed successfully`
            });
        } else {
            res.status(404).json({
                success: false,
                error: `Client ${clientId} not found`
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Получение QR кода
app.get('/api/clients/:clientId/qr', (req, res) => {
    const clientId = req.params.clientId
    const qrCode = clientManager.getQRCode(clientId);

    if (qrCode) {
        res.json({
            success: true,
            clientId: clientId,
            qr: qrCode,
            message: `QR код успешно получен для клиента ${clientId}. Сканируйте его в WhatsApp.`
        });
    } else {
        res.status(404).json({
            success: false,
            clientId: clientId,
            error: `QR код не найден для клиента ${clientId}. Пожалуйста, подождите, пока клиент WhatsApp не получит новый QR код.`
        });
    }
});

// Отправка сообщений
app.post('/api/send-message', async (req, res) => {
    const {number, message, clientId, delay = 0} = req.body;

    if (!number || !message) {
        return res.status(400).json({
            success: false,
            error: 'Не указан номер или сообщение'
        });
    }

    try {
        const client = clientManager.getClient(clientId);
        if (!client) {
            return res.status(404).json({
                success: false,
                error: `Client with ID ${clientId} not found`
            });
        }

        // Добавляем задержку для имитации человеческого поведения
        if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        const chatId = number.includes('@c.us') ? number : `${number}@c.us`;

        // Отправляем индикатор печати
        await sendTypingIndicator(chatId, clientId);

        // Небольшая задержка перед отправкой
        await new Promise(resolve => setTimeout(resolve, 1000));

        const result = await client.sendMessage(chatId, message, {sendSeen: false});

        let messageId = null;
        if (result && result.id && result.id._serialized) {
            messageId = result.id._serialized;
        }

        console.log(`📤 Сообщение отправлено клиентом ${clientId} на ${number}: ${message.substring(0, 50)}...`);

        res.json({
            success: true,
            clientId: clientId,
            message: 'Сообщение отправлено',
            messageId: messageId
        });
    } catch (error) {
        console.error(`❌ Ошибка отправки сообщения для клиента ${clientId}:`, error);
        res.status(500).json({
            success: false,
            clientId: clientId,
            error: error.message
        });
    }
});

// Статус подключения
app.get('/api/clients/:clientId/status', async (req, res) => {
    const clientId = req.params.clientId

    try {
        const client = clientManager.getClient(clientId);
        if (!client) {
            return res.status(404).json({
                success: false,
                clientId: clientId,
                error: `Client with ID ${clientId} not found`,
                timestamp: new Date().toISOString()
            });
        }

        const state = await client.getState();
        const info = client.info;

        res.json({
            success: true,
            clientId: clientId,
            connected: state === 'CONNECTED',
            state: state,
            info: info ? {
                pushname: info.pushname,
                me: info.me,
                platform: info.platform,
                battery: info.battery
            } : null,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.json({
            success: false,
            clientId: clientId,
            connected: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    const clients = clientManager.getAllClients();
    const connectedClients = clients.filter(client => client.connected);

    if (connectedClients.length > 0) {
        res.status(200).json({
            status: 'healthy',
            connected: true,
            clientsCount: clients.length,
            connectedClientsCount: connectedClients.length,
            clients: clients,
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(503).json({
            status: 'unhealthy',
            connected: false,
            clientsCount: clients.length,
            connectedClientsCount: 0,
            error: 'No WhatsApp clients connected',
            timestamp: new Date().toISOString()
        });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 Завершение работы...');

    // Destroy all clients
    const clients = clientManager.getAllClients();
    for (const client of clients) {
        try {
            console.log(`🔌 Отключение клиента ${client.id}...`);
            await clientManager.removeClient(client.id);
        } catch (error) {
            console.error(`❌ Ошибка при отключении клиента ${client.id}:`, error);
        }
    }

    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('🛑 Получен SIGTERM, завершение работы...');

    // Destroy all clients
    const clients = clientManager.getAllClients();
    for (const client of clients) {
        try {
            console.log(`🔌 Отключение клиента ${client.id}...`);
            await clientManager.removeClient(client.id);
        } catch (error) {
            console.error(`❌ Ошибка при отключении клиента ${client.id}:`, error);
        }
    }

    process.exit(0);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 WhatsApp API запущен на порту ${PORT}`);
});
