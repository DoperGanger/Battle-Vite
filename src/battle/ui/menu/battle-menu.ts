import Phaser from "phaser";
import {
  ASSET_KEYS,
  BATTLE_MENU_OPTIONS,
  BATTLE_UI_TEXT_STYLE,
  DIRECTION,
  battleMenuOptions,
  direction,
} from "../../../assets/keys";

export class BattleMenu {
  #scene!: Phaser.Scene;
  #mainBattleMenuPhaserContainerGameObject!: Phaser.GameObjects.Container;
  #battleTextGameObjectLine1!: Phaser.GameObjects.Text;
  #battleTextGameObjectLine2!: Phaser.GameObjects.Text;
  #mainBattleMenuCursorPhaserImageGameObject!: Phaser.GameObjects.Image;
  #selectedBattleMenuOption!: battleMenuOptions;

  constructor(scene: Phaser.Scene) {
    this.#scene = scene;
    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
    this.#createMainInfoPane();
    this.#createMainBattlemenu();
  }

  showMainbattlemenu() {
    this.#mainBattleMenuPhaserContainerGameObject.setAlpha(1);
    this.#battleTextGameObjectLine1.setAlpha(1);
    this.#battleTextGameObjectLine2.setAlpha(1);

    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
    this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(
      ASSET_KEYS.CURSOR_X,
      ASSET_KEYS.CURSOR_Y
    );
  }

  hideMainbattlemenu() {
    this.#mainBattleMenuPhaserContainerGameObject.setAlpha(0);
    this.#battleTextGameObjectLine1.setAlpha(0);
    this.#battleTextGameObjectLine2.setAlpha(0);
  }

  handlePlayerInput(input: direction | "OK" | "CANCEL") {
    console.log(input);
    this.#updateSelectedBattleMenuOptionFromInput(input);
    this.#moveMainBattleMenuCursor();
  }

  #createMainInfoPane() {
    const padding = 4;
    const rectHeight = 124;
    const borderRadius = 20; // Set the border radius

    // Create a Graphics object
    const graphics = this.#scene.add.graphics();

    // Set line style for the border
    graphics.lineStyle(8, 0xaad7d9, 1);

    // Set fill style for the rectangle
    graphics.fillStyle(0xffffec, 1);

    // Draw a rounded rectangle
    graphics.fillRoundedRect(
      padding,
      this.#scene.scale.height - rectHeight - padding,
      this.#scene.scale.width - padding * 2,
      rectHeight,
      borderRadius
    );

    graphics.strokeRoundedRect(
      padding,
      this.#scene.scale.height - rectHeight - padding,
      this.#scene.scale.width - padding * 2,
      rectHeight,
      borderRadius
    );
  }

  #createMainBattlemenu() {
    // text line
    this.#battleTextGameObjectLine1 = this.#scene.add.text(
      30,
      468,
      "You encountered the...",
      BATTLE_UI_TEXT_STYLE
    );
    this.#battleTextGameObjectLine2 = this.#scene.add.text(
      160,
      512,
      `COPS!!!`,
      BATTLE_UI_TEXT_STYLE
    );

    // cursor
    this.#mainBattleMenuCursorPhaserImageGameObject = this.#scene.add
      .image(ASSET_KEYS.CURSOR_X, ASSET_KEYS.CURSOR_Y, ASSET_KEYS.CURSOR, 0)
      .setOrigin(0.5)
      .setScale(2.5);

    this.#mainBattleMenuPhaserContainerGameObject = this.#scene.add.container(
      530,
      448,
      [
        this.#createMainInfoSubPane(),
        this.#scene.add.text(
          75,
          22,
          BATTLE_MENU_OPTIONS.FIGHT,
          BATTLE_UI_TEXT_STYLE
        ),
        this.#scene.add.text(
          260,
          22,
          BATTLE_MENU_OPTIONS.PAY,
          BATTLE_UI_TEXT_STYLE
        ),
        this.#scene.add.text(
          75,
          70,
          BATTLE_MENU_OPTIONS.RUN,
          BATTLE_UI_TEXT_STYLE
        ),
        this.#mainBattleMenuCursorPhaserImageGameObject,
      ]
    );

    this.hideMainbattlemenu();
  }

  #createMainInfoSubPane() {
    const rectWidth = 490;
    const rectHeight = 124;
    const borderRadius = 20; // Set the border radius

    // Create a Graphics object
    const graphics = this.#scene.add.graphics();

    // Set line style for the border
    graphics.lineStyle(8, 0x905ac2, 1);

    // Set fill style for the rectangle
    graphics.fillStyle(0xede4f3, 1);

    // Draw a rounded rectangle
    graphics.fillRoundedRect(0, 0, rectWidth, rectHeight, borderRadius);
    graphics.strokeRoundedRect(0, 0, rectWidth, rectHeight, borderRadius);

    return graphics;
  }

  #updateSelectedBattleMenuOptionFromInput(
    direction: direction | "OK" | "CANCEL"
  ) {
    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FIGHT) {
      switch (direction) {
        case DIRECTION.RIGHT:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.PAY;
          return;
        case DIRECTION.DOWN:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.RUN;
          return;
        case DIRECTION.LEFT:
        case DIRECTION.UP:
        case DIRECTION.NONE:
          return;
        default:
          return;
      }
    }
    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.PAY) {
      switch (direction) {
        case DIRECTION.LEFT:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
          return;
        case DIRECTION.DOWN:
        case DIRECTION.RIGHT:
        case DIRECTION.UP:
        case DIRECTION.NONE:
          return;
        default:
          return;
      }
    }
    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.RUN) {
      switch (direction) {
        case DIRECTION.RIGHT:
          return;
        case DIRECTION.UP:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
          return;
        case DIRECTION.LEFT:
        case DIRECTION.DOWN:
        case DIRECTION.NONE:
          return;
        default:
          return;
      }
    }
    // if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FLEE) {
    //   switch (direction) {
    //     case DIRECTION.LEFT:
    //       this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
    //       return;
    //     case DIRECTION.UP:
    //       this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.SWITCH;
    //       return;
    //     case DIRECTION.RIGHT:
    //     case DIRECTION.DOWN:
    //     case DIRECTION.NONE:
    //       return;
    //     default:
    //       return
    //   }
    //   return;
    // }
  }

  #moveMainBattleMenuCursor() {
    switch (this.#selectedBattleMenuOption) {
      case BATTLE_MENU_OPTIONS.FIGHT:
        this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(
          ASSET_KEYS.CURSOR_X,
          ASSET_KEYS.CURSOR_Y
        );
        return;
      case BATTLE_MENU_OPTIONS.PAY:
        this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(
          228,
          ASSET_KEYS.CURSOR_Y
        );
        return;
      case BATTLE_MENU_OPTIONS.RUN:
        this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(
          ASSET_KEYS.CURSOR_X,
          86
        );
        return;
      // case BATTLE_MENU_OPTIONS.FLEE:
      //   this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(228, 86);
      //   return;
      default:
        return;
    }
  }
}
