export interface BattleCharacterConfig {
  scene: Phaser.Scene;
  characterDetails: Character;
}

export interface Character {
  name: string;
  assetKey: string;
  assetFrame?: number;
  maxHp: number;
  currentHp: number;
  baseAttack: number;
  attackIds: number[];
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Attack {
  id: number;
  name: string;
  animationName: string;
}
