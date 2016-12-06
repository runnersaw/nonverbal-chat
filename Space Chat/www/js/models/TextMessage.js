define(function() {

	var TextMessage = function(text, color, x, y, fontSize) {
		this.text = text;
		this.color = color;
		this.x = x;
		this.y = y;
		this.fontSize = fontSize;

		this.draw = function(canvas) {
			var ctx = canvas.getContext("2d");
			ctx.font = this.fontSize+" Verdana";
			ctx.fillStyle = this.color;
			ctx.fillText(this.text,this.x,this.y);
		}
	};

	return {
		'TextMessage': TextMessage
	}
});
