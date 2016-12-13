define(function() {

	var Drawing = function(color, x, y) {
		// this.size = size;
		this.color = color;
		this.x = x;
		this.y = y;

		this.clickX = new Array();
		this.clickY = new Array();

		this.addClick=function(x, y) {
			this.clickX.push(x);
			this.clickY.push(y);
		}

		this.draw=function(canvas) {
			context = canvas.getContext("2d");

			context.strokeStyle = this.color;
			context.lineJoin = "round";
			context.lineWidth = 4;

			for(var i=0; i < this.clickX.length; i++) {
				context.beginPath();
				if (i) {
					context.moveTo(this.clickX[i-1], this.clickY[i-1]);
				} else {
					context.moveTo(this.clickX[i]-1, this.clickY[i]);
				}
				context.lineTo(this.clickX[i], this.clickY[i]);
				context.closePath();
				context.stroke();
			}
		}
	};

	return {
		'Drawing': Drawing
	}
});