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
    context.lineWidth = 2;
  } else if (currentTool === 'brush' || currentTool === 'eraser') {
    context.lineWidth = currentLineThickness;
  }

  const x = e.clientX - canvas.getBoundingClientRect().left;
  const y = e.clientY - canvas.getBoundingClientRect().top;

  if (currentTool === 'pencil' || currentTool === 'brush') {
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  } else if (currentTool === 'eraser') {
    context.clearRect(x - context.lineWidth / 2, y - context.lineWidth / 2, context.lineWidth, context.lineWidth);
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
  if (currentTool === 'brush' || currentTool === 'eraser') {
    context.lineWidth = currentLineThickness;
  }
});

for (const toolRadio of toolRadios) {
  toolRadio.addEventListener('change', (e) => {
    currentTool = e.target.value;
    if (currentTool === 'pencil') {
      context.lineWidth = 2;
    } else if (currentTool === 'brush' || currentTool === 'eraser') {
      context.lineWidth = currentLineThickness;
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

// Initialize canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
