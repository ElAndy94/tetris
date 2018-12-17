const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
];

collide = (gameArea, player) => {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && 
                (gameArea[y + o.y] && gameArea[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

createMatrix = (w, h) => {
    const matrix = [];
    while(h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

draw = () => {
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.clientWidth, canvas.height);

    drawMaterix(gameArea, {x: 0, y: 0});
    drawMaterix(player.matrix, player.pos);
}

drawMaterix = (matrix, offset) => {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = 'red';
                context.fillRect(
                    x + offset.x,
                    y + offset.y, 
                    1, 1
                );
            }
        });
    });
}

merge = (gameArea, player) => {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                gameArea[y + player.pos.y][x + player.pos.x] = value;
            }
        })
    })
}

playerDrop = () => {
    player.pos.y ++;
    if (collide(gameArea , player)) {
        player.pos.y --;
        merge(gameArea, player);
        player.pos.y = 0;
    }
    dropCounter = 0;
}

playerMove = (direction) => {
    player.pos.x += direction;
    if (collide(gameAream, player)) {
        player.pos.y -= direction;
    }
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
update = (time = 0) => {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        player.pos.y ++;
        dropCounter = 0;
    }

    draw();
    requestAnimationFrame(update);
}

const gameArea = createMatrix(12, 20);

const player = {
    pos: {x: 5, y: 5},
    matrix: matrix
}

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    }
})

update();

// draw();