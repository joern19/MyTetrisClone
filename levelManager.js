var lines = 0;
var level = 1;

function resetLevelManager() {
    lines = 0;
    level = 1;
    document.getElementById('level').innerHTML = level;
    document.getElementById('lines').innerHTML = lines;
}

function lineRemoved() {
    lines++;
    if (lines % 10 == 0) { //on reach of 10, 20, 30, ...
        if (level < 10) { //max level is currently 10
            level++;
            document.getElementById('level').innerHTML = level;
        }
        speed = 1100 - level * 100; //1100 because we already start at level 1
    }
    document.getElementById('lines').innerHTML = lines;
}