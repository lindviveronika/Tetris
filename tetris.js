var descendSpeed = 400;
var pieceSize = 100;
var innerPieceSize = pieceSize/4;
var gameBoardHeight = pieceSize * 5;
var gameBoardWidth = pieceSize * 2.5;

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
    piece.element.className += ' s-shape';
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

function gameOver () {

  var restart = confirm('Game over! Do you want to play again?');

  if (restart) {
    location.reload();
  }

}

var cumulativeOffset = function(element) {
    var top = 0, left = 0;
    do {
        top += element.offsetTop  || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while(element);

    return {
        top: top,
        left: left
    };
};

function collision (top, left, existingElem) {
  if (top === cumulativeOffset(existingElem).top && left === cumulativeOffset(existingElem).left){
    return true;
  }
  else {
    return false;
  }
}

function createPieceElement () {
  var pieceContainer = document.createElement('div');
  var innerPiece;
  for(var i = 1; i <= 16; i++){
    innerPiece = document.createElement('div');
    innerPiece.id = i;
    innerPiece.style.height = pieceSize/4 + 'px';
    innerPiece.style.width = pieceSize/4 + 'px';
    pieceContainer.appendChild(innerPiece);
    if(i === 7 || i === 8 || i === 10 || i === 11){
      innerPiece.className = 'colored'
    }
  }
  return pieceContainer;
}

function Piece (top,left) {
  this.top = -pieceSize;
  this.left = gameBoardWidth/2 - pieceSize/2;

  this.collided = false;
  this.reachedBottom = false;

  this.element = createPieceElement();
  this.element.className = 'piece';
}

Piece.prototype.descend = function () {

  var piece = this;

  document.getElementById('gameboard').appendChild(piece.element);

  var interval = setInterval(function () {

        if (piece.top + pieceSize === gameBoardHeight || piece.collisionCheck(innerPieceSize,0)) {
            clearInterval(interval);

            if (piece.top === 0) {
              gameOver();
            }
            else {
              piece.reachedBottom = true;
              dropNewPiece();
            }

            return;
        }

        piece.top += innerPieceSize;
        piece.element.style.top = piece .top + 'px';

  }, descendSpeed);

}

Piece.prototype.moveLeft = function () {
  var gameboard = document.getElementById('gameboard');
  var innerPieces = this.element.childNodes;
  var reachedLeft = false;
  for(i = 0; i < innerPieces.length; i++){
    if(innerPieces[i].className === 'colored'){
      if(cumulativeOffset(innerPieces[i]).left === cumulativeOffset(gameboard).left){
        reachedLeft = true;
      }
    }
  }
  if(!reachedLeft && this.reachedBottom === false && !this.collisionCheck(0, -innerPieceSize)){
      this.left = this.left - innerPieceSize;
      this.element.style.left = this.left + 'px';
  }
}

Piece.prototype.moveRight = function () {
  var gameboard = document.getElementById('gameboard');
  var innerPieces = this.element.childNodes;
  var reachedRight = false;
  for(i = 0; i < innerPieces.length; i++){
    if(innerPieces[i].className === 'colored'){
      if(cumulativeOffset(innerPieces[i]).left + innerPieceSize === cumulativeOffset(gameboard).left + gameBoardWidth){
        reachedRight = true;
      }
    }
  }
  if(!reachedRight && this.reachedBottom === false && !this.collisionCheck(0, innerPieceSize)){
      this.left = this.left + innerPieceSize;
      this.element.style.left = this.left + 'px';
  }
}

Piece.prototype.collisionCheck = function (movetop,moveleft) {
  var existingPieces = document.getElementsByClassName('colored');
  var innerPieces = this.element.childNodes;
  for(i = 0; i < innerPieces.length; i++){
    if(innerPieces[i].className === 'colored'){
      for(j = 0; j < existingPieces.length; j++){
        if(!innerPieces[i].parentNode.isSameNode(existingPieces[j].parentNode) && !innerPieces[i].isSameNode(existingPieces[j])){
          if(collision(cumulativeOffset(innerPieces[i]).top + movetop, cumulativeOffset(innerPieces[i]).left + moveleft, existingPieces[j])){
            return true;
          }
        }
      }
    }
  }
  return false;
}
