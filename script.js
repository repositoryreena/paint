const canvas = document.getElementById('drawing-canvas');
const context = canvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');
const lineThickness = document.getElementById('line-thickness');
const clearButton = document.getElementById('clear-button');
const saveButton = document.getElementById('save-button');
const toolRadios = document.getElementsByName('tool');

let isDrawing = false;
let currentColor = colorPicker.value;
let currentLineThickness = lineThickness.value;
let currentTool = 'pencil';

function startDrawing(e) {
  isDrawing = true;
  draw(e);
}

function stopDrawing() {
  isDrawing = false;
  context.beginPath();
}

function draw(e) {
  if (!isDrawing) return;

  context.strokeStyle = currentColor;
  context.lineCap = 'round';

  if (currentTool === 'pencil') {
    context.lineWidth = 2; // Narrower line for a pencil
  } else if (currentTool === 'brush' || currentTool === 'eraser') {
    context.lineWidth = currentLineThickness; // Adjust line thickness for brush and eraser
  }

  if (currentTool === 'pencil' || currentTool === 'brush') {
    context.lineTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
    context.stroke();
    context.beginPath();
    context.moveTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
  } else if (currentTool === 'eraser') {
    context.clearRect(
      e.clientX - canvas.getBoundingClientRect().left - context.lineWidth / 2,
      e.clientY - canvas.getBoundingClientRect().top - context.lineWidth / 2,
      context.lineWidth,
      context.lineWidth
    );
  }
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startDrawing(e.touches[0]);
});

canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  draw(e.touches[0]);
});

clearButton.addEventListener('click', () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
});

colorPicker.addEventListener('input', (e) => {
  currentColor = e.target.value;
});

lineThickness.addEventListener('input', (e) => {
  currentLineThickness = e.target.value;

  // Update line thickness for brush and eraser when slider changes
  if (currentTool === 'brush' || currentTool === 'eraser') {
    context.lineWidth = currentLineThickness;
  }
});

for (const toolRadio of toolRadios) {
  toolRadio.addEventListener('change', (e) => {
    currentTool = e.target.value;

    // Reset line thickness when changing tools
    if (currentTool === 'pencil') {
      context.lineWidth = 2; // Narrower line for a pencil
    } else if (currentTool === 'brush' || currentTool === 'eraser') {
      context.lineWidth = currentLineThickness; // Set to current slider value for brush and eraser
    }
  });
}

function saveDrawing() {
  const image = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = image;
  link.download = 'drawing.png';
  link.click();
}

saveButton.addEventListener('click', saveDrawing);

canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.clearRect(0, 0, canvas.width, canvas.height);
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
