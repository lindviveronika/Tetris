var score = 0;
var descendSpeed = 400;

var pieceSize = 100;
var innerPieceSize = pieceSize/4;

var nrInnerPiecesRow = 10;
var gameBoardHeight = pieceSize * 5;
var gameBoardWidth = innerPieceSize * nrInnerPiecesRow;

window.onload = function () {

    var startButton = document.getElementById('startbutton');

    startbutton.onclick = function() {
        this.disabled = true;
        dropNewPiece();
    };

};

function dropNewPiece () {

    var piece = getRandomPiece();
    piece.descend();

    window.onkeydown = function(e) {
        if (e.keyCode === 39) {
            piece.moveRight();
        }
        if (e.keyCode === 37) {
            piece.moveLeft();
        }
        if (e.keyCode === 38) {
            piece.rotate();
        }
        if (e.keyCode === 40) {
            piece.moveDown();
        }
    };

}

function gameOver () {

  var restart = confirm('Game over! Your score: ' + score + '. Do you want to play again?');

  if (restart) {
    location.reload();
  }

}

function absolutePosition (element) {
    var top = 0, left = 0;
    do {
        top += element.offsetTop  || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while(element && element.getAttribute('id') != 'gameboard');

    return {
        top: top,
        left: left
    };
};

function addClone (clone, top, left) {

  document.getElementById('gameboard').appendChild(clone);
  clone.style.visibility = 'hidden';
  clone.style.top = top + 'px';
  clone.style.left = left + 'px';

}

function collisionCheck (element) {

  var gameboard = document.getElementById('gameboard');
  var existing = document.getElementsByClassName('colored fixed');
  var childnodes = element.childNodes;

  for(i = 0; i < childnodes.length; i++){

    if(childnodes[i].className.indexOf('colored') > -1){

      //Outside bottom
      if(absolutePosition(childnodes[i]).top > gameBoardHeight - innerPieceSize){
        return 'bottom';
      }

      //Outside right side
      if(absolutePosition(childnodes[i]).left > gameBoardWidth - innerPieceSize){
        return 'right';
      }

      //Outside left side
      if(absolutePosition(childnodes[i]).left < 0){
        return 'left';
      }

      //Collision with other piece
      for(j = 0; j < existing.length; j++){

        if(!childnodes[i].parentNode.isSameNode(existing[j].parentNode) && !childnodes[i].isSameNode(existing[j])){

          if (absolutePosition(childnodes[i]).top === absolutePosition(existing[j]).top && absolutePosition(childnodes[i]).left === absolutePosition(existing[j]).left){
            return 'bottom';
          }

        }
      }
    }
  }
  return false;
}

function replacePiece (oldPiece) {
  var replacingpiece = oldPiece.cloneNode();
  replacingpiece.className = oldPiece.className + ' fixed';
  replacingpiece.style.width = innerPieceSize + 'px';
  replacingpiece.style.height = innerPieceSize + 'px';
  replacingpiece.style.position = 'absolute';
  replacingpiece.style.top = absolutePosition(oldPiece).top + 'px';
  replacingpiece.style.left = absolutePosition(oldPiece).left + 'px';
  document.getElementById('gameboard').appendChild(replacingpiece);
}

function movePiecesAbove (top) {
  var remainingPieces = document.getElementsByClassName('colored fixed');
  for(l = 0; l < remainingPieces.length; l++){
    if(absolutePosition(remainingPieces[l]).top < top){
      remainingPieces[l].style.top = parseInt(remainingPieces[l].style.top) + innerPieceSize + 'px';
    }
  }
}

function speedUp () {
  if(descendSpeed > 50) {
    descendSpeed = descendSpeed - 10;
  }
}

function checkRows (newPiece) {

  var childnodes = newPiece.element.childNodes;
  var fixedPieces = document.getElementsByClassName('colored fixed');
  var piecesInRow;
  var top;

  for(i = 0; i < childnodes.length; i++){

    if(childnodes[i].className.indexOf('colored') > -1){
      piecesInRow = [];
      top = absolutePosition(childnodes[i]).top;

      for(j = 0; j < fixedPieces.length; j++){

        if(absolutePosition(fixedPieces[j]).top === top){
          piecesInRow.push(fixedPieces[j]);

          if(piecesInRow.length === nrInnerPiecesRow){
            for(k = 0; k < piecesInRow.length; k++){

              piecesInRow[k].remove();
            }
            movePiecesAbove(top);
            speedUp();
            score ++;
          }
        }
      }
    }
  }

}

function getRandomPiece () {

  var rand = Math.floor(Math.random() * 7) + 1;

  switch (rand) {
    case 1:
        return new OPiece();
    case 2:
        return new IPiece();
    case 3:
        return new SPiece();
    case 4:
        return new ZPiece();
    case 5:
        return new LPiece();
    case 6:
        return new JPiece();
    case 7:
        return new TPiece();
      break;
    default: return new OPiece();

  }
}

function Piece (color) {
  this.color = color;
  this.top = -pieceSize;
  this.left = gameBoardWidth/2 - pieceSize/2;
  this.curState = 1;
  this.element = this.draw();
  this.element.className = 'piece';
}

Piece.prototype.draw = function () {

  var pieceContainer = document.createElement('div');

  var innerPiece;

  var state = this.states[this.curState - 1];

  for(var i = 0; i < state.length; i++){
    for(var j = 0; j < state[i].length; j++){

      innerPiece = document.createElement('div');
      pieceContainer.appendChild(innerPiece);

      if(state[i][j] === 1){
        innerPiece.className = 'colored' + ' ' + this.color;
      }
    }
  }

  return pieceContainer;

}

Piece.prototype.descend = function () {

  var piece = this;

  document.getElementById('gameboard').appendChild(piece.element);

  var interval = setInterval(function () {

    var clone = piece.element.cloneNode(true);
    addClone(clone, piece.top + innerPieceSize, piece.left);

    if (collisionCheck(clone) === 'bottom') {
        clearInterval(interval);

        var childnodes = piece.element.childNodes;
        for(var i = 0; i < childnodes.length; i++){
          if(childnodes[i].className.indexOf('colored') > -1){
            replacePiece(childnodes[i]);
          }
        }
        checkRows(piece);

        if (piece.reachedTop()) {
          gameOver();
        }
        else {
          dropNewPiece();
        }

        piece.element.remove();
        clone.remove();
        return;
    }
    clone.remove();
    piece.top += innerPieceSize;
    piece.element.style.top = piece .top + 'px';

  }, descendSpeed);

}

Piece.prototype.moveLeft = function () {

  var clone = this.element.cloneNode(true);
  addClone(clone, this.top, this.left - innerPieceSize);

  if(!collisionCheck(clone)){

      this.left = this.left - innerPieceSize;
      this.element.style.left = this.left + 'px';

  }
  clone.remove();
}

Piece.prototype.moveRight = function () {

  var clone = this.element.cloneNode(true);
  addClone(clone, this.top, this.left + innerPieceSize);

  if(!collisionCheck(clone)){

      this.left = this.left + innerPieceSize;
      this.element.style.left = this.left + 'px';

  }
  clone.remove();
}

Piece.prototype.moveDown = function () {

  var clone = this.element.cloneNode(true);
  addClone(clone, this.top + innerPieceSize, this.left);

  if(!collisionCheck(clone)){

    this.top = this.top + innerPieceSize;
    this.element.style.top = this.top + 'px';

  }
  clone.remove();
}

Piece.prototype.rotate = function () {
  var prevState = this.curState;

  if(this.curState < this.states.length){
    this.curState++;
  }
  else {
    this.curState = 1;
  }

  var clone = this.draw();
  addClone(clone, this.top, this.left);
  clone.className = this.element.className;

  if(!collisionCheck(clone)){
    this.element.remove();
    this.element = clone;
    this.element.style.visibility = 'visible';
  }
  else{
    clone.remove();
    this.curState = prevState;
  }

}

Piece.prototype.reachedTop = function () {

  var childnodes = this.element.childNodes;

  for(i = 0; i < childnodes.length; i++){
    if(childnodes[i].className.indexOf('colored') > -1){
      if(absolutePosition(childnodes[i]).top <= 0){
        return true;
      }
    }
  }
  return false;
}


function OPiece () {

  this.state1 = [ [0, 0, 0, 0],
                  [0, 1, 1, 0],
                  [0, 1, 1, 0],
                  [0, 0, 0, 0] ];


  this.states  = [this.state1];

  Piece.call(this, 'red');

}

function IPiece () {

  this.state1 = [ [0, 0, 0, 0],
                  [1, 1, 1, 1],
                  [0, 0, 0, 0],
                  [0, 0, 0, 0] ];

  this.state2 = [ [0, 0, 1, 0],
                  [0, 0, 1, 0],
                  [0, 0, 1, 0],
                  [0, 0, 1, 0] ];

  this.states  = [this.state1, this.state2];

  Piece.call(this, 'blue');

}

function SPiece () {

  this.state1 = [ [0, 0, 0, 0],
                  [0, 0, 1, 1],
                  [0, 1, 1, 0],
                  [0, 0, 0, 0] ];

  this.state2 = [ [0, 0, 1, 0],
                  [0, 0, 1, 1],
                  [0, 0, 0, 1],
                  [0, 0, 0, 0] ];

  this.states  = [this.state1, this.state2];

  Piece.call(this, 'yellow');

}

function ZPiece () {

  this.state1 = [ [0, 0, 0, 0],
                  [0, 1, 1, 0],
                  [0, 0, 1, 1],
                  [0, 0, 0, 0] ];

  this.state2 = [ [0, 0, 0, 1],
                  [0, 0, 1, 1],
                  [0, 0, 1, 0],
                  [0, 0, 0, 0] ];

  this.states  = [this.state1, this.state2];

  Piece.call(this, 'green');

}

function LPiece () {

  this.state1 = [ [0, 0, 1, 0],
                  [0, 0, 1, 0],
                  [0, 0, 1, 1],
                  [0, 0, 0, 0] ];

  this.state2 = [ [0, 0, 0, 1],
                  [0, 1, 1, 1],
                  [0, 0, 0, 0],
                  [0, 0, 0, 0] ];

  this.state3 = [ [0, 1, 1, 0],
                  [0, 0, 1, 0],
                  [0, 0, 1, 0],
                  [0, 0, 0, 0] ];

  this.state4 = [ [0, 0, 0, 0],
                  [0, 1, 1, 1],
                  [0, 1, 0, 0],
                  [0, 0, 0, 0] ];

  this.states  = [this.state1, this.state2, this.state3, this.state4];

  Piece.call(this, 'cyan');

}

function JPiece () {

  this.state1 = [ [0, 0, 1, 1],
                  [0, 0, 1, 0],
                  [0, 0, 1, 0],
                  [0, 0, 0, 0] ];

  this.state2 = [ [0, 1, 0, 0],
                  [0, 1, 1, 1],
                  [0, 0, 0, 0],
                  [0, 0, 0, 0] ];

  this.state3 = [ [0, 0, 1, 0],
                  [0, 0, 1, 0],
                  [0, 1, 1, 0],
                  [0, 0, 0, 0] ];

  this.state4 = [ [0, 0, 0, 0],
                  [0, 1, 1, 1],
                  [0, 0, 0, 1],
                  [0, 0, 0, 0] ];

  this.states  = [this.state1, this.state2, this.state3, this.state4];

  Piece.call(this, 'purple');

}

function TPiece () {

  this.state1 = [ [0, 0, 0, 0],
                  [0, 1, 1, 1],
                  [0, 0, 1, 0],
                  [0, 0, 0, 0] ];

  this.state2 = [ [0, 0, 1, 0],
                  [0, 0, 1, 1],
                  [0, 0, 1, 0],
                  [0, 0, 0, 0] ];

  this.state3 = [ [0, 0, 1, 0],
                  [0, 1, 1, 1],
                  [0, 0, 0, 0],
                  [0, 0, 0, 0] ];

  this.state4 = [ [0, 0, 1, 0],
                  [0, 1, 1, 0],
                  [0, 0, 1, 0],
                  [0, 0, 0, 0] ];

  this.states  = [this.state1, this.state2, this.state3, this.state4];

  Piece.call(this, 'orange');

}

var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

inheritsFrom(OPiece, Piece);
inheritsFrom(IPiece, Piece);
inheritsFrom(SPiece, Piece);
inheritsFrom(ZPiece, Piece);
inheritsFrom(LPiece, Piece);
inheritsFrom(JPiece, Piece);
inheritsFrom(TPiece, Piece);
