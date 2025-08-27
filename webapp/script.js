

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals = 1) {
    const val = Math.random() * (max - min) + min;
    // Always round to nearest tenth
    return Math.round(val * 10) / 10;
}

let m, b, x, y, useDecimals = false;

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function generateProblem() {
    useDecimals = document.getElementById('useDecimals').checked;
    let pointOnLine = Math.random() < 0.65; // ~65% chance
    if (useDecimals) {
        m = getRandomFloat(-5, 5, 1);
        b = getRandomFloat(-10, 10, 1);
        x = getRandomFloat(-10, 10, 1);
        if (pointOnLine) {
            y = Math.round((m * x + b) * 10) / 10;
        } else {
            let offset = getRandomFloat(1, 5, 1);
            if (Math.random() < 0.5) offset *= -1;
            y = Math.round((m * x + b + offset) * 10) / 10;
        }
        // Clamp x and y
        x = clamp(x, -10, 10);
        y = clamp(y, -10, 10);
    } else {
        m = getRandomInt(-5, 5);
        b = getRandomInt(-10, 10);
        x = getRandomInt(-10, 10);
        if (pointOnLine) {
            y = m * x + b;
        } else {
            let offset = getRandomInt(1, 5);
            if (Math.random() < 0.5) offset *= -1;
            y = m * x + b + offset;
        }
        // Clamp x and y
        x = clamp(x, -10, 10);
        y = clamp(y, -10, 10);
    }
    document.getElementById('lineEquation').textContent = `y = ${m}${m === 1 ? '' : ''}x + ${b}`;
    document.getElementById('pointDisplay').textContent = `(${x}, ${y})`;
    document.getElementById('solution').innerHTML = '';
    document.getElementById('solution').classList.add('hidden');
    document.getElementById('graphCanvas').style.display = 'none';
}

document.getElementById('regenerate').addEventListener('click', generateProblem);
document.getElementById('useDecimals').addEventListener('change', generateProblem);


function drawGraph() {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Graph settings
    const padding = 32;
    const size = canvas.width;
    const axisColor = '#444';
    const gridColor = '#e0e0e0';
    const lineColor = '#007bff';
    const pointColor = '#e74c3c';
    const tickLength = 8;
    const fontSize = 13;
    const minVal = -10, maxVal = 10;

    // Map math coords to canvas coords
    function mapX(val) {
        return padding + ((val - minVal) / (maxVal - minVal)) * (size - 2 * padding);
    }
    function mapY(val) {
        return size - padding - ((val - minVal) / (maxVal - minVal)) * (size - 2 * padding);
    }

    // Draw grid lines for multiples of 5 and 10
    ctx.save();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = minVal; i <= maxVal; i++) {
        if (i % 5 === 0 && i !== 0) {
            // Vertical grid
            ctx.beginPath();
            ctx.moveTo(mapX(i), mapY(minVal));
            ctx.lineTo(mapX(i), mapY(maxVal));
            ctx.stroke();
            // Horizontal grid
            ctx.beginPath();
            ctx.moveTo(mapX(minVal), mapY(i));
            ctx.lineTo(mapX(maxVal), mapY(i));
            ctx.stroke();
        }
    }
    ctx.restore();

    // Draw axes
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mapX(minVal), mapY(0));
    ctx.lineTo(mapX(maxVal), mapY(0));
    ctx.moveTo(mapX(0), mapY(minVal));
    ctx.lineTo(mapX(0), mapY(maxVal));
    ctx.stroke();

    // Draw ticks and labels for multiples of 5 and 10 only
    ctx.fillStyle = axisColor;
    ctx.font = `${fontSize}px Arial`;
    for (let i = minVal; i <= maxVal; i++) {
        if (i % 5 === 0 && i !== 0) {
            // x-axis ticks
            ctx.beginPath();
            ctx.moveTo(mapX(i), mapY(0) - tickLength);
            ctx.lineTo(mapX(i), mapY(0) + tickLength);
            ctx.stroke();
            ctx.fillText(i, mapX(i) - 10, mapY(0) + 26);
            // y-axis ticks
            ctx.beginPath();
            ctx.moveTo(mapX(0) - tickLength, mapY(i));
            ctx.lineTo(mapX(0) + tickLength, mapY(i));
            ctx.stroke();
            ctx.fillText(i, mapX(0) - 30, mapY(i) + 5);
        }
    }

    // Draw line
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let x1 = minVal, y1 = m * x1 + b;
    let x2 = maxVal, y2 = m * x2 + b;
    ctx.moveTo(mapX(x1), mapY(y1));
    ctx.lineTo(mapX(x2), mapY(y2));
    ctx.stroke();

    // Draw point
    ctx.save();
    ctx.shadowColor = pointColor;
    ctx.shadowBlur = 8;
    ctx.fillStyle = pointColor;
    ctx.beginPath();
    ctx.arc(mapX(x), mapY(y), 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(mapX(x), mapY(y), 7, 0, 2 * Math.PI);
    ctx.stroke();
}

document.getElementById('showSolution').addEventListener('click', function() {
    const solutionDiv = document.getElementById('solution');
    const canvas = document.getElementById('graphCanvas');
    // Calculate y from equation
    const yCalc = m * x + b;
    let result = '';
    if (Math.abs(yCalc - y) < 1e-9) {
        result = `<strong>Solution:</strong> The point (${x}, ${y}) lies on the line y = ${m}x + ${b}.`;
    } else {
        result = `<strong>Solution:</strong> The point (${x}, ${y}) does <span style=\"color:red\">not</span> lie on the line y = ${m}x + ${b}.<br>Calculated y for x=${x}: ${yCalc}`;
    }
    solutionDiv.innerHTML = result;
    solutionDiv.classList.toggle('hidden');
    canvas.style.display = solutionDiv.classList.contains('hidden') ? 'none' : 'block';
    if (!solutionDiv.classList.contains('hidden')) {
        drawGraph();
    }
});

// Initial problem generation
window.addEventListener('DOMContentLoaded', generateProblem);

// Initial problem generation
window.addEventListener('DOMContentLoaded', generateProblem);
