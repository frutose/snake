var grid = [];
var scl = 20;
var snake;
var food = false;
var tail = [];

function setup() {
  createCanvas(420, 420);
  //noStroke();
  for(let j = 0; j < height/scl; j++) {
    grid[j] = []; // j -> cols
    for(let i = 0; i < width/scl; i++) {
      grid[j][i] = new Cell(i, j); // i -> rows
    }
  }
  snake = new Snake(10, 10);
  let x = floor(random(width / scl));
  let y = floor(random(height / scl));
  grid[y][x].food = true;
}

function draw() {
  background(0);
  snake.updateTail();
  snake.edges();
  snake.move();
  for(let j = 0; j < height/scl; j++) {
    for(let i = 0; i < width/scl; i++) {
      grid[j][i].feed();
      grid[j][i].show();
    }
  }
  if(tail[0]) {
    tail[0].show();  
  }
  if(dead()) {
    noLoop();
  }
  snake.show();
}

function keyPressed() {
  if(keyCode == LEFT_ARROW) {
    if(tail[0] === undefined || 
       snake.i - snake.loc[0].i < 0 ||
       snake.i === snake.loc[0].i) {
    snake.moveL = true;
    snake.moveR = false;
    snake.moveU = false;
    snake.moveD = false;
    }
  }
  if(keyCode == RIGHT_ARROW) {
    if(tail[0] == undefined || 
       snake.i - snake.loc[0].i > 0 ||
       snake.i === snake.loc[0].i
       ) {
      snake.moveL = false;
      snake.moveR = true;
      snake.moveU = false;
      snake.moveD = false;
    }
  }
  if(keyCode == UP_ARROW) {
    if(tail[0] === undefined || 
       snake.j - snake.loc[0].j < 0 ||
       snake.j === snake.loc[0].j) {
      snake.moveL = false;
      snake.moveR = false;
      snake.moveU = true;
      snake.moveD = false;
    }
  }
  if(keyCode == DOWN_ARROW) {
    if(tail[0] === undefined || 
       snake.j - snake.loc[0].j > 0 ||
       snake.j === snake.loc[0].j) {
      snake.moveL = false;
      snake.moveR = false;
      snake.moveU = false;
      snake.moveD = true;
    }
  }
}












class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.food = false;
  }
  
  show() {
    noFill();
    rect(this.i*scl, this.j*scl, scl, scl);
    if(this.food) {
      fill(100, 180, 250);
      ellipse((this.i + 0.5)*scl, (this.j + 0.5)*scl, 0.65 * scl);
    }
  }
  
  feed() {
    if(this.food) {
      if(snake.i == this.i && snake.j == this.j) {
        this.food = false;
        addFood();
        let newI, newJ;
        if(tail.length === 0) {
          if(snake.moveU) {
            newI = snake.i;
            newJ = snake.j + 1;
            tail.push(new Tail(newI, newJ));
          }
          if(snake.moveD) {
            newI = snake.i;
            newJ = snake.j - 1;
            tail.push(new Tail(newI, newJ));
          }
          if(snake.moveL) {
            newI = snake.i + 1;
            newJ = snake.j;
            tail.push(new Tail(newI, newJ));
          }
          if(snake.moveR) {
            newI = snake.i - 1;
            newJ = snake.j;
            tail.push(new Tail(newI, newJ));
          }
          snake.loc.push({
              i: newI,
              j: newJ
            });
        } else {
          let lastIndex = tail.length - 1;
          if(snake.moveU) {
            tail.push(
              new Tail(tail[lastIndex].i, tail[lastIndex].j + 1)
            );
          }
          if(snake.moveD) {
            tail.push(
              new Tail(tail[lastIndex].i, tail[lastIndex].j - 1)
            );
          }
          if(snake.moveL) {
            tail.push(
              new Tail(tail[lastIndex].i + 1, tail[lastIndex].j)
            );
          }
          if(snake.moveR) {
            tail.push(
              new Tail(tail[lastIndex].i - 1, tail[lastIndex].j)
            );
          }
        }
      }
    }
  }

}










class Snake {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.moveL = false;
    this.moveR = false;
    this.moveU = false;
    this.moveD = false;
    this.loc = [];
  }
  
  show() {
    fill(0, 100, 0);
    rect(this.i*scl, this.j*scl, scl, scl);
  }
  
  move() {
    if(frameCount % 5 == 1) {
      if(this.moveL) {
        this.i--;
      } else if(this.moveR) {
          this.i++;
      } else if(this.moveU) {
          this.j--;
      } else if(this.moveD) {
          this.j++;
      }
    }
  }
  
  updateTail() {
    let location = {
        i: this.i,
        j: this.j
      };
    if (frameCount % 5 === 1) {
      this.loc.unshift(location);
      if(this.loc.length > tail.length) {
        this.loc.pop();
      }
    }
  }
  
  edges() {
    if(this.i > width/scl - 1) {
      this.i = 0;
    }
    if(this.i < 0) {
      this.i = width/scl - 1;
    }
    if(this.j > height/scl - 1) {
      this.j = 0;
    }
    if(this.j < 0) {
      this.j = height/scl - 1;
    }
  }
  
}

class Tail {
  constructor(i, j) {
    this.i = i;
    this.j = j;
  }
  
  show() {
    fill(255);
    for(let k = 0; k < snake.loc.length; k++) {
      let red = k / 2;
      let green = 100 + (155 / snake.loc.length) * (k + 1);
      let blue = k;
      push();
      fill(red, green, blue);
      rect(snake.loc[k].i*scl, snake.loc[k].j*scl, scl, scl);
      pop()
    } 
  }
  
}




function addFood() {
  let occupied = true;
  let x, y;
  while(occupied) {
    occupied = false
    x = floor(random(width / scl));
    y = floor(random(height / scl));
    for(let k = 0; k < snake.loc.length; k++) {
      if (
        x == snake.i && y == snake.j ||
        x == snake.loc[k].i && y == snake.loc[k].j
         )
        occupied = true;
    }
  }
  grid[y][x].food = true;
}

function dead() {
  for(let loc of snake.loc) {
    if(snake.i === loc.i && snake.j === loc.j) {
      return true;
    }
  }
}