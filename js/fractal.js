CanvasRenderingContext2D.prototype.drawPixel = function(x, y, color) {
  this.fillStyle = color;
  this.fillRect (y, x, 1, 1);
}

var CANVAS_WIDTH = 875;
var CANVAS_HEIGHT = 500;
var MAX_ITERATIONS = 17;

var colorFromIteration = function(iterations) {
  return ["#ffffff", "#f6f6f6", "#eee", 
          "#e5e5e5", "#d4d4d4", "#cccccc", 
          "#c3c3c3", "#bbbbbb", "#b2b2b2", 
          "#aaaaaa", "#a1a1a1", "#999999",
          "#909090", "#888888", "#7f7f7f",
          "#777777", "#6e6e6e", "#666666",
          "#5d5d5d", "#555555", "#4c4c4c",
          "#444444", "#3b3b3b", "#333333",
          "#2a2a2a", "#222222", "#191919",
          "#111111", "#080808", "#000000"][iterations % 30];
}

var scaledY = function(canvas_y, offset, max) {
  return (canvas_y / CANVAS_HEIGHT * (2.0 - max)) - (1.0 + offset); // fits [-1,1]
};

var scaledX = function(canvas_x, offset, max) {
  return (canvas_x / CANVAS_WIDTH * (3.5 - max)) - (2.5 + offset); // fits [-2.5, 1]
}

var drawMandelbrot = function(context, offset_x, max_x, offset_y, max_y) {
  for(var canvas_y = 0; canvas_y < CANVAS_HEIGHT; canvas_y++) {
    for(var canvas_x = 0; canvas_x < CANVAS_WIDTH; canvas_x++) {
      var scaled_y = scaledY(canvas_y, offset_y, max_y);
      var scaled_x = scaledX(canvas_x, offset_x, max_x);

      var x = 0, i = 0, y = 0;
      for(;x*x + y*y < 2*2 && i < MAX_ITERATIONS; i++) {
        var xtemp = x*x - y*y + scaled_x;
        y = 2*x*y + scaled_y;
        x = xtemp;
      }

      context.drawPixel(canvas_y, canvas_x, colorFromIteration(i));
    }
  }
}

$(function() {
  var $fractal = $('#fractal');
  $fractal.attr("width", CANVAS_WIDTH);
  $fractal.attr("height", CANVAS_HEIGHT);


  var canvas = document.getElementById("fractal");
  var context = canvas.getContext('2d');
  //drawMandelbrot(context, -0.5, 1.2, -0.5, 1.2);
  drawMandelbrot(context, -0, 0, -0, 0);

  var last_x_offset = 0;
  var last_y_offset = 0;

  $('#fractal').click(function(e) {
    context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    var current_x = scaledX(e.offsetX - 100, last_x_offset, 0);
    console.log(current_x);

    var current_y = scaledY(e.offsetY - 100, last_y_offset, 0);
    console.log(current_y);

    drawMandelbrot(context, -Math.abs(current_x), 0.8, -Math.abs(current_y), 0.8);
  });
});
