define(function() {

	var QuickChatMessage = function(text, color, x, y) {
		this.text = text;
		this.color = color;
		this.x = x;
		this.y = y;
		this.fontSize = '30px';

		this.draw = function(canvas) {
			var ctx = canvas.getContext("2d");
			ctx.font = this.fontSize+" Verdana";
			ctx.fillStyle = this.color;
			ctx.fillText(this.text,this.x,this.y);
		}
	};

	return {
		'QuickChatMessage': QuickChatMessage
	}
});
