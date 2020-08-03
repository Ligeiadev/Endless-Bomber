class Button {
  constructor(x, y, width, height, text, fontSize) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.fontSize = fontSize;
  }
  
  mouseHovering() {
    if (mouseX >= this.x && mouseX <= this.x + this.width) {
      if (mouseY >= this.y && mouseY <= this.y + this.height)
        return true;
    }
  }
  
  draw() {
    push();
    noFill();
    if (this.mouseHovering()) {
      stroke('blue');
      rect(this.x, this.y, this.width, this.height);
    } else {
      stroke('white');
      rect(this.x, this.y, this.width, this.height);
      noStroke();
    }
    textAlign(CENTER, CENTER);
    fill('white');
    textSize(this.fontSize);
    text(this.text, this.x + this.width / 2, this.y + this.height / 2);
    pop();
  }
  
}