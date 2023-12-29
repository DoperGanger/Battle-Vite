import Phaser from "phaser";
import { ASSET_KEYS, SCENE_KEYS } from "../assets/keys";

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.BATTLE_SCENE);
  }

  create() {
    // create background
    this.add.image(0, 0, ASSET_KEYS.CITY).setOrigin(0);
    // create player
    this.add.image(256, 316, ASSET_KEYS.MAFIA, 0);
    // create enemy
    this.add.image(768, 316, ASSET_KEYS.POLICE, 0);

    // render out the player health bar
    const playerName = this.add.text(30, 20, ASSET_KEYS.MAFIA, {
      color: "#7E3D3F",
      fontSize: "32px",
    });
    this.add.container(0, 0, [
      this.add.image(0, 0, ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0).setScale(1, 0.85),
      playerName,
      this.#createHealth(34, 34),
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

    // render out the enemy health bar
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
      this.#createHealth(34, 34),
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
  }

  #createHealth(x: number, y: number) {
    const scaleY = 0.7;
    const leftCap = this.add
      .image(x, y, ASSET_KEYS.LEFT_CAP)
      .setOrigin(0, 0.5)
      .setScale(1, scaleY);
    const middle = this.add
      .image(leftCap.x + leftCap.width, y, ASSET_KEYS.MIDDLE)
      .setOrigin(0, 0.5)
      .setScale(1, scaleY);
    middle.displayWidth = 360;
    const rightCap = this.add
      .image(middle.x + middle.displayWidth, y, ASSET_KEYS.RIGHT_CAP)
      .setOrigin(0, 0.5)
      .setScale(1, scaleY);

    return this.add.container(x, y, [leftCap, middle, rightCap]);
  }
}
