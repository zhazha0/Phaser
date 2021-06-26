// import Phaser from 'phaser'
import cons from '../constants'
import Counter from '../components/publicComponents/counter';
// import Ball from '../objects/ball'
// class MainScene extends Phaser.Scene {
class MainScene {
    constructor () {
        // super();

        // this.game = null
        this.gameOver = false
        this.score = null

    }

    preload () {

        // sling
        this.load.image("sling1", "./assets/sling1.png")
        this.load.image("sling2", "./assets/sling2.png")
        this.load.image("sling3", "./assets/sling3.png")
        // stone
        this.load.image("stone", "./assets/boulder.png")
        this.cameras.main.backgroundColor.setTo(232, 135, 30)

    }

    create () {
        let startPos = { x: 200, y: 600 }
        this.sling1 = this.add.image(startPos.x, startPos.y, 'sling1')
        this.sling1.depth = 0
        let sling2 = this.add.image(this.sling1.x - 25, this.sling1.y - 40, 'sling2')
        sling2.depth = 3

        this.stone = this.matter.add.image(this.sling1.x - 10, this.sling1.y - 60, 'stone')
        this.stone.depth = 2
        this.stone.setCircle()

        this.stone.setMass(80)
        this.stone.setIgnoreGravity(true) 

        this.matter.world.setBounds(0, 0, this.sys.scale.width, this.sys.scale.height)
        // check this with other method
        // this.matter.world.setBounds(0, 0, game.config.width, game.config.height);

        this.sling1._fixpoint = { x: this.sling1.x + 5, y: this.sling1.y - 70 }
        sling2._fixpoint = { x: sling2.x, y: sling2.y - 40 }

        // this.matter.add.spring(this.bullet, this.fixpoint, 140, 0.001)

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(4, 0x000000, 1);

        this.generatePyramid({ x: this.sys.scale.width - 100, y: this.sys.scale.height - 200 })

        this.isReady = true

        this.setStoneDragAction()
    }

    update () {

    }

    setStoneDragAction () {
        let self = this
        this.stone
            .setInteractive({ draggable: true })
            .on('dragstart', function (pointer, dragX, dragY) {
                console.log('dragstart')
            })
            .on('drag', function (pointer, dragX, dragY) {
                self.stone.setPosition(dragX, dragY);
                console.log('drag')

                // draw geometry line
                self.line1 = new Phaser.Geom.Line(
                    self.sling1._fixpoint.x,
                    self.sling1._fixpoint.y,
                    self.stone.x,
                    self.stone.y
                );
                // self.line2 = new Phaser.Geom.Line(
                //     sling2._fixpoint.x,
                //     sling2._fixpoint.y,
                //     self.stone.x,
                //     self.stone.y
                // );
                self.graphics.clear()
                self.graphics.strokeLineShape(self.line1)
                // self.graphics.strokeLineShape(self.line2)


            })
            .on('dragend', function (pointer, dragX, dragY, dropped) {
                console.log('dragend')
                self.graphics.clear()
                self.stone.setIgnoreGravity(false) 
                self.stone.disableInteractive()
                self.stone
                    .setVelocityX((self.sling1._fixpoint.x - self.stone.x) / 5)
                    .setVelocityY((self.sling1._fixpoint.y - self.stone.y) / 5)
                self.time.delayedCall(2 * 1000,
                    () => {
                        self.stone.destroy()
                        self.stone = self.matter.add.image(self.sling1.x - 10, self.sling1.y - 60, 'stone')
                        self.stone.setMass(80)
                        self.stone.setIgnoreGravity(true)
                        self.setStoneDragAction()
                        console.log('set new')
                        self.isReady = true
                    })
                
            })
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

// too fast movement make matterjs collider not working
// It is tunneling.Physics engines have ccd(continues collision detection) to detect such collisions but matterjs doesn't have . You can try increasing position and velocity iterations but they probably won't be enough for too fast objects.

//     this.matter.world.engine.positionIterations = 20;
// this.matter.world.engine.velocityIterations = 20;
