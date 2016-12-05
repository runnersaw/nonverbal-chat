define(function() {

	var redraw = function(){}

	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var lastX=canvas.width/2, lastY=canvas.height/2;
	var dragStart,dragged;
	var scaleFactor = 1.0;

	var zoom = function(clicks){
		var canvas = document.getElementById('canvas');
		var ctx = canvas.getContext('2d');
		var pt = ctx.transformedPoint(lastX,lastY);
		ctx.translate(pt.x,pt.y);
		var factor = Math.pow(scaleFactor,clicks);
		ctx.scale(factor,factor);
		ctx.translate(-pt.x,-pt.y);
		redraw();
	}

	function log(x){
		var canvas = document.getElementById('canvas');
		var ctx = canvas.getContext('2d');

		var p1 = ctx.transformedPoint(0,0);
		var p2 = ctx.transformedPoint(canvas.width,canvas.height);
		ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

		ctx.font = "24px Verdana";
		ctx.fillStyle = '#000000';
		ctx.fillText(x,150,150);
	}

	function panTouchstart(evt) {
		if (evt.touches.length == 1) {
			document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
			lastX = evt.touches[0].pageX;
			lastY = evt.touches[0].pageY;
			dragStart = ctx.transformedPoint(lastX,lastY);
			realDragStart = {'x':lastX, 'y':lastY};
			dragged = false;
		} // TODO handle zoom otherwise
	}

	function panTouchmove(evt) {
		if (evt.touches.length == 1) {
			lastX = evt.touches[0].pageX;
			lastY = evt.touches[0].pageY;
			dragged = true;
			if (dragStart){
				var pt = ctx.transformedPoint(lastX,lastY);
				ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
			}
			redraw();
		} // TODO handle zoom otherwise
	}

	// This function returns true if the user has been panning. If the user has panned, don't do anything else.
	function panTouchend(evt) {
		if (evt.touches.length == 0) {
			var handled = false;
			if (dragStart) {
				if (Math.abs(lastX-realDragStart.x) > 15 || Math.abs(lastY-realDragStart.y) > 15) {
					handled = true;
				}
				dragStart = null;
				realDragStart = null;
			}
			redraw();
			return handled;
		} else {
			return false;
		}
	}

	function panMousedown(evt) {
		document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
		lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
		lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
		dragStart = ctx.transformedPoint(lastX,lastY);
		realDragStart = {'x':lastX, 'y':lastY};
		dragged = false;
	}

	function panMousemove(evt) {
		lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
		lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
		dragged = true;
		if (dragStart){
			var pt = ctx.transformedPoint(lastX,lastY);
			ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
			log(evt.type);
		}
	}

	function panMouseup(evt){
		var handled = false;
		if (dragStart) {
			if (Math.abs(lastX-realDragStart.x) > 15 || Math.abs(lastY-realDragStart.y) > 15) {
				handled = true;
			}
			dragStart = null;
			realDragStart = null;
		}
		log(evt.type);
		if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
		return handled;
	}

	// Adds ctx.getTransform() - returns an SVGMatrix
	// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
	function trackTransforms(){
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		var xform = svg.createSVGMatrix();
		ctx.getTransform = function(){ return xform; };

		var savedTransforms = [];
		var save = ctx.save;
		ctx.save = function(){
			savedTransforms.push(xform.translate(0,0));
			return save.call(ctx);
		};
		var restore = ctx.restore;
		ctx.restore = function(){
			xform = savedTransforms.pop();
			return restore.call(ctx);
		};

		var scale = ctx.scale;
		ctx.scale = function(sx,sy){
			xform = xform.scaleNonUniform(sx,sy);
			return scale.call(ctx,sx,sy);
		};
		var rotate = ctx.rotate;
		ctx.rotate = function(radians){
			xform = xform.rotate(radians*180/Math.PI);
			return rotate.call(ctx,radians);
		};
		var translate = ctx.translate;
		ctx.translate = function(dx,dy){
			xform = xform.translate(dx,dy);
			return translate.call(ctx,dx,dy);
		};
		var transform = ctx.transform;
		ctx.transform = function(a,b,c,d,e,f){
			var m2 = svg.createSVGMatrix();
			m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
			xform = xform.multiply(m2);
			return transform.call(ctx,a,b,c,d,e,f);
		};
		var setTransform = ctx.setTransform;
		ctx.setTransform = function(a,b,c,d,e,f){
			xform.a = a;
			xform.b = b;
			xform.c = c;
			xform.d = d;
			xform.e = e;
			xform.f = f;
			return setTransform.call(ctx,a,b,c,d,e,f);
		};
		var pt  = svg.createSVGPoint();
		ctx.transformedPoint = function(x,y){
			pt.x=x; pt.y=y;
			return pt.matrixTransform(xform.inverse());
		}
	}

	function handleScroll(evt){
		var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
		if (delta) zoom(delta);
		return evt.preventDefault() && false;
	};

	function setRedraw(r) {
		redraw = r;
	}

	return {
		'panTouchstart': panTouchstart,
		'panTouchmove': panTouchmove,
		'panTouchend': panTouchend,
		'panMousedown': panMousedown,
		'panMousemove': panMousemove,
		'panMouseup': panMouseup,
		'trackTransforms': trackTransforms,
		'handleScroll': handleScroll,
		'setRedraw': setRedraw,
	}
});