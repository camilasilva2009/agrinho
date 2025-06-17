let player;
let foods = [];
let score = 0;
let message = '';
let gameState = 'start'; // estados: 'start', 'playing', 'gameover'

let imgHealthy, imgUnhealthy;

function preload() {
  imgHealthy = loadImage('11682133-removebg-preview.png'); 
  imgUnhealthy = loadImage('pngtree-food-can-or-tin-icon-vector-thin-symbol-vector-png-image_38990536-removebg-preview.png');
}

function setup() {
  createCanvas(600, 400);
  player = new Player();

  for (let i = 0; i < 5; i++) {
    foods.push(new Food());
  }
}

function draw() {
  background(220);

  if (gameState === 'start') {
    showStartScreen();
  } else if (gameState === 'playing') {
    playGame();
  } else if (gameState === 'gameover') {
    showGameOverScreen();
  }
}

function keyPressed() {
  if (gameState === 'start' && keyCode === ENTER) {
    gameState = 'playing';
  } else if (gameState === 'gameover' && keyCode === ENTER) {
    resetGame();
  }
}

function showStartScreen() {
  textAlign(CENTER);
  fill(0);
  textSize(32);
  text('O Sabor do Campo', width / 2, height / 2 - 40);
  textSize(16);
  text('Use as setas ← → para mover', width / 2, height / 2);
  text('Coma alimentos saudáveis e evite os industrializados!', width / 2, height / 2 + 30);
  text('Pressione ENTER para começar', width / 2, height / 2 + 60);
}

function playGame() {
  player.show();
  player.move();

  for (let f of foods) {
    f.move();
    f.show();

    if (player.eats(f)) {
      if (f.isHealthy) {
        score++;
        player.happy();
        message = 'Ótima escolha!';
      } else {
        score--;
        player.sad();
        message = 'Ops! Melhor evitar isso.';
      }
      f.reset();
    }
  }

  fill(0);
  textSize(20);
  text('Pontuação: ' + score, 10, 30);
  text(message, 10, 60);

  if (score >= 10) {
    gameState = 'gameover';
  }
}

function showGameOverScreen() {
  textAlign(CENTER);
  fill(0);
  textSize(28);
  text('Parabéns!', width / 2, height / 2 - 20);
  textSize(18);
  text('Você valoriza o campo e a saúde!', width / 2, height / 2 + 10);
  text('Pontuação final: ' + score, width / 2, height / 2 + 40);
  text('Pressione ENTER para jogar novamente', width / 2, height / 2 + 70);
}

function resetGame() {
  score = 0;
  message = '';
  gameState = 'playing';
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 30;
    this.size = 40;
    this.mood = 'neutro';
  }

  show() {
    fill(255, 204, 0);
    ellipse(this.x, this.y, this.size);

    fill(0);
    ellipse(this.x - 10, this.y - 5, 5);
    ellipse(this.x + 10, this.y - 5, 5);

    noFill();
    stroke(0);
    if (this.mood === 'feliz') {
      arc(this.x, this.y + 5, 20, 10, 0, PI);
    } else if (this.mood === 'triste') {
      arc(this.x, this.y + 15, 20, 10, PI, 0);
    }
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= 5;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += 5;
    }
    this.x = constrain(this.x, this.size / 2, width - this.size / 2);
  }

  eats(food) {
    let d = dist(this.x, this.y, food.x, food.y);
    return d < (this.size + food.size) / 2;
  }

  happy() {
    this.mood = 'feliz';
  }

  sad() {
    this.mood = 'triste';
  }
}

class Food {
  constructor() {
    this.x = random(width);
    this.y = random(-200, -50);
    this.size = 40;
    this.speed = random(2, 5);
    this.isHealthy = random() < 0.5;
  }

  move() {
    this.y += this.speed;
    if (this.y > height + this.size) {
      this.reset();
    }
  }

  show() {
    if (this.isHealthy) {
      image(imgHealthy, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    } else {
      image(imgUnhealthy, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
  }

  reset() {
    this.x = random(width);
    this.y = random(-200, -50);
    this.speed = random(2, 5);
    this.isHealthy = random() < 0.5;
  }
}
