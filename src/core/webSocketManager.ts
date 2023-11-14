import { WebSocket, WebSocketServer } from 'ws';
import { ReminderRepository } from '../reminder/reminder.repository';
import { formatReminderData } from '../helper/dataFormatter';

type ClientData = {
  ws: WebSocket;
  clientId: string;
};

export class WebSocketManager {
  private wss: WebSocketServer;
  private reminderRepository: ReminderRepository;
  private readonly clients: Map<string, ClientData>;

  constructor(reminderRepository: ReminderRepository, port: number) {
    this.reminderRepository = reminderRepository;
    this.clients = new Map<string, ClientData>();
    this.wss = new WebSocketServer({ port });
  }

  public start(): void {
    this.wss.on('connection', (ws) => {
      console.log('A client connected!');

      ws.on('message', async (message: string) => {
        console.log(`Received message => ${message}`);

        const data = JSON.parse(message.toString());
        await this.handleMessage(ws, data);
      });

      ws.on('close', () => {
        this.handleDisconnect(ws);
        console.log('A client connected!');
      });
    });

    console.log(`WebSocket server started on port ${this.wss.options.port}`);
  }

  private async handleMessage(ws: WebSocket, data: any): Promise<void> {
    if (data.type === 'auth') {
      this.clients.set(data.clientId, { ws, clientId: data.clientId });
      ws.send('Authenticated successfully!');
    }

    if (data.type === 'setReminder') {
      const reminder = formatReminderData(data);
      await this.reminderRepository.saveReminders(reminder);

      ws.send('Reminder saved Successfully!');
    }
  }

  private handleDisconnect(ws: WebSocket) {
    this.clients.forEach((value, key) => {
      if (value.ws === ws) {
        this.clients.delete(key);
      }
    });
  }

  public getClients(): Map<string, ClientData> {
    return this.clients;
  }

  public sendToClient(clientId: string, message: string): void {
    const clientData = this.clients.get(clientId);
    clientData?.ws.send(message);
  }
}
