
var Modes = {
	TEXT: {name: 'Text'},
	NONE: {name: 'None'}
};

var Session = function() {
	this.mode = Modes.NONE;
	this.currentColor = '#000000';
};

Session.Modes = Modes;

var session = new Session();

function handleClick(evt) {
	touchEnded(evt.pageX, evt.pageY);
}

function handleEnd(evt) {
	touchEnded(evt.touches[0].pageX, evt.touches[0].pageY);
}

function touchEnded(x, y) {
	log('hello');
	if (session.mode == Session.Modes.TEXT) {
		log('hi');
		var input = $("#input-text");
		input.css({
			'position': 'absolute',
			'left': x+'px',
			'top': y+'px'
		});
		input.show();
		input.focus();
	}
}

function enteredText(input) {
	drawText(input.val(), input.position().left, input.position().top + input.height(), input.css('font-size'));

	input.hide();
	input.val('');
	session.mode = Session.Modes.NONE;

	var textModeButton = $('#text-mode-button');
	textModeButton.css({
		'background-color': 'gray'
	});
}

function drawText(text, x, y, fontSize) {
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.font = fontSize+" verdana";
	ctx.fillStyle = session.currentColor;
	ctx.fillText(text,x,y);
}

function log(x) {
	console.log(x);
	var message = document.getElementById('message');
	message.innerHTML = x;
}

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
	session.currentColor = '#0000FF';
}

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
	session.currentColor = '#FF0000';
}

$(document).ready(function() {

	var canvas = $("#canvas");

	canvas.on('touchstart', handleEnd);
	canvas.click(handleClick);
	$(document).resize(function(){console.log("Resized");});

	var input = $("#input-text");
	input.hide();
	input.keydown(function(evt) {
	    if (evt.keyCode === 13) {  //checks whether the pressed key is "Enter"
	        enteredText(input);
	    }
	});
	input.focus(function() {
		log('focused');
	});

	var blue_button = $('#blue-button');
	blue_button.click(colorBlue);

	var red_button = $('#red-button');
	red_button.click(colorRed);

	var textModeButton = $('#text-mode-button');
	log(textModeButton);
	log(session);
	textModeButton.click(function(evt) {
		log(session);
		session.mode = Session.Modes.TEXT;
		log('in text mode');
		textModeButton.css({
			'background-color': 'green'
		});
	});
	log(textModeButton);
});



