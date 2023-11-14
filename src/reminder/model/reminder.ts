export interface Reminder {
    id: string;
    clientId: string;
    title: string;
    description: string;
    setReminderInSeconds: number;
    dueDate: Date;
    wasNotified: boolean
}