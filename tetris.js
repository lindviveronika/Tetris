var descendSpeed = 600;
var pieceSize = 50;
var gameBoardHeight = 450;
var gameBoardWidth = 450;

window.onload = function () {

    var startButton = document.getElementById('startbutton');

    startbutton.onclick = function() {
        this.disabled = true;
        dropNewPiece();
    };

};

function collisionCheck(top,left) {

    var existingPieces = document.getElementsByClassName('piece');

    for(i=0; i < existingPieces.length; i++){
        if(top === existingPieces[i].offsetTop && left === existingPieces[i].offsetLeft){
            console.log('met other piece');
            return true;
        }
    }

    return false;
}

function dropNewPiece () {

    var piece;
    piece = createPiece();
    piece.descend();

    window.onkeydown = function(e) {
        if (e.keyCode === 39) {
            piece.moveRight();
        }
        if (e.keyCode === 37) {
            piece.moveLeft();
        }
    };

}

function createSquare (top,left) {

    this.left = left;
    this.top = top;
    var reachedBottom = false;

    var square = document.createElement('div');
    square.style.width = pieceSize + 'px';
    square.style.height = pieceSize + 'px';
    square.className = 'square';
    square.style.left = left + 'px';
    document.getElementById('gameboard').appendChild(square);

    return square;

}

function createPiece () {

    var square1 = createSquare(0,200);
    var square2 = createSquare(0,150);
    var piece = [square1,square2];

    piece.descend = function () {

        var interval = setInterval(function () {

            for( i = 0; i < piece.length; i++){

                piece[i].top += pieceSize;
                var collision = collisionCheck(piece[i].top,piece[i].left);

                if (piece[i].top === gameBoardHeight || collision === true) {
                    piece[i].reachedBottom = true;
                    clearInterval(interval);
                    dropNewPiece();
                    return;
                }

                piece[i].style.top = top + 'px';

            }

        }, descendSpeed);
    }

    piece.moveRight = function() {
        left = left + pieceSize;
        var collision = collisionCheck(top,left);
        if(left < gameBoardWidth && reachedBottom === false && collision === false){
            piece.style.left = left + 'px';
        }
        else{
            left = left - pieceSize;
        }
    }

    piece.moveLeft = function() {
        left = left - pieceSize;
        var collision = collisionCheck(top,left);
        if(left >= 0 && reachedBottom === false && collision === false){
            piece.style.left = left + 'px';
        }
        else{
            left = left + pieceSize;
        }
    }
    return piece;
}
