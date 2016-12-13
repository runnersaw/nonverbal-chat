define(function(require) {

	var session = require('models/Session').sharedSession;
	var Session = require('models/Session').Session;

	// Messages
	var QuickChatMessage = require('models/QuickChatMessage').QuickChatMessage;
	var TextMessage = require('models/TextMessage').TextMessage;
	var Drawing = require('models/Drawing').Drawing

	// Event handling
	var pan = require('pan');

	function handleTouchstart(evt) {
		if (session.mode == Session.Modes.DRAWING) {
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext('2d');

			var x = evt.changedTouches[0].pageX;
			var y = evt.changedTouches[0].pageY;
			var p = ctx.transformedPoint(x, y);

			session.currentDrawing = new Drawing(session.currentColor,p.x,p.y);
			session.currentDrawing.addClick(p.x,p.y);
		} else {
			// pan
			pan.panTouchstart(evt);
		}
		redraw();
	}

	function handleTouchmove(evt) {
		if (session.mode == Session.Modes.DRAWING) {
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext('2d');

			var x = evt.changedTouches[0].pageX;
			var y = evt.changedTouches[0].pageY;
			var p = ctx.transformedPoint(x, y);

			session.currentDrawing.addClick(p.x,p.y);
		} else {
			pan.panTouchmove(evt);
		}
		redraw();
	}

	function handleTouchend(evt) {
		var wasPanned = false;

		if (session.mode != Session.Modes.DRAWING) {
			wasPanned = pan.panTouchend(evt);
		}

		if (!wasPanned) {
			touchEnded(evt.changedTouches[0].pageX, evt.changedTouches[0].pageY);
		}
	}

	function handleMousedown(evt) {
		if (session.mode == Session.Modes.DRAWING) {
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext('2d');

			var x = evt.pageX;
			var y = evt.pageY;
			var p = ctx.transformedPoint(x, y);

			session.currentDrawing = new Drawing(session.currentColor,p.x,p.y);
			session.currentDrawing.addClick(p.x,p.y);
		} else {
			// pan
			pan.panMousedown(evt);
		}
		redraw();
	}

	function handleMousemove(evt) {
		if (session.mode == Session.Modes.DRAWING && session.currentDrawing != undefined) {
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext('2d');

			var x = evt.pageX;
			var y = evt.pageY;
			var p = ctx.transformedPoint(x, y);

			session.currentDrawing.addClick(p.x,p.y);
		} else {
			pan.panMousemove(evt);
		}
		redraw();
	}

	function handleMouseup(evt) {
		var wasPanned = false;

		if (session.mode != Session.Modes.DRAWING) {
			wasPanned = pan.panMouseup(evt);
		}

		if (!wasPanned) {
			touchEnded(evt.pageX, evt.pageY);
		}

		redraw();
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
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext('2d');

			var p = ctx.transformedPoint(x, y);
			var message = new QuickChatMessage(session.currentSelectedQuickChat.innerHTML, session.currentColor, p.x, p.y);
			drawMessage(message);

			updateCurrentQuickChatIcon();
		} else if (session.mode == Session.Modes.DRAWING) {
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext('2d');

			var p = ctx.transformedPoint(x, y);

			session.currentDrawing.addClick(p.x,p.y);
			session.messages.push(session.currentDrawing);
			session.currentDrawing=undefined;
		}
	}

	function enteredText(input) {
		var canvas = document.getElementById('canvas');
		var ctx = canvas.getContext('2d');

		var p = ctx.transformedPoint(input.position().left, input.position().top + parseInt(input.css('font-size')));
		var message = new TextMessage(input.val(), session.currentColor, p.x, p.y, input.css('font-size'));
		drawMessage(message);

		input.hide();
		input.val('');
	}

	function drawMessage(message) {
		var c = document.getElementById("canvas");
		message.draw(c);
		session.messages.push(message);
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
			}
			else if (session.mode == Session.Modes.DRAWING && "drawing-mode-button" == button.id) {
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

	function redraw() {
		var canvas = document.getElementById('canvas');
		var ctx = canvas.getContext('2d');

		// Clear things
		var p1 = ctx.transformedPoint(0,0);
		var p2 = ctx.transformedPoint(canvas.width,canvas.height);
		ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

		for (var message in session.messages) {
			session.messages[message].draw(canvas);
		}

		if (session.currentDrawing != undefined) {
			session.currentDrawing.draw(canvas);
		}
	}

	$(document).ready(function() {
		var canvas = $("#canvas");

		var c = document.getElementById("canvas");
		c.width = document.body.clientWidth;
		c.height = document.body.clientHeight;

		// PLEASE ONLY ADD EVENT HANDLERS IN MAIN. THIS PREVENTS US OVERRIDING EACH OTHER'S EVENT HANDLERS

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			canvas.on('touchstart', handleTouchstart);
			canvas.on('touchmove', handleTouchmove);
			canvas.on('touchend', handleTouchend);
		} else {
			canvas.on('mousedown', handleMousedown);
			canvas.on('mousemove', handleMousemove);
			canvas.on('mouseup', handleMouseup);
		}

		c.addEventListener('DOMMouseScroll',pan.handleScroll,false);
		c.addEventListener('mousewheel',pan.handleScroll,false);

		pan.setRedraw(redraw);

		pan.trackTransforms();

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
			if (session.mode == Session.Modes.TEXT) {
				updateCurrentMode(Session.Modes.NONE);
				updateCurrentQuickChatIcon();
			} else {
				updateCurrentMode(Session.Modes.TEXT);
				updateCurrentQuickChatIcon();
			}
		});
		var drawingModeButton = $('#drawing-mode-button');
		drawingModeButton.click(function(evt) {
			if (session.mode == Session.Modes.DRAWING) {
				updateCurrentMode(Session.Modes.NONE);
				updateCurrentQuickChatIcon();
			} else {
				updateCurrentMode(Session.Modes.DRAWING);
				updateCurrentQuickChatIcon();
			}
		})

		var quickChatButtons = $('.quick-chat-button');
		quickChatButtons.click(quickChatButtonPressed);

		setInterval(updateFooterPosition, 10);
	});

});
