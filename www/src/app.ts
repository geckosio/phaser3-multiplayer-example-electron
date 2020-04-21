import { Game as PhaserGame } from 'phaser'
import MainScene from './mainScene'

new PhaserGame({
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [MainScene],
})
