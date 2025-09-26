// This file defines the Task interface used in the task manager application.

export interface Task {
    name: string;
    duration: number; // Duration in seconds
    dateTime: string; // ISO string format for date and time
    completed: boolean;
}