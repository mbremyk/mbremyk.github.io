let lastRender = 0;
let ctx;
const width = 800;
const height = 800;
let stop = false;
let empty = true;
let balls = [];
let gravity = 10;
let dynamic_collision_pairs = [];
const collision_dampening = 0.7;

let test = false;

// HTML objects
let canvas;
let btnStart;
let btnStop;
let btnReset;
let sliderGravity;
let txtGravity;

function setup() {
    prepareFields();

    prepareCanvas();
    resetCanvas();

    balls.push(new Ball(200, 200, 25));
    balls.push(new Ball(210, 260, 25));

    canvas.addEventListener('click', handleCanvasClick);
    window.requestAnimationFrame(loop);
}

/**
 * Find global interactive HTML elements.
 */
function prepareFields() {
    btnStart = document.getElementById('btnStart');
    btnStop = document.getElementById('btnStop');
    btnReset = document.getElementById('btnReset');
    sliderGravity = document.getElementById('sliderGravity');
    txtGravity = document.getElementById('txtGravity');
}

/**
 * Create and initialise canvas.
 */
function prepareCanvas() {
    let topLevel = document.getElementById('canvas');
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style = 'border: 1px solid #404040';
    topLevel.appendChild(canvas);
    ctx = canvas.getContext('2d');
}

function resetCanvas() {
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function loop(timestamp) {
    if (stop) return;
    let delta = timestamp - lastRender;
    lastRender = timestamp;
    resetCanvas();
    update(delta);
    draw();
    if (!stop)
        window.requestAnimationFrame(loop);
}

/**
 * I was having problems with physics calculations so I borrowed heavily from https://github.com/cdacamar/ball_pit/
 */
function update(delta) {
    dynamic_collision_pairs = [];
    // For each ball
    for (let i = 0; i < balls.length; ++i) {
        let ball = balls[i];

        ball.vy += gravity;

        if (ball.vx ** 2 < 0.1) {
            ball.vx = 0;
        }

        if (ball.vy ** 2 < 0.1) {
            ball.vy = 0;
        }

        if(ball.speed() ** 2 < 0.1) {
            ball.vx = 0;
            ball.vy = 0;
        }

        ball.move(delta);

        if (ball.y > canvas.height - ball.r) {
            ball.y = canvas.height - ball.r;
            ball.vy = -ball.vy * .7;
        }
        if (ball.x < 0 + ball.r) {
            ball.x = ball.r;
            ball.vx = -ball.vx * collision_dampening;
        }
        if (ball.x > canvas.width - ball.r) {
            ball.x = canvas.width - ball.r;
            ball.vx = -ball.vx * collision_dampening;
        }

        // For each following ball, check collisions and move them outside eachother. Add velocity in opposite directions.
        for (let j = i + 1; j < balls.length; ++j) {
            let b = balls[j];
            let distance = ball.dist(b);
            // Desired distance is AT LEAST the sum of the radii.
            let desiredDistance = ball.r + b.r;
            if (distance < desiredDistance) {
                dynamic_collision_pairs.push([ball, b]);
                let dx = b.x - ball.x;
                let dy = b.y - ball.y;
                let collision_vector = [dx, dy];

                if (distance < 0.01) {
                    continue;
                }
                //console.log(ball, b);
                
                // Move the balls away from eachother an amount proportional to their radius.
                // Should make the balls touching, not overlapping.
                let overlap = (distance - ball.r - b.r) / 2;
                ball.x += overlap * collision_vector[0] / distance;
                ball.y += overlap * collision_vector[1] / distance;
                b.x -= overlap * collision_vector[0] / distance;
                b.y -= overlap * collision_vector[1] / distance;

                //console.log(ball, b);
            }
        }
    }

    for ([a, b] of dynamic_collision_pairs) {
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let collision_vector = [dx, dy];
        let distance = a.dist(b);
        if (distance < 0.01) {
            distance = 0.01;
        }
        let collision_normalised = [collision_vector[0] / distance, collision_vector[1] / distance];
        let relative_velocity = [a.vx - b.vx, a.vy - b.vy];
        let speed = relative_velocity[0] * collision_normalised[0] + relative_velocity[1] * collision_normalised[1];

        if (speed < 0) continue;
        
        let impulse = 2 * speed / (a.r + b.r);
        a.vx -= collision_normalised[0] * impulse * a.r;
        a.vy -= collision_normalised[1] * impulse * a.r;
        b.vx += collision_normalised[0] * impulse * b.r;
        b.vy += collision_normalised[1] * impulse * b.r;
        //console.log(dx, dy, collision_vector, distance, collision_normalised, relative_velocity, speed, impulse, a, b); 
    }
}

function draw() {
    balls.forEach(b => {
        b.draw(ctx);
    });
}

function handleCanvasClick(e) {
    balls.push(new Ball(e.x, e.y, 25, `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`));
    balls.forEach(ball => ball.draw(ctx));
    empty = false;
}

function handleStart() {
    if (stop) {
        btnStart.disabled = true;
        btnStop.disabled = false;
        btnReset.disabled = false;
        stop = false;
        empty = false;
        window.requestAnimationFrame(loop);
    }
}

function handleStop() {
    stop = true;
    btnStop.disabled = true;
    btnStart.disabled = false;
    btnReset.disabled = false;
}

function handleReset() {
    resetCanvas();
    balls = [];
    empty = true;
}

function handleGravitySlide() {
    gravity = parseFloat(sliderGravity.value);
    txtGravity.value = gravity;
}

function handleGravityText() {
    gravity = parseFloat(txtGravity.value);
    sliderGravity.value = gravity;
}

window.onload = setup;