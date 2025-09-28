let taskList = document.getElementById("taskList");
let taskentry = document.getElementById("taskInputs");
let summaryPage = document.getElementById("summaryPage");
let summaryList = document.getElementById("summaryList");
let progressFill = document.getElementById("progressFill");
let numbers = document.getElementById("numbers");
let doNowList = document.getElementById("doNowList");
let doNowCount = document.getElementById("doNowCount");
let endEarlyBtn = document.getElementById("endEarly");
let addbtn = document.getElementById("add");
let addtask = document.getElementById("addTask");
let modal = document.getElementById("timerModal");


  function updateProgress() {
  let done = tasks.filter(t => t.completed).length + doNowTasks.filter(t => t.completed).length;
  let total = tasks.length + doNowTasks.length;
  numbers.textContent = `${done} / ${total}`;
  progressFill.style.width = total ? `${(done/total)*100}%` : "0%";
}


addbtn.addEventListener("click", () => {
 taskentry.style.display = "block";
});


 let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
 let doNowTasks = JSON.parse(localStorage.getItem("doNowTasks")) || [];


let tasklist = document.getElementById("taskList");



 function displayTasks() {
    updateProgress();
  tasklist.innerHTML = ""; 

  tasks.forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.innerHTML = `
    <div class="taskcontent">
      <div class="dotask-content" draggable="true" >
        <div class="task-header">
          <b>${task.name}</b>
          <span style="font-size:0.9em; margin-right : 7rem ; color: red;">${task.priority}</span>
        </div>
        <div style="font-size:0.95em;">
          <span>🗓️ Due date: ${task.date} , ${task.time}</span>
        </div>
       
        <div class="btns">
          <button class="btn-complete" style="background-color: green; color: white">Complete</button>
          <button class="btn-skip" style="background-color: red; color: white">Skip</button>
          <button class="btn-donow" style="background-color: purple; color: white">Move to do now</button>
        </div>
        </div>
        </div>
      `;
      if (task.completed) taskDiv.style.opacity = 0.5;
      // if (task.completed) alert("Task Completed!");
    
    taskDiv.querySelector(".btn-donow").onclick = () => {
      doNowTasks.push({ ...task, completed: false });
      tasks.splice(index, 1);         
      saveTasks();
      savedotasks();
      displayTasks();
      displayDoNowTasks();
    };
    taskDiv.querySelector(".btn-complete").onclick = () => {
      tasks[index].completed = true;
      saveTasks();
      displayTasks();
       updateProgress();
       checkAllCompleted();
    };
    
  const dragElem = taskDiv.querySelector(".dotask-content");
  dragElem.addEventListener("dragstart", function(e) {
    dragSrcType = "main";
    dragSrcIdx = index;
    e.dataTransfer.effectAllowed = "move";
  });
  dragElem.addEventListener("dragend", function(e) {
    dragSrcType = null;
    dragSrcIdx = null;
  });

    tasklist.appendChild(taskDiv);
  });


  const skipButtons = document.getElementsByClassName("btn-skip");
  Array.from(skipButtons).forEach((btn, idx) => {
    btn.onclick = () => {
      tasks.splice(idx, 1);
    //   alert("Task Skipped!");
      saveTasks();
      displayTasks();
       updateProgress();
       displayDoNowTasks();
    };
  });
}


function displayDoNowTasks() {
  doNowList.innerHTML = "";
  doNowTasks.forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "dotask";
    taskDiv.innerHTML = `
    <div class = "taskcontent">
    <div class = "donowtask-content" >
      <div class="task-header">
        <b>${task.name}</b>
        <span style="font-size:0.9em; margin-right:7rem; color:purple;">${task.priority}</span>
      </div>
      <div style="font-size:0.95em;">
        <span>🗓️ Due date: ${task.date} , ${task.time}</span>
      </div>
      
      <div class="btns">
        <button class="btn-timer" style="background-color:green; color:white">Set Timer</button>
         <button class="btn-complete" style="background-color: yellow; color: black">Complete</button>
        <button class="btn-skip" style="background-color:red; color:white">Remove</button>
      </div>
      <div class="timer-controls" style="display:none; margin-top:10px;">
        <input class="hrs" type="number" min="0" max="23" placeholder="HH" style="width:40px;">
        <input class="mins" type="number" min="0" max="59" placeholder="MM" style="width:40px;">
        <input class="secs" type="number" min="0" max="59" placeholder="SS" style="width:40px;">
        <button class="startBtn" style="background-color:blue; color:white">Start</button>
        <div class="countdown" style="margin-left:10px;"></div>
      </div>
      <div class="status" style="margin-top:10px; color:green; font-weight:bold;">
        ${task.completed ? "✅ Completed" : ""}
        
      </div>
      </div>
      </div>
    `;
    if (task.completed) taskDiv.style.opacity = 0.5;
    // if (task.completed) alert("Task Completed!");
    if (task.completed)  updateProgress();
    
    taskDiv.querySelector(".btn-skip").onclick = () => {
      tasks.push({ ...task, completed: false });
      doNowTasks.splice(index, 1);
      savedotasks();
      displayDoNowTasks();
        updateProgress();
      saveTasks();
      displayTasks();
      
    };
    
      taskDiv.querySelector(".btn-complete").onclick = () => {
      doNowTasks[index].completed = true;
       savedotasks();
      displayDoNowTasks();
        updateProgress();
        checkAllCompleted();
      
    };

    
    const timerControls = taskDiv.querySelector(".timer-controls");
    taskDiv.querySelector(".btn-timer").onclick = () => {
      timerControls.style.display = "block";
    };

   
    let timerInterval;
    const startBtn = taskDiv.querySelector(".startBtn");
    const countdown = taskDiv.querySelector(".countdown");
    startBtn.onclick = () => {
      let hrs = parseInt(taskDiv.querySelector(".hrs").value) || 0;
      let mins = parseInt(taskDiv.querySelector(".mins").value) || 0;
      let secs = parseInt(taskDiv.querySelector(".secs").value) || 0;
      let totalSeconds = hrs * 3600 + mins * 60 + secs;

      if (totalSeconds <= 0) {
        alert("Please set a valid time!");
        return;
      }

      clearInterval(timerInterval);

      timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
          totalSeconds--;
          let h = Math.floor(totalSeconds / 3600);
          let m = Math.floor((totalSeconds % 3600) / 60);
          let s = totalSeconds % 60;
          countdown.textContent = 
            `${String(h).padStart(2, '0')} : ${String(m).padStart(2, '0')} : ${String(s).padStart(2, '0')}`;
        } else {
          clearInterval(timerInterval);
          countdown.textContent = "⏱ Time's Up!";
          countdown.style.color = "green";
         
          doNowTasks[index].completed = true;
          startBtn.display.style = "none";
          savedotasks();
          displayDoNowTasks();
          checkAllCompleted();
        }
      }, 1000);
    };

    doNowList.appendChild(taskDiv);
  });
}



 doNowList.ondragover = function(e) { e.preventDefault(); };
  doNowList.ondrop = function(e) {
    e.preventDefault();
    if (dragSrcType === "main") {
      let t = tasks.splice(dragSrcIdx, 1)[0];
      doNowTasks.push(t);
      saveTasks();
      displayTasks();
      displayDoNowTasks();
    }
  };

function savedotasks() {
        localStorage.setItem("doNowTasks", JSON.stringify(doNowTasks));
    }


  
     function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
addtask.addEventListener("click", () => {
     const name = document.getElementById("taskName").value;
      const dateTime = document.getElementById("taskDateTime").value;
      let date = "";
      let time = "";
      if (dateTime) {
        const dt = new Date(dateTime);
        date = dt.toLocaleDateString();
        time = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      const priority = document.getElementById("taskPriority").value;
      
      
      if (!name || !dateTime ) {
        alert("Please fill all fields!");
        return;
      }

      tasks.push({ name, date, time, priority, completed: false });

      
      saveTasks();

   
      displayTasks();




      document.getElementById("taskName").value = "";
      document.getElementById("taskDateTime").value = "";
      document.getElementById("taskTime").value = "";
    });

    function checkAllCompleted() {
  const allCompleted =
    tasks.every(t => t.completed) &&
    doNowTasks.every(t => t.completed) &&
    (tasks.length + doNowTasks.length > 0);

  if (allCompleted) {
    showSummary();
  }
}

function showSummary() {

  document.querySelector(".container").style.display = "none";
  document.querySelector(".progress").style.display = "none";

  
  summaryPage.style.display = "block";
  summaryPage.innerHTML = "<h2>Summary</h2><ul id='summaryList'></ul>";

  const allTasks = [
    ...tasks.map(t => ({ ...t, type: "Task" })),
    ...doNowTasks.map(t => ({ ...t, type: "Do Now" }))
  ];

  let totalExecutionTime = 0;
  allTasks.forEach(task => {
   
    const li = document.createElement("li");
    li.textContent = `${task.type}: ${task.name} | Priority: ${task.priority} | Due: ${task.date} ${task.time} | Status: Completed`;
    summaryPage.querySelector("#summaryList").appendChild(li);
  });

  
  const execDiv = document.createElement("div");
  execDiv.textContent = "All tasks completed! (Execution time tracking can be added here)";
  summaryPage.appendChild(execDiv);
}

    
displayTasks();
displayDoNowTasks();



