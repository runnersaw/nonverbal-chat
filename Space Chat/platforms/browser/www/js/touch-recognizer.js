
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
	var input = document.getElementById("input-text");
	input.style.position = "absolute";
	input.style.left = (x)+'px';
	input.style.top = (y)+'px';
	input.style.display='block';
	input.focus();
}

var input = document.getElementById("input-text");
input.style.display='none';
input.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 13) {  //checks whether the pressed key is "Enter"
        enteredText(input);
    }
});

function enteredText(input) {
	var rect = input.getBoundingClientRect();
	var fontSize = window.getComputedStyle(input).fontSize;
	log(rect);
	drawText(input.value, rect.left, rect.bottom, fontSize);

	input.style.display='none';
	input.value = '';
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