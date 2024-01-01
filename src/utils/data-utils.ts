import { ASSET_KEYS } from "../assets/keys";
import { Attack } from "../types/type";

export class DataUtils{
    static getCharacterAttack(scene:Phaser.Scene, attackId:number){
        const data = scene.cache.json.get(ASSET_KEYS.ATTACKS);
        return data.find((attack:Attack) => attack.id === attackId)
    }

}