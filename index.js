let todo = document.getElementById("Todo");
let progress = document.getElementById("Progress");
let done = document.getElementById("Done");

let cols = [todo, progress, done];
let tasksData = {};

// know the element you are dragging, store it , use it and settle it in drop event listener.

let dragElement = null;

if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));

  for (const col in data) {
    const column = document.querySelector(`#${col}`);

    data[col].forEach((task) => {
      const div = document.createElement("div");
      div.classList.add("Task");

      div.setAttribute("draggable", "true");

      div.innerHTML = `
        <h2>${task.title}</h2>   
        <p>${task.desc}</p>     
        <button class="Delete">Delete</button>
      `;

      column.appendChild(div);

      div.addEventListener("drag", (e) => {
        dragElement = div;
      });
    });
  }
}

const tasks = document.querySelectorAll(".Task");

tasks.forEach((Task) => {
  Task.addEventListener("drag", (e) => {
    // optional: store dragged element
    dragElement = Task;
  });
});

function DragEvents(column) {
  column.addEventListener("dragenter", (event) => {
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", (event) => {
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (event) => {
    event.preventDefault(); // ⭐ REQUIRED
    // Actually to Drop the div in other element, the browser doesnt allow generally but using this alert the browser
  });

  column.addEventListener("drop", (e) => {
    cols.forEach((col) => {
      const currentTasks = col.querySelectorAll(".Task");
      let countDisplay = col.querySelector(".right");

      countDisplay.innerText = currentTasks.length;

      tasksData[cols.id] = Array.from(tasks).map((t) => {
        return {
          title: t.querySelector("h2").innerText,
          desc: t.querySelector("p").innerText,
        };
      });

      localStorage.setItem("tasks", JSON.stringify(tasksData));
    });

    column.appendChild(dragElement);
    column.classList.remove("hover-over");

    [todo, progress, done].forEach((col) => {
      const currentTasks = col.querySelectorAll(".Task");
      let countDisplay = col.querySelector(".right");

      countDisplay.innerText = currentTasks.length;
    });
  });
}

DragEvents(todo);
DragEvents(progress);
DragEvents(done);

// console.log(progress)

// progress.addEventListener("dragenter", (e) => {
//     progress.classList.add("hover-over");
// });

// This code is working but to follow the DRY principle , we create a fucntion

// progress.addEventListener("dragleave", (e) => {
//     progress.classList.remove("hover-over");
// });

// Modal Code

let toggleModal = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");

toggleModal.addEventListener("click", (e) => {
  modal.classList.toggle("active");
});

let modalBg = document.querySelector(".modal .bg");

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

const addTaskButton = document.querySelector(".add-task-btn");

addTaskButton.addEventListener("click", () => {
  const TaskTitle = document.getElementById("textInput").value;
  const TextArea = document.getElementById("textfill").value;

  const div = document.createElement("div");
  div.classList.add("Task");

  div.setAttribute("draggable", "true");

  div.innerHTML = `
    <h2>${task.title}</h2>   
    <p>${task.desc}</p>      
    <button class="Delete">Delete</button>
  `;

  todo.appendChild(div);

  cols.forEach((col) => {
    const currentTasks = col.querySelectorAll(".Task");
    let countDisplay = col.querySelector(".right");

    countDisplay.innerText = currentTasks.length;

    tasksData[cols.id] = Array.from(tasks).map((t) => {
      return {
        title: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText,
      };
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
  });

  div.addEventListener("drag", (e) => {
    dragElement = div;
  });

  modal.classList.remove("active");
});