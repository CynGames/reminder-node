import { MongoConnect } from './core/mongo';
import { ReminderRepository } from './reminder/reminder.repository';
import { WebSocketManager } from "./core/webSocketManager";
import { ReminderScheduler } from "./reminder/reminder.scheduler";

async function main() {
  const mongoConnection = MongoConnect.getInstance();
  await mongoConnection.connect();

  const reminderRepository = new ReminderRepository();
  const webSocketManager = new WebSocketManager(reminderRepository, 8080);
  webSocketManager.start();

  const reminderScheduler = new ReminderScheduler(reminderRepository, webSocketManager);
  reminderScheduler.start();
}

main();
