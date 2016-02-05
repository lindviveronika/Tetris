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
    piece = new Piece(0,200);
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

function Piece (top,left) {
  this.top = top;
  this.left = left;
  this.collided = false;
  this.reachedBottom = false;
  this.element = document.createElement('div');

  this.element.style.width = pieceSize + 'px';
  this.element.style.height = pieceSize + 'px';
  this.element.className = 'piece';
  this.element.style.left = left + 'px';
  this.element.style.top = top + 'px';

}

Piece.prototype.descend = function () {

  var piece = this;

  document.getElementById('gameboard').appendChild(piece.element);

  var interval = setInterval(function () {

        piece .top += pieceSize;
        //this.collisionCheck();

        if (piece.top === gameBoardHeight /*|| this.collided*/) {
            piece.reachedBottom = true;
            clearInterval(interval);
            dropNewPiece();
            return;
        }

        piece.element.style.top = piece .top + 'px';

  }, descendSpeed);

}

Piece.prototype.moveLeft = function () {

}

Piece.prototype.moveRight = function () {

}

Piece.prototype.collisionCheck = function () {

}

/*

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


function createPiece (top,left) {

    var piece = document.createElement('div');

    piece.reachedBottom = false;
    piece.style.width = pieceSize + 'px';
    piece.style.height = pieceSize + 'px';
    piece.className = 'piece';
    piece.style.left = left + 'px';

    piece.descend = function () {

        var interval = setInterval(function () {

              top += pieceSize;
              var collision = collisionCheck(top, left);

              if (top === gameBoardHeight || collision === true) {
                  piece.reachedBottom = true;
                  clearInterval(interval);
                  dropNewPiece();
                  return;
              }

              piece.style.top = top + 'px';

        }, descendSpeed);
    }

    piece.moveRight = function() {
        left = left + pieceSize;
        var collision = collisionCheck(top,left);
        if(left < gameBoardWidth && piece.reachedBottom === false && collision === false){
            piece.style.left = left + 'px';
        }
        else{
            left = left - pieceSize;
        }
    }

    piece.moveLeft = function() {
        left = left - pieceSize;
        var collision = collisionCheck(top,left);
        if(left >= 0 && piece.reachedBottom === false && collision === false){
            piece.style.left = left + 'px';
        }
        else{
            left = left + pieceSize;
        }
    }

    document.getElementById('gameboard').appendChild(piece);
    return piece;
}
*/
