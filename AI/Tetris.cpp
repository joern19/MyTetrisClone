//
// Created by not-a-robot on 16.05.20.
//

#include <iostream>
#include <cstdlib>
#include <vector>
#include <ctime>
#include "Tetris.h"

Tetris::Tetris() {
    initArray();
    rotationPoint.push_back(0);
    rotationPoint.push_back(0);
    spawnNew();
}

void Tetris::initArray() {
    for (int x = 0; x < 20; x++) {
        std::vector<int> tmp;
        tmp.reserve(10);
        for (int y = 0; y < 10; y++) {
            tmp.push_back(0);
        }
        game.push_back(tmp);
    }
}

void Tetris::printGame() {
    std::cout << "-----------------------" << std::endl;
    for (auto &x : game) { //into 1 loop??
        std::cout << "| ";
        for (int &y : x) {
            if (y == 0) {
                std::cout << "  ";
            } else {
                std::cout << "# ";
            }
        }
        std::cout << "|" << std::endl;
    }
    std::cout << "-----------------------" << std::endl;
}

void Tetris::redToBlue() {
    for (int x = 19; x >= 0; x--) {
        for (int y = 0; y < 10; y++) {
            if (game[x][y] == 2) {
                game[x][y] = 1;
            }
        }
    }
}

void Tetris::removeFullLines() {
    for (int x = 19; x >= 0; x--) {
        bool isLineFull = true;
        for (int y = 0; y < 10; y++) {
            if (game[x][y] == 0) {
                isLineFull = false;
            }
        }
        if (isLineFull) {
            for (int y = 0; y < 10; y++) {
                game[x][y] = 0;
            }
            for (int i = x - 1; i >= 0; i--) { //needs to be reversed
                for (int a = 0; a < 10; a++) {
                    game[i + 1][a] = game[i][a];
                }
            }
            x++; //we need to proceed this line again because all stones were moved one line down.
        }
    }
}

bool Tetris::gameLoop() {
    if (moveDown()) {
        removeFullLines();
        if (!spawnNew()) {
            printGame();
            return true;
        }
        printGame();
    }
    return false;
}

std::vector<std::vector<int>> Tetris::getGame() {
    return game;
}

bool Tetris::moveDown() {
    bool res = true;
    for (int x = 0; x < 20; x++) {
        for (int y = 0; y < 10; y++) {
            if (x < 19 && game[x][y] == 2 && game[x + 1][y] == 1) {
                redToBlue();
                printGame();
                return true;
            }
        }
    }
    for (int x = 19; x >= 0; x--) { //need to loop from bottom to top
        for (int y = 0; y < 10; y++) {
            if (game[x][y] == 2) {
                res = false;
                if (x < 19) {
                    game[x][y] = 0;
                    game[x + 1][y] = 2;
                } else {
                    redToBlue();
                    printGame();
                    return true;
                }
            }
        }
    }
    rotationPoint[0]++;
    printGame();
    return res;
}

bool Tetris::spawnNew() {
    bool res = true;

    switch (rand() % 7) { //0-6
        case 0: //long bar
            if (game[0][3] == 1 || game[0][4] == 1 || game[0][5] == 1 || game[0][6] == 1) {
                res = false;
            }
            game[0][3] = 2;
            game[0][4] = 2;
            game[0][5] = 2;
            game[0][6] = 2;
            rotationPoint[0] = 1;
            rotationPoint[1] = 5;
            break;
        case 1: //J
            if (game[0][3] == 1 || game[1][3] == 1 || game[1][4] == 1 || game[1][5] == 1) {
                res = false;
            }
            game[0][3] = 2;
            game[1][3] = 2;
            game[1][4] = 2;
            game[1][5] = 2;
            rotationPoint[0] = 1.5;
            rotationPoint[1] = 4.5;
            break;
        case 2: //L
            if (game[0][6] == 1 || game[1][4] == 1 || game[1][5] == 1 || game[1][6] == 1) {
                res = false;
            }
            game[0][6] = 2;
            game[1][4] = 2;
            game[1][5] = 2;
            game[1][6] = 2;
            rotationPoint[0] = 1.5;
            rotationPoint[1] = 5.5;
            break;
        case 3: //square
            if (game[0][5] == 1 || game[0][4] == 1 || game[1][5] == 1 || game[1][4] == 1) {
                res = false;
            }
            game[0][4] = 2;
            game[0][5] = 2;
            game[1][4] = 2;
            game[1][5] = 2;
            rotationPoint[0] = 1;
            rotationPoint[1] = 5;
            break;
        case 4: //S
            if (game[0][6] == 1 || game[0][5] == 1 || game[1][4] == 1 || game[1][5] == 1) {
                res = false;
            }
            game[0][5] = 2;
            game[0][6] = 2;
            game[1][4] = 2;
            game[1][5] = 2;
            rotationPoint[0] = 1.5;
            rotationPoint[1] = 5.5;
            break;
        case 5: //triangle
            if (game[0][5] == 1 || game[1][4] == 1 || game[1][5] == 1 || game[1][6] == 1) {
                res = false;
            }
            game[0][5] = 2;
            game[1][4] = 2;
            game[1][5] = 2;
            game[1][6] = 2;
            rotationPoint[0] = 1.5;
            rotationPoint[1] = 5.5;
            break;
        case 6: //Z
            if (game[0][4] == 1 || game[0][5] == 1 || game[1][5] == 1 || game[1][6] == 1) {
                res = false;
            }
            game[0][4] = 2;
            game[0][5] = 2;
            game[1][5] = 2;
            game[1][6] = 2;
            rotationPoint[0] = 1.5;
            rotationPoint[1] = 5.5;
            break;
    }
    printGame();
    return res;
}

void Tetris::down() {
    moveDown();
}

void Tetris::left() {
    std::vector<std::vector<int>> toMove;
    for (int x = 19; x >= 0; x--) {
        for (int y = 0; y < 10; y++) { //important: from left to right
            if (game[x][y] == 2) {
                if (y == 0 || game[x][y - 1] == 1) {
                    return;
                }
                toMove.push_back(std::vector<int>{x, y});
            }
        }
    }
    for (auto &i : toMove) {
        int x = i[0];
        int y = i[1];
        game[x][y] = 0;
        game[x][y - 1] = 2;
    }
    rotationPoint[1]--;
    printGame();
}

void Tetris::right() {
    std::vector<std::vector<int>> toMove;
    for (int x = 19; x >= 0; x--) {
        for (int y = 10; y >= 0; y--) { //important: from right to left
            if (game[x][y] == 2) {
                if (y == 9 || game[x][y + 1] == 1) {
                    return;
                }
                toMove.push_back(std::vector<int>{x, y});
            }
        }
    }
    for (auto &i : toMove) {
        int x = i[0];
        int y = i[1];
        game[x][y] = 0;
        game[x][y + 1] = 2;
    }
    rotationPoint[1]++;
    printGame();
}

void Tetris::antiClockwise() {
    std::vector<std::vector<int>> newPositions;
    std::vector<std::vector<int>> currentRelativePositions;
    std::vector<std::vector<int>> oldPositions;
    for (int x = 0; x < 20; x++) {
        for (int y = 0; y < 10; y++) {
            if (game[x][y] == 2) {
                int relativeX = x - int(rotationPoint[0]);
                int relativeY = y - int(rotationPoint[1]);
                if (relativeX >= 0) {
                    relativeX++;
                }
                if (relativeY >= 0) {
                    relativeY++;
                }
                currentRelativePositions.push_back(std::vector<int>{relativeX, relativeY});
                oldPositions.push_back(std::vector<int>{x, y});
            }
        }
    }
    for (auto &currentRelativePosition : currentRelativePositions) {
        int newRelativeX = currentRelativePosition[0];
        int newRelativeY = currentRelativePosition[1];

        //now the turning algorithm starts
        newRelativeY = -newRelativeY;

        if (newRelativeX > 0) {
            newRelativeX--;
        }
        if (newRelativeY > 0) {
            newRelativeY--;
        }

        int newX = int(rotationPoint[0]) + newRelativeY; //warning applying newRalativeY to newX
        int newY = int(rotationPoint[1]) + newRelativeX; //warning applying newRelativeX to newY

        if ((newX > 19 || newX < 0) || (newY < 0 || newY > 9) || game[newX][newY] == 1) { //verify new Positions
            return;
        }
        newPositions.push_back(std::vector<int>{newX, newY});
    }
    //deleting old Positions
    for (auto &oldPosition : oldPositions) {
        game[oldPosition[0]][oldPosition[1]] = 0;
    }
    //applying new Positions
    for (auto &newPosition : newPositions) {
        game[newPosition[0]][newPosition[1]] = 2;
    }
    printGame();
}

void Tetris::clockwise() {
    std::vector<std::vector<int>> newPositions;
    std::vector<std::vector<int>> currentRelativePositions;
    std::vector<std::vector<int>> oldPositions;
    for (int x = 0; x < 20; x++) {
        for (int y = 0; y < 10; y++) {
            if (game[x][y] == 2) {
                int relativeX = x - int(rotationPoint[0]);
                int relativeY = y - int(rotationPoint[1]);
                if (relativeX >= 0) {
                    relativeX++;
                }
                if (relativeY >= 0) {
                    relativeY++;
                }
                currentRelativePositions.push_back(std::vector<int>{relativeX, relativeY});
                oldPositions.push_back(std::vector<int>{x, y});
            }
        }
    }
    for (auto &currentRelativePosition : currentRelativePositions) {
        int newRelativeX = currentRelativePosition[0];
        int newRelativeY = currentRelativePosition[1];

        //now the turning algorithm starts
        newRelativeX = -newRelativeX;

        if (newRelativeX > 0) {
            newRelativeX--;
        }
        if (newRelativeY > 0) {
            newRelativeY--;
        }

        int newX = int(rotationPoint[0]) + newRelativeY; //warning applying newRalativeY to newX
        int newY = int(rotationPoint[1]) + newRelativeX; //warning applying newRelativeX to newY

        if ((newX > 19 || newX < 0) || (newY < 0 || newY > 9) || game[newX][newY] == 1) { //verify new Positions
            return;
        }
        newPositions.push_back(std::vector<int>{newX, newY});
    }

    //deleting old Positions
    for (auto &oldPosition : oldPositions) {
        game[oldPosition[0]][oldPosition[1]] = 0;
    }
    //applying new Positions
    for (auto &newPosition : newPositions) {
        game[newPosition[0]][newPosition[1]] = 2;
    }
    printGame();
}


