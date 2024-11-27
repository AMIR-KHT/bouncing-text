let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext("2d");
let isclear = false;
let text = prompt("Enter Your Text");

// Offscreen canvas setup
let offscreenCanvas = document.createElement("canvas");
let offscreenContext = offscreenCanvas.getContext("2d");
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;

class Ball {
    constructor(x, y, vx, vy, colorR = 0, colorG = 0, colorB = 0) {
        this.start = false;
        this.tf = ["Times New Roman", "Arial", "Trebuchet MS", "Monospaced font", "Georgia", "Garamond", "Verdana", "Helvetica", "Tahoma"];
        this.rttf = this.tf[random(0, 8)];
        this.st = random(10, 90);
        this.r = this.st + 10;
        this.x = x || random(0 + this.r, innerWidth - (this.r * 3));
        this.y = y || random(0 + this.r, innerHeight - (this.r * 3));

        document.querySelector("#sp").addEventListener("click", () => {
            this.vx *= 1.1;
            this.vy *= 1.1;
        });

        document.querySelector("#ps").addEventListener("click", () => {
            this.vx /= 1.1;
            this.vy /= 1.1;
        });

        this.vx = vx || random(1, 10);
        this.vy = vy || random(1, 10);

        this.colorR = colorR;
        this.colorG = colorG;
        this.colorB = colorB;

        document.querySelector("#cro").addEventListener("click", () => {
            this.start = false;
        });
        document.querySelector("#cr2").addEventListener("click", () => {
            this.start = true;
        });

        this.draw();
    }

    draw(ctx = c) {
        ctx.fillStyle = `rgb(${this.colorR},${this.colorG},${this.colorB})`;
        ctx.font = `${this.st}px ${this.rttf}`;
        this.textWidth = ctx.measureText(text).width;
        this.textHeight = ctx.measureText(text).actualBoundingBoxAscent + ctx.measureText(text).actualBoundingBoxDescent;
        ctx.fillText(text, this.x, this.y);
    }

    update() {
        if (this.start == true) {
            this.rttf = this.tf[random(0, 8)];
            this.st = random(10, 90);
            this.vx *= 1.002;
            this.vy *= 1.002;
            this.colorR = random(1, 400);
            this.colorG = random(1, 400);
            this.colorB = random(1, 400);
        }
        if ((this.x + this.textWidth >= window.innerWidth && this.vx > 0) || (this.x < 0 && this.vx < 0)) {
            this.vx *= -1;
            this.colorR = random(1, 400);
            this.colorG = random(1, 400);
            this.colorB = random(1, 400);
        }
        if (((this.y) > innerHeight && this.vy > 0) || (this.y - this.textHeight < 0 && this.vy < 0)) {
            this.vy *= -1;
            this.colorR = random(1, 400);
            this.colorG = random(1, 400);
            this.colorB = random(1, 400);
        }
        this.vx += cv;
        this.vy += cv;

        this.x += this.vx;
        this.y += this.vy;
        this.draw(offscreenContext);
    }

    serialize() {
        return {
            x: this.x,
            y: this.y,
            vx: this.vx,
            vy: this.vy,
            colorR: this.colorR,
            colorG: this.colorG,
            colorB: this.colorB,
        };
    }
}

let cv = 0;
let iv = 1;
let balls = [];

let balls_b = localStorage.getItem('balls');
if (balls_b != null) {
    balls = JSON.parse(balls_b).map(({ x, y, vx, vy, colorR, colorG, colorB }) => new Ball(x, y, vx, vy, colorR, colorG, colorB));
}

if (!balls.length) {
    balls.push(new Ball());
}

function animateOffscreen() {
    // Clear the offscreen canvas
    offscreenContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

    // Render all balls on the offscreen canvas
    balls.forEach(ball => ball.update());

    // Clear and draw the offscreen content onto the visible canvas
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(offscreenCanvas, 0, 0);

    requestAnimationFrame(animateOffscreen);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
});

// document.querySelector("#ad").addEventListener("click", () => {
//     balls.push(new Ball());
// });
document.querySelector("#addMoreBtn").addEventListener("click", () => {
    let addNumber = document.querySelector("#addMore").value
    for(let i = 0;i<addNumber;i++){
        balls.push(new Ball())
    }
});
document.querySelector("#rem").addEventListener("click", () => {
    balls.pop();
});
document.querySelector("#crp").addEventListener("click", () => {
    cv++;
    document.querySelector('#cr').innerHTML = "Crazy: " + cv;
});
document.querySelector("#crn").addEventListener("click", () => {
    cv--;
    document.querySelector('#cr').innerHTML = "Crazy: " + cv;
});
window.addEventListener('beforeunload', () => {
    if (isclear) return;
    localStorage.setItem('balls', JSON.stringify(balls.map(ball => ball.serialize())));
});
document.querySelector("#cl").addEventListener("click", () => {
    localStorage.removeItem('balls');
    isclear = true;
    window.location.reload();
});

if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
    balls = [];
    balls.push(new Ball());
}

// Start animation
animateOffscreen();
