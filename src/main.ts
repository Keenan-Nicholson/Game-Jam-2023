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

  await Assets.load(["images/duck.json", "images/fox.json"]);

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

  const egg = PIXI.Sprite.from("images/egg.png");
  egg.anchor.set(0.5);
  egg.x =
    Math.random() * (app.view.width / 1.1 - app.view.width / 12) -
    app.view.width / 12;
  egg.y = app.view.height / 1.07;
  egg.scale.x = 3;
  egg.scale.y = 3;
  app.stage.addChild(egg);

  // animate and stage fox
  const animateFox = Assets.cache.get("images/fox.json").animations;
  const fox = PIXI.AnimatedSprite.fromFrames(animateFox["fox"]);
  fox.anchor.set(0.5);
  fox.x = Math.random() > 0.5 ? app.view.width + 200 : -200;
  fox.y = app.view.height / 1.152;
  fox.scale.x = 5;
  fox.scale.y = 5;
  fox.animationSpeed = 1 / 6;
  fox.play();
  app.stage.addChild(fox);

  // animate and stage fox
  const animateDuck = Assets.cache.get("images/duck.json").animations;
  const duck = PIXI.AnimatedSprite.fromFrames(animateDuck["duck"]);
  duck.anchor.set(0.5);
  duck.x = app.view.width / 2;
  duck.y = app.view.height / 1.09;
  duck.scale.x = 5;
  duck.scale.y = 5;
  duck.animationSpeed = 1 / 6;
  duck.play();
  app.stage.addChild(duck);

  const pressing = {
    right: false,
    left: false,
    jump: false,
    hit: false,
  };

  const handleKey = (code: string, state: boolean) => {
    switch (code) {
      case "ArrowRight":
        pressing.right = state;
        break;
      case "ArrowLeft":
        pressing.left = state;
        break;
      case "ArrowUp":
        pressing.jump = state;
        break;
      case "Space":
        pressing.hit = state;
        break;
    }
  };

  window.addEventListener("keydown", (event) => handleKey(event.code, true));
  window.addEventListener("keyup", (event) => handleKey(event.code, false));

  app.ticker.add(() => {
    if (pressing.right) {
      duck.scale.x = 5;
      if (duck.x < app.view.width - 55) {
        duck.x += 5;
      }
    }

    if (pressing.left) {
      duck.scale.x = -5;
      if (duck.x > 55) {
        duck.x -= 5;
      }
    }

    if (pressing.jump) {
      duck.y = HEIGHT / 1.35;
    } else {
      duck.y = app.view.height / 1.09;
    }

    if (
      duck.x < fox.x + 75 &&
      duck.x > fox.x - 75 &&
      pressing.hit &&
      !pressing.jump
    ) {
      if (fox.x > duck.x) {
        fox.x += 200;
      } else {
        fox.x -= 200;
      }
    }

    if (fox.x > egg.x) {
      fox.scale.x = 5;
      fox.x -= 3;
    }
    if (fox.x < egg.x) {
      fox.scale.x = -5;
      fox.x += 3;
    }
  });
});
