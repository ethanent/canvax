var game = new canvax.Renderer(document.getElementById("demoCanvas"));

var myRect = new canvax.Rectangle(10, 10, 50, 50, "#3498DB", "none", "0px");

var myEnt = new canvax.Entity((ctx) => {
	var x = 100;
	var y = 100;
	var w = 40;
	var h = 80;
	var kappa = .5522848,
		ox = (w / 2) * kappa, // control point offset horizontal
		oy = (h / 2) * kappa, // control point offset vertical
		xe = x + w,           // x-end
		ye = y + h,           // y-end
		xm = x + w / 2,       // x-middle
		ym = y + h / 2;       // y-middle

	ctx.beginPath();
	ctx.moveTo(x, ym);
	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	ctx.stroke();
});

game.add(myRect);
game.add(myEnt);




function animate() {
	game.render();
	requestAnimationFrame(animate);
}

animate();







var keysDown = [];

document.body.addEventListener("keydown", (e) => {
	if (keysDown.indexOf(e.key) === -1) {
		keysDown.push(e.key);
	}
});

document.body.addEventListener("keyup", (e) => {
	if (keysDown.indexOf(e.key) !== -1) {
		keysDown.splice(keysDown.indexOf(e.key), 1);
	}
});

setInterval(() => {
	if (keysDown.indexOf("ArrowUp") !== -1) {
		myRect.y += -0.6;
	}
	if (keysDown.indexOf("ArrowDown") !== -1) {
		myRect.y += 0.6;
	}
	if (keysDown.indexOf("ArrowRight") !== -1) {
		myRect.x += 0.6;
	}
	if (keysDown.indexOf("ArrowLeft") !== -1) {
		myRect.x += -0.6;
	}
}, 1);