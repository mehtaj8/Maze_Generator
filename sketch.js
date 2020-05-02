var cols;
var rows;
var w = 35;
var grid;

var current;
var stack = [];
var final;

var cnv;
var gamePlay = false;
var gameX = 0;
var gameY = 0;

function reset() {
  grid = new Array(cols);
  //frameRate(5);

  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      grid[i][j] = new Cell(i, j);
    }
  }

  current = grid[0][0];
  final = grid[cols - 1][rows - 1];
  gameX = 0;
  gameY = 0;
  gamePlay = false;
  loop();
}

function centerElements() {
  x = (windowWidth - width) / 2;
  y = (windowHeight - height) / 2;
  cnv.position(x, y);
  select("#reset").position(x + width, y);
}

function setup() {
  cnv = createCanvas(750, 750);
  centerElements();
  cols = floor(width / w);
  rows = floor(height / w);
  select("#reset").mousePressed(reset);
  reset();
}

function draw() {
  background(255);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }

  stroke(0);
  strokeWeight(3);
  noFill();
  rect(0, 0, 735, 735);

  current.visited = true;
  current.highlight();
  // STEP 1
  var next = current.checkNeighbours();
  if (next) {
    next.visited = true;
    // STEP 2
    stack.push(current);
    // STEP 3
    removeWalls(current, next);
    // STEP 4
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  } else {
    final.end();
    current.start();
    gamePlay = true;
    noLoop();
  }
}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  // TOP, RIGHT, BOTTOM, LEFT
  this.walls = [true, true, true, true];
  this.visited = false;

  this.checkNeighbours = function () {
    var neighbours = [];
    if (j - 1 >= 0) {
      var top = grid[i][j - 1];
    }
    if (i + 1 < cols) {
      var right = grid[i + 1][j];
    }
    if (j + 1 < rows) {
      var bottom = grid[i][j + 1];
    }
    if (i - 1 >= 0) {
      var left = grid[i - 1][j];
    }

    if (top && !top.visited) {
      neighbours.push(top);
    }
    if (right && !right.visited) {
      neighbours.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbours.push(bottom);
    }
    if (left && !left.visited) {
      neighbours.push(left);
    }

    if (neighbours.length > 0) {
      var r = floor(random(0, neighbours.length));
      return neighbours[r];
    } else {
      return undefined;
    }
  };

  this.highlight = function () {
    var x = this.i * w;
    var y = this.j * w;
    noStroke();
    fill(0, 0, 255, 200);
    rect(x + 1, y + 1, w - 2, w - 2);
  };

  this.start = function () {
    var x = this.i * w;
    var y = this.j * w;
    noStroke();
    fill(0, 255, 0, 200);
    rect(x + 1, y + 1, w - 2, w - 2);
  };

  this.end = function () {
    var x = this.i * w;
    var y = this.j * w;
    noStroke();
    fill(255, 0, 0);
    rect(x + 1, y + 1, w - 2, w - 2);
  };

  this.white = function () {
    var x = this.i * w;
    var y = this.j * w;
    noStroke();
    fill(255, 255, 255);
    rect(x + 1, y + 1, w - 2, w - 2);
  };

  this.show = function () {
    var x = this.i * w;
    var y = this.j * w;
    stroke(0);
    strokeWeight(1);
    if (this.walls[0]) {
      line(x, y, x + w, y);
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + w);
    }
    if (this.walls[2]) {
      line(x + w, y + w, x, y + w);
    }
    if (this.walls[3]) {
      line(x, y + w, x, y + w);
    }

    if (this.visited) {
      noStroke();
    }
  };
}

function keyPressed() {
  if (gamePlay) {
    if (keyCode === UP_ARROW) {
      console.log("UP");
      if (grid[gameX][gameY].walls[0] != true) {
        grid[gameX][gameY].white();
        gameY -= 1;
        grid[gameX][gameY].start();
      }
    } else if (keyCode === RIGHT_ARROW) {
      console.log("RIGHT");
      if (grid[gameX][gameY].walls[1] != true) {
        grid[gameX][gameY].white();
        gameX += 1;
        grid[gameX][gameY].start();
      }
    } else if (keyCode === DOWN_ARROW) {
      console.log("DOWN");
      if (grid[gameX][gameY].walls[2] != true) {
        grid[gameX][gameY].white();
        gameY += 1;
        grid[gameX][gameY].start();
      }
    } else if (keyCode === LEFT_ARROW) {
      console.log("LEFT");
      if (grid[gameX][gameY].walls[3] != true) {
        grid[gameX][gameY].white();
        gameX -= 1;
        grid[gameX][gameY].start();
      }
    }
  }
}

function removeWalls(a, b) {
  var x = a.i - b.i;
  if (x == 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x == -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }

  var y = a.j - b.j;
  if (y == 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y == -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}
