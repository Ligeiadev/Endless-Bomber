class Entity {
  constructor(x, y, width, height, drawWidth, drawHeight) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.drawWidth = drawWidth;
    this.drawHeight = drawHeight;
  }
  
  collide(entity) {
    let gap1x = this.x  - (entity.x + entity.width);
    let gap1y = this.y - (entity.y + entity.height);
    let gap2x = entity.x - (this.x + this.width);
    let gap2y = entity.y - (this.y + this.height);

    if (gap1x >= 0 || gap1y >= 0) {
      return false;
    }
    if (gap2x >= 0 || gap2y >= 0) {
      return false;
    }
    return true;
  }
}