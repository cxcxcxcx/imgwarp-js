var ImgWarper = ImgWarper || {};

ImgWarper.PointDefiner = function(canvas, image, imgData) {
  this.oriPoints = new Array();
  this.dstPoints = new Array();

  //set up points for change; 
  var c = canvas;
  this.canvas = canvas;
  var that = this;
  this.dragging_ = false;
  this.computing_ = false;
  $(c).unbind();
  $(c).bind('mousedown', function (e) { that.touchStart(e); });
  $(c).bind('mousemove', function (e) { that.touchDrag(e); });
  $(c).bind('mouseup', function (e) { that.touchEnd(e); });
  this.currentPointIndex = -1;
  this.imgWarper = new ImgWarper.Warper(c, image, imgData);
};

ImgWarper.PointDefiner.prototype.touchEnd = function(event) {
  this.dragging_ = false;
}

ImgWarper.PointDefiner.prototype.touchDrag = function(e) {
  if (this.computing_ || !this.dragging_ || this.currentPointIndex < 0) {
    return;
  }
  this.computing_ = true;
  e.preventDefault();
  var endX = (e.offsetX || e.clientX - $(e.target).offset().left);
  var endY = (e.offsetY || e.clientY - $(e.target).offset().top);

  movedPoint = new ImgWarper.Point(endX, endY);
  this.dstPoints[this.currentPointIndex] = new ImgWarper.Point(endX, endY);
  this.redraw();
  this.computing_ = false;
};

ImgWarper.PointDefiner.prototype.redraw = function () {
  if (this.oriPoints.length < 3) {
    if (document.getElementById('show-control').checked) {
      this.redrawCanvas();
    }
    return;
  }
  this.imgWarper.warp(this.oriPoints, this.dstPoints);
  if (document.getElementById('show-control').checked) {
    this.redrawCanvas();
  }
};


ImgWarper.PointDefiner.prototype.touchStart = function(e) {
  this.dragging_ = true;
  e.preventDefault();
  var startX = (e.offsetX || e.clientX - $(e.target).offset().left);
  var startY = (e.offsetY || e.clientY - $(e.target).offset().top);
  var q = new ImgWarper.Point(startX, startY);

  if (e.ctrlKey) {
    this.oriPoints.push(q);
    this.dstPoints.push(q);
  } else if (e.shiftKey) {
    var pointIndex = this.getCurrentPointIndex(q);  
    if (pointIndex >= 0) {
      this.oriPoints.splice(pointIndex, 1);
      this.dstPoints.splice(pointIndex, 1);
    }
  } else {
    this.currentPointIndex = this.getCurrentPointIndex(q);  
  }
  this.redraw();
};

ImgWarper.PointDefiner.prototype.getCurrentPointIndex = function(q) {
  var currentPoint = -1;   

  for (var i = 0 ; i< this.dstPoints.length; i++){
    if (this.dstPoints[i].InfintyNormDistanceTo(q) <= 20) {
      currentPoint = i;
      return i;
    }
  }
  return currentPoint;
};

ImgWarper.PointDefiner.prototype.redrawCanvas = function(points) {
  var ctx = this.canvas.getContext("2d");
  for (var i = 0; i < this.oriPoints.length; i++){
    if (i < this.dstPoints.length) {
      if (i == this.currentPointIndex) {
        this.drawOnePoint(this.dstPoints[i], ctx, 'orange');
      } else {
        this.drawOnePoint(this.dstPoints[i], ctx, '#6373CF');
      }

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.moveTo(this.oriPoints[i].x, this.oriPoints[i].y);
      ctx.lineTo(this.dstPoints[i].x, this.dstPoints[i].y);
      //ctx.strokeStyle = '#691C50';
      ctx.stroke();
    } else {
      this.drawOnePoint(this.oriPoints[i], ctx, '#119a21');
    }
  } 
  ctx.stroke();
};

ImgWarper.PointDefiner.prototype.drawOnePoint = function(point, ctx, color) {
  var radius = 10; 
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.arc(parseInt(point.x), parseInt(point.y), radius, 0, 2 * Math.PI, false);
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.arc(parseInt(point.x), parseInt(point.y), 3, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill(); 
};
