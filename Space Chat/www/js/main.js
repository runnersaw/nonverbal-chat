define(function(require) {

	var session = require('models/Session').sharedSession;
	var Session = require('models/Session').Session;

	// Messages
	var QuickChatMessage = require('models/QuickChatMessage').QuickChatMessage;
	var TextMessage = require('models/TextMessage').TextMessage;

	function handleClick(evt) {
		touchEnded(evt.pageX, evt.pageY);
	}

	function handleEnd(evt) {
		touchEnded(evt.changedTouches[0].pageX, evt.changedTouches[0].pageY);
	}

	function touchEnded(x, y) {
		// Do text if text is chosen or if there was no recent mode
		if (session.mode == Session.Modes.TEXT || session.mode == Session.Modes.NONE) {
			updateCurrentMode(Session.Modes.TEXT);

			var input = $("#input-text");

			if (input.val() == '' || input.val() == undefined) {
				input.css({
					'position': 'absolute',
					'left': x+'px',
					'top': y+'px'
				});
				input.show();
				input.focus();
			} else {
				enteredText(input);
			}
		} else if (session.mode == Session.Modes.QUICK_CHAT) {
			var message = new QuickChatMessage(session.currentSelectedQuickChat.innerHTML, session.currentColor, x, y);
			drawMessage(message);

			updateCurrentQuickChatIcon();
		}
	}

	function enteredText(input) {
		var message = new TextMessage(input.val(), session.currentColor, input.position().left, input.position().top + parseInt(input.css('font-size')), input.css('font-size'));
		drawMessage(message);

		input.hide();
		input.val('');
	}

	function drawMessage(message) {
		var c = document.getElementById("canvas");
		message.draw(c);
		session.messages.push(message);
		log(session);
	}

	function log(x) {
		console.log(x);
		var message = document.getElementById('message');
		message.innerHTML = x;
	}

	function getColorForButtonId(buttonId) {
		if (buttonId === 'red-button') {
			return '#FF0000';
		} else if (buttonId === 'blue-button') {
			return '#0000FF';
		}
	}

	function setColor(color, button) {
		$(".color-button").css({
			'border': '0px'
		})
		button.css({
			'border': '3px solid #fff'
		});
		var output = $("#input-text");
		output.css({
			color: color
		})
		session.currentColor = color;

		updateCurrentMode(session.mode);
		updateCurrentQuickChatIcon();
	}

	function quickChatButtonPressed(evt) {
		session.currentSelectedQuickChat = evt.currentTarget;
		updateCurrentMode(Session.Modes.QUICK_CHAT);
		updateCurrentQuickChatIcon();
	}

	function updateCurrentQuickChatIcon() {
		var quickChatButtons = $('.quick-chat-button');
		for (var i=0; i<quickChatButtons.length; i++) {
			var button = quickChatButtons[i];
			if (session.currentSelectedQuickChat == button) {
				$(button).css({
					'background-color': session.currentColor
				});
			} else {
				$(button).css({
					'background-color': 'white'
				});
			}
		}
	}

	function updateCurrentMode(mode) {
		session.mode = mode;

		if (mode != Session.Modes.QUICK_CHAT) {
			session.currentSelectedQuickChat = undefined;
		}

		if (mode != Session.Modes.TEXT) {
			var input = $("#input-text");
			input.hide();
		}

		// Reset color of current mode button
		var modeButtons = $('.mode-button');
		for (var i=0; i<modeButtons.length; i++) {
			var button = modeButtons[i];
			if (session.mode == Session.Modes.TEXT && "text-mode-button" == button.id) {
				$(button).css({
					'background-color': session.currentColor
				});
			} else {
				$(button).css({
					'background-color': 'white'
				});
			}
		}

		updateCurrentQuickChatIcon();
	}

	function updateFooterPosition() {
		var footer = $('#footer');
		var height = footer.height();
		footer.css({'bottom':(session.origHeight-window.innerHeight-window.scrollY).toString()+'px'});
	}

	$(document).ready(function() {
		var canvas = $("#canvas");

		var c = document.getElementById("canvas");
		c.width = document.body.clientWidth;
		c.height = document.body.clientHeight;

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			canvas.on('touchend', handleEnd);
		} else {
			canvas.click(handleClick);
		}

		var input = $("#input-text");
		input.hide();
		input.keydown(function(evt) {
		    if (evt.keyCode === 13) {  //checks whether the pressed key is "Enter"
		        enteredText(input);
		    }
		});

		var color_buttons = $('.color-button');
		color_buttons.click(function(evt) {
			var button = $(evt.currentTarget);
			var color = getColorForButtonId(evt.currentTarget.id);
			setColor(color, button);
		});

		// Set the default color to red
		setColor('#FF0000', $('#red-button'));

		var textModeButton = $('#text-mode-button');
		textModeButton.click(function(evt) {
			updateCurrentMode(Session.Modes.TEXT);
			updateCurrentQuickChatIcon();
		});

		var quickChatButtons = $('.quick-chat-button');
		quickChatButtons.click(quickChatButtonPressed);

		setInterval(updateFooterPosition, 20);
	});

});
