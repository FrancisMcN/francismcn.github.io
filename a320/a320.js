// -----------------------------
// Canvas setup
// -----------------------------

(async () => {
  await loadFont("b612-mono-regular", "B612Mono-Regular.ttf")
//   draw();
})();

async function loadFont(fontFamily = '', url = '', props = {
  style: "normal",
  weight: "400"
}) {
  const font = new FontFace(`${fontFamily}`, `url(${url})`, props);
  // wait for font to be loaded
  await font.load();
  // add font to document
  document.fonts.add(font);
}

function resize(canvas) {

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// -----------------------------
// Timing configuration
// -----------------------------
const MAX_FPS = 60;
const FRAME_INTERVAL_MS = 1000 / MAX_FPS;

let previousTimeMs = performance.now();
let accumulator = 0;

// -----------------------------
// World state
// -----------------------------
const box = {
    x: 100,
    y: 100,
    w: 60,
    h: 60,
    vx: 220, // pixels per second
};

// -----------------------------
// Update (fixed timestep)
// -----------------------------
function updatePhysics(canvas, dt) {
    box.x += box.vx * dt;

    if (box.x > canvas.width) {
    box.x = -box.w;
    }
}

function drawEcamTitle(text, ctx) {
    // Debug text
    ctx.fillStyle = "#bbb";
    ctx.font = "18px b612-mono-regular";
    ctx.fillText(text, 10, 20);
    // Define a new path
    ctx.beginPath();
    // Set a start-point
    ctx.moveTo(10, 25);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#bbb";
    // Set an end-point
    ctx.lineTo(10 + ctx.measureText(text).width, 25);
    // Stroke it (Do the Drawing)
    ctx.stroke();
}

function drawArc(ctx, initialX, initialY, radius) {

    ctx.beginPath();
    ctx.strokeStyle = "#bbb";
    ctx.lineWidth = 2;
    ctx.arc(initialX, initialY, radius, Math.PI, 0);
    ctx.lineTo(initialX + (radius - 5), initialY);
    ctx.moveTo(initialX - (radius - 5), initialY);
    ctx.lineTo((initialX - (radius - 5)) - 5, initialY);
    ctx.moveTo(initialX, initialY - radius);
    ctx.lineTo(initialX, initialY - (radius - 5));
    ctx.stroke();
    
}

function drawArcLine(ctx, initialX, initialY, radius, percent) {

    const angle = ((percent / 100) * Math.PI) + Math.PI;

    // Compute object position
    const x = initialX + (radius) * Math.cos(angle);
    const y = initialY + (radius) * Math.sin(angle);

    const rotation = angle + Math.PI / 2;

    // Draw moving object
    ctx.beginPath();
    ctx.fillStyle = "#09fe10";
    ctx.moveTo(x, y);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillRect(0, -5, 3, 10);
    ctx.restore();
    ctx.stroke();
}

function drawArcText(ctx, x, y, text) {
    // Debug text
    ctx.fillStyle = "#09fe10";
    ctx.font = "16px b612-mono-regular";
    ctx.fillText(text, x-(ctx.measureText(text).width / 2), y);
}

// -----------------------------
// Draw (every frame)
// -----------------------------
function draw(canvas, ctx) {

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw box
    // ctx.fillStyle = "#4da3ff";
    // ctx.fillRect(box.x, box.y, box.w, box.h);

    drawEcamTitle("ENGINE", ctx)

    let p1 = document.getElementById("engine1").value
    drawArc(ctx, 100, 85, 40)
    drawArcLine(ctx, 100, 85, 40, p1)
    drawArcText(ctx, 100, 85, p1)
    let p2 = document.getElementById("engine2").value
    drawArc(ctx, 300, 85, 40)
    drawArcLine(ctx, 300, 85, 40, p2)
    drawArcText(ctx, 300, 85, p2)
}

function render(can) {

    let canvas = can;
    let ctx = canvas.getContext("2d");
    // -----------------------------
    // Main loop
    // -----------------------------
    function frame(currentTimeMs) {
        let deltaTimeMs = currentTimeMs - previousTimeMs;

        // Prevent spiral of death after tab switching
        if (deltaTimeMs > 250) deltaTimeMs = 250;

        previousTimeMs = currentTimeMs;
        accumulator += deltaTimeMs;

        while (accumulator >= FRAME_INTERVAL_MS) {
        updatePhysics(canvas, FRAME_INTERVAL_MS / 1000);
        accumulator -= FRAME_INTERVAL_MS;
        }
        draw(canvas, ctx);
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

}

const canvases = document.getElementsByTagName("canvas");
for (let i = 0; i < canvases.length; i++) {
    const canvas = canvases[i];
    resize(canvas);
    render(canvas);
}