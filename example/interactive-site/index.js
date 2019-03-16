const {Renderer, Rectangle, Image, Circle, Text} = canvax

const page = new Renderer(document.querySelector('canvas'), true)

page.fullPage()

page.add(() => new Rectangle({
	'x': 0,
	'y': 0,
	'width': page.element.width,
	'height': page.element.height,
	'backgroundColor': '#F3F3F3'
}))

page.add(() => new Image({
	'source': 'https://ethanent.me/images/mainLogo.png',
	'x': page.element.width / 2 - 100,
	'y': 40,
	'width': 200,
	'height': 200
}))

page.add(() => new Text({
	'text': 'ethanent',
	'x': page.element.width / 2,
	'y': 300,
	'alignment': 'center',
	'color': '#040404',
	'font': '50px Arial'
}))

page.add(() => new Text({
	'text': 'Homepage',
	'x': page.element.width / 2,
	'y': 400,
	'alignment': 'center',
	'color': '#0645AD',
	'font': '15px Arial'
}))

page.add(() => new Rectangle({
	'x': page.element.width / 2 - 40,
	'y': 400 + 6,
	'width': 80,
	'height': 2,
	'backgroundColor': '#0645AD'
}))

const region = new Rectangle({
	'x': page.element.width / 2 - 40,
	'y': 400 - 15,
	'width': 80,
	'height': 20
})

region.on('mousein', () => {
	page.element.style.cursor = 'pointer'
})

region.on('mouseout', () => {
	region.backgroundColor = null

	page.element.style.cursor = 'default'
})

region.on('mousedown', () => {
	region.backgroundColor = '#CC2200'
})

region.on('click', () => {
	window.location.assign('https://ethanent.me')
})

page.add(region)

page.on('resize', () => {
	region.x = page.element.width / 2 - 40
})