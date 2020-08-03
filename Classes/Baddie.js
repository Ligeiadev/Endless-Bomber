class Baddie extends Bomber {
  constructor(x, y, width, height, drawWidth, drawHeight, id) {
    super(x, y, width, height, drawWidth, drawHeight, 4);
    this.speed = 0.5;
    this.id = id;
    this.totalFrames = 5;
    this.pickOrientation();    
  }
  
  draw() {
    this.time++;
    let img = this.sprites[this.orientation][this.frame];
    // DRAWING BOMBER
    if (this.live) {
      if (this.orientation == 3) { // MIRRORING RIGHT FACING SIDE SPRITES FOR LEFT
        push();
        scale(-1, 1);
        image(img, - this.x - this.drawWidth, this.y, this.drawWidth, this.drawHeight);
        pop();
      } else {
        image(img, this.x, this.y, this.drawWidth, this.drawHeight);
      }
    } else { // TINTING BADDIE RED IF KILLED (SAME AS EXPLODING BLOCKS)
      push();
      tint(250, this.tintLevel, this.tintLevel / 2, this.alphaLevel);
      this.time++;
      if (this.time % 4) {
        this.tintLevel += 4;
        this.alphaLevel -= 3;
      }
      if (this.orientation == 3) {
        push();
        scale(-1, 1);
        image(img, -this.x - this.drawWidth, this.y, this.drawWidth, this.drawHeight);
        pop();
      } else {
        image(img, this.x, this.y, this.drawWidth, this.drawHeight);
      }
      pop();
    } 
 
    push();
    fill(255, 0, 0, 100);
    rect(this.x, this.y , this.width, this.height);
    pop();    

  }
  
  pickOrientation() {
    this.orientation = Math.floor(Math.random() * 4);
  }
  
  setup() {
    this.sprites[0] = [];
    this.sprites[1] = [];
    this.sprites[2] = [];
    this.sprites[3] = [];
    for (let i = 0; i <= 5; i++) {
      this.sprites[0].push(loadImage('Sprites/Creep/Creep_B_f0' + i + '.png'));
      this.sprites[1].push(loadImage('Sprites/Creep/Creep_S_f0' + i + '.png'));
      this.sprites[2].push(loadImage('Sprites/Creep/Creep_F_f0' + i + '.png'));
      this.sprites[3].push(loadImage('Sprites/Creep/Creep_S_f0' + i + '.png'));
    }
    this.sprites[1].push(loadImage('Sprites/Creep/Creep_S_f06.png'));
    this.sprites[3].push(loadImage('Sprites/Creep/Creep_S_f06.png'));
  }
  
  update(orientation) {
    this.cycle();
    this.orientation = orientation;
    let speed = this.speed;
    while (speed > 0) {
      if (orientation == 0) {
        this.y -= speed;
        if (this.checkAllBlockCollisions()) {
          this.y += speed;
          speed -= 1;
        } else {
          this.y -= speed;
          return true;
        }
      } else if (orientation == 1) {
        this.x += speed;
        if (this.checkAllBlockCollisions()) {
          this.x -= speed;
          speed -= 1;
        } else {
          this.x += speed;
          return true;
        }
      } else if (orientation == 2) {
        this.y += speed;
        if (this.checkAllBlockCollisions()) {
          this.y -= speed;
          speed -= 1;
        } else {
          this.y += speed;
          return true;
        }
      } else if (orientation == 3) {
        this.x -= speed;
        if (this.checkAllBlockCollisions()) {
          this.x += speed;
          speed -= 1;
        } else {
          this.x -= speed;
          return true;
        }
      }
    }
    return false;
  }
  
  walkCycle() {
    if (!this.update(this.orientation)) {
      this.pickOrientation();
    }
  }
  
}

class BaddieLv1 extends Baddie {
  constructor(x, y, width, height, drawWidth, drawHeight) {
    super(x, y, width, height, drawWidth, drawHeight);
  }
  
}