const canvas = document.getElementById('drawing-canvas');
const context = canvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');
const lineThickness = document.getElementById('line-thickness');
const clearButton = document.getElementById('clear-button');
const saveButton = document.getElementById('save-button');

let isDrawing = false;

// Initialize drawing properties
let currentColor = colorPicker.value;
let currentLineThickness = lineThickness.value;

// Function to start drawing
function startDrawing(e) {
  isDrawing = true;
  draw(e);
}

// Function to stop drawing
function stopDrawing() {
  isDrawing = false;
  context.beginPath(); // Start a new path for separate lines
}

// Function to draw on the canvas
function draw(e) {
  if (!isDrawing) return;

  context.lineWidth = currentLineThickness; // Set line thickness
  context.lineCap = 'round'; // Set line cap style
  context.strokeStyle = currentColor; // Set line color

  // Draw a line from the previous point to the current point
  context.lineTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
  context.stroke();
  context.beginPath(); // Start a new path for smoother lines
  context.moveTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
}

// Event listeners for mouse and touch events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Prevent default touch behavior
  startDrawing(e.touches[0]);
});

canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault(); // Prevent default touch behavior
  draw(e.touches[0]);
});

// Event listener to clear the canvas
clearButton.addEventListener('click', () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
});

// Event listener for color picker
colorPicker.addEventListener('input', (e) => {
  currentColor = e.target.value;
});

// Event listener for line thickness adjustment
lineThickness.addEventListener('input', (e) => {
  currentLineThickness = e.target.value;
});

// Function to save the canvas as an image
function saveDrawing() {
  const image = canvas.toDataURL('image/png'); // Convert canvas content to a data URL
  const link = document.createElement('a');
  link.href = image;
  link.download = 'drawing.png'; // Set the filename for the saved image
  link.click();
}

// Event listener for the "Save Drawing" button
saveButton.addEventListener('click', saveDrawing);

// Disable context menu on canvas (right-click)
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// Resize canvas to fit the window
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.clearRect(0, 0, canvas.width, canvas.height);
});

// Initialize canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
