var ImgWarper = ImgWarper || {};

ImgWarper.BilinearInterpolation = function(width, height, canvas){
  this.width = width;
  this.height = height;
  this.ctx = canvas.getContext("2d");
  this.imgTargetData = this.ctx.createImageData(this.width, this.height);
};

ImgWarper.BilinearInterpolation.prototype.generate = 
    function(source, fromGrid, toGrid) {
  this.imgData = source;
  for (var i = 0; i < toGrid.length; ++i) {
    this.fill(toGrid[i], fromGrid[i]);
  }
  return this.imgTargetData;
};

ImgWarper.BilinearInterpolation.prototype.fill = 
    function(sourcePoints, fillingPoints) {
  var i, j;
  var srcX, srcY;
  var x0 = fillingPoints[0].x;
  var x1 = fillingPoints[2].x;
  var y0 = fillingPoints[0].y;
  var y1 = fillingPoints[2].y;
  x0 = Math.max(x0, 0); 
  y0 = Math.max(y0, 0); 
  x1 = Math.min(x1, this.width - 1);
  y1 = Math.min(y1, this.height - 1);

  var xl, xr, topX, topY, bottomX, bottomY;
  var yl, yr, rgb, index;
  for (i = x0; i <= x1; ++i) {
    xl = (i - x0) / (x1 - x0);
    xr = 1 - xl;
    topX = xr * sourcePoints[0].x + xl * sourcePoints[1].x;
    topY = xr * sourcePoints[0].y + xl * sourcePoints[1].y;
    bottomX = xr * sourcePoints[3].x + xl * sourcePoints[2].x;
    bottomY = xr * sourcePoints[3].y + xl * sourcePoints[2].y;
    for (j = y0; j <= y1; ++j) {
      yl = (j - y0) / (y1 - y0);
      yr = 1 - yl;
      srcX = topX * yr + bottomX * yl;
      srcY = topY * yr + bottomY * yl;
      index = ((j * this.width) + i) * 4;
      if (srcX < 0 || srcX > this.width - 1 ||
          srcY < 0 || srcY > this.height - 1) {
        this.imgTargetData.data[index] = 255;
        this.imgTargetData.data[index + 1] = 255;
        this.imgTargetData.data[index + 2] = 255;
        this.imgTargetData.data[index + 3] = 255;
        continue;
      }
      var srcX1 = Math.floor(srcX);
      var srcY1 = Math.floor(srcY);
      var base = ((srcY1 * this.width) + srcX1) * 4;
      //rgb = this.nnquery(srcX, srcY);
      this.imgTargetData.data[index] = this.imgData[base];
      this.imgTargetData.data[index + 1] = this.imgData[base + 1];
      this.imgTargetData.data[index + 2] = this.imgData[base + 2];
      this.imgTargetData.data[index + 3] = this.imgData[base + 3];
    }
  }
};

ImgWarper.BilinearInterpolation.prototype.nnquery = function(x, y) {
  var x1 = Math.floor(x);
  var y1 = Math.floor(y);
  var base = ((y1 * this.width) + x1) * 4;
  return [
    this.imgData[base],
    this.imgData[base + 1],
    this.imgData[base + 2],
    this.imgData[base + 3]];
};

ImgWarper.BilinearInterpolation.prototype.query = function(x, y) {
  var x1,x2,y1,y2;
  x1 = Math.floor(x); x2 = Math.ceil(x);
  y1 = Math.floor(y); y2 = Math.ceil(y);

  var c = [0, 0, 0, 0];   // get new RGB

  var base11 = ((y1 * this.width) + x1) * 4;
  var base12 = ((y2 * this.width) + x1) * 4;
  var base21 = ((y1 * this.width) + x2) * 4;
  var base22 = ((y2 * this.width) + x2) * 4;
  // 4 channels: RGBA
  for (var i = 0; i < 4; ++i) {
    t11 = this.imgData[base11 + i];
    t12 = this.imgData[base12 + i];
    t21 = this.imgData[base21 + i];
    t22 = this.imgData[base22 + i];
    t = (t11 * (x2 - x) * (y2 - y) + 
        t21 * (x - x1) * (y2 - y) + 
        t12 * (x2 - x) * (y - y1) + 
        t22 * (x - x1) * (y - y1)) / ((x2 - x1) * (y2 - y1));
    c[i] = parseInt(t);
  }
  return c;
};
