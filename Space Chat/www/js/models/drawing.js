define(function() {

	var Drawing = function(size, color, x, y) {
		this.size = size;
		this.color = color;
		this.x = x;
		this.y = y;

		var clickX = new Array();
		var clickY = new Array();
		var clickDrag = new Array();

		function addClick(x, y, dragging)
		{
		  clickX.push(x);
		  clickY.push(y);
		  clickDrag.push(dragging);
		}

		this.draw = function(canvas) {
			var ctx = canvas.getContext("2d");
			ctx.font = this.fontSize+" Verdana";
			ctx.fillStyle = this.color;
			ctx.fillText(this.text,this.x,this.y);
		}
	};

	return {
		'Drawing': Drawing
	}
});