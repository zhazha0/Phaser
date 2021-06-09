// import Phaser from 'phaser'
import cons from '../constants'
import Counter from '../components/publicComponents/counter';
import Enemy from '../components/enemy';
// import Ball from '../objects/ball'
// class MainScene extends Phaser.Scene {
class MainScene {
    constructor () {
        // super();

        // this.game = null
        this.gameOver = false
        this.score = null
        this.blood = 100

    }

    preload () {
        // explosion demo
        // this.load.spritesheet('explosion', 'assets/explosion.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 })
        // thunderbolt demo
        this.load.spritesheet('thunderbolt', 'assets/thunderbolt.jpg', { frameWidth: 626 / 5, frameHeight: 417 / 2 })

        // background
        this.load.image('background', 'assets/back.png')
        // clouds
        this.load.spritesheet('cloud', 'assets/clouds.png', { frameWidth: 64, frameHeight: 32 })
        // pillars
        this.load.spritesheet("plate", "./assets/plates.png", { frameWidth: 64, frameHeight: 40 })
        // player
        this.load.spritesheet("player", "./assets/players.png", { frameWidth: 36, frameHeight: 64 })
        // focus
        this.load.spritesheet("button", "./assets/buttons.png", { frameWidth: 80, frameHeight: 40 })
        // icons
        this.load.spritesheet("icon", "./assets/icons.png", { frameWidth: 20, frameHeight: 20 })

        // this.cameras.main.backgroundColor.setTo(232, 135, 30)

    }

    create () {
        // thunderbolt demo
        // var config = {
        //     key: 'thunderbolt',
        //     frames: this.anims.generateFrameNumbers('thunderbolt', { start: 0, end: 10 }),
        //     frameRate: 10,
        //     repeat: -1
        // };

        // this.anims.create(config);

        // this.add.sprite(200, 300, 'thunderboltsprite').play('thunderbolt').setDepth(3);


        this.matter.world.setBounds(0, 0, this.sys.scale.width, this.sys.scale.height)
        // check this with other method
        // this.matter.world.setBounds(0, 0, game.config.width, game.config.height);

        this.bullet = this.matter.add.sprite(100, 600, 'icon', 0)
        this.bullet.setMass(80)
        this.bullet.setIgnoreGravity(true) 
        // this.bullet.depth = 1

        this.fixpoint = this.add.sprite(100, 600, 'icon', 1)

        // this.matter.add.spring(this.bullet, this.fixpoint, 140, 0.001)

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(4, 0x00ff00, 1);

        this.generatePyramid({ x: 300, y: 700 })

        this.isReady = true

        let self = this
        this.bullet
            .setInteractive({ draggable: true })
            .on('dragstart', function (pointer, dragX, dragY) {
                console.log('dragstart')
            })
            .on('drag', function (pointer, dragX, dragY) {
                self.bullet.setPosition(dragX, dragY);
                console.log('drag')
                self.line = new Phaser.Geom.Line(
                    self.fixpoint.x,
                    self.fixpoint.y,
                    self.bullet.x,
                    self.bullet.y
                );
                self.graphics.clear()
                self.graphics.strokeLineShape(self.line)
            })
            .on('dragend', function (pointer, dragX, dragY, dropped) {
                // ...
                console.log('dragend')
                self.graphics.clear()
                self.bullet.setIgnoreGravity(false) 
                self.bullet
                    .setVelocityX((self.fixpoint.x - self.bullet.x) / 5)
                    .setVelocityY((self.fixpoint.y - self.bullet.y) / 5)
                self.time.delayedCall(2 * 1000,
                    () => {
                        self.bullet = self.matter.add.sprite(100, 600, 'icon', 0)
                        self.bullet.setMass(80)
                        self.bullet.setIgnoreGravity(true)
                        console.log('set new')
                        self.isReady = true
                    })
                
            })
    }

    update () {
        
    }

    generatePyramid(pos) {
        let col = 10
        let row = 8
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col - i; j++) {
                let x = pos.x - (12 * j / 2) + j * 12
                let y = pos.y - 20 * i
                let rect = this.add.rectangle(0, 0, 12, 20, 0xff0000, 1)
                rect.x = x
                rect.y = y
                this.matter.add.gameObject(rect)
            }
        }

    }

}

export default MainScene

// `Phaser.Geom.Line` as opposed to the `Phaser.GameObjects.Line`

// this.add.line(
//     0,
//     0,
//     sprite1.x,
//     sprite1.y,
//     sprite2.x,
//     sprite2.y,
//     0xff0000
// )

// // creating my line
// const line = new Phaser.Geom.Line(
//     sprite1.x,
//     sprite1.y,
//     sprite2.x,
//     sprite2.y
// );

// // in Scene.update()
// this.graphics.strokeLineShape(line)

// too fast movement make matterjs collider not working
// It is tunneling.Physics engines have ccd(continues collision detection) to detect such collisions but matterjs doesn't have . You can try increasing position and velocity iterations but they probably won't be enough for too fast objects.

//     this.matter.world.engine.positionIterations = 20;
// this.matter.world.engine.velocityIterations = 20;

//  var blockA = this.matter.add.image(200, 300, 'block').setBounce(1).setFriction(0);
// blockA.setVelocityX(25);