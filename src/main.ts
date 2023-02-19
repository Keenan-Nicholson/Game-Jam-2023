import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import { Assets } from "@pixi/assets";

import "./style.css";

const WIDTH = window.innerWidth * 0.8;
const HEIGHT = window.innerHeight * 0.8;

window.addEventListener("load", async () => {
  const app = new PIXI.Application({
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: 0xffffff,
  });

  await Assets.load(["images/duck.json"]);

  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

  document.body.appendChild(app.view);

  sound.add("my-sound", {
    url: "music/Duck_Game_Song.mp3",
    loop: true,
  });
  sound.play("my-sound");
  sound.volume("my-sound", 0.1);

  const background = PIXI.Sprite.from("images/background.jpg");
  background.anchor.set(0.5);

  background.position.set(app.screen.width / 2, app.screen.height / 2);
  background.width = WIDTH;
  background.height = HEIGHT;
  app.stage.addChild(background);

  const fox = PIXI.Sprite.from("images/fox1.png");

  fox.anchor.set(0.5);
  fox.x = app.view.width / 1.15;
  fox.y = app.view.height - 160;

  fox.width = 250;
  fox.height = 250;
  app.stage.addChild(fox);

  const animations = Assets.cache.get("images/duck.json").animations;
  const duck = PIXI.AnimatedSprite.fromFrames(animations["duck"]);
  duck.anchor.set(0.5);
  duck.x = app.view.width / 2;
  duck.y = app.view.height - 100;
  duck.scale.x = 4;
  duck.scale.y = 4;
  duck.play();

  /* const duck = PIXI.Sprite.from("images/duck.png"); */

  app.stage.addChild(duck);

  const pressing = {
    right: false,
    left: false,
    jump: false,
  };

  const handleKey = (code: string, state: boolean) => {
    switch (code) {
      case "ArrowRight":
        pressing.right = state;
        break;
      case "ArrowLeft":
        pressing.left = state;
        break;
      case "Space":
        pressing.jump = state;
        break;
    }
  };

  window.addEventListener("keydown", (event) => handleKey(event.code, true));
  window.addEventListener("keyup", (event) => handleKey(event.code, false));

  app.ticker.add(() => {
    if (pressing.right) {
      duck.scale.x = 4;
      if (duck.x < app.view.width - 55) {
        duck.x += 5;
      }
    }

    if (pressing.left) {
      duck.scale.x = -4;
      if (duck.x > 55) {
        duck.x -= 5;
      }
    }

    if (pressing.jump) {
      duck.y = HEIGHT / 1.25;
    } else {
      duck.y = app.view.height - 100;
    }
  });
});
