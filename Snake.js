class Snake {
  constructor() {

    this.chunks = new Array(0);
    this.chunks.push(new Chunks());

    this.row = 30;
    this.column = 40;

    this.grid = new Array(this.column).fill(0).map(x => new Array(this.row).fill(0));

    this.field = document.createElement('div');
    this.field.className = 'field';
    document.body.appendChild(this.field);

    this.score = document.createElement('div');
    this.score.className = 'score';
    this.score.textContent = 'Score: ' + this.chunks.length;
    this.field.appendChild(this.score);

    for (let y = 0; y < this.row; y++) {
      for (let x = 0; x < this.column; x++) {
        this.grid[x][y] = document.createElement('div');
        this.grid[x][y].className = 'cell';
        this.grid[x][y].id = 'cell-x' + x + '-y' + y;
        this.field.appendChild(this.grid[x][y]);
      }
    }

    this.alive = true;
    this.direction = {
      inDir: 'none',
      dir: 'none',
      x: 0,
      y: 0
    }

    this.food = new Food();
    this.grid[this.food.x][this.food.y].className = 'cell food';

    document.addEventListener("keypress", (e) => {
      if ((e.key == 'w' || e.keyCode == 38) && this.direction.dir != 's') {
        this.direction.inDir = 'w';
      } else if ((e.key == 's' || e.keyCode == 40) && this.direction.dir != 'w') {
        this.direction.inDir = 's';
      } else if ((e.key == 'd' || e.keyCode == 39) && this.direction.dir != 'a') {
        this.direction.inDir = 'd';
      } else if ((e.key == 'a' || e.keyCode == 37) && this.direction.dir != 'd') {
        this.direction.inDir = 'a';
      } else if (e.key =='p') {
        this.direction.x = 0;
        this.direction.y = 0;
      } else if (e.key =='i') {
        for (let i = 0; i < 5; i++) this.chunks.push(new Chunks());
      }
    });

  }

  mainLoop() {

    this.mLoop = setInterval(() => {
      this.update();
    }, 100);

  }

  update() {

    this.direction.dir = this.direction.inDir;

    switch (this.direction.inDir) {
      case 'w':
        this.direction.x = 0;
        this.direction.y = -1;
        break;
      case 's':
        this.direction.x = 0;
        this.direction.y = 1;
        break;
      case 'd':
        this.direction.x = 1;
        this.direction.y = 0;
        break;
      case 'a':
        this.direction.x = -1;
        this.direction.y = 0;
        break;
    }

    this.score.textContent = 'Score: ' + this.chunks.length * 10;

    if (this.collidingWithFood()){
      this.chunks.push(new Chunks());
      this.food.goToRandom();
    }


    if (this.notInBundaries() || this.selfEating())
      this.alive = false;

    if (this.alive) {

      let y = this.chunks[0].y;
      let x = this.chunks[0].x;

      this.chunks[0].oldX = x;
      this.chunks[0].oldY = y;

      this.grid[x][y].className = 'cell';

      this.chunks[0].y += this.direction.y;
      this.chunks[0].x += this.direction.x;

      y = this.chunks[0].y;
      x = this.chunks[0].x;
      this.grid[x][y].className = 'cell chunks';

      for (let i = 1; i < this.chunks.length; i++) {
        y = this.chunks[i].y;
        x = this.chunks[i].x;

        this.chunks[i].oldX = x;
        this.chunks[i].oldY = y;

        this.grid[x][y].className = 'cell';

        this.chunks[i].y = this.chunks[i - 1].oldY;
        this.chunks[i].x = this.chunks[i - 1].oldX;

        y = this.chunks[i].y;
        x = this.chunks[i].x;
        this.grid[x][y].className = 'cell chunks';
      }

    } else {
      clearInterval(this.mLoop);
      this.lastWords();
    }

    this.grid[this.food.x][this.food.y].className = 'cell food';
  }

  notInBundaries() {
    let x = this.chunks[0].x + this.direction.x;
    let y = this.chunks[0].y + this.direction.y;

    if (x < 0 || x > this.column - 1 || y < 0 || y > this.row - 1) return true;

    return false;
  }

  selfEating() {
    let x = this.chunks[0].x + this.direction.x;
    let y = this.chunks[0].y + this.direction.y;

    for(let i = 1; i < this.chunks.length; i++) {
      if (this.chunks[i].x == x && this.chunks[i].y == y)
        return true;
    }

    return false;
  }

  collidingWithFood() {
    let x = this.chunks[0].x + this.direction.x;
    let y = this.chunks[0].y + this.direction.y;

    if (x == this.food.x && y ==this.food.y) return true;

    return false;
  }

  lastWords() {
    this.lWords = document.createElement('div');
    this.lWordsCaption = document.createElement('p');

    this.lWordsCaption.className = 'lWords';
    this.lWords.className = 'lWords';
    this.lWordsCaption.textContent = 'Dead';

    this.lWords.appendChild(this.lWordsCaption);
    this.field.appendChild(this.lWords);
  }

}

class Chunks {
  constructor() {
    this.x = 1;
    this.y = 1;
    this.oldX = 1;
    this.oldY = 1;
  }
}

class Food {
  constructor() {
    this.goToRandom();
  }

  goToRandom() {
    this.x = Math.floor(Math.random() * 29);
    this.y = Math.floor(Math.random() * 19);
  }

}
