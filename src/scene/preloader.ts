import Phaser from "phaser";
import { ASSET_KEYS, SCENE_KEYS } from "../assets/keys";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.PRELOAD_SCENE);
  }

  preload() {
    this.load.image(ASSET_KEYS.CITY, "/images/city.png");
    this.load.image(ASSET_KEYS.MAFIA, "/images/mafia.png");
    this.load.image(ASSET_KEYS.POLICE, "/images/police.png");

    // Health
    this.load.image(
      ASSET_KEYS.HEALTH_BAR_BACKGROUND,
      "/images/kenneys-assets/ui-space-expansion/custom-ui.png"
    );
    this.load.image(
      ASSET_KEYS.LEFT_CAP,
      "/images/kenneys-assets/ui-space-expansion/barHorizontal_green_left.png"
    );
    this.load.image(
      ASSET_KEYS.MIDDLE,
      "/images/kenneys-assets/ui-space-expansion/barHorizontal_green_mid.png"
    );
    this.load.image(
      ASSET_KEYS.RIGHT_CAP,
      "/images/kenneys-assets/ui-space-expansion/barHorizontal_green_right.png"
    );
    this.load.image(
      ASSET_KEYS.LEFT_CAP_SHADOW,
      "/images/kenneys-assets/ui-space-expansion/barHorizontal_shadow_left.png"
    );
    this.load.image(
      ASSET_KEYS.MIDDLE_SHADOW,
      "/images/kenneys-assets/ui-space-expansion/barHorizontal_shadow_mid.png"
    );
    this.load.image(
      ASSET_KEYS.RIGHT_CAP_SHADOW,
      "/images/kenneys-assets/ui-space-expansion/barHorizontal_shadow_right.png"
    );

    // Cursor
    this.load.image(ASSET_KEYS.CURSOR, "/images/monster-tamer/ui/cursor.png");

    // Attack json
    this.load.json(ASSET_KEYS.ATTACKS, "/data/attacks.json");
  }
  create() {
    this.scene.start(SCENE_KEYS.BATTLE_SCENE);
  }
}
