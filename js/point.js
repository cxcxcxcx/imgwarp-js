var ImgWarper = ImgWarper || {};

ImgWarper.Point = function (x, y) {
  this.x = x;
  this.y = y;
};

ImgWarper.Point.prototype.add = function (o) {
  return new ImgWarper.Point(this.x + o.x, this.y + o.y);
};

ImgWarper.Point.prototype.subtract = function (o) {
  return new ImgWarper.Point(this.x - o.x, this.y - o.y);
};

// w * [x; y] * [x, y]
ImgWarper.Point.prototype.wXtX = function (w) {
  return (new ImgWarper.Matrix22(
        this.x * this.x * w, this.x * this.y * w,
        this.y * this.x * w, this.y * this.y * w
        ));
};

// Dot product
ImgWarper.Point.prototype.dotP = function (o) {
  return this.x * o.x + this.y * o.y;
};

ImgWarper.Point.prototype.multiply = function (o) {
  return new ImgWarper.Point(
      this.x * o.M11 + this.y * o.M21, this.x * o.M12 + this.y * o.M22);
};

ImgWarper.Point.prototype.multiply_d = function (o) {
  return new ImgWarper.Point(this.x * o, this.y * o);
};

ImgWarper.Point.weightedAverage = function (p, w) {
  var i;
  var sx = 0,
      sy = 0,
      sw = 0;

  for (i = 0; i < p.length; i++) {
    sx += p[i].x * w[i];
    sy += p[i].y * w[i];
    sw += w[i];
  }
  return new ImgWarper.Point(sx / sw, sy / sw);
};

ImgWarper.Point.prototype.InfintyNormDistanceTo = function (o) {
  return Math.max(Math.abs(this.x - o.x), Math.abs(this.y - o.y));
}
