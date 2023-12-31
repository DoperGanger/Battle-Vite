import Phaser from "phaser";
import { ASSET_KEYS, DIRECTION, SCENE_KEYS, direction } from "../assets/keys";
import { BattleMenu } from "../battle/ui/menu/battle-menu";
import { Background } from "../battle/background";
import { EnemyBattleCharacter } from "../battle/characters/enemy-battle-character";
import { PlayerBattleCharacter } from "../battle/characters/player-battle-character";

export default class BattleScene extends Phaser.Scene {
  #battleMenu!: BattleMenu;
  #cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
  #activeEnemyCharacter!: EnemyBattleCharacter;
  #activePlayerCharacter!: PlayerBattleCharacter;

  constructor() {
    super(SCENE_KEYS.BATTLE_SCENE);
  }

  create() {
    // Create background
    const background = new Background(this);
    background.showCity();

    // Create player
    // this.add.image(256, 316, ASSET_KEYS.MAFIA, 0);
    this.#activePlayerCharacter = new PlayerBattleCharacter({
      scene: this,
      characterDetails: {
        name: ASSET_KEYS.MAFIA,
        assetKey: ASSET_KEYS.MAFIA,
        assetFrame: 0,
        currentHp: 25,
        maxHp: 25,
        attackIds: [],
        baseAttack: 5,
        currentLevel: 6,
      },
      scaleHealthBarBackgroundImageByY: 1, // Default value
    });

    // Create enemy
    // this.add.image(768, 316, ASSET_KEYS.POLICE, 0);
    this.#activeEnemyCharacter = new EnemyBattleCharacter({
      scene: this,
      characterDetails: {
        name: ASSET_KEYS.POLICE,
        assetKey: ASSET_KEYS.POLICE,
        assetFrame: 0,
        currentHp: 25,
        maxHp: 25,
        attackIds: [],
        baseAttack: 5,
        currentLevel: 6,
      },
      scaleHealthBarBackgroundImageByY: 1, // Default value
    });

    this.#activeEnemyCharacter.takeDamage(20, () => {
      this.#activePlayerCharacter.takeDamage(15);
    });

    // Render main info pane and sub info pane
    this.#battleMenu = new BattleMenu(this);
    this.#battleMenu.showMainBattleMenu();

    // Cursor key control
    this.#cursorKeys = this.input.keyboard.createCursorKeys();
  }

  update() {
    const wasSpaceKeyPressed = Phaser.Input.Keyboard.JustDown(
      this.#cursorKeys.space
    );

    if (wasSpaceKeyPressed) {
      this.#battleMenu.handlePlayerInput("OK");
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.shift)) {
      this.#battleMenu.handlePlayerInput("CANCEL");
      return;
    }

    let selectedDirection: direction = DIRECTION.NONE;
    if (this.#cursorKeys.left.isDown) {
      selectedDirection = DIRECTION.LEFT;
    } else if (this.#cursorKeys.right.isDown) {
      selectedDirection = DIRECTION.RIGHT;
    } else if (this.#cursorKeys.up.isDown) {
      selectedDirection = DIRECTION.UP;
    } else if (this.#cursorKeys.down.isDown) {
      selectedDirection = DIRECTION.DOWN;
    }

    if (selectedDirection !== DIRECTION.NONE) {
      this.#battleMenu.handlePlayerInput(selectedDirection);
    }
  }
}
