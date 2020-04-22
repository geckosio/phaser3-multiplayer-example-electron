import { Game } from 'phaser'
import MainScene from './mainScene'

new Game({
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [MainScene],
  physics: {
    default: 'arcade',

    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
})
