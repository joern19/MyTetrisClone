//
// Created by not-a-robot on 16.05.20.
//

#ifndef UNTITLED_TETRIS_H
#define UNTITLED_TETRIS_H
#include <vector>


class Tetris {
public:
    bool gameLoop(); //true if game is over
    std::vector<std::vector<int>> getGame();

    //ai controls
    void down();
    void left();
    void right();
    void antiClockwise();
    void clockwise();
    //ai controls end

    Tetris();
private:
    std::vector<std::vector<int>> game;
    std::vector<double> rotationPoint;
    void initArray();
    void redToBlue();
    void removeFullLines();
    bool moveDown(); //return true if all blue
    bool spawnNew();
    void printGame();
};


#endif //UNTITLED_TETRIS_H
