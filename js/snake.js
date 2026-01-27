const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("game-over");
const langSelect = document.getElementById("lang-select");
const gameOverTitle = document.getElementById("game-over-title");
const gameOverText = document.getElementById("game-over-text");
const restartButton = document.getElementById("restart-button");

let currentLang = langSelect.value;

function updateLanguage() {
    currentLang = langSelect.value;
    scoreElement.innerHTML = `${translations[currentLang].score}: ${score}`;
    gameOverTitle.innerText = translations[currentLang].gameOver;
    gameOverText.innerText = translations[currentLang].fleetDestroyed;
    restartButton.innerText = translations[currentLang].restart;
}

const box = 20;
let score = 0;

langSelect.addEventListener("change", updateLanguage);
updateLanguage();
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let d;
let game;

document.addEventListener("keydown", direction);

function direction(event) {
    let key = event.key;
    if (key === "ArrowLeft" && d != "RIGHT") {
        d = "LEFT";
    } else if (key === "ArrowUp" && d != "DOWN") {
        d = "UP";
    } else if (key === "ArrowRight" && d != "LEFT") {
        d = "RIGHT";
    } else if (key === "ArrowDown" && d != "UP") {
        d = "DOWN";
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    score = 0;
    scoreElement.innerHTML = `${translations[currentLang].score}: ${score}`;
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    d = undefined;
    gameOverElement.style.display = "none";
    clearInterval(game);
    game = setInterval(draw, 100);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "#00ffcc" : "#0099cc";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00ffff";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.shadowBlur = 0;
    }

    ctx.fillStyle = "#ff0066";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff0066";
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (!d) return;

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.innerHTML = `${translations[currentLang].score}: ${score}`;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        gameOverElement.style.display = "block";
    }

    snake.unshift(newHead);
}

canvas.width = 400;
canvas.height = 400;

game = setInterval(draw, 100);
