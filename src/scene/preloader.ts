import Phaser from 'phaser';
import { ASSET_KEYS, SCENE_KEYS } from '../assets/keys';

export default class Preloader extends Phaser.Scene{
    constructor(){
        super (SCENE_KEYS.PRELOAD_SCENE)
    }

    preload(){
        this.load.image(ASSET_KEYS.CITY, '/images/city.png')
        this.load.image(ASSET_KEYS.MAFIA, '/images/mafia.png')
        this.load.image(ASSET_KEYS.POLICE, '/images/police.png')
    
        this.load.image(ASSET_KEYS.HEALTH_BAR_BACKGROUND, '/images/kenneys-assets/ui-space-expansion/custom-ui.png')
        this.load.image(ASSET_KEYS.LEFT_CAP, '/images/kenneys-assets/ui-space-expansion/barHorizontal_green_left.png')
        this.load.image(ASSET_KEYS.MIDDLE, '/images/kenneys-assets/ui-space-expansion/barHorizontal_green_mid.png')
        this.load.image(ASSET_KEYS.RIGHT_CAP, '/images/kenneys-assets/ui-space-expansion/barHorizontal_green_right.png')

        
        

    }
    create() {
        this.scene.start(SCENE_KEYS.BATTLE_SCENE);
      }
}