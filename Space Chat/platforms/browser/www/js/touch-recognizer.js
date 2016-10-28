
var canvas = document.getElementById("canvas");

document.addEventListener("touchstart", handleEnd, false);
document.addEventListener("click", handleClick, false);

function handleClick(evt) {
	touchEnded(evt.pageX, evt.pageY);
}

function handleEnd(evt) {
	touchEnded(evt.touches[0].pageX, evt.touches[0].pageY);
}

function touchEnded(x, y) {
	var input = $("#input-text");
	input.css({
		'position': 'absolute',
		'left': x+'px',
		'top': y+'px'
	});
	input.show();
	input.focus();
}

var input = $("#input-text");
input.hide();
input.keydown(function (evt) {
    if (evt.keyCode === 13) {  //checks whether the pressed key is "Enter"
        enteredText(input);
    }
});

function enteredText(input) {
	drawText(input.val(), input.position().left, input.position().top + input.height(), input.css('font-size'));

	input.hide();
	input.val('');
}

function drawText(text, x, y, fontSize) {
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.font = fontSize+" sans-serif";
	ctx.fillText(text,x,y);
}

function log(x) {
	console.log(x);
	var message = document.getElementById('message');
	message.innerHTML = x;
}