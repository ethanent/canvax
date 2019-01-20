var game = new canvax.Renderer(document.getElementById('gameCanvas'), true)

var fish = new canvax.Image({
	'x': 50,
	'y': 600,
	'width': 400 / 4,
	'height': 400 / 4,
	'source': 'http://piq.codeus.net/static/media/userpics/piq_164380_400x400.png'
})

var fps = new canvax.Text({
	'x': 30,
	'y': 100,
	'text': 'Hey',
	'font': '80px Arial'
})

game.add(fps)
game.add(fish);

document.addEventListener("keypress", (e) => {
	var key = e.key.toLowerCase();

	if (key === " ") {
		velY = 5;
	}
});

var velY = 10;

setInterval(() => {
	velY += -0.1;

	fish.y -= velY;

	if (fish.y > game.element.height || fish.y < 0) {
		//console.log("Game over!");
	}
}, 8);

const Pipe = class Pipe {
	constructor () {
		const randomOffset = Math.floor(Math.random() * 100)
		const gapSize = 440 + Math.floor(Math.random() * 50)

		this.rectTop = new canvax.Rectangle({
			'x': game.element.width + 50,
			'y': randomOffset + gapSize,
			'width': 120,
			'height': 700,
			'backgroundColor': '#01C200',
			'borderColor': '#003600',
			'borderWeight': 5
		})

		this.rectBottom = new canvax.Rectangle({
			'x': game.element.width + 50,
			'y': randomOffset - gapSize,
			'width': 120,
			'height': 700,
			'backgroundColor': '#01C200',
			'borderColor': '#003600',
			'borderWeight': 5
		})

		setInterval(() => {
			this.rectTop.x -= 3;
			this.rectBottom.x -= 3;

			if (this.rectTop.touches(fish)) {
				this.rectTop.backgroundColor = '#000000'
			}

			if (this.rectBottom.touches(fish)) {
				this.rectBottom.backgroundColor = '#000000'
			}
		}, 5)
	}
}
	

setInterval(() => {
	console.log("Adding pipe.");

	var pipeGen = new Pipe();
	game.add(pipeGen.rectTop);
	game.add(pipeGen.rectBottom);
}, 2000)