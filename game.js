const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const keyUp = document.querySelector('.up');
const keyLeft = document.querySelector('.left');
const keyRight = document.querySelector('.right');
const keyDown = document.querySelector('.down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let timeStart;
let level = 0;
let lives = 3;

let timePlayer;
let timeInterval; 

const playerPosition = {
    x: undefined,
    y: undefined,
}

const giftPosition = {
    x: undefined,
    y: undefined,
}

let enemyPositions = [];

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);
window.addEventListener("keydown", moveByKey);
keyUp.addEventListener("click", moveUp);
keyLeft.addEventListener("click", moveLeft);
keyRight.addEventListener("click", moveRight);
keyDown.addEventListener("click", moveDown);

function moveByKey(event){
    if(event.key == 'ArrowUp') moveUp();
    else if(event.key == 'ArrowLeft') moveLeft();
    else if(event.key == 'ArrowRight') moveRight();
    else if(event.key == 'ArrowDown') moveDown();
    
}

function movePlayer(){
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;

    const enemyCollision = enemyPositions.find(enemy =>{
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY
    })

    if(enemyCollision){
        console.log('Enemigo')
        levelLose();
    }

    if(giftCollision){
        console.log('Subes de nivel')
        levelWin();
    }


    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y)

}

function moveUp(){

    if ((playerPosition.y - elementsSize) < elementsSize){
        console.log('OUT')
    }else{
        playerPosition.y -= elementsSize;
        gameStart();
    }

}
function moveLeft(){

    if ((playerPosition.x - elementsSize) < elementsSize){
        console.log('OUT')
    }else{
    playerPosition.x -= elementsSize;
    gameStart();
    }

}
function moveRight(){
    if ((playerPosition.x + elementsSize) > canvasSize + elementsSize){
        console.log('OUT')
    }else{
    playerPosition.x += elementsSize;
    gameStart();
    }
}

function moveDown(){
    if ((playerPosition.y + elementsSize) > canvasSize + elementsSize){
        console.log('OUT')
    }else{
    playerPosition.y += elementsSize;
    gameStart();
    }
}

function setCanvasSize (){

    if(window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7;
    }else{
        canvasSize = window.innerHeight * 0.7;
    }

    canvasSize = Number(canvasSize.toFixed(0))

    canvas.setAttribute("width", canvasSize);
    canvas.setAttribute("height", canvasSize);

    elementsSize = canvasSize / 10;

    gameStart();

    playerPosition.x = undefined;
    playerPosition.y = undefined;
}

function gameStart (){
    
    game.font = elementsSize + "px Verdana";
    game.textAlign = "end";

    const map = maps[level];
    
    if(!map){
        gameWin();
        return;
    }

    if(!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split('')); 

    showLives();

    enemyPositions = [];
    game.clearRect(0, 0, canvasSize, canvasSize)
    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);

            if(col == 'O' && (!playerPosition.x && !playerPosition.y)){
                playerPosition.x = posX;
                playerPosition.y = posY;   
            }else if(col == 'I'){
                giftPosition.x = posX;
                giftPosition.y = posY;

            }else if (col == 'X'){
                enemyPositions.push({
                    x: posX,
                    y:posY
                })
            }

            game.fillText(emoji, posX, posY);


            
            
        })
    })
    movePlayer();


    
    

}

function levelWin(){
    level++
    gameStart();
}

function gameWin(){
    console.log("Pasaste el juego")
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if(recordTime){
        if(recordTime >= playerTime){
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'Superaste el record';
        }else{
            pResult.innerHTML= 'No superaste el record';
        }    
    }else{
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'Nuevo en el juego? Supera tu record'
    }
    
}

function levelLose(){
    lives -= 1;

    if(lives <= 0){
        level = 0;
        lives = 3;
        timeStart = undefined;   
    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    gameStart();
}

function showLives(){
    const heartArray = Array(lives).fill(emojis['HEART']);

    spanLives.innerHTML = "";
    heartArray.forEach(heart => spanLives.append(heart));
}

function showTime(){
    spanTime.innerHTML = Date.now()  - timeStart;
}

function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record_time')
}
