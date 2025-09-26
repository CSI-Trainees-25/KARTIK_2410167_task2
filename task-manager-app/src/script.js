let taskList = document.getElementById("taskList");
let summaryPage = document.getElementById("summaryPage");
let summaryList = document.getElementById("summaryList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const taskCard = document.createElement("div");
        taskCard.className = "task-card";
        taskCard.draggable = true;
        taskCard.innerHTML = `
            <div class="task-header">
                <h3>${task.name}</h3>
                <div class="btns">
                    <button class="btn-primary" onclick="completeTask(${index})">Complete</button>
                    <button class="btn-danger" onclick="skipTask(${index})">Skip</button>
                </div>
            </div>
            <p>Duration: ${task.duration} seconds</p>
            <p>Scheduled: ${new Date(task.dateTime).toLocaleString()}</p>
            <div id="timer-${index}" class="timer"></div>
        `;
        taskCard.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", index);
        });
        taskCard.addEventListener("dragover", (e) => {
            e.preventDefault();
        });
        taskCard.addEventListener("drop", (e) => {
            e.preventDefault();
            const draggedIndex = e.dataTransfer.getData("text/plain");
            const draggedTask = tasks[draggedIndex];
            tasks.splice(draggedIndex, 1);
            tasks.splice(index, 0, draggedTask);
            saveTasks();
            renderTasks();
        });
        taskList.appendChild(taskCard);
    });
}

function completeTask(index) {
    tasks[index].completed = true;
    saveTasks();
    renderTasks();
}

function skipTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

async function startTask(index) {
    const timerDisplay = document.getElementById(`timer-${index}`);
    let remaining = tasks[index].duration;
    return new Promise(resolve => {
        const interval = setInterval(() => {
            timerDisplay.textContent = `⏳ Remaining: ${remaining}s`;
            remaining--;
            if (remaining < 0) {
                clearInterval(interval);
                tasks[index].completed = true;
                saveTasks();
                renderTasks();
                resolve();
            }
        }, 1000);
    });
}

document.getElementById("addTask").addEventListener("click", () => {
    const name = document.getElementById("taskName").value;
    const dateTime = document.getElementById("taskDateTime").value;
    const duration = document.getElementById("taskDuration").value;
    const priority = document.getElementById("taskPriority").value;
    if (!name || !dateTime || !duration) return alert("Please fill all fields");
    tasks.push({ name, dateTime, duration, priority, completed: false });
    saveTasks();
    renderTasks();
});

document.getElementById("startAll").addEventListener("click", async () => {
    for (let i = 0; i < tasks.length; i++) {
        const now = new Date();
        const taskTime = new Date(tasks[i].dateTime);
        if (taskTime > now) {
            alert(`Waiting for ${tasks[i].name} scheduled time...`);
            while (new Date() < taskTime) {
                await new Promise(r => setTimeout(r, 1000));
            }
        }
        await startTask(i);
        if (i < tasks.length - 1) {
            let breakTimer = 30;
            const breakInterval = setInterval(() => {
                document.getElementById(`timer-${i}`).textContent = `Break: ${breakTimer}s`;
                breakTimer--;
                if (breakTimer < 0) clearInterval(breakInterval);
            }, 1000);
            await new Promise(resolve => setTimeout(resolve, 30000));
        }
    }
    showSummary();
});

function showSummary() {
    taskList.style.display = "none";
    summaryPage.style.display = "flex";
    summaryList.innerHTML = tasks.map(t => `<li>${t.name} - ${t.completed ? "✅ Done" : "❌ Skipped"}</li>`).join("");
}

renderTasks();