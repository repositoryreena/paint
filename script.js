// JavaScript - script.js

const canvas = document.getElementById('drawing-canvas');
const context = canvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');
const lineThickness = document.getElementById('line-thickness');
const clearButton = document.getElementById('clear-button'); // Add this line
const saveButton = document.getElementById('save-button');
const toolRadios = document.getElementsByName('tool');
const textInput = document.getElementById('text-input');
const fontSelector = document.getElementById('font-selector');
const sunsetButton = document.getElementById('sunset-button'); // Add this line

let isDrawing = false;
let currentColor = colorPicker.value;
let currentLineThickness = lineThickness.value;
let currentTool = 'pencil';
let sunsetEnabled = false; // Added variable to track sunset background

WebFont.load({
  google: {
    families: ['Dancing Script']
  },
  active: initializeCanvas
});

// Function to update the background color based on the given color
function updateBackground(color) {
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgb(255, 140, 0)'); // Sunset color

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

const sunsetColors = [
    'orange', 'red', 'yellow', 'green', 'blue', 'purple', 'pink' // Add your desired colors here
];

let currentSunsetColorIndex = 0; // To keep track of the current sunset color

function initializeCanvas() {
  context.font = `${currentLineThickness * 4}px 'Dancing Script', cursive`;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Add sunset background by default
  if (sunsetEnabled) {
    updateBackground(currentColor);
  }
}

function startDrawing(e) {
  isDrawing = true;
  if (currentTool === 'text') {
    e.preventDefault();
  }
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
  } else if (currentTool === 'text') {
    drawText(x, y);
  }
}

function drawText(x, y) {
  const text = textInput.value;
  const selectedFont = fontSelector.value;

  const textSize = currentLineThickness * 4;
  context.font = `${textSize}px ${selectedFont}`;
  context.fillStyle = currentColor;
  context.fillText(text, x, y);
}

function drawShape(e) {
  if (!isDrawing) return;

  const x = e.clientX - canvas.getBoundingClientRect().left;
  const y = e.clientY - canvas.getBoundingClientRect().top;

  context.strokeStyle = currentColor;
  context.lineWidth = currentLineThickness;

  if (currentTool === 'rectangle') {
    const width = currentLineThickness * 4;
    const height = currentLineThickness * 4;
    context.strokeRect(x - width / 2, y - height / 2, width, height);
  } else if (currentTool === 'circle') {
    const radius = currentLineThickness * 2;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.stroke();
    context.closePath();
  } else if (currentTool === 'triangle') {
    const size = currentLineThickness * 4;
    context.beginPath();
    context.moveTo(x, y - size / 2);
    context.lineTo(x - size / 2, y + size / 2);
    context.lineTo(x + size / 2, y + size / 2);
    context.closePath();
    context.stroke();
  }
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousemove', drawShape);

colorPicker.addEventListener('input', (e) => {
  currentColor = e.target.value;
});

lineThickness.addEventListener('input', (e) => {
  currentLineThickness = e.target.value;
  if (currentTool === 'brush' || currentTool === 'eraser') {
    context.lineWidth = currentLineThickness;
  }
  
  if (currentTool === 'text') {
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;
    drawText(x, y);
  }
});

for (const toolRadio of toolRadios) {
  toolRadio.addEventListener('change', (e) => {
    currentTool = e.target.value;
    if (currentTool === 'pencil') {
      context.lineWidth = 2;
    } else if (currentTool === 'brush' || currentTool === 'eraser') {
      context.lineWidth = currentLineThickness;
    } else {
      textInput.style.display = 'block';
      fontSelector.style.display = 'block';
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

// Add event listener to clear button
clearButton.addEventListener('click', () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
});

// Sunset background button click event
sunsetButton.addEventListener('click', () => {
  // Get the next sunset color from the array
  const nextSunsetColor = sunsetColors[currentSunsetColorIndex];
  
  // Update the background with the next sunset color
  updateBackground(nextSunsetColor);

  // Increment the index for the next click
  currentSunsetColorIndex = (currentSunsetColorIndex + 1) % sunsetColors.length;
});
