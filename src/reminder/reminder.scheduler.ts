import { ReminderRepository } from "./reminder.repository";
import { WebSocketManager } from "../core/webSocketManager";

export class ReminderScheduler {
  private reminderRepository: ReminderRepository;
  private webSocketManager: WebSocketManager;

  constructor(reminderRepository: ReminderRepository, webSocketManager: WebSocketManager) {
    this.reminderRepository = reminderRepository;
    this.webSocketManager = webSocketManager;
  }

  public start() {
    setInterval(async () => {
      const now = new Date();
      const query = { dueDate: { $lte: now }, wasNotified: false };
      const dueReminders = await this.reminderRepository.fetchReminders(query);

      dueReminders.forEach((reminder) => {
        const clientId = reminder.clientId;
        const message = JSON.stringify({
          type: 'reminder',
          data: `Reminder: ${reminder.description}`
        })

        this.webSocketManager.sendToClient(clientId, message);
        this.reminderRepository.saveReminders({ ...reminder, wasNotified: true });
      });
    }, 1000);
  }
}