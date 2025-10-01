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
let startAllBtn = document.getElementById("startAllBtn");


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


addtask.addEventListener("click", () => {
  const name = document.getElementById("taskName").value;
  const dateTime = document.getElementById("taskDateTime").value;
  const durationRaw = document.getElementById("taskTime").value; 
  const priority = document.getElementById("taskPriority").value;

  let date = "";
  let time = "";
  let dueTimestamp = null;
  let duration = 0; 
  const now = Date.now();
const dtTimestamp = dateTime ? new Date(dateTime).getTime() : null;

  if (dateTime) {
    const dt = new Date(dateTime);
    date = dt.toLocaleDateString();
    time = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    dueTimestamp = dt.getTime();
  }

  if (durationRaw) {
    const [hrs, mins] = durationRaw.split(":").map(Number);
    duration = hrs * 3600 + mins * 60;
    //  let h = Math.floor(totalSeconds / 3600);
    //       let m = Math.floor((totalSeconds % 3600) / 60);
    //       let s = totalSeconds % 60;
    //       countdown.textContent = 
    // `${String(h).padStart(2, '0')} : ${String(m).padStart(2, '0')} : ${String(s).padStart(2, '0')}`;
  }

  if (!name || !dateTime || !durationRaw || !dateTime ) {
    alert("Please fill all fields!");
    return;
  }
  if (dtTimestamp !== null && dtTimestamp < now) {
  alert("Please enter a valid future date and time!");
  return;
}

  tasks.push({ name, date, time, priority, completed: false, dueTimestamp, durationRaw, duration, timerStarted: false });

  saveTasks();
  displayTasks();

  document.getElementById("taskName").value = "";
  document.getElementById("taskDateTime").value = "";
  document.getElementById("taskTime").value = "";
});


 function displayTasks() {
    updateProgress();
    
  tasklist.innerHTML = ""; 

  tasks.forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
   taskDiv.style.cursor = "grab";
    taskDiv.innerHTML = `
    <div class="taskcontent">
      <div class="dotask-content" draggable="true" >
        <div class="task-header">
          <b>${task.name}</b>
          <span style="font-size:0.9em; margin-right : 7rem ; color: red;">${task.priority}</span>
        </div>
        <div style="font-size:0.95em;">
          <span>🗓️ Due date: ${task.date} , ${task.time}</span><br>
          <span>⏱️ duration : ${task.durationRaw}</span>   
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
      doNowTasks.push({ ...task, completed: false, duration: Number(task.duration), durationRaw: task.durationRaw, timerStarted: false });
      tasks.splice(index, 1);         
      saveTasks();
      savedotasks();
      displayTasks();
      displayDoNowTasks();
    };
    taskDiv.querySelector(".btn-complete").onclick = () => {
      doNowTasks.push({ ...task, completed: true, durationRaw: task.durationRaw });
      tasks.splice(index, 1); 
      
      saveTasks();
      displayTasks();
      displayDoNowTasks();
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
    taskDiv.draggable = true;
    taskDiv.style.cursor = "grab";
    taskDiv.dataset.index = index;
    doNowCount.textContent = `${doNowTasks.filter(t => t.completed).length} / ${doNowTasks.length}`;
    
    taskDiv.innerHTML = `
    <div class = "taskcontent">
    <div class = "donowtask-content" >
      <div class="task-header">
        <b>${task.name}</b>
        <span style="font-size:0.9em; margin-right:7rem; color:purple;">${task.priority}</span>
      </div>
      <div style="font-size:0.95em;">
        <span>🗓️ Due date: ${task.date} , ${task.time}</span><br>
        ⏱️ duration: ${task.durationRaw || 'Not set'}
        <span class="countdown" style="margin-left:10px; color:blue;"></span>
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
        
      </div>
      <div class="status" style="margin-top:10px; color:green; font-weight:bold;">
        ${task.completed ? "✅ Completed" : ""}
        
      </div>
      </div>
      </div>
      </div>
    `;
    if (task.completed) taskDiv.style.opacity = 0.5;
    
    if (task.completed)  updateProgress();
    
    taskDiv.querySelector(".btn-skip").onclick = () => {
      tasks.push({ ...task, completed: false, duration: task.duration, durationRaw: task.durationRaw , timerStarted: false });
        
      doNowTasks.splice(index, 1);
      savedotasks();
      displayDoNowTasks();
        updateProgress();
      saveTasks();
      displayTasks();
      
    };
      
      taskDiv.querySelector(".btn-complete").onclick = () => {
        if (!doNowTasks[index].startTime) doNowTasks[index].startTime = Date.now();
       doNowTasks[index].endTime = Date.now();
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
      doNowTasks[index].startTime = Date.now();
      savedotasks();
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
          doNowTasks[index].endTime = Date.now();
         
          doNowTasks[index].completed = true;
          doNowTasks[index].duration = totalSeconds;
          savedotasks();
          displayDoNowTasks();
          checkAllCompleted();
        }
      }, 1000);
    };

       // Drag events
    taskDiv.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", index);
      taskDiv.style.opacity = "0.5";
    });
    taskDiv.addEventListener("dragend", (e) => {
      taskDiv.style.opacity = "1";
    });
    taskDiv.addEventListener("dragover", (e) => {
      e.preventDefault();
      taskDiv.style.border = "2px dashed #6a0dad";
    });
    taskDiv.addEventListener("dragleave", (e) => {
      taskDiv.style.border = "";
    });
    taskDiv.addEventListener("drop", (e) => {
      e.preventDefault();
      taskDiv.style.border = "";
      const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
      const toIndex = index;
      if (fromIndex !== toIndex) {
       
        const moved = doNowTasks.splice(fromIndex, 1)[0];
        doNowTasks.splice(toIndex, 0, moved);
        savedotasks();
        displayDoNowTasks();
      }
    });


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
  allTasks.forEach(task => {
    let execTime = "";
    if (task.startTime && task.endTime) {
      const seconds = Math.round((task.endTime - task.startTime) / 1000);
      execTime = ` | Execution Time: ${seconds} sec`;
    }
    const li = document.createElement("li");
    li.textContent = `${task.type}: ${task.name} | Priority: ${task.priority} | Due: ${task.date} ${task.time} | Status: Completed${execTime}`;
    summaryPage.querySelector("#summaryList").appendChild(li);
  });

  const execDiv = document.createElement("div");
  execDiv.textContent = "All tasks completed!";
  summaryPage.appendChild(execDiv);
}

    
displayTasks();
displayDoNowTasks();

startAllBtn.onclick = async function() {
 
  const tasksToRun = doNowTasks.filter(t => !t.completed);
  for (let i = 0; i < tasksToRun.length; i++) {
    const idx = doNowTasks.indexOf(tasksToRun[i]);
    if (idx === -1) continue;

   
    let duration = Number(doNowTasks[idx].duration);
    if (!duration || isNaN(duration)) duration = 60;

    
    displayDoNowTasks(); 
    await new Promise(res => setTimeout(res, 100));
    const taskDivs = doNowList.querySelectorAll(".dotask");
    let countdownElem = null;
   
   for (let div of taskDivs) {
  if (div.textContent.includes(doNowTasks[idx].name)) {
    countdownElem = div.querySelector(".countdown");
    if (countdownElem) countdownElem.style.color = "blue";
    break;
  }
}
   
    await runTaskTimer( duration, countdownElem);

   
    doNowTasks[idx].completed = true;
    savedotasks();
    displayDoNowTasks();
    updateProgress && updateProgress();
    checkAllCompleted && checkAllCompleted();

   
    if (i < tasksToRun.length - 1) {
      await runBreakTimer(30);
    }
  }
};


function runTaskTimer( totalSeconds, countdownElem) {
  return new Promise(resolve => {
    let timer = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--;
        if (countdownElem) {
          let h = Math.floor(totalSeconds / 3600);
          let m = Math.floor((totalSeconds % 3600) / 60);
          let s = totalSeconds % 60;
          countdownElem.textContent =
            `${String(h).padStart(2, '0')} : ${String(m).padStart(2, '0')} : ${String(s).padStart(2, '0')}`;
        }
      } else {
        clearInterval(timer);
        if (countdownElem) {
          countdownElem.textContent = "⏱ Time's Up!";
          countdownElem.style.color = "green";
        }
        resolve();
      }
    }, 1000);
  });
}


function runBreakTimer(seconds) {
  return new Promise(resolve => {
    let breakTime = seconds;
    let breakMsg = document.createElement("div");
    breakMsg.textContent = `Break: ${breakTime} seconds`;
    breakMsg.style = "background: #ffe; color: #6a0dad; padding: 1em; text-align: center; font-weight: bold;";
    doNowList.prepend(breakMsg);

    let breakInterval = setInterval(() => {
      breakTime--;
      breakMsg.textContent = `Break: ${breakTime} seconds`;
      if (breakTime <= 0) {
        clearInterval(breakInterval);
        breakMsg.remove();
        resolve();
      }
    }, 1000);
  });
}

setInterval(() => {
  const now = Date.now();
  tasks.forEach((task, index) => {
    if (
      !task.completed &&
      !task.timerStarted &&
      task.dueTimestamp &&
      now >= task.dueTimestamp
    ) {
      doNowTasks.push({ ...task, completed: false, duration: Number(task.duration), durationRaw: task.durationRaw, timerStarted: true });
      tasks.splice(index, 1);
      saveTasks();
      savedotasks();
      displayTasks();
      displayDoNowTasks();
      autoStartTaskTimer(doNowTasks.length - 1);
    }
  });
  doNowTasks.forEach((task, index) => {
    if (
      !task.completed &&
      !task.timerStarted &&
      task.dueTimestamp &&
      now >= task.dueTimestamp
    ) {
      doNowTasks[index].timerStarted = true;
      savedotasks();
      autoStartTaskTimer(index);
    }
  });
}, 10000);


function autoStartTaskTimer(index) {
  let totalSeconds = Number(doNowTasks[index].duration);
  if (!totalSeconds || isNaN(totalSeconds)) totalSeconds = 60;
  displayDoNowTasks();
  setTimeout(() => {
    const taskDivs = doNowList.querySelectorAll(".dotask");
    let countdownElem = null;
    for (let div of taskDivs) {
      if (div.textContent.includes(doNowTasks[index].name)) {
        countdownElem = div.querySelector(".countdown");
        if (countdownElem) countdownElem.style.color = "blue";
        break;
      }
    }
    doNowTasks[index].startTime = Date.now();
    savedotasks();
    runTaskTimer(totalSeconds, countdownElem).then(() => {
      doNowTasks[index].completed = true;
      doNowTasks[index].endTime = Date.now();
      savedotasks();
      displayDoNowTasks();
      updateProgress && updateProgress();
      checkAllCompleted && checkAllCompleted();
    });
  }, 100); 
}

