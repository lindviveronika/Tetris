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

        piece.top += pieceSize;

        if (piece.top === gameBoardHeight || piece.collisionCheck()) {
            piece.reachedBottom = true;
            clearInterval(interval);
            dropNewPiece();
            return;
        }

        piece.element.style.top = piece .top + 'px';

  }, descendSpeed);

}

Piece.prototype.moveLeft = function () {
  this.left = this.left - pieceSize;
  if(this.left >= 0 && this.reachedBottom === false && !this.collisionCheck()){
      this.element.style.left = this.left + 'px';
  }
  else{
      this.left = this.left + pieceSize;
  }
}

Piece.prototype.moveRight = function () {
  this.left = this.left + pieceSize;
  if(this.left < gameBoardWidth && this.reachedBottom === false && !this.collisionCheck()){
      this.element.style.left = this.left + 'px';
  }
  else{
      this.left = this.left - pieceSize;
  }
}

Piece.prototype.collisionCheck = function () {
  var existingPieces = document.getElementsByClassName('piece');

  for(i=0; i < existingPieces.length; i++){
      if(this.top === existingPieces[i].offsetTop && this.left === existingPieces[i].offsetLeft){
          console.log('met other piece');
          return true;
      }
  }

  return false;
}
