var ImgWarper = ImgWarper || {};

ImgWarper.Matrix22 = function(N11, N12, N21, N22) {
  this.M11 = N11;
  this.M12 = N12;
  this.M21 = N21;
  this.M22 = N22;
};

ImgWarper.Matrix22.prototype.EPS = 0.00001;

ImgWarper.Matrix22.prototype.Matrix_p = function (a, b) {
  return new ImgWarper.Matrix22(a.x, a.y, b.x, b.y);
};


ImgWarper.Matrix22.prototype.adjugate = function () {
  return new ImgWarper.Matrix22(
      this.M22, -1 * this.M12, -1 * this.M21, this.M11);
};

ImgWarper.Matrix22.prototype.determinant = function () {
  return this.M11 * this.M22 - this.M12 * this.M21;
};

ImgWarper.Matrix22.prototype.divide = function (d) {
  return this.multiply(1.0 / d);
};

ImgWarper.Matrix22.prototype.multiply = function (m) {
  return new ImgWarper.Matrix22(
      this.M11 * m, this.M12 * m,
      this.M21 * m, this.M22 * m
      );
};

ImgWarper.Matrix22.prototype.multiply_m = function (o) {
  return new ImgWarper.Matrix22(
      this.M11 * o.M11 + this.M12 * o.M21, this.M11 * o.M12 + this.M12 * o.M22,
      this.M21 * o.M11 + this.M22 * o.M21, this.M21 * o.M12 + this.M22 * o.M22
      );
};

ImgWarper.Matrix22.prototype.transpose = function () {
  return new ImgWarper.Matrix22(
      this.M11, this.M21,
      this.M12, this.M22
      );
};

ImgWarper.Matrix22.prototype.add_m = function (o) {
  return new ImgWarper.Matrix22(
      this.M11 + o.M11, this.M12 + o.M12,
      this.M21 + o.M21, this.M22 + o.M22
      );
};

ImgWarper.Matrix22.prototype.inverse = function () {
  var dm = this.determinant();
  adj = this.adjugate();
  return adj.divide(dm);
};

ImgWarper.Matrix22.prototype.equals = function (o) {
  return Math.abs(this.M11 - o.M11) < this.eps && 
    Math.abs(this.M12 - o.M12) < this.eps && 
    Math.abs(this.M21 - o.M21) < this.eps && 
    Math.abs(this.M22 - o.M22) < this.eps;
};

var ZERO_M = new ImgWarper.Matrix22(0, 0, 0, 0);
var E = new ImgWarper.Matrix22(1, 0, 0, 1);
