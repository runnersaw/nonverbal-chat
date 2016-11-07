
var Modes = {
	TEXT: {name: 'Text'},
	NONE: {name: 'None'},
	QUICK_CHAT: {name: 'QuickChat'}
};

var Session = function() {
	this.mode = Modes.NONE;
	this.currentColor = '#000000';
	this.currentSelectedQuickChat = undefined;
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
	if (session.mode == Session.Modes.TEXT || session.mode == Session.Modes.NONE) { // Default to text box
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
	else if (session.mode == Session.Modes.QUICK_CHAT) {
		drawText(session.currentSelectedQuickChat.innerHTML, x, y, '30px');
		session.mode = Session.Modes.NONE;
		session.currentSelectedQuickChat = undefined;
		updateCurrentQuickChatIcon();
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
	ctx.font = fontSize+" Verdana";
	ctx.fillStyle = session.currentColor;
	ctx.fillText(text,x,y);
}

function log(x) {
	console.log(x);
	var message = document.getElementById('message');
	message.innerHTML = x;
}

function getColorForButtonText(text) {
	if (text === 'Red') {
		return '#FF0000';
	} else if (text === 'Blue') {
		return '#0000FF';
	}
}

function setColor(color, button) {
	$(".color-button").css({
		'border': '1px solid #000000'
	})
	button.css({
		'border': '5px solid '+color
	});
	var output = $("#input-text");
	output.css({
		color: color
	})
	session.currentColor = color;
}

function quickChatButtonPressed(evt) {
	session.currentSelectedQuickChat = evt.currentTarget;
	session.mode = Session.Modes.QUICK_CHAT;
	updateCurrentQuickChatIcon();
}

function updateCurrentQuickChatIcon() {
	var quickChatButtons = $('.quick-chat-button');
	for (var i=0; i<quickChatButtons.length; i++) {
		var button = quickChatButtons[i];
		log(button);
		if (session.currentSelectedQuickChat == button) {
			$(button).css({
				'background-color': 'green'
			});
		} else {
			$(button).css({
				'background-color': 'white'
			});
		}
	}
}

$(document).ready(function() {
	var canvas = $("#canvas");

	var c = document.getElementById("canvas");
	c.width = document.body.clientWidth;
	c.height = document.body.clientHeight;
	console.log(document.body.clientHeight);

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

	var color_buttons = $('.color-button');
	color_buttons.click(function(evt) {
		var button = $(evt.currentTarget);
		var color = getColorForButtonText(evt.currentTarget.innerHTML);
		setColor(color, button);
	});

	// Set the default color to red
	setColor('#FF0000', $('#red-button'));

	var textModeButton = $('#text-mode-button');
	textModeButton.click(function(evt) {
		session.mode = Session.Modes.TEXT;
		textModeButton.css({
			'background-color': 'green'
		});
	});

	var quickChatButtons = $('.quick-chat-button');
	quickChatButtons.click(quickChatButtonPressed);
});



