import {
  Attack,
  BattleCharacterConfig,
  Character,
  Coordinate,
} from "../../types/type";
import { HealthBar } from "../ui/health-bar";

export class BattleCharacter {
  protected _scene: Phaser.Scene;
  protected _characterDetails: Character;
  protected _healthBar: HealthBar;
  protected _phaserGameObject: Phaser.GameObjects.Image;
  protected _currentHealth!: number;
  protected _maxHealth!: number;
  protected _characterAttacks!: Attack[];

  constructor(config: BattleCharacterConfig, position: Coordinate) {
    this._scene = config.scene;
    this._characterDetails = config.characterDetails;
    this._currentHealth = this._characterDetails.currentHp;
    this._maxHealth = this._characterDetails.maxHp;
    this._characterAttacks = [];

    this._healthBar = new HealthBar(this._scene, 34, 34);
    this._phaserGameObject = this._scene.add.image(
      position.x,
      position.y,
      this._characterDetails.assetKey,
      this._characterDetails.assetFrame || 0
    );
  }

  get isFainted(): boolean {
    return this._currentHealth <= 0;
  }

  get name(): string {
    return this._characterDetails.name;
  }

  get attacks(): Attack[] {
    return [...this._characterAttacks];
  }

  get baseAttack(): number {
    return this._characterDetails.baseAttack;
  }

  takeDamage(damage: number, callback?: () => void): void {
    // Update current monster health and animate health bar
    this._currentHealth -= damage;
    if (this._currentHealth < 0) {
      this._currentHealth = 0;
    }
    this._healthBar.setMeterPercentageAnimated(
      this._currentHealth / this._maxHealth,
      { callback }
    );
  }
}
