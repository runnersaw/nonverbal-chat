define(function() {
	var Modes = {
		TEXT: {name: 'Text'},
		NONE: {name: 'None'},
		QUICK_CHAT: {name: 'QuickChat'}
		DRAWING: {name: 'Drawing'}
	};

	var Session = function() {
		this.mode = Modes.NONE;
		this.currentColor = '#000000';
		this.currentSelectedQuickChat = undefined;
		this.origHeight = window.innerHeight;
		this.messages = [];
	};

	Session.Modes = Modes;

	var session = new Session();

	return {
		'sharedSession': session,
		'Session': Session
	}
});
