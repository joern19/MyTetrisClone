#include <iostream>
#include "cmake-build-debug/CMakeFiles/Tetris.h"

int main() {
    std::cout << "Hello world!" << std::endl;
    //OOP::test();

    Tetris tetris;
    tetris.gameLoop();
    tetris.right();
    tetris.right();
    tetris.right();
    tetris.right();
    int counter = 0;
    while (counter < 40) {
        counter++;
        tetris.gameLoop();
    }
    
    return 0;
}
