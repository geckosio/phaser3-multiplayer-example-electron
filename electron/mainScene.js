const geckos = require('@geckos.io/server').default

const DEBUG = true

class MainScene extends Phaser.Scene {
  players = new Map()
  level = []
  io
  controls

  constructor() {
    super('MainScene')
  }

  geckos() {
    const io = geckos()

    io.listen(3000)

    io.onConnection((channel) => {
      console.log('new player connected')

      const dude = this.physics.add.sprite(Math.random() * 300 + 50, 10, 'dude')
      dude.setBounce(0.2)
      dude.setCollideWorldBounds(true)
      this.players.set(channel.id, { dude })

      // make this player collide with the level (staticGroup in this case)
      this.physics.add.collider(dude, this.staticGroup)

      // make sure the client gets the current level
      channel.emit('level', this.level, { reliable: true })

      channel.onDisconnect(() => {
        const player = this.players.get(channel.id)
        if (player) {
          const { dude } = player
          if (dude) {
            dude.destroy()
            console.log('dude destroyed')
            io.emit('destroy', { id: channel.id }, { reliable: true })
          }
          this.players.delete(channel.id)
        }
      })

      channel.on('move', (data) => {
        const dude = this.players.get(channel.id).dude
        if (dude) {
          if (data === 'jump') {
            dude.body.setVelocityY(-300)
          } else {
            const speed = 150
            dude.body.setVelocityX(data === 'right' ? speed : -speed)
          }
        }
      })
    })

    return io
  }

  init() {
    this.level = [
      { key: 'ground', x: 400, y: 568, scale: 2 },
      { key: 'ground', x: 600, y: 400, scale: 1 },
      { key: 'ground', x: 50, y: 250, scale: 1 },
      { key: 'ground', x: 750, y: 220, scale: 1 },
    ]
  }

  preload() {
    this.load.image('ground', '../www/src/assets/platform.png')
    this.load.spritesheet('dude', '../www/src/assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
  }

  create() {
    this.io = this.geckos()

    if (DEBUG) {
      const cursors = this.input.keyboard.createCursorKeys()
      const controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        acceleration: 0.04,
        drag: 0.0005,
        maxSpeed: 0.5,
      }
      this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(
        controlConfig
      )
    }

    // generate level
    this.staticGroup = this.physics.add.staticGroup()
    this.level.forEach((el) => {
      this.staticGroup
        .create(el.x, el.y, el.key)
        .setScale(el.scale)
        .refreshBody()
    })

    this.add
      .text(
        20,
        20,
        'This what the server sees.\nOpen your browser at http://localhost:8080/ to play.\nUse your arrow keys to move the camera.',
        { fontSize: 20 }
      )
      .setScrollFactor(0)
  }

  update(time, delta) {
    if (DEBUG) this.controls.update(delta)

    if (this.io && this.players.size >= 1) {
      const update = []
      this.players.forEach((player, id) => {
        const animation = player.dude.body.velocity.x > 0 ? 'right' : 'left'
        update.push({ id, x: player.dude.x, y: player.dude.y, animation })
      })
      this.io.emit('update', update)
    }
  }
}

module.exports = MainScene
