import { BattleCharacterConfig } from "../../types/type";
import { BattleCharacter } from "./battle-character";


const ENEMY_POSITION = Object.freeze({
    x: 768,
    y: 316,
  });
  
  export class EnemyBattleCharacter extends BattleCharacter {
    constructor(config: BattleCharacterConfig) {
      super(config, ENEMY_POSITION);
    }
  }