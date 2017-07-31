var game = new canvax.Renderer(document.getElementById("demoCanvas"));

var myRect = new canvax.Image(100, 100, 50, 100, "http://charactersheets.minotaur.cc/images/single.png");

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
	var a = (canvax._pointDistance([myRect.x, myRect.y], [game.element.width / 2, game.element.height / 2]) > 330);
	if (a) console.log("Too far from center! Turn back now!");
	if (keysDown.indexOf("w") !== -1) {
		myRect.y += -0.6;
	}
	if (keysDown.indexOf("s") !== -1) {
		myRect.y += 0.6;
	}
	if (keysDown.indexOf("d") !== -1) {
		myRect.x += 0.6;
	}
	if (keysDown.indexOf("a") !== -1) {
		myRect.x += -0.6;
	}
}, 1);