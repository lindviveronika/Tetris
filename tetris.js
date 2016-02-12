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
    };

}

function gameOver () {

  var restart = confirm('Game over! Do you want to play again?');

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
    } while(element);

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

    if(childnodes[i].className === 'colored'){

      //Outside bottom
      if(absolutePosition(childnodes[i]).top > absolutePosition(gameboard).top + gameBoardHeight - innerPieceSize){
        return 'bottom';
      }

      //Outside right side
      if(absolutePosition(childnodes[i]).left > absolutePosition(gameboard).left + gameBoardWidth - innerPieceSize){
        return 'right';
      }

      //Outside left side
      if(absolutePosition(childnodes[i]).left < absolutePosition(gameboard).left){
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

function Piece (className) {
  this.top = -pieceSize;
  this.left = gameBoardWidth/2 - pieceSize/2;
  this.curState = 1;
  this.element = this.draw();
  this.element.className = className;
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
        innerPiece.className = 'colored'
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
          childnodes[i].className += ' fixed';
        }

        if (piece.reachedTop()) {
          gameOver();
        }
        else {
          dropNewPiece();
        }

        return;
    }

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
}

Piece.prototype.moveRight = function () {

  var clone = this.element.cloneNode(true);
  addClone(clone, this.top, this.left + innerPieceSize);

  if(!collisionCheck(clone)){

      this.left = this.left + innerPieceSize;
      this.element.style.left = this.left + 'px';

  }
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
  var gameboard = document.getElementById('gameboard');

  for(i = 0; i < childnodes.length; i++){

    if(childnodes[i].className === 'colored'){

      if(absolutePosition(childnodes[i]).top === absolutePosition(gameboard).top){
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

  Piece.call(this, 'o-piece');

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

  Piece.call(this, 'i-piece');

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

  Piece.call(this, 's-piece');

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

  Piece.call(this, 'z-piece');

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

  Piece.call(this, 'l-piece');

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

  Piece.call(this, 'j-piece');

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

  Piece.call(this, 't-piece');

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
