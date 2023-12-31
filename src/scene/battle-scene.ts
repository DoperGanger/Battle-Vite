import Phaser from "phaser";
import { ASSET_KEYS, DIRECTION, SCENE_KEYS, direction } from "../assets/keys";
import { BattleMenu } from "../battle/ui/menu/battle-menu";
import { Background } from "../battle/background";
import { HealthBar } from "../battle/ui/health-bar";
import { EnemyBattleCharacter } from "../battle/characters/enemy-battle-character";

export default class BattleScene extends Phaser.Scene {
  #battleMenu!: BattleMenu;
  #cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
  #activeEnemyCharacter!: EnemyBattleCharacter;


  constructor() {
    super(SCENE_KEYS.BATTLE_SCENE);
  }

  create() {
    // Create background
    const background = new Background(this);
    background.showCity();

    // Create player
    this.add.image(256, 316, ASSET_KEYS.MAFIA, 0);

    // Create enemy
    // this.add.image(768, 316, ASSET_KEYS.POLICE, 0);
    this.#activeEnemyCharacter = new EnemyBattleCharacter(
      {
        scene: this,
        characterDetails: {
          name: ASSET_KEYS.POLICE,
          assetKey: ASSET_KEYS.POLICE,
          assetFrame: 0,
          currentHp: 25,
          maxHp: 25,
          attackIds: [],
          baseAttack: 5,
        },
      },
    );

    // Render out the player health bar
    const playerHealthBar = new HealthBar(this, 34, 34);
    const playerName = this.add.text(30, 20, ASSET_KEYS.MAFIA, {
      color: "#7E3D3F",
      fontSize: "32px",
    });
    this.add.container(0, 0, [
      this.add
        .image(0, 0, ASSET_KEYS.HEALTH_BAR_BACKGROUND)
        .setOrigin(0)
        .setScale(1, 0.85),
      playerName,
      playerHealthBar.container,
      this.add.text(playerName.width + 35, 23, "L5", {
        color: "#ED474B",
        fontSize: "28px",
      }),
      this.add.text(30, 55, "HP", {
        color: "#FF6505",
        fontSize: "24px",
        fontStyle: "italic",
      }),
      this.add
        .text(443, 80, "25/25", {
          color: "#7E3D3F",
          fontSize: "16px",
        })
        .setOrigin(1, 0),
    ]);
    // Animated player healthbar
    playerHealthBar.setMeterPercentageAnimated(0.5, {
      duration: 3000,
      callback: () => {
        console.log("animation completed");
      },
    });
   

    // Render out the enemy health bar
    // const enemyHealthbar = new HealthBar(this, 34, 34);
    const enemyHealthBar = this.#activeEnemyCharacter._healthBar;
    const enemyMonsterName = this.add.text(30, 20, ASSET_KEYS.POLICE, {
      color: "#7E3D3F",
      fontSize: "32px",
    });
    this.add.container(555, 0, [
      this.add
        .image(0, 0, ASSET_KEYS.HEALTH_BAR_BACKGROUND)
        .setOrigin(0)
        .setScale(1, 0.8),
      enemyMonsterName,
      enemyHealthBar.container,
      this.add.text(enemyMonsterName.width + 35, 23, "L5", {
        color: "#ED474B",
        fontSize: "28px",
      }),
      this.add.text(30, 55, "HP", {
        color: "#FF6505",
        fontSize: "24px",
        fontStyle: "italic",
      }),
    ]);
    // Enemy take damage
    this.#activeEnemyCharacter.takeDamage(25);
    console.log("Enemy is fainted: ",this.#activeEnemyCharacter.isFainted);

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
