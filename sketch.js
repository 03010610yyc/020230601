let player;
let bullets = [];
let enemies = [];
let score = 0;

function setup() {
  createCanvas(600, 500);
  player = new Player(width / 2, height - 50);
}

function draw() {
  background(250);

  player.display();
  player.update();

  // 更新並顯示子彈
  for (let bullet of bullets) {
    bullet.display();
    bullet.update();

    // 檢查子彈是否擊中敵人
    for (let enemy of enemies) {
      if (bullet.hits(enemy)) {
        bullet.setToRemove();
        enemy.setToRemove();
        score +=50
      }
    }
  }

  // 移除標記為待刪除的子彈和敵人
  bullets = bullets.filter((bullet) => !bullet.toRemove);
  enemies = enemies.filter((enemy) => !enemy.toRemove);

  // 更新並顯示敵人
  for (let enemy of enemies) {
    enemy.display();
    enemy.update();

    // 檢查敵人是否擊中玩家
    if (enemy.hits(player)) {
      gameOver();
    }
  }

  // 隨機新增敵人
  if (frameCount % 60 === 0) {
    let x = random(width);
    let y = -50;
    let speed = random(1, 3);
    let heartSize = random(50, 150);
    let enemy = new Enemy(x, y, speed, heartSize);
    enemies.push(enemy);

  }
    // 顯示分數
    fill(255);
    textSize(24);
    textAlign(RIGHT);
    text("得分 " + score, width - 20, 30);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    player.moveLeft();
  } else if (keyCode === RIGHT_ARROW) {
    player.moveRight();
  } else if (key === " ") {
    let bullet = new Bullet(player.x, player.y);
    bullets.push(bullet);
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.speed = 5;
  }

  display() {
    fill("#1d3557");
    noStroke()
    ellipse(this.x, this.y, this.width, this.height);
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.moveLeft();
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.moveRight();
    }
  }

  moveLeft() {
    this.x -= this.speed;
    this.x = constrain(this.x, 0, width - this.width);
  }

  moveRight() {
    this.x += this.speed;
    this.x = constrain(this.x, 0, width - this.width);
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.speed = 10;
    this.toRemove = false;
  }

  display() {
    fill("#ffc300");
    noStroke()
    ellipse(this.x, this.y, this.radius * 3, this.radius * 3);
  }

  update() {
    this.y -= this.speed;
    if (this.y < 0) {
      this.toRemove = true;
    }
  }

  hits(enemy) {
    let d = dist(this.x, this.y, enemy.x, enemy.y);
    return d < this.radius + enemy.size / 2;
  }

  setToRemove() {
    this.toRemove = true;
  }
}

class Enemy {
  constructor(x, y, speed, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.toRemove = false;
  }

  display() {
    if (!this.toRemove) {
      fill("#FAE0E4");
      stroke("#ff0a54");
      strokeWeight(4);
      beginShape();
      vertex(this.x, this.y - this.size / 4);
      bezierVertex(
        this.x + this.size / 2,
        this.y - this.size / 2,
        this.x + this.size / 2,
        this.y + this.size / 4,
        this.x,
        this.y + this.size / 2
      );
      bezierVertex(
        this.x - this.size / 2,
        this.y + this.size / 4,
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.x,
        this.y - this.size / 4
      );
      endShape(CLOSE);
    }
  }

  update() {
    this.y += this.speed;
    if (this.y > height + this.size) {
      this.toRemove = true;
    }
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < this.size / 2 + player.width / 2;
  }

  setToRemove() {
    this.toRemove = true;
  }
}

function gameOver() {
  noLoop();
  fill(255);
  textSize(40);
  textAlign(CENTER);
  text("Game Over", width / 2, height / 2);
}

// 開始遊戲
function startGame() {
  setup();
  loop();
}

// 重新開始遊戲
function restartGame() {
  player = null;
  bullets = [];
  enemies = [];
  clear();
  startGame();
}