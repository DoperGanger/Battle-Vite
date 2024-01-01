import Phaser from "phaser";
import { ASSET_KEYS, DIRECTION, SCENE_KEYS, direction } from "../assets/keys";
import { BattleMenu } from "../battle/ui/menu/battle-menu";
import { Background } from "../battle/background";
import { EnemyBattleCharacter } from "../battle/characters/enemy-battle-character";
import { PlayerBattleCharacter } from "../battle/characters/player-battle-character";
import { BattleState } from "../types/type";

export default class BattleScene extends Phaser.Scene {
  #battleMenu!: BattleMenu;
  #cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
  #activePlayerCharacter!: PlayerBattleCharacter; // define player
  #activeEnemyCharacter!: EnemyBattleCharacter; // define enemy
  #activePlayerAttackIndex!: number;

  constructor() {
    super(SCENE_KEYS.BATTLE_SCENE);
  }

  init() {
    this.#activePlayerAttackIndex = -1;
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
        attackIds: [1, 2], // Choose attack
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
        attackIds: [1, 2], // Choose attack
        baseAttack: 5,
        currentLevel: 6,
      },
      scaleHealthBarBackgroundImageByY: 1, // Default value
    });

    // Render main info pane and sub info pane
    this.#battleMenu = new BattleMenu(this, this.#activePlayerCharacter); //?
    this.#battleMenu.showMainBattleMenu();

    // Cursor key control
    this.#cursorKeys = this.input.keyboard.createCursorKeys();
  }

  update() {
    console.log(this.#battleMenu.selectedAttack);

    const wasSpaceKeyPressed = Phaser.Input.Keyboard.JustDown(
      this.#cursorKeys.space
    );

    if (wasSpaceKeyPressed) {
      this.#battleMenu.handlePlayerInput("OK");
      this.#activePlayerAttackIndex = this.#battleMenu.selectedAttack;

      if (this.#battleMenu.currentState === BattleState.WAITING_FOR_PLAYER) {
        this.#battleMenu.currentState = BattleState.PLAYER_TURN;
        this.handleBattleSequence();
      }
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

  handleBattleSequence() {
    // general battle flow
    // show attack used, brief pause
    // then play attack animation, brief pause
    // then play damage animation, brief pause
    // then play health bar animation, brief pause
    // then repeat the steps above for the other character

    this.#playerAttack();
  }

  // #playerAttack() {
  //   this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
  //     [
  //       `${this.#activePlayerCharacter.name} used ${
  //         this.#activePlayerCharacter.attacks[this.#activePlayerAttackIndex].name
  //       }`,
  //     ],
  //     () => {
  //       this.time.delayedCall(500, () => {
  //         // Characters attacking alternately
  //         this.#activeEnemyCharacter.takeDamage(20, () => {
  //           this.#enemyAttack();
  //         });
  //       });
  //     }
  //   );
  // }

  // #enemyAttack() {
  //   this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
  //     [
  //       `${this.#activeEnemyCharacter.name} ${
  //         this.#activeEnemyCharacter.attacks[this.#activePlayerAttackIndex+1].name
  //       } you back`,
  //     ],
  //     () => {
  //       this.time.delayedCall(500, () => {
  //         // Characters attacking alternately
  //         this.#activePlayerCharacter.takeDamage(20, () => {
  //           this.#battleMenu.showMainBattleMenu();
  //         });
  //       });
  //     }
  //   );
  // }

  #playerAttack() {
    this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
      [`mafia choose to attack`],
      () => {
        this.time.delayedCall(500, () => {
          // Characters attacking alternately
          this.#activeEnemyCharacter.takeDamage(20, () => {
            this.#battleMenu.currentState = BattleState.ENEMY_TURN;
            this.#enemyAttack();
          });
        });
      }
    );
  }

  #enemyAttack() {
    this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
      [`police attack back`],
      () => {
        this.time.delayedCall(500, () => {
          // Characters attacking alternately
          this.#activePlayerCharacter.takeDamage(20, () => {
            this.#battleMenu.currentState = BattleState.WAITING_FOR_PLAYER;
            this.#battleMenu.showMainBattleMenu();
          });
        });
      }
    );
  }
}
