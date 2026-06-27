// ============================================================
// DOM REFERENCES + SHARED STATE
// ============================================================

const todoColumn = document.getElementById("Todo");
const progressColumn = document.getElementById("Progress");
const doneColumn = document.getElementById("Done");
const columns = [todoColumn, progressColumn, doneColumn];

let tasksData = {};
let dragElement = null; // tracks whichever card is currently being dragged

// ============================================================
// HELPER 1: build one task card (used by both "load" and "add task")
// ============================================================

function createTaskCard(title, desc) {
  const card = document.createElement("div");
  card.classList.add("Task");
  card.setAttribute("draggable", "true");

  card.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <button class="Delete">Delete</button>
  `;

  // "dragstart" fires once at the beginning of a drag (unlike "drag",
  // which fires repeatedly the whole time the mouse is moving)
  card.addEventListener("dragstart", () => {
    dragElement = card;
  });

  return card;
}

// ============================================================
// HELPER 2: recount every column + rebuild tasksData + save
// (this used to be copy-pasted in the drop handler AND the add-task handler)
// ============================================================

function saveBoardState() {
  columns.forEach((col) => {
    const currentTasks = col.querySelectorAll(".Task");
    const countDisplay = col.querySelector(".right");

    if (countDisplay) {
      countDisplay.innerText = currentTasks.length;
    }

    // NOTE: this uses col.id (the loop variable), not cols.id —
    // the original had a typo here (cols.id is always undefined)
    tasksData[col.id] = Array.from(currentTasks)
      .map((t) => {
        const titleEl = t.querySelector("h2");
        const descEl = t.querySelector("p");
        // skip any malformed card that's missing its title or description
        // (e.g. a leftover empty .Task div) instead of crashing
        if (!titleEl || !descEl) return null;
        return { title: titleEl.innerText, desc: descEl.innerText };
      })
      .filter(Boolean);
  });

  localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// ============================================================
// Wire up drag listeners for any .Task already hardcoded in the HTML
// (cards created later via createTaskCard already get this automatically)
// ============================================================

function wireExistingTaskCards() {
  document.querySelectorAll(".Task").forEach((card) => {
    card.addEventListener("dragstart", () => {
      dragElement = card;
    });
  });
}

// ============================================================
// Restore saved tasks from localStorage on page load
// ============================================================

function loadBoardState() {
  const saved = localStorage.getItem("tasks");
  if (!saved) return;

  const data = JSON.parse(saved);

  for (const colId in data) {
    const column = document.getElementById(colId);
    if (!column) continue;

    data[colId].forEach((task) => {
      const card = createTaskCard(task.title, task.desc);
      column.appendChild(card);
    });
  }
}

// ============================================================
// Drag-and-drop behavior for a single column (called once per column)
// ============================================================

function setupColumnDragEvents(column) {
  column.addEventListener("dragenter", () => {
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (event) => {
    event.preventDefault(); // required — tells the browser this is a valid drop target
  });

  column.addEventListener("drop", () => {
    column.appendChild(dragElement); // moves the card (DOM nodes can't exist in 2 places)
    column.classList.remove("hover-over");
    saveBoardState();
  });
}

// ============================================================
// Modal: open/close + adding a new task
// ============================================================

function setupModal() {
  const toggleModalBtn = document.querySelector("#toggle-modal");
  const modal = document.querySelector(".modal");
  const modalBg = document.querySelector(".modal .bg");
  const addTaskButton = document.querySelector(".add-task-btn");
  const titleInput = document.getElementById("textInput");
  const descInput = document.getElementById("textfill");

  toggleModalBtn.addEventListener("click", () => {
    modal.classList.toggle("active");
  });

  modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  addTaskButton.addEventListener("click", () => {
    const title = titleInput.value;
    const desc = descInput.value;

    // NOTE: original code referenced an undefined `task` variable here
    // (task.title / task.desc) — using the actual input values instead
    const card = createTaskCard(title, desc);
    todoColumn.appendChild(card);

    saveBoardState();
    modal.classList.remove("active");

    // clear the inputs so the modal is empty next time it opens
    titleInput.value = "";
    descInput.value = "";
  });
}

// ============================================================
// Delete button handling
// One listener, attached once, handles every .Delete button —
// current ones AND any created later (restored, newly added).
// This works because clicks "bubble up" from the button to ancestors,
// so we can catch them all the way up at the document level.
// ============================================================

function setupDeleteHandling() {
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("Delete")) return;

    const card = e.target.closest(".Task");
    if (!card) return;

    card.remove();
    saveBoardState();
  });
}

// ============================================================
// INIT — everything starts here
// ============================================================

function init() {
  wireExistingTaskCards(); // tasks hardcoded directly in the HTML, if any
  loadBoardState(); // tasks restored from localStorage
  columns.forEach(setupColumnDragEvents);
  setupModal();
  setupDeleteHandling();
  saveBoardState(); // make sure counts/storage are correct on first load
}

init();