import Phaser from "phaser";
import {
  ASSET_KEYS,
  BATTLE_MENU_OPTIONS,
  BATTLE_UI_TEXT_STYLE,
  CHIP_OPTIONS,
  DIRECTION,
  battleMenuOptions,
  chipOptions,
  direction,
} from "../../../assets/keys";
import { CurrentState } from "../../../types/type";

export class BattleMenu {
  #scene!: Phaser.Scene;
  #battleTextGameObjectLine1!: Phaser.GameObjects.Text;
  #battleTextGameObjectLine2!: Phaser.GameObjects.Text;
  #battleTextGameObjectLine3!: Phaser.GameObjects.Text;
  #selectedBattleMenuOption!: battleMenuOptions;
  #selectedAttackIndex!: number; //#

  #selectedChipOption!: chipOptions;

  #chipPhaserContainerGameObject!: Phaser.GameObjects.Container;
  #chipCursorPhaserImageGameObject!: Phaser.GameObjects.Image;
  #mainBattleMenuPhaserContainerGameObject!: Phaser.GameObjects.Container;
  #mainBattleMenuCursorPhaserImageGameObject!: Phaser.GameObjects.Image;

  // Attack state
  // public attackState!: boolean;
  public currentState!: CurrentState; // check state

  // Callback declare
  #queuedInfoPanelMessages!: string[];
  #queuedInfoPanelCallback?: () => void | undefined;
  #waitingForPlayerInput!: boolean;

  constructor(scene: Phaser.Scene) {
    this.#scene = scene;
    this.#selectedChipOption = CHIP_OPTIONS.ATTACK;
    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
    this.#queuedInfoPanelMessages = [];
    this.#queuedInfoPanelCallback = undefined;
    this.#waitingForPlayerInput = false;
    this.#createMainInfoPane();
    this.#createChipMenu();
    this.#createMainBattleMenu();
    // this.attackState = false; reset attack state
    this.currentState = CurrentState.CHIP;
  }

  get selectedAttack(): number {
    return this.#selectedAttackIndex;
  }

  showChipMenu() {
    this.#chipPhaserContainerGameObject.setAlpha(1);
    this.#battleTextGameObjectLine3.setAlpha(1);
    this.#chipCursorPhaserImageGameObject.setPosition(
      ASSET_KEYS.CURSOR_X,
      ASSET_KEYS.CURSOR_Y
    );
  }

  hideChipMenu() {
    this.#battleTextGameObjectLine3.setAlpha(0);
    this.#chipPhaserContainerGameObject.setAlpha(0);
  }

  showMainBattleMenu() {
    this.#mainBattleMenuPhaserContainerGameObject.setAlpha(1);
    this.#battleTextGameObjectLine1.setText("You encountered the...");
    this.#battleTextGameObjectLine1.setAlpha(1);
    this.#battleTextGameObjectLine2.setAlpha(1);

    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
    this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(
      ASSET_KEYS.CURSOR_X,
      ASSET_KEYS.CURSOR_Y
    );

    // this.attackState = false; // reset attack state
    this.currentState = CurrentState.MENU;
    this.#selectedAttackIndex = -1; // Reset attack index
  }

  hideMainBattleMenu() {
    this.#mainBattleMenuPhaserContainerGameObject.setAlpha(0);
    this.#battleTextGameObjectLine1.setAlpha(0);
    this.#battleTextGameObjectLine2.setAlpha(0);
  }

  ///
  handlePlayerInput(input: direction | "OK" | "CANCEL") {
    console.log(input);

    // Callback 1
    if (this.#waitingForPlayerInput && (input === "CANCEL" || input === "OK")) {
      this.#updateInfoPaneWithMessage();
      return;
    }

    // Cursor handling
    this.#updateSelectedBattleMenuOptionFromInput(input);
    this.#moveMainBattleMenuCursor();

    this.#updateSelectedChipOptionFromInput(input);
    this.#moveChipCursor();

    // Chip option selection
    if (input === "OK") {
      this.#handlePlayerChooseChipWithIndex();
    }

    // Battle option selection
    if (input === "OK") {
      this.#handlePlayerChooseMainBattleOptionWithIndex();
    }
  }

  // Callback 2
  updateInfoPaneMessagesAndWaitForInput(
    messages: string[],
    callback: () => void
  ) {
    this.#queuedInfoPanelMessages = messages;
    this.#queuedInfoPanelCallback = callback;

    this.#updateInfoPaneWithMessage();
  }

  // Callback 3
  #updateInfoPaneWithMessage() {
    this.#waitingForPlayerInput = false;
    this.#battleTextGameObjectLine1.setText("").setAlpha(1);

    // Check if all messages have been displayed from the queue and call the callback
    if (this.#queuedInfoPanelMessages.length === 0) {
      if (this.#queuedInfoPanelCallback) {
        this.#queuedInfoPanelCallback();
        this.#queuedInfoPanelCallback = undefined;
      }
      return;
    }

    // Get first message from queue and animate message
    const messageToDisplay = this.#queuedInfoPanelMessages.shift();
    if (messageToDisplay !== undefined) {
      this.#battleTextGameObjectLine1.setText(messageToDisplay);
      this.#waitingForPlayerInput = true;
    }
  }
  ///

  #createMainInfoPane() {
    //lapisan biru luar
    const padding = 4;
    const rectHeight = 124;
    const borderRadius = 20; // Set the border radius

    // Create a graphics object
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

  #createChipMenu() {
    // text and container
    // Text line
    this.#battleTextGameObjectLine3 = this.#scene.add.text(
      30,
      468,
      "Choose your chip",
      BATTLE_UI_TEXT_STYLE
    );

    // Cursor
    this.#chipCursorPhaserImageGameObject = this.#scene.add
      .image(ASSET_KEYS.CURSOR_X, ASSET_KEYS.CURSOR_Y, ASSET_KEYS.CURSOR, 0)
      .setOrigin(0.5)
      .setScale(2.5);

    this.#chipPhaserContainerGameObject = this.#scene.add.container(530, 448, [
      this.#createChipSubPane(),
      this.#scene.add.text(75, 22, CHIP_OPTIONS.ATTACK, BATTLE_UI_TEXT_STYLE),
      this.#scene.add.text(260, 22, CHIP_OPTIONS.SPEED, BATTLE_UI_TEXT_STYLE),
      this.#scene.add.text(75, 70, CHIP_OPTIONS.DEFENSE, BATTLE_UI_TEXT_STYLE),
      this.#chipCursorPhaserImageGameObject,
    ]);

    this.hideChipMenu();
  }

  #createChipSubPane() {
    // lapisan ungu kanan
    const rectWidth = 490;
    const rectHeight = 124;
    const borderRadius = 20; // Set the border radius

    // Create a graphics object
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

  #createMainBattleMenu() {
    // text and container
    // Text line
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

    // Cursor
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

    this.hideMainBattleMenu();
  }

  #createMainInfoSubPane() {
    // lapisan ungu kanan
    const rectWidth = 490;
    const rectHeight = 124;
    const borderRadius = 20; // Set the border radius

    // Create a graphics object
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

  #updateSelectedChipOptionFromInput(direction: direction | "OK" | "CANCEL") {
    if (this.#selectedChipOption === CHIP_OPTIONS.ATTACK) {
      switch (direction) {
        case DIRECTION.RIGHT:
          this.#selectedChipOption = CHIP_OPTIONS.SPEED;
          return;
        case DIRECTION.DOWN:
          this.#selectedChipOption = CHIP_OPTIONS.DEFENSE;
          return;
        case DIRECTION.LEFT:
        case DIRECTION.UP:
        case DIRECTION.NONE:
          return;
        default:
          return;
      }
    }
    if (this.#selectedChipOption === CHIP_OPTIONS.SPEED) {
      switch (direction) {
        case DIRECTION.LEFT:
          this.#selectedChipOption = CHIP_OPTIONS.ATTACK;
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
    if (this.#selectedChipOption === CHIP_OPTIONS.DEFENSE) {
      switch (direction) {
        case DIRECTION.RIGHT:
          return;
        case DIRECTION.UP:
          this.#selectedChipOption = CHIP_OPTIONS.ATTACK;
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

  #moveChipCursor() {
    switch (this.#selectedChipOption) {
      case CHIP_OPTIONS.ATTACK:
        this.#chipCursorPhaserImageGameObject.setPosition(
          ASSET_KEYS.CURSOR_X,
          ASSET_KEYS.CURSOR_Y
        );
        return;
      case CHIP_OPTIONS.SPEED:
        this.#chipCursorPhaserImageGameObject.setPosition(
          228,
          ASSET_KEYS.CURSOR_Y
        );
        return;
      case CHIP_OPTIONS.DEFENSE:
        this.#chipCursorPhaserImageGameObject.setPosition(
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

  // #handlePlayerChooseMainBattleOption() {
  //   this.hideMainBattleMenu();

  //   if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FIGHT) {
  //     this.updateInfoPaneMessagesAndWaitForInput(
  //       ["You choose to FIGHT"],
  //       () => {
  //         this.showMainBattleMenu();
  //       }
  //     );
  //     return;
  //   }

  //   if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.PAY) {
  //     // this.#activeBattleMenu = ACTIVE_BATTLE_MENU.PAY;
  //     this.updateInfoPaneMessagesAndWaitForInput(["You choose to PAY"], () => {
  //       this.showMainBattleMenu();
  //     });
  //     return;
  //   }

  //   if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.RUN) {
  //     // this.#activeBattleMenu = ACTIVE_BATTLE_MENU.RUN;
  //     this.updateInfoPaneMessagesAndWaitForInput(["You Choose to RUN"], () => {
  //       this.showMainBattleMenu();
  //     });
  //     return;
  //   }
  // }

  #handlePlayerChooseMainBattleOptionWithIndex() {
    let selectedMoveIndex = 0;
    this.hideChipMenu();
    this.hideMainBattleMenu();
    switch (this.#selectedBattleMenuOption) {
      case BATTLE_MENU_OPTIONS.FIGHT:
        selectedMoveIndex = 0;
        console.log("index", selectedMoveIndex);
        break;
      case BATTLE_MENU_OPTIONS.PAY:
        selectedMoveIndex = 1;
        console.log("index", selectedMoveIndex);
        break;
      case BATTLE_MENU_OPTIONS.RUN:
        selectedMoveIndex = 2;
        console.log("index", selectedMoveIndex);
        break;
      default:
    }

    this.#selectedAttackIndex = selectedMoveIndex;
  }
  
  #handlePlayerChooseChipWithIndex() {
    let selectedMoveIndex = 0;
    this.hideChipMenu();
    this.hideMainBattleMenu();
    switch (this.#selectedBattleMenuOption) {
      case BATTLE_MENU_OPTIONS.FIGHT:
        selectedMoveIndex = 0;
        console.log("index", selectedMoveIndex);
        break;
      case BATTLE_MENU_OPTIONS.PAY:
        selectedMoveIndex = 1;
        console.log("index", selectedMoveIndex);
        break;
      case BATTLE_MENU_OPTIONS.RUN:
        selectedMoveIndex = 2;
        console.log("index", selectedMoveIndex);
        break;
      default:
    }

    this.#selectedAttackIndex = selectedMoveIndex;
  }
}
