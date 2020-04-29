var cols;
var rows;
var w = 10;
var grid;

var current;
var stack = [];

function setup() {
  createCanvas(400, 400);
  cols = floor(width / w);
  rows = floor(height / w);
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
}

function draw() {
  background(50);
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      grid[i][j].show();
    }
  }

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
    noLoop();
  }
}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  // TOP, RIGHT, BOTTOM, LEFT
  this.walls = [true, true, true, true];
  this, (visited = false);

  this.checkNeighbours = function () {
    var neighbours = [];

    console.log(i);
    console.log(j);
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
    fill(0, 255, 0, 100);
    rect(x, y, w, w);
  };

  this.show = function () {
    var x = this.i * w;
    var y = this.j * w;
    stroke(255);
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
      fill(255, 0, 255, 75);
      rect(x, y, w, w);
    }
  };
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
