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

ImgWarper.Point.prototype.cross = function (o) {
  return this.x * o.y - this.y * o.x;
};


ImgWarper.Point.prototype.cross3 = function (a, b, c) {
  return b.subtract(a).cross(c.subtract(a));
};

ImgWarper.Point.prototype.negate = function () {
  return new ImgWarper.Point(-1 * this.x, -1 * this.y);
};

ImgWarper.Point.prototype.length = function () {
  return (Math.sqrt((this.x * this.x) + (this.y * this.y)) || 0);
};

ImgWarper.Point.prototype.ThisTransposeMultiplyOtherMultiplyThis = function (w) {
  return (new ImgWarper.Matrix22(
        this.x * this.x * w, this.x * this.y * w,
        this.y * this.x * w, this.y * this.y * w
        ));
};

ImgWarper.Point.prototype.ThisTransposeMultiplyOther = function (o) {
  return new ImgWarper.Matrix22(
      this.x * o.x, this.x * o.y,
      this.y * o.x, this.y * o.y
      );
};

ImgWarper.Point.prototype.multiplyOtherTranspose = function (o) {
  return this.x * o.x + this.y * o.y;
};

ImgWarper.Point.prototype.multiply = function (o) {
  return new ImgWarper.Point(
      this.x * o.M11 + this.y * o.M21, this.x * o.M12 + this.y * o.M22);
};

ImgWarper.Point.prototype.multiply_d = function (o) {
  return new ImgWarper.Point(this.x * o, this.y * o);
};

ImgWarper.Point.prototype.average = function (p) {
  var x = 0;
  var y = 0;
  for (i = 0; i < p.length; i++) {
    x += p[i].x;
    y += p[i].y;
  }
  x /= p.length;
  y /= p.length;
  return new ImgWarper.Point(x, y);
};

ImgWarper.Point.average_pd = function (p, w) {
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

ImgWarper.Point.TriangleContainsPoint = function (a, b, c, o) {
  var xa, xb, xc, ya, yb, yc, d, d1, d2;

  xa = a.x - o.x;
  ya = a.y - o.y;
  xb = b.x - o.x;
  yb = b.y - o.y;
  xc = c.x - o.x;
  yc = c.y - o.y;

  d = xb * yc - xc * yb;
  d1 = -xa * yc - xc * -ya;
  d2 = xb * -ya - -xa * yb;

  return [d1 / d, d2 / d];
};

ImgWarper.Point.prototype.InfintyNormDistanceTo = function (o) {
  return Math.max(Math.abs(this.x - o.x), Math.abs(this.y - o.y));
}

ImgWarper.Point.prototype.equals = function (o) {
  return ((this.x == o.x) && (this.y == o.y));
};

ImgWarper.Point.prototype.orthogonal = function () {
  return new ImgWarper.Point(-this.y, this.x);
};

ImgWarper.Point.prototype.divide = function (mus) {
  return this.multiply_d(1.0 / mus);
};

ImgWarper.Grid = function(p0, p1, p2, p3) {
  this.p = [p0, p1, p2, p3];
};
  
ImgWarper.Grid.prototype.contains = function(i, j) {
  this.q = new ImgWarper.Point(i, j);
  x1 = Point.cross3(this.p[0], this.p[1], this.q);
  x2 = Point.cross3(this.p[1], this.p[2], this.q);
  x3 = Point.cross3(this.p[2], this.p[3], this.q);
  x4 = Point.cross3(this.p[3], this.p[0], this.q);
  if ( x1 * x2 < 0 ) return false;
  if ( x1 * x3 < 0 ) return false;
  if ( x1 * x4 < 0 ) return false;
  return true;
};
