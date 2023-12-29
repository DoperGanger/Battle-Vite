import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.setBaseURL('https://labs.phaser.io')

		this.load.image('sky', 'assets/skies/space3.png')

	}

	create() {
		this.add.image(400, 300, 'sky')

	}
}
