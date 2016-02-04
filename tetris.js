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
    console.log(top);
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

    var square = document.createElement('div');

    square.left = left;
    square.top = top;
    square.reachedBottom = false;

    square.style.width = pieceSize + 'px';
    square.style.height = pieceSize + 'px';
    square.className = 'square';
    square.style.left = left + 'px';
    document.getElementById('gameboard').appendChild(square);

    return square;

}

function createPiece () {

    var piece = createSquare(0,200);
    piece.className += ' ' + 'piece';

    piece.descend = function () {

        var interval = setInterval(function () {

              piece.top += pieceSize;
              var collision = collisionCheck(piece.top,piece.left);
              console.log(collision);

              if (piece.top === gameBoardHeight || collision === true) {
                  piece.reachedBottom = true;
                  clearInterval(interval);
                  dropNewPiece();
                  return;
              }

              piece.style.top = piece.top + 'px';

        }, descendSpeed);
    }

    piece.moveRight = function() {
        piece.left = piece.left + pieceSize;
        var collision = collisionCheck(piece.top,piece.left);
        if(piece.left < gameBoardWidth && piece.reachedBottom === false && collision === false){
            piece.style.left = piece.left + 'px';
        }
        else{
            piece.left = piece.left - pieceSize;
        }
    }

    piece.moveLeft = function() {
        piece.left = piece.left - pieceSize;
        var collision = collisionCheck(piece.top,piece.left);
        if(piece.left >= 0 && piece.reachedBottom === false && collision === false){
            piece.style.left = piece.left + 'px';
        }
        else{
            piece.left = piece.left + pieceSize;
        }
    }
    return piece;
}
