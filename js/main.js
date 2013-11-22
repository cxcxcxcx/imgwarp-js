var ImgWarper = ImgWarper || {};


$(document).ready(function(){  
  var canvas = $("#main-canvas")[0];
  var warper = null;

  var holder = document.getElementById('drop-area');

  $('.allow-drag').each(function (ele) {
    this.ondragstart = function (e) {
      e.dataTransfer.setData('text', this.src);
      console.log(e.dataTransfer.getData('text'));
      console.log(e);
    };
  });

  $('.redraw').change(function () {
    if (warper) {
      warper.redraw();
    }
  });

  holder.ondragover = function () { this.className = 'hover'; return false; };
  holder.ondragend = function () { this.className = ''; return false; };
  holder.ondrop = function (e) {
    this.className = '';
    e.stopPropagation();
    e.preventDefault();

    if (e.dataTransfer.files.length > 0) {
      var file = e.dataTransfer.files[0];
      var reader = new FileReader();
      // Prevent any non-image file type from being read.
      if(!file.type.match(/image.*/)){
          console.log("The dropped file is not an image: ", file.type);
          return;
      }
      reader.onload = function (event) {
        console.log(event.target);
        var img = render(event.target.result, function (imageData) {
          if (warper) {
            delete warper;
          }
          warper = new ImgWarper.PointDefiner(canvas, img, imageData);
        });
      };
      reader.readAsDataURL(file);
    } else {
      var src = e.dataTransfer.getData('text');
      var img = render(src, function (imageData) {
        if (warper) {
          delete warper;
        }
        warper = new ImgWarper.PointDefiner(canvas, img, imageData);
      });
    }
    return false;
  };
});

var MAX_HEIGHT = 500;
function render(src, callback){
  var image = new Image();
  image.onload = function(){
    var canvas = document.getElementById("myCanvas");
    if(image.height > MAX_HEIGHT) {
      image.width *= MAX_HEIGHT / image.height;
      image.height = MAX_HEIGHT;
    }
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, image.width, image.height);
    callback(ctx.getImageData(0, 0, image.width, image.height));
  };
  image.src = src;
  return image;
}
