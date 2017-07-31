var game = new canvax.Renderer(document.getElementById("demoCanvas"));

var myRect = new canvax.Image(300, 200, 50, 100, "http://charactersheets.minotaur.cc/images/single.png");

game.add(myRect);



function animate() {
	game.render();
	requestAnimationFrame(animate);
}

animate();







var keysDown = [];

document.body.addEventListener("keydown", (e) => {
	if (keysDown.indexOf(e.key.toLowerCase()) === -1) {
		keysDown.push(e.key.toLowerCase());
	}
});

document.body.addEventListener("keyup", (e) => {
	if (keysDown.indexOf(e.key.toLowerCase()) !== -1) {
		keysDown.splice(keysDown.indexOf(e.key.toLowerCase()), 1);
	}
});

setInterval(() => {
	var a = (canvax._pointDistance([myRect.x, myRect.y], [game.element.width / 2, game.element.height / 2]) > 250);
	var centerX = game.element.width / 2;
	var centerY = game.element.height / 2;

	if (keysDown.indexOf("w") !== -1) {
		if (a && myRect.y < centerY) {
			myRect.y += 0.6;
			return;
		}
		myRect.y += -0.6;
	}
	if (keysDown.indexOf("s") !== -1) {
		console.log(a);
		if (a && myRect.y > centerY) {
			myRect.y += -0.6;
			return;
		}
		myRect.y += 0.6;
	}
	if (keysDown.indexOf("d") !== -1) {
		if (a && myRect.x > centerX) {
			myRect.x += -0.6;
			return;
		}
		myRect.x += 0.6;
	}
	if (keysDown.indexOf("a") !== -1) {
		if (a && myRect.x < centerX) {
			myRect.x += 0.6;
			return;
		}
		myRect.x += -0.6;
	}
}, 1);