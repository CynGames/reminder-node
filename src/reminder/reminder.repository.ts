import { Binary } from 'mongodb';
import { MongoConnect } from '../core/mongo';
import { Reminder } from './model/reminder';
import { UUID, uuidv7 } from 'uuidv7';

const REMINDER_COLLECTION = 'reminder';

export class ReminderRepository {
  private readonly mongoInstance: MongoConnect;

  constructor() {
    this.mongoInstance = MongoConnect.getInstance();
  }

  async fetchReminders(where: any): Promise<Reminder[]> {
    const collection = this.mongoInstance.collection(REMINDER_COLLECTION);
    const remindersCursor = collection.find( where );
    const reminderDocuments = await remindersCursor.toArray();

    return reminderDocuments.map((doc) => {
      const { _id, ...reminderFields } = doc;

      return {
        id: _id.toString(),
        ...reminderFields,
      } as Reminder;
    });
  }

  async saveReminders(reminder: Reminder) {
    const collection = this.mongoInstance.collection(REMINDER_COLLECTION);
    const { id, ...fields } = reminder;

    const reminderDocument = {
      _id: new Binary(UUID.parse(id).bytes, 4),
      ...fields,
    };

    await collection.replaceOne(
      { _id: reminderDocument._id },
      reminderDocument,
      { upsert: true }
    );
  }
}
