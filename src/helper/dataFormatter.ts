import { Reminder } from "../reminder/model/reminder";
import { v4 as uuidv4 } from "uuid";

export const formatReminderData = (data: Reminder) => {
  const reminder: Reminder = {
    id: uuidv4(),
    clientId: data.clientId,
    title: data.title,
    description: data.description,
    setReminderInSeconds: data.setReminderInSeconds,
    dueDate: new Date(
      new Date().getTime() + data.setReminderInSeconds * 1000
    ),
    wasNotified: false,
  };

  return reminder;
};