class Block extends Entity {
  constructor(x, y, width, height, drawWidth, drawHeight, sprite) {
    super(x, y, width, height, drawWidth, drawHeight);
    this.sprite = sprite;
    this.img = null;
  }
  
  draw() {
    image(this.img, this.x, this.y, this.width, this.height);
  }
  
  setup() {
    this.img = loadImage(this.sprite); 
  }
}

class ExplodingTile extends Block {
  constructor(block) {
    super(block.x, block.y, block.width, block.height, block.drawWidth, block.drawHeight, block.sprite);
    this.time = 0;
    this.tintLevel = 0;
    this.alphaLevel = 250;
  }
  
  draw() {
    this.time++;
    if (this.time % 4) {
      this.tintLevel += 4;
      this.alphaLevel -= 3;
    }
    push();
    tint(250, this.tintLevel, this.tintLevel/2, this.alphaLevel);
    image(this.img, this.x, this.y, this.width, this.height);
    pop();
  }
}
  