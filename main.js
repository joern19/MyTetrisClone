/*
Author: Jörn Hirschfeld
Developed in april 2020
Turning algorithm: https://tetris.fandom.com/wiki/SRS (only the Picture was used)

All algorithms were developed by myself. The above link only describe the turning behavior

*/
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const h = 438;
const w = 218;
var game = [];
var speed = 1000; //ms until next gameloop call
var rotationPoint = [0, 0]; //x, y

var keyDownEventHandler;
var lastLoopCallMs;

function initArray() {
    for (x = 0; x < 20; x++) {
        let tmpArr = [];
        for (y = 0; y < 10; y++) {
            tmpArr[y] = 0;
        }
        game[x] = tmpArr;
    }
}

function playImpactSound() {
    if (document.getElementById("soundOnCheckbox").checked) {
        document.getElementById("impactSoundButton").click(); //need to press putton because direct play will be blocked by firefox.
    }
}

function drawLines() {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFFFFFFF";
    for (i = 1; i < 10; i++) {
        ctx.moveTo(i * 22 - 1, 0);
        ctx.lineTo(i * 22 - 1, h);
    }
    for (i = 1; i < 20; i++) {
        ctx.moveTo(0, i * 22 - 1);
        ctx.lineTo(w, i * 22 - 1);
    }
    ctx.stroke();
}

function drawRect(w, h, c) {
    ctx.fillStyle = "#333333";
    if (c == 1) {
        ctx.fillStyle = "blue";
    } else if (c == 2) {
        ctx.fillStyle = "red";
    }
    ctx.fillRect(w * 22, h * 22, 20, 20);
}

function draw() {
    for (x = 0; x < 20; x++) {
        for (y = 0; y < 10; y++) {
            drawRect(y, x, game[x][y]);
        }
    }
    ctx.beginPath();
    if (document.getElementById("renderRotationPointCheckbox").checked) {
        ctx.arc(22 * rotationPoint[1], 22 * rotationPoint[0], 3, 0, 2 * Math.PI);
    }
    ctx.stroke();
}

function logGame() {
    for (x = 0; x < 20; x++) {
        let str = "";
        for (y = 0; y < 10; y++) {
            str += game[x][y];
        }
        console.log(str);
    }
}

function registerEvents() {
    keyDownEventHandler = function (event) {
        if (event.keyCode == 37) { //left
            var toMove = [];
            for (x = 19; x >= 0; x--) {
                for (y = 0; y < 10; y++) { //important: from left to right
                    if (game[x][y] == 2) {
                        if (y == 0 || game[x][y - 1] == 1) {
                            return;
                        }
                        toMove.push([x, y]);
                    }
                }
            }
            for (i = 0; i < toMove.length; i++) {
                var x = toMove[i][0];
                var y = toMove[i][1];
                game[x][y] = 0;
                game[x][y - 1] = 2;
            }
            rotationPoint[1]--;
            draw();
        } else if (event.keyCode == 39) { //right
            var toMove = [];
            for (x = 19; x >= 0; x--) {
                for (y = 10; y >= 0; y--) { //important: from right to left
                    if (game[x][y] == 2) {
                        if (y == 9 || game[x][y + 1] == 1) {
                            return;
                        }
                        toMove.push([x, y]);
                    }
                }
            }
            for (i = 0; i < toMove.length; i++) {
                var x = toMove[i][0];
                var y = toMove[i][1];
                game[x][y] = 0;
                game[x][y + 1] = 2;
            }
            rotationPoint[1]++;
            draw();
        } else if (event.keyCode == 40) { //down
            moveDown();
        } else if (event.keyCode == 89) { //y anti clockwise
            var newPositions = [];
            var currentRelativePositions = [];
            var oldPositions = []
            if (rotationPoint[0] % 1 == 0 && rotationPoint[1] % 1 == 0) { //rotation point on intersection
                for (x = 0; x < 20; x++) {
                    for (y = 0; y < 10; y++) {
                        if (game[x][y] == 2) {
                            relativeX = x - (rotationPoint[0]);
                            relativeY = y - (rotationPoint[1]);
                            if (relativeX >= 0) {
                                relativeX++;
                            }
                            if (relativeY >= 0) {
                                relativeY++;
                            }
                            currentRelativePositions.push([relativeX, relativeY]);
                            oldPositions.push([x, y]);
                        }
                    }
                }
                for (var i = 0; i < currentRelativePositions.length; i++) {
                    newRelativeX = currentRelativePositions[i][0];
                    newRelativeY = currentRelativePositions[i][1];

                    //now the turning algorithm starts
                    newRelativeY = -newRelativeY;

                    if (newRelativeX > 0) {
                        newRelativeX--;
                    }
                    if (newRelativeY > 0) {
                        newRelativeY--;
                    }

                    newX = (rotationPoint[0]) + newRelativeY; //warning applying newRalativeY to newX
                    newY = (rotationPoint[1]) + newRelativeX; //warning applying newRelativeX to newY

                    if ((newX > 19 || newX < 0) || (newY < 0 || newY > 9) || game[newX][newY] == 1) { //verify new Positions
                        return;
                    }

                    newPositions.push([newX, newY]);
                }
            } else if (rotationPoint[0] % 1 == 0.5 && rotationPoint[1] % 1 == 0.5) { //rotation point centerd in box
                for (x = 0; x < 20; x++) {
                    for (y = 0; y < 10; y++) {
                        if (game[x][y] == 2) {
                            relativeX = x - (rotationPoint[0] - 0.5);
                            relativeY = y - (rotationPoint[1] - 0.5);
                            currentRelativePositions.push([relativeX, relativeY]);
                            oldPositions.push([x, y]);
                        }
                    }
                }
                for (var i = 0; i < currentRelativePositions.length; i++) {
                    newRelativeX = currentRelativePositions[i][0];
                    newRelativeY = currentRelativePositions[i][1];

                    //now the turning algorithm starts
                    if (newRelativeY != 0) {
                        newRelativeY = -newRelativeY;
                    }

                    newX = (rotationPoint[0] - 0.5) + newRelativeY; //warning applying newRalativeY to newX
                    newY = (rotationPoint[1] - 0.5) + newRelativeX; //warning applying newRelativeX to newY
                    if ((newX > 19 || newX < 0) || (newY < 0 || newY > 9) ||game[newX][newY] == 1) { //verify new Positions
                        return;
                    }

                    newPositions.push([newX, newY]);
                }
            } else {
                console.error("Fatal error! The x and y for the rotationPoint are not both dividable by 1 or both not devidable by 1");
            }
            //deleting old Positions
            for (var i = 0; i < oldPositions.length; i++) {
                game[oldPositions[i][0]][oldPositions[i][1]] = 0;
            }
            //applying new Positions
            for (var i = 0; i < newPositions.length; i++) {
                game[newPositions[i][0]][newPositions[i][1]] = 2;
            }
            draw();
        } else if (event.keyCode == 88) { //x clockwise
            var newPositions = [];
            var currentRelativePositions = [];
            var oldPositions = []
            if (rotationPoint[0] % 1 == 0 && rotationPoint[1] % 1 == 0) { //rotation point on intersection
                for (x = 0; x < 20; x++) {
                    for (y = 0; y < 10; y++) {
                        if (game[x][y] == 2) {
                            relativeX = x - (rotationPoint[0]);
                            relativeY = y - (rotationPoint[1]);
                            if (relativeX >= 0) {
                                relativeX++;
                            }
                            if (relativeY >= 0) {
                                relativeY++;
                            }
                            currentRelativePositions.push([relativeX, relativeY]);
                            oldPositions.push([x, y]);
                        }
                    }
                }
                for (var i = 0; i < currentRelativePositions.length; i++) {
                    newRelativeX = currentRelativePositions[i][0];
                    newRelativeY = currentRelativePositions[i][1];

                    //now the turning algorithm starts
                    newRelativeX = -newRelativeX;

                    if (newRelativeX > 0) {
                        newRelativeX--;
                    }
                    if (newRelativeY > 0) {
                        newRelativeY--;
                    }

                    newX = (rotationPoint[0]) + newRelativeY; //warning applying newRalativeY to newX
                    newY = (rotationPoint[1]) + newRelativeX; //warning applying newRelativeX to newY

                    if ((newX > 19 || newX < 0) || (newY < 0 || newY > 9) || game[newX][newY] == 1) { //verify new Positions
                        return;
                    }

                    newPositions.push([newX, newY]);
                }
            } else if (rotationPoint[0] % 1 == 0.5 && rotationPoint[1] % 1 == 0.5) { //rotation point centerd in box
                for (x = 0; x < 20; x++) {
                    for (y = 0; y < 10; y++) {
                        if (game[x][y] == 2) {
                            relativeX = x - (rotationPoint[0] - 0.5);
                            relativeY = y - (rotationPoint[1] - 0.5);
                            currentRelativePositions.push([relativeX, relativeY]);
                            oldPositions.push([x, y]);
                        }
                    }
                }
                for (var i = 0; i < currentRelativePositions.length; i++) {
                    newRelativeX = currentRelativePositions[i][0];
                    newRelativeY = currentRelativePositions[i][1];

                    //now the turning algorithm starts
                    if (newRelativeX != 0) {
                        newRelativeX = -newRelativeX;
                    }

                    newX = (rotationPoint[0] - 0.5) + newRelativeY; //warning applying newRalativeY to newX
                    newY = (rotationPoint[1] - 0.5) + newRelativeX; //warning applying newRelativeX to newY
                    if ((newX > 19 || newX < 0) || (newY < 0 || newY > 9) ||game[newX][newY] == 1) { //verify new Positions
                        return;
                    }

                    newPositions.push([newX, newY]);
                }
            } else {
                console.error("Fatal error! The x and y for the rotationPoint are not both dividable by 1 or both not devidable by 1");
            }
            //deleting old Positions
            for (var i = 0; i < oldPositions.length; i++) {
                game[oldPositions[i][0]][oldPositions[i][1]] = 0;
            }
            //applying new Positions
            for (var i = 0; i < newPositions.length; i++) {
                game[newPositions[i][0]][newPositions[i][1]] = 2;
            }
            draw();
        }
    }
    document.addEventListener('keydown', keyDownEventHandler);
}

function moveDown() { //return true if all blue...
    var res = true;
    for (x = 0; x < 20; x++) {
        for (y = 0; y < 10; y++) {
            if (x < 19 && game[x][y] == 2 && game[x + 1][y] == 1) {
                redToBlue();
                draw();
                return true;
            }
        }
    }
    for (x = 19; x >= 0; x--) { //need to loop from bottom to top
        for (y = 0; y < 10; y++) {
            if (game[x][y] == 2) {
                res = false;
                if (x < 19) {
                    game[x][y] = 0;
                    game[x + 1][y] = 2;
                } else {
                    redToBlue();
                    draw();
                    return true;
                }
            }
        }
    }
    rotationPoint[0]++;
    draw();
    return res;
}

function redToBlue() {
    for (x = 19; x >= 0; x--) {
        for (y = 0; y < 10; y++) {
            if (game[x][y] == 2) {
                game[x][y] = 1;
            }
        }
    }
    playImpactSound();
}

function removeFulllines() {
    for (x = 19; x >= 0; x--) {
        var isLineFull = true;
        for (y = 0; y < 10; y++) {
            if (game[x][y] == 0) {
                isLineFull = false;
            }
        }
        if (isLineFull) {
            for (y = 0; y < 10; y++) {
                game[x][y] = 0;
            }
            for (var i = x - 1; i >= 0; i--) { //needs to be reversed
                for (var a = 0; a < 10; a++) {
                    game[i + 1][a] = game[i][a];
                }
            }
            lineRemoved();
            x++; //we need to proceed this line again because all stones were moved one line down.
        }
    }
}

function spawnNew() { //0-6
    var res = true;
    switch (Math.floor((Math.random() * 7))) {
        case 0: //long bar
            if (game[0][3] == 1 || game[0][4] == 1 || game[0][5] == 1 || game[0][6] == 1) {
                res = false;
            }
            game[0][3] = 2;
            game[0][4] = 2;
            game[0][5] = 2;
            game[0][6] = 2;
            rotationPoint = [1, 5];
            break;
        case 1: //J
            if (game[0][3] == 1 || game[1][3] == 1 || game[1][4] == 1 || game[1][5] == 1) {
                res = false;
            }
            game[0][3] = 2;
            game[1][3] = 2;
            game[1][4] = 2;
            game[1][5] = 2;
            rotationPoint = [1.5, 4.5];
            break;
        case 2: //L
            if (game[0][6] == 1 || game[1][4] == 1 || game[1][5] == 1 || game[1][6] == 1) {
                res = false;
            }
            game[0][6] = 2;
            game[1][4] = 2;
            game[1][5] = 2;
            game[1][6] = 2;
            rotationPoint = [1.5, 5.5];
            break;
        case 3: //square
            if (game[0][5] == 1 || game[0][4] == 1 || game[1][5] == 1 || game[1][4] == 1) {
                res = false;
            }
            game[0][4] = 2;
            game[0][5] = 2;
            game[1][4] = 2;
            game[1][5] = 2;
            rotationPoint = [1, 5];
            break;
        case 4: //S
            if (game[0][6] == 1 || game[0][5] == 1 || game[1][4] == 1 || game[1][5] == 1) {
                res = false;
            }
            game[0][5] = 2;
            game[0][6] = 2;
            game[1][4] = 2;
            game[1][5] = 2;
            rotationPoint = [1.5, 5.5];
            break;
        case 5: //triangle
            if (game[0][5] == 1 || game[1][4] == 1 || game[1][5] == 1 || game[1][6] == 1) {
                res = false;
            }
            game[0][5] = 2;
            game[1][4] = 2;
            game[1][5] = 2;
            game[1][6] = 2;
            rotationPoint = [1.5, 5.5];
            break;
        case 6: //Z
            if (game[0][4] == 1 || game[0][5] == 1 || game[1][5] == 1 || game[1][6] == 1) {
                res = false;
            }
            game[0][4] = 2;
            game[0][5] = 2;
            game[1][5] = 2;
            game[1][6] = 2;
            rotationPoint = [1.5, 5.5];
            break;
    }
    return res;
}

function restart() {
    document.removeEventListener('keydown', keyDownEventHandler);
    game = [];
    speed = 1000;
    resetLevelManager();
    initArray();
    registerEvents();
    spawnNew();
    draw();
    setTimeout(gameLoop, speed);
    document.getElementById('gameOverOverlay').style.display = "none";
}

function gameOver() {
    document.removeEventListener('keydown', keyDownEventHandler);
    keyDownEventHandler = function(event) {
        restart();
    }
    document.addEventListener('keydown', keyDownEventHandler);
    document.getElementById('gameOverOverlay').style.display = "block";
}

function gameLoop() { //sleep between calls sets the game speed 
    lastLoopCallMs = new Date().getMilliseconds();
    if (moveDown()) {
        removeFulllines();
        if (!spawnNew()) {
            draw();
            setTimeout(gameOver(), speed);
            return;
        }
        draw();
    }


    var diff = new Date().getMilliseconds() - lastLoopCallMs;
    var toWait = speed - diff;
    if (toWait < 0) {
        gameLoop();
        document.getElementById("tps").innerHTML = 1000 / diff;
    } else {
        setTimeout(gameLoop, speed - diff);
        document.getElementById("tps").innerHTML = 1000 / speed;    
    }
}

function onLoad() {
    initArray();
    drawLines();
    registerEvents();

    spawnNew();
    draw();
    setTimeout(gameLoop, speed);
}

function onShowTpsChange() {
    if (document.getElementById('showTpsCheckbox').checked) {
        document.getElementById('tpsDiv').style.display = "block";
    } else {
        document.getElementById('tpsDiv').style.display = "none";
    }
}