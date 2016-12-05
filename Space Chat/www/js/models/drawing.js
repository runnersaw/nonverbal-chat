define(function() {

	var Drawing = function(color, x, y) {
		// this.size = size;
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

		function redraw(canvas){
			context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas

			context.strokeStyle = "#df4b26";
			context.lineJoin = "round";
			context.lineWidth = 5;
					
			for(var i=0; i < clickX.length; i++) {		
			context.beginPath();
			if(clickDrag[i] && i){
			  context.moveTo(clickX[i-1], clickY[i-1]);
			 }else{
			   context.moveTo(clickX[i]-1, clickY[i]);
			 }
			 context.lineTo(clickX[i], clickY[i]);
			 context.closePath();
			 context.stroke();
			}
		}
	};

	return {
		'Drawing': Drawing
	}
});