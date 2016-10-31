
var canvas = document.getElementById("canvas");

canvas.addEventListener("touchstart", handleEnd, false);
canvas.addEventListener("click", handleClick, false);

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

var currentColor = 	'#000000';

function enteredText(input) {
	drawText(input.val(), input.position().left, input.position().top + input.height(), input.css('font-size'), currentColor);
	input.hide();
	input.val('');
}

function drawText(text, x, y, fontSize, currentColor) {
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.font = fontSize+" sans-serif";
	ctx.fillStyle = currentColor;
	ctx.fillText(text,x,y);
}

var blue_button = $('#blue-button');
blue_button.click(colorBlue);

function colorBlue() {
	$(".color-button").css({
		'border': '1px solid #000000'
	})
	var input = $("#blue-button");
	input.css({
		'border': '5px solid #0000FF'
	});
	var output = $("#input-text");
	output.css({
		color: '#0000FF'
	})
	currentColor = '#0000FF';
}

var red_button = $('#red-button');
red_button.click(colorRed);

function colorRed() {
	$(".color-button").css({
		'border': '1px solid #000000'
	})
	var input = $("#red-button");
	input.css({
		'border': '5px solid #FF0000'
	});
	var output = $("#input-text");
	output.css({
		color: '#FF0000'
	})
	currentColor = '#FF0000';
}

function log(x) {
	console.log(x);
	var message = document.getElementById('message');
	message.innerHTML = x;
}