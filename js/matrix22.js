var ImgWarper = ImgWarper || {};

ImgWarper.Matrix22 = function(N11, N12, N21, N22) {
  this.M11 = N11;
  this.M12 = N12;
  this.M21 = N21;
  this.M22 = N22;
};

ImgWarper.Matrix22.prototype.adjugate = function () {
  return new ImgWarper.Matrix22(
      this.M22, -this.M12, 
      -this.M21, this.M11);
};

ImgWarper.Matrix22.prototype.determinant = function () {
  return this.M11 * this.M22 - this.M12 * this.M21;
};

ImgWarper.Matrix22.prototype.multiply = function (m) {
  this.M11 *= m;
  this.M12 *= m;
  this.M21 *= m;
  this.M22 *= m;
  return this;
};

ImgWarper.Matrix22.prototype.addM = function(o) {
  this.M11 += o.M11;
  this.M12 += o.M12;
  this.M21 += o.M21;
  this.M22 += o.M22;
};

ImgWarper.Matrix22.prototype.inverse = function () {
  return this.adjugate().multiply(1.0 / this.determinant());
};
