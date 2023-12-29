import Phaser from 'phaser'

import BattleScene from './scene/battle-scene'
import Preloader from './scene/preloader'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.CANVAS,
	pixelArt: false,
	parent: "app",
	width: 1024,
	height: 576,
	scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
	// physics: {
	// 	default: 'arcade',
	// 	arcade: {
	// 		gravity: { y: 200 },
	// 	},
	// },


	scene: [Preloader, BattleScene],
}

export default new Phaser.Game(config)
