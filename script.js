const canvas = document.getElementById('drawing-canvas');
const context = canvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');
const lineThickness = document.getElementById('line-thickness');
const clearButton = document.getElementById('clear-button');
const saveButton = document.getElementById('save-button');
const toolRadios = document.getElementsByName('tool');
const textInput = document.getElementById('text-input');
const fontSelector = document.getElementById('font-selector');

let isDrawing = false;
let currentColor = colorPicker.value;
let currentLineThickness = lineThickness.value;
let currentTool = 'pencil';

function startDrawing(e) {
  isDrawing = true;
  if (currentTool === 'text') {
    // Prevent text input when starting text tool
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
  context.moveTo(x, y - size / 2);
  context.lineTo(x - size / 2, y + size / 2);
  context.lineTo(x + size / 2, y + size / 2);
  context.closePath();
  context.stroke();
}

// ...

function drawText(x, y) {
  const text = textInput.value;
  const selectedFont = fontSelector.value;

  // Calculate text size based on the line thickness slider value
  const textSize = currentLineThickness * 4;

  // Define font styles here
  const fontStyles = {
    'Dancing Script, cursive': 'Dancing Script, cursive',
    'Arial, sans-serif': 'Arial, sans-serif',
    'Times New Roman, serif': 'Times New Roman, serif',
    'Verdana, sans-serif': 'Verdana, sans-serif'
  };

  context.font = `${textSize}px ${fontStyles[selectedFont]}`;
  context.fillStyle = currentColor;
  context.fillText(text, x, y);
}

// Listen for changes in the line thickness slider value
lineThickness.addEventListener('input', (e) => {
  currentLineThickness = e.target.value;
  if (currentTool === 'brush' || currentTool === 'eraser') {
    context.lineWidth = currentLineThickness;
  }

  // Redraw text with the updated size when the slider changes
  if (currentTool === 'text') {
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;
    drawText(x, y);
  }
});

// ...


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
  } else if (currentTool === 'text') {
    drawText(x, y);
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
  
  // Update text size for the text tool
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
    } else if (currentTool === 'text') {
      textInput.style.display = 'block'; // Show text input box
      fontSelector.style.display = 'block'; // Show font selector
    } else {
      textInput.style.display = 'none'; // Hide text input box for other tools
      fontSelector.style.display = 'none'; // Hide font selector for other tools
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
