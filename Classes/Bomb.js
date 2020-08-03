class Bomb extends Entity {
  constructor(x, y, width, height, drawWidth, drawHeight, power, id) {
    super(x, y, width, height, drawWidth, drawHeight);
    this.power = power;
    this.id = id;
    this.time = 0;
    this.sprite = 'Sprites/Bomb/Bomb_f0';
    this.sprites = [];
    this.frame = 0;
  }
  
  draw() {
    this.time++;
    if (this.time % 22 == 0)
      this.frame++;
    if (this.frame >= 3)
      this.frame = 0;
    image(this.sprites[this.frame], this.x, this.y, this.drawWidth, this.drawHeight);
  }
  
  setup() {
    for (let i = 1; i <= 3; i++) {
      this.sprites.push(loadImage(this.sprite + i + '.png'));
    }
  }
  
}