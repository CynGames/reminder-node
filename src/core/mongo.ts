import { Collection, Document, MongoClient } from "mongodb";

const DB_NAME = "reminders-db";

export class MongoConnect {
  private static instance: MongoConnect;
  public client: MongoClient;

  private constructor() {
    this.client = new MongoClient(`mongodb://localhost:8001/${DB_NAME}`);
  }

  public static getInstance(): MongoConnect {
    if (!MongoConnect.instance) {
      MongoConnect.instance = new MongoConnect();
    }

    return MongoConnect.instance;
  }

  public collection<T extends Document>(collectionName: string): Collection<T> {
    return this.client.db(DB_NAME).collection<T>(collectionName);
  }

  public async connect() {
    await this.client.connect();
  }

  public async disconnect() {
    await this.client.close();
  }
}
