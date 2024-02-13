import Phaser from "phaser";
import { ASSET_KEYS, SCENE_KEYS } from "../assets/keys";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.PRELOAD_SCENE);
  }

  preload() {
    this.load.image(ASSET_KEYS.CITY, "/images/main-ui/Background.png");
    this.load.image(ASSET_KEYS.MAFIA, "/images/main-ui/player.png");
    this.load.image(ASSET_KEYS.POLICE, "/images/main-ui/e-police.png");

    // Health
    this.load.image(
      ASSET_KEYS.HEALTH_BAR_BACKGROUND,
      "/images/health/custom-ui.png"
    );
    this.load.image(
      ASSET_KEYS.LEFT_CAP,
      "/images/health/barHorizontal_green_left.png"
    );
    this.load.image(
      ASSET_KEYS.MIDDLE,
      "/images/health/barHorizontal_green_mid.png"
    );
    this.load.image(
      ASSET_KEYS.RIGHT_CAP,
      "/images/health/barHorizontal_green_right.png"
    );
    this.load.image(
      ASSET_KEYS.LEFT_CAP_SHADOW,
      "/images/health/barHorizontal_shadow_left.png"
    );
    this.load.image(
      ASSET_KEYS.MIDDLE_SHADOW,
      "/images/health/barHorizontal_shadow_mid.png"
    );
    this.load.image(
      ASSET_KEYS.RIGHT_CAP_SHADOW,
      "/images/health/barHorizontal_shadow_right.png"
    );

    // Cursor
    this.load.image(ASSET_KEYS.CURSOR, "/images/main-ui/cursor.png");

    // Attack json
    this.load.json(ASSET_KEYS.ATTACKS, "/data/attacks.json");
  }
  create() {
    this.scene.start(SCENE_KEYS.BATTLE_SCENE);
  }
}
