# Task Manager Application

## Overview
This project is a responsive task manager application that allows users to manage their tasks efficiently. Users can add tasks with a name, duration, and scheduled date, and then start them sequentially with breaks in between. The application also provides options to complete or skip tasks and displays a summary of completed tasks.

## Features
- Input fields for:
  - Task Name
  - Time Duration
  - Task Date
- Buttons for:
  - Adding tasks
  - Starting all tasks
  - Completing individual tasks
  - Skipping individual tasks
- Task list display with drag-and-drop functionality
- Summary page after all tasks are completed
- Timer functionality for each task
- State persistence using local storage to retain tasks after refreshing

## Project Structure
```
task-manager-app
├── src
│   ├── index.html       # HTML structure of the application
│   ├── style.css        # CSS styles for the application
│   ├── script.js        # JavaScript logic for task management
│   └── types
│       └── index.js     # Type definitions for tasks
├── package.json         # npm configuration file
└── README.md            # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd task-manager-app
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage
1. Open `src/index.html` in your web browser.
2. Fill in the task details in the input fields.
3. Click "Add Task" to add the task to the list.
4. Click "Start" to begin executing tasks sequentially.
5. Use the "Complete" and "Skip" buttons to manage tasks as needed.
6. View the summary of completed tasks at the end.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License.