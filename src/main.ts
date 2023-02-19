import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import { Assets } from "@pixi/assets";

import "./style.css";
import { Ticker } from "pixi.js";

/** bees attack stuff */
// if (count < 3) {
//   app.stage.removeChild(hearts[count]);
//   app.stage.addChild(brokenHearts[count]);
//   count += 1;
// }

const WIDTH = window.innerWidth * 0.8;
const HEIGHT = window.innerHeight * 0.8;

// let count = 0;
// let beeAttacking = false;

window.addEventListener("load", async () => {
  const app = new PIXI.Application({
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: 0xffffff,
  });

  await Assets.load(["images/duck.json", "images/fox.json", "images/bee.json"]);

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

  // brokenhearts
  const brokenHeart1 = PIXI.Sprite.from("images/brokenHeart.png");
  const brokenHeart2 = PIXI.Sprite.from("images/brokenHeart.png");
  const brokenHeart3 = PIXI.Sprite.from("images/brokenHeart.png");
  brokenHeart1.anchor.set(0.5);
  brokenHeart2.anchor.set(0.5);
  brokenHeart3.anchor.set(0.5);

  // set hearts and broken hearts
  const heart1 = PIXI.Sprite.from("images/heart.png");
  heart1.anchor.set(0.5);
  heart1.x = brokenHeart1.x = app.view.width / 1.15;
  heart1.y = brokenHeart1.y = app.view.height / 25;
  heart1.scale.x = brokenHeart1.scale.x = 4;
  heart1.scale.y = brokenHeart1.scale.y = 4;
  app.stage.addChild(heart1);

  const heart2 = PIXI.Sprite.from("images/heart.png");
  heart2.anchor.set(0.5);
  heart2.x = brokenHeart2.x = app.view.width / 1.1;
  heart2.y = brokenHeart2.y = app.view.height / 25;
  heart2.scale.x = brokenHeart2.scale.x = 4;
  heart2.scale.y = brokenHeart2.scale.y = 4;
  app.stage.addChild(heart2);

  const heart3 = PIXI.Sprite.from("images/heart.png");
  heart3.anchor.set(0.5);
  heart3.x = brokenHeart3.x = app.view.width / 1.0525;
  heart3.y = brokenHeart3.y = app.view.height / 25;
  heart3.scale.x = brokenHeart3.scale.x = 4;
  heart3.scale.y = brokenHeart3.scale.y = 4;
  app.stage.addChild(heart3);

  let hearts = [heart1, heart2, heart3];
  let brokenHearts = [brokenHeart1, brokenHeart2, brokenHeart3];

  // egg
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

  // animate and stage duck
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

  // animate and stage bee
  const animateBee = Assets.cache.get("images/bee.json").animations;
  const bee = PIXI.AnimatedSprite.fromFrames(animateBee["bee"]);
  bee.anchor.set(0.5);
  bee.x = app.view.width / 2;
  bee.y = app.view.height / 3;
  bee.scale.x = 1.2;
  bee.scale.y = 1.2;
  bee.animationSpeed = 1 / 6;
  bee.play();
  app.stage.addChild(bee);

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

  let bee_x_target = 0;
  let bee_y_target = 0;
  function beeInterval() {
    bee_x_target =
      Math.random() * (app.view.width / 1.1 - app.view.width / 12) -
      app.view.width / 12;

    bee_y_target =
      Math.random() * (app.view.height / 1.8 - app.view.height / 25) -
      app.view.height / 25;
  }

  setInterval(beeInterval, 2000);

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

    // fox-egg tracking
    if (fox.x > egg.x) {
      fox.scale.x = 5;
      fox.x -= 3;
    }
    if (fox.x < egg.x) {
      fox.scale.x = -5;
      fox.x += 3;
    }

    // bee-duck tracking
    // if (bee.x > duck.x) {
    //   bee.scale.x = 1.2;
    //   bee.x -= 3;
    // }
    // if (bee.x < duck.x) {
    //   bee.scale.x = -1.2;
    //   bee.x += 3;
    // }
    // if (bee.y < duck.y - 40) {
    //   bee.y += 1;
    // }
    // if (bee.y >= duck.y - 40 && bee.y > HEIGHT / 1.35 - 40) {
    //   bee.y -= 1;
    // }
    // Have to make bees randomly fly until they attack at random intervals?

    if (bee.x > bee_x_target && bee.x > app.view.width / 12) {
      bee.scale.x = 1.2;
      bee.x -= 1;
    }
    if (bee.x < bee_x_target && bee.x < app.view.width / 1.1) {
      bee.scale.x = -1.2;
      bee.x += 1;
    }

    if (bee.y > bee_y_target && bee.y > app.view.height / 25) {
      bee.y -= 1;
    }
    if (bee.y < bee_y_target && bee.y < app.view.height / 1.8) {
      bee.y += 1;
    }
  });
});
