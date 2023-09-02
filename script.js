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

function drawRectangle(x, y, width, height) {
  context.strokeStyle = currentColor;
  context.lineWidth = currentLineThickness;
  context.beginPath();
  context.rect(x, y, width, height);
  context.stroke();
}

function drawCircle(x, y, radius) {
  context.strokeStyle = currentColor;
  context.lineWidth = currentLineThickness;
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.stroke();
}

function drawTriangle(x, y, size) {
  context.strokeStyle = currentColor;
  context.lineWidth = currentLineThickness;
  context.beginPath();
  const halfSize = size / 2;
  context.moveTo(x, y - halfSize);
  context.lineTo(x - halfSize, y + halfSize);
  context.lineTo(x + halfSize, y + halfSize);
  context.closePath();
  context.stroke();
}

function drawShape(e) {
  if (!isDrawing) return;

  const x = e.clientX - canvas.getBoundingClientRect().left;
  const y = e.clientY - canvas.getBoundingClientRect().top;

  if (currentTool === 'rectangle') {
    const width = currentLineThickness * 4;
    const height = currentLineThickness * 4;
    drawRectangle(x - width / 2, y - height / 2, width, height);
  } else if (currentTool === 'circle') {
    const radius = currentLineThickness * 2;
    drawCircle(x, y, radius);
  } else if (currentTool === 'triangle') {
    const size = currentLineThickness * 4;
    drawTriangle(x, y, size);
  }
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousemove', drawShape);

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startDrawing(e.touches[0]);
});

canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  draw(e.touches[0]);
  drawShape(e.touches[0]);
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
