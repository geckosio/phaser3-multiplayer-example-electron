import geckos, { ClientChannel } from '@geckos.io/client'
import { Scene, Types } from 'phaser'

class MainScene extends Scene {
  dudes: Map<String, Phaser.GameObjects.Sprite> = new Map()
  channel: ClientChannel
  cursors: Types.Input.Keyboard.CursorKeys

  constructor() {
    super('MainScene')
  }

  geckos() {
    const channel = geckos({ port: 3000 })

    channel.onConnect((error) => {
      if (error) {
        console.error(error.message)
        return
      } else {
        console.log('You are connected')
      }

      channel.onDisconnect(() => {
        console.log('You got disconnected')
      })

      channel.on('level', (data: any) => {
        data.forEach((el) => {
          const element = this.add.image(el.x, el.y, el.key)
          element.setScale(el.scale)
        })
      })

      channel.on('update', (data) => {
        // @ts-ignore
        data.forEach((d) => {
          const dude = this.dudes.get(d.id)
          if (!dude) {
            console.log('add new dude')
            this.dudes.set(d.id, this.add.sprite(d.x, d.y, 'dude'))
          } else {
            dude.x = d.x
            dude.y = d.y
            if (dude?.anims?.currentAnim?.key !== d.animation)
              dude.anims.play(d.animation, true)
          }
        })
      })

      channel.on('destroy', (data: any) => {
        const { id } = data
        const dude = this.dudes.get(id)
        if (dude) {
          console.log('Destroy player ', id)
          dude.destroy()
          this.dudes.delete(id)
        }
      })
    })

    return channel
  }

  preload() {
    this.load.image('sky', 'assets/sky.png')
    this.load.image('ground', 'assets/platform.png')
    this.load.spritesheet('dude', 'assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
  }

  create() {
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    })

    this.add.image(400, 300, 'sky')

    this.channel = this.geckos()

    this.cursors = this.input.keyboard.createCursorKeys()

    this.add.text(
      20,
      20,
      'This what the player sees.\nMove arrow keys to move the player.',
      { fontSize: 20 }
    )
  }

  update() {
    if (this.channel) {
      if (this.cursors?.left?.isDown) {
        this.channel.emit('move', 'left')
      } else if (this.cursors?.right?.isDown) {
        this.channel.emit('move', 'right')
      }

      if (this.cursors?.up?.isDown) {
        this.channel.emit('move', 'jump')
      }
    }
  }
}

export default MainScene
