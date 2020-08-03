let bomber;
let backgroundTiles = [];
let tiles = [];
let map, nMap;
let explodingTiles = [];
let bombs = [],
  placedBomb = false,
  bombWaitList = [];
let flames = [];
let baddies = [];
let gameState;
let userHasClicked = false;

let backgroundSprite = 'Sprites/Block/BackgroundTile.png';
let solidSprite = 'Sprites/Block/SolidBlock.png';
let breakableSprite = 'Sprites/Block/ExplodableBlock.png';

// we need to reset variables so previous games don't spill over
function initializeVariables() {
  backgroundTiles = [];
  tiles = [];
  map = null;
  nMap = null;
  explodingTiles = [];
  bombs = [];
  placedBomb = false; 
  bombWaitList = [];
  flames = [];
  baddies = [];
  
  for (let i = 0; i < 15; i++) {
    tiles[i] = [];
    tiles[i][14] = null;
  }
}

function setup() {
  createCanvas(750, 750);
  
  initializeVariables();
  setupStage();
  
  gameState = 'run stage'; 
}


function draw() {
  background(0);
  if (gameState == 'main menu') {
    mainMenu();
  }
  else if (gameState == 'run stage') {
    runStage();
  }
  else if (gameState == 'game over') {
    gameOver();
  }
}


function mainMenu() {
  push();
  textSize(70);
  textAlign(CENTER);
  fill(255, 255, 255);
  text('Endless Bomber', 375, 150);
  
  let startButton = new Button(300, 250, 150, 60, 'Start Game', 26);
  startButton.draw();
  
  let gameOverButton = new Button(300, 320, 150, 60, 'Game Over', 26);
  gameOverButton.draw();
  
  if (startButton.mouseHovering() && userHasClicked) {
    setupStage();
    gameState = 'run stage';
  }
  
  if (gameOverButton.mouseHovering() && userHasClicked) {
    gameState = 'game over';
  }
  
  pop();
  userHasClicked = false;
  
}

function gameOver() {
  push();
  textSize(50);
  textAlign(CENTER);
  fill(105, 105, 105);
  text('GAME OVER', 375, 150);
  
  let retryButton = new Button(300, 250, 150, 60, 'Retry', 26);
  retryButton.draw();
  
  let menuButton = new Button(300, 320, 150, 60, 'Main Menu', 20);
  menuButton.draw();
  
  if (retryButton.mouseHovering() && userHasClicked) {
    setupStage();
    gameState = 'run stage';
  }
  
  if (menuButton.mouseHovering() && userHasClicked) {
    gameState = 'main menu';
  }
  
  pop();
  userHasClicked = false;
  
}

function setupStage() {
  
  initializeVariables();
  
  bomber = new Bomber(50, 50, 50, 50, 50, 100);
  bomber.setup();
  
  map = buildMap();
  nMap = populateMap(map);
    
  let baddieCounter = 0;
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      backgroundTiles.push(new Block(i * 50, j * 50, 50, 50, 50, 50, backgroundSprite));
      backgroundTiles[i * 15 + j].setup();
      if (map[i][j] == 'w') {
        tiles[i][j] = new Block(i * 50, j * 50, 50, 50, 50, 50, solidSprite);
        tiles[i][j].setup();
      } else if (map[i][j] == 'o') {
        tiles[i][j] = new Block(i * 50, j * 50, 50, 50, 50, 50, breakableSprite);
        tiles[i][j].setup();
      } else if (nMap[i][j] == 'e') {
        baddies.push(new Baddie(i * 50, j * 50, 50, 50, 50, 50, 'baddie' + baddieCounter));
        baddies[baddies.length - 1].setup();
        baddieCounter++;
      }
    }
  }
  
}

function runStage() {
  
  backgroundTiles.forEach(tile => tile.draw());
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if (tiles[i][j] != null) {
        tiles[i][j].draw();
      }
    }
  }
  
  // EXPLODING BOMBS 
  for (let i = 0; i < bombs.length; i++) {
    if (bombs[i].time > 200) {
      explodeBomb(bombs[i]);
      if (bombs[i].id == 'bomber')
        bomber.bombCounter--;
      else {
        baddies.forEach(function(baddie) {
          if (bombs[i].id == baddie.id)
            baddie.bombCounter--;
        });
      }
      bombs.splice(i, 1);
    }
  }

  // DRAWING EXPLODING TILES
  for (let i = 0; i < explodingTiles.length; i++) {
    let tile = explodingTiles[i];
    if (tile.time > 40) {
      explodingTiles.splice(i, 1);
    }
    tile.draw();
  }

  // EXHAUSTING FLAMES & CHECKING FLAME COLLISION WITH CHARACTERS
  for (let i = 0; i < flames.length; i++) {
    // checking collision with bomber
    if (bomber.live && bomber.collide(flames[i])) {
      bomber.time = 0;
      bomber.live = false;
    }
    // checking collision with baddies
    baddies.forEach(function(baddie) {
      if (baddie.live && baddie.collide(flames[i])) {
        baddie.time = 0;
        baddie.live = false;
      }
    });
    if (flames[i].time > 40) {
      flames.splice(i, 1);
    }
  }
  
  // CHECKING FOR BOMBER COLLISION WITH BADDIES
  baddies.forEach(function(baddie) {
    if (bomber.live && bomber.collide(baddie)) {
      bomber.time = 0;
      bomber.live = false;
    }
  });

  bombs.forEach(bomb => bomb.draw());

  flames.forEach(flame => flame.draw());

  // DRAWING BADDIES CHECKING FOR BADDIES KILLED
  baddies.forEach(baddie => {if (baddie.live) baddie.walkCycle()});
  
  for (let i = 0; i < baddies.length; i++) {
    if (!baddies[i].live) {
      if (baddies[i].time > 40) {
        baddies.splice(i, 1);
      } else
        baddies[i].draw();
    } else
      baddies[i].draw();
  }

  // DRAWING BOMBER & CHECKING FOR GAME OVER 
  if (!bomber.live) {
    if (bomber.time > 150) {
      gameState = 'game over';
    } else {
      bomber.draw();
    }
  } else {
    bomber.draw();
  }


  if (bomber.live) {
    // MOVING BOMBER
    if (keyIsDown(UP_ARROW)) {
      bomber.update(0);
    } else if (keyIsDown(RIGHT_ARROW)) {
      bomber.update(1);
    } else if (keyIsDown(DOWN_ARROW)) {
      bomber.update(2);
    } else if (keyIsDown(LEFT_ARROW)) {
      bomber.update(3);
    }
  
    // PLACING BOMBS
    if (keyIsDown(32)) {
      if (placedBomb == false) {
        if (bomber.bombCounter < bomber.bombs) {
          let x = bomber.x;
          let y = bomber.y + bomber.height / 4;
          // NEED TO FIX THIS CALCULATION!!!
          x = Math.floor(x / 50) * 50;
          y = Math.floor(y / 50) * 50;
          let bomb = new Bomb(x, y, 50, 50, 50, 50, bomber.power, 'bomber');
          bomb.setup();
          bombs.push(bomb);
          placedBomb = true;
          bomber.bombCounter++;
        }
      }
    }
  }
  
  push();
  if (placedBomb) {
    fill('red');
  } 
  else {
    fill('green');
  }
  rect(20, 20, 20, 20);
  pop();
}

// UTILITY FUNCTIONS

function mouseClicked() {
  userHasClicked = true;
}

function checkBlockCollision(entity) {
  // since we'll perform this check twice I'll wrap this part in a lambda function (IIFE)
  const lambdaCheckCollision = (x, y) => {
    let tile = tiles[x][y];
    if (tile != null && entity.collide(tile)) {
      return [x, y];
    }
    if (x > 0) {
      tile = tiles[x - 1][y];
      if (tile != null && entity.collide(tile)) {
        return [x - 1, y];
      }
    } 
    if (x < 14) {
      tile = tiles[x + 1][y];
      if (tile != null && entity.collide(tile))
        return [x + 1, y];
    }
    if (y > 0) {
      tile = tiles[x][y - 1];
      if (tile != null && entity.collide(tile))
        return [x, y - 1];
    }
    if (y < 14) {
      tile = tiles[x][y + 1];
      if (tile != null && entity.collide(tile))
        return [x, y + 1];
    }
    return null;
  }
  let entityGridX = Math.floor(entity.x / 50); 
  let entityGridY = Math.floor(entity.y / 50);
  let check = lambdaCheckCollision(entityGridX, entityGridY);
  if (check != null) return check;
  entityGridX = Math.ceil(entity.x / 50); 
  entityGridY = Math.ceil(entity.y / 50);
  check = lambdaCheckCollision(entityGridX, entityGridY);
  if (check != null) return check;
  return null;
}

function checkBombCollisionBaddie(entity) {
  let i = 0;
  // check collision with all bombs
  for (; i < bombs.length; i++) {
    if (entity.collide(bombs[i])) {
      return true;
    }
  }
  // note: we still need to check if player has put the bomb directly below the baddie! 
}

function checkBombCollisionBomber(entity) {
  let last = bombs.length - 1;
  if (placedBomb) {
    if (!entity.collide(bombs[last])) {
      placedBomb = false;
    }
  } else {
    if (bombs[last] != null && entity.collide(bombs[last])) {
      return true;
    }
  }
  if (bombs.length > 1) {
    for (let i = 0; i < last - 1; i++) {
      if (entity.collide(bombs[i])) {
        return true;
      }
    }
  }
  return false;
}
 
function explodeBomb(bomb) {

  flames.push(new Flame(bomb.x, bomb.y, 50, 50, 50, 50));
  flames[flames.length - 1].setup();
  let flame;
  for (let direction = 0; direction < 4; direction++) {
    for (let i = 1; i <= bomb.power; i++) {
      // for each direction we create a flame and test for collisions.
      // if flame is validated buildFlame() will push it into the list for drawing.
      // if buildFlame() returns false the flame was not validated.
      if (direction == 0)
        flame = new Flame(bomb.x, bomb.y - 50 * i, 50, 50, 50, 50);
      else if (direction == 1)
        flame = new Flame(bomb.x + 50 * i, bomb.y, 50, 50, 50, 50);
      else if (direction == 2)
        flame = new Flame(bomb.x, bomb.y + 50 * i, 50, 50, 50, 50);
      else if (direction == 3)
        flame = new Flame(bomb.x - 50 * i, bomb.y, 50, 50, 50, 50);
      if (!buildFlame(flame))
        break;
    }
  }
}

function buildFlame(flame) {

  // breaking blocks if touching flames
  let coordinates = checkBlockCollision(flame);
  if (coordinates != null){
    // if flames touch a breakable tile, destroy it and explode it. Stop flames.
    if (map[coordinates[0]][coordinates[1]] == 'o') {
      map[coordinates[0]][coordinates[1]] = ' ';
      let tempTile = tiles[coordinates[0]][coordinates[1]];
      tiles[coordinates[0]][coordinates[1]] = null;
      tempTile = new ExplodingTile(tempTile);
      tempTile.setup();
      explodingTiles.push(tempTile);
    }
    return false;
  }

  // if flames touch a bomb, explode bomb and stop flames.
  for (let i = 0; i < bombs.length; i++) {
    if (flame.collide(bombs[i])) {
      bombs[i].time = 201; // this does the trick neatly
      return false;
    }
  }

  // everything else ok, create flame
  flame.setup();
  flames.push(flame);
  return true;
}

function buildMap() {
  let map = [];
  map.push('wwwwwwwwwwwwwww');
  map.push('w             w');
  map.push('w w w w w w w w');
  map.push('w             w');
  map.push('w w w w w w w w');
  map.push('w             w');
  map.push('w w w w w w w w');
  map.push('w             w');
  map.push('w w w w w w w w');
  map.push('w             w');
  map.push('w w w w w w w w');
  map.push('w             w');
  map.push('w w w w w w w w');
  map.push('w             w');
  map.push('wwwwwwwwwwwwwww');
  for (let i = 0; i < 15; i++) {
    map[i] = map[i].split('');
  }

  for (let i = 1; i <= 13; i++) {
    for (let j = 1; j <= 13; j++) {
      if (i % 2 == 0 && j % 2 == 0)
        continue;
      if (i == 1 && j < 3)
        continue;
      else if (i == 2 && j == 1)
        continue;
      else {
        if (Math.random() < 0.5) {
          map[i][j] = 'o';
        }
      }
    }
  }
  return map;
}

function populateMap(map) {
  let cMap = [];
  cMap.push('ccccccccccccccc');
  for (let i = 0; i < 6; i++) {
    cMap.push('c             c');
    cMap.push('c c c c c c c c');
  }
  cMap.push('c             c');
  cMap.push('ccccccccccccccc');
  for (let i = 0; i < 15; i++) {
    cMap[i] = cMap[i].split('');
  }
  let nMap = [];
  map.forEach(line => nMap.push(Array.from(line)));
  let regions = [];
  let coordinates = [];
  for (let i = 13; i >= 1; i--) {
    for (let j = 13; j >= 1; j--) {
      if (cMap[i][j] == 'c')
        continue;
      else {
        let length = checkRegionLength(i, j, cMap, nMap, coordinates);
        if (length > 2) {
          regions.push(coordinates);
        }
      }
    }
  }
  
  let enemies = 0, k = 0, position;
  if (regions.length <= 4) {
    while (enemies < 4) {
      position = regions[k][~~(Math.random() * regions[k].length)];
      nMap[position[0]][position[1]] = 'e';
      enemies++;
      if (k >= regions.length) k = 0;
      else k++;
    }
  } else {
    while (enemies < 4) {
      for (let i = 0; i < 4; i++) {
        position = regions[i][~~(Math.random() * regions[i].length)];
        nMap[position[0]][position[1]] = 'e';
        enemies++;        
      }
    }
  }
  
  for (let i = 1; i <= 13; i++) {
    for (let j = 1; j <= 13; j++) {
      if (nMap[i][j] == 'o' && Math.random() < 0.059) {
        nMap[i][j] = 'p';
      }
    }
  }
  
  return nMap;
}

function checkRegionLength(i, j, cMap, nMap, coordinates) {
  if (cMap[i][j] == 'c')
    return 0;
  cMap[i][j] = 'c';
  let length = 1;
  for (let m = -1; m <= 1; m += 2) {
    if (nMap[i + m][j] == ' ' && cMap[i + m][j] == ' ') {
      length += checkRegionLength(i + m, j, cMap, nMap, coordinates);
      coordinates.push([i + m, j]);
    }
  }
  for (let m = -1; m <= 1; m += 2) {
    if (nMap[i][j + m] == ' ' && cMap[i][j + m] == ' ') {
      length += checkRegionLength(i, j + m, cMap, nMap, coordinates);
      coordinates.push([i, j + m]);
    }
  }
  return length;
}