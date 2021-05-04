// import Phaser from 'phaser'
import cons from '../constants'
import Score from '../components/score';

// class MainScene extends Phaser.Scene {
class MainScene {
    constructor () {
        // super();

        // this.game = null
        this.gameOver = false

    }

    preload () {
        this.load.image('ball', 'assets/ball_32_32.png')
        this.load.image('brick_b', 'assets/brick1_64_32.png')
        this.load.image('brick_y', 'assets/brick2_64_32.png')
        this.load.image('brick_r', 'assets/brick3_64_32.png')
        this.load.image('paddle', 'assets/paddle_128_32.png')

        // this.cameras.main.backgroundColor.setTo(232, 135, 30)

    }

    create () {
        this.player = this.physics.add.sprite(
            cons.WIDTH_SCENE / 2, // x position
            cons.HEIGHT_SCENE - 200, // y position
            'paddle', // key of image for the sprite
        )

        this.ball = this.physics.add.sprite(
            cons.WIDTH_SCENE / 2, // x position
            cons.HEIGHT_SCENE - 250, // y position
            'ball' // key of image for the sprite
        )

        this.violetBricks = this.physics.add.group({
            key: 'brick_b',
            repeat: 9,
            immovable: true,
            setScale: { x: .5, y: .5 }, // scale a group of image
            setXY: {
              x: (cons.WIDTH_SCENE - 40 * 9) / 2,
              y: 140,
              stepX: 40
            }
        })

        this.yellowBricks = this.physics.add.group({
            key: 'brick_y',
            repeat: 9,
            immovable: true,
            setScale: { x: .5, y: .5 },
            setXY: {
              x: (cons.WIDTH_SCENE - 40 * 9) / 2,
              y: 90,
              stepX: 40
            }
        })

        this.redBricks  = this.physics.add.group({
            key: 'brick_r',
            repeat: 9,
            immovable: true,
            setScale: { x: .5, y: .5 },
            setXY: {
              x: (cons.WIDTH_SCENE - 40 * 9) / 2,
              y: 40,
              stepX: 40
            }
        })

        // Manage key presses
        let cursors = this.input.keyboard.createCursorKeys()

        // Ensure that the player and ball can't leave the screen
        this.player.setCollideWorldBounds(true)
        this.ball.setCollideWorldBounds(true)
        this.ball.setBounce(1, 1)
        this.ball.setVelocityY(-500)

        this.physics.world.checkCollision.down = false;

        // Add collision for the bricks
        this.physics.add.collider(this.ball, this.violetBricks, this.hitBrick, null, this)
        this.physics.add.collider(this.ball, this.yellowBricks, this.hitBrick, null, this)
        this.physics.add.collider(this.ball, this.redBricks, this.hitBrick, null, this)

        // Make the player immovable
        this.player.setImmovable(true);
        // Add collision for the player
        this.physics.add.collider(this.ball, this.player, this.hitPlayer, null, this)

        // pointer control
        this.input.on('pointermove', function (pointer) {
            if (this.gameOver) return
            if (pointer.isDown) {
                this.player.x = pointer.x
            }
        }, this)

    }

    update () {
        if (this.gameOver) return

        if (this.ball.body.y > cons.HEIGHT_SCENE) {
            this.gameOver = true
            console.log('game over')
            this.add.text(this.cameras.main.centerX, this.cameras.main.centerY,
                'Game Over',
                { fontSize: '48px', fill: '#fff' }).setOrigin(0.5)
            this.scene.pause()
        }


      

    }

    hitBrick (ball, brick) {
        brick.disableBody(true, true);
      
        if (ball.body.velocity.x == 0) {
            let randNum = Phaser.Math.Between(0, 1)
            if (randNum === 1) {
                ball.body.setVelocityX(150);
            } else {
                ball.body.setVelocityX(-150);
            }
        }
    }

    hitPlayer (ball, player) {
        // Increase the velocity of the ball after it bounces
        ball.setVelocityY(ball.body.velocity.y - 5)
      
        let newXVelocity = Math.abs(ball.body.velocity.x) + 5
        // If the ball is to the left of the player, ensure the x velocity is negative
        if (ball.x < player.x) {
          ball.setVelocityX(-newXVelocity)
        } else {
          ball.setVelocityX(newXVelocity)
        }
    }

}

export default MainScene
