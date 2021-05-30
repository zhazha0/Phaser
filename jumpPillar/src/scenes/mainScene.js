// import Phaser from 'phaser'
import cons from '../constants'
import Score from '../components/score';
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

        this.cameras.main.backgroundColor.setTo(232, 135, 30)

    }

    create () {
        // explosion demo
        // var config = {
        //     key: 'explodeAnimation',
        //     frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 23, first: 23 }),
        //     frameRate: 20,
        //     repeat: -1
        // };

        // this.anims.create(config);

        // this.add.sprite(200, 300, 'explosion').play('explodeAnimation').setDepth(3);

        // background
        let background = this.add.image(0, 0, 'background').setOrigin(0)
        console.log('size:', this.sys.game.canvas.width, this.sys.game.canvas.height)
        console.log('size Center', this.cameras.main.centerX, this.cameras.main.centerY)
        // key: canvas size is different with 'style' set on canvas
        // removing the style, the canvas may wont fit with device screen
        background.setScale(this.sys.game.canvas.width / 160, this.sys.game.canvas.height / 280)

        // clouds
        for (var i = 0; i < 3; i++) {
            var firstX = Phaser.Math.Between(20, this.sys.game.canvas.width - 20);
            var firstTime = Math.floor((20000 - 3000 * i) * (firstX + 150) / (this.sys.game.canvas.width + 200));
            var cloud = this.add.sprite(firstX, this.sys.game.canvas.height - 250 + 50 * i, "cloud", Phaser.Math.Between(0, 2));
            cloud.setScale(1 + 0.5 * i);
            cloud.alpha = 0.3;
            // this.add.tween(cloud).to({ x: -150 }, firstTime, "Linear", true).onComplete.add(function (obj, tw, twTime) {
            //     obj.x = this.sys.game.canvas.width + 50;
            //     obj.frame = Phaser.Math.Between(0, 2);
            //     this.add.tween(obj).to({ x: -150 }, twTime, "Linear", true, 0, -1).onLoop.add(function (obj) {
            //         obj.frame = Phaser.Math.Between(0, 2);
            //     }, this);
            // }, this, 0, 20000 - 3000 * i);
        }

        this.curPlate = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, "plate", 0); // 0 - 7
        this._hwRatio = this.curPlate.displayHeight / this.curPlate.displayWidth // 40 / 64
        this.curPlate.setOrigin(0.5, this._hwRatio)

        this.geneNewPillar()


        this.geneNewPlayer()

        this.focus = this.add.sprite(0, 0, "button", 7)
        this.focus.setScale(0.5)
        this.focus.setOrigin(0.6)
        this.focus.setVisible(false)

        this.downTime = 0
        this.input.on('pointerdown', function (pointer) {
            this.downTime = Date.now()
            // if (this.focusOn) {

            // }
            this.focus.setVisible(true)
            this.focus.x = this.curPlate.x
            this.focus.y = this.curPlate.y
        }, this)
        this.input.on('pointerup', function (pointer) {
            this.player.setScale(1, 1)
            this.focus.setVisible(false)
            this.jump()
            
        }, this)

        
     
    }

    update () {
        if (this.gameOver) return;
        
        var pointer = this.input.activePointer
        if (pointer.isDown) {
            let downDuration = Date.now() - this.downTime
            this.scale = Math.min(2000, downDuration * 2) / 3000 // (0 - 2000) / 3000
            console.log(this.downTime, downDuration, 1 - this.scale)

            this.player.setScale(1, 1 - this.scale)
            this.focus.x = this.curPlate.x + this.curDirect * (this.scale * 3000 / 10)
            this.focus.y = this.curPlate.y - this._hwRatio * (this.scale * 3000 / 10)
        }
    }

    geneNewPillar () {
        this.curDirect = Phaser.Math.Between(1, 2) === 1 ? 1 : -1
        let distance = Phaser.Math.Between(50, 150)

        let newX = this.curPlate.x + this.curDirect * distance
        let newY = this.curPlate.y - distance * this._hwRatio
        this.nextPlate =  this.add.sprite(newX, newY, "plate", Phaser.Math.Between(0, 1))
        this.nextPlate.setOrigin(0.5, this._hwRatio)

    }

    jump () {
        let dis = this.scale * 3000 / 10
        let ratio = 64 / 40
        console.log(dis)
       
        var tweenCont = this.tweens.add({
            targets: this.player._contMove,
            x: this.player._contMove.x + this.curDirect * dis,
            y: this.player._contMove.y - this._hwRatio * dis,
            ease: 'Power0',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 602,
            repeat: 0,            // -1: infinity
            yoyo: false,
            completeDelay: 10, // delay to onComplete callback
            onComplete: () => {
                // check score
                if (this.player._contMove.x < this.nextPlate.x + 10 &&
                    this.player._contMove.x > this.nextPlate.x - 10 &&
                    this.player._contMove.y > this.nextPlate.y - 10 &&
                    this.player._contMove.y < this.nextPlate.y + 10) {
                        console.log('scored')
                    } else {
                        console.log('falled')
                        if (this.player._contMove.x < this.nextPlate.x + 20 &&
                            this.player._contMove.x > this.nextPlate.x - 20 &&
                            this.player._contMove.y > this.nextPlate.y - 20 &&
                            this.player._contMove.y < this.nextPlate.y + 20) {

                                let fallDirect = 1
                                if ((this.curDirect > 0 &&
                                    this.player._contMove.x >= this.nextPlate.x + 10) ||
                                    (this.curDirect < 0 &&
                                    this.player._contMove.x <= this.nextPlate.x - 10)) {
                                        fallDirect = -1
                                    }
                                this.tweens.timeline({
                                    loop: 0,
                                    targets: this.player._contMove,
                                    tweens: [{
                                        angle: { from: 0, to: -this.curDirect * 90 * fallDirect },
                                        ease: 'Power0',
                                        duration: 300
                                    }, {
                                        y: this.player._contMove.y + this.sys.game.canvas.height,
                                        ease: 'Power0',
                                        duration: 700,
                                        // completeDelay: 7000,
                                        onComplete: this.geneNewPlayer(1000),
                                    }]
                                })
                            } else {
                                this.tweens.timeline({
                                    loop: 0,
                                    targets: this.player._contMove,
                                    tweens: [{
                                        y: this.player._contMove.y + this.sys.game.canvas.height,
                                        ease: 'Power0',
                                        duration: 1000,
                                        // completeDelay: 7000,
                                        onComplete: this.geneNewPlayer(1000),
                                    }]
                                })
                            }
                        
                    }
            },
        })

        var timeline = this.tweens.timeline({
            loop: 0,
            targets: this.player._contJump,
            tweens: [{
                angle: { from: 0, to: this.curDirect * 180 },
                ease: 'Power0',
                duration: 1
            }, {
                y: '-=80',
                angle: { from: this.curDirect * 180, to: this.curDirect * 270 },
                ease: 'Power0',
                duration: 300
            }, {
                y: '+=80',
                angle: { from: this.curDirect * 270, to: this.curDirect * 360 },
                ease: 'Power0',
                duration: 300
            }, {
                angle: { from: this.curDirect * 360, to: 0 },
                ease: 'Power0',
                duration: 1
            }]

        })

        // this.cameras.main.scrollX = this.player.cont.x
        // this.cameras.main.scrollY = this.player.cont.y

    }

    geneNewPlayer (time = 10) {
        this.time.delayedCall(time, function () {
            if (this.blood > 0) {
                this.blood --
                // multiple layer of animations use container to apply simultaneously
                this.player = this.add.sprite(0, 0, 'player', 0).setOrigin(0.5, 1) // used to scale from bottom
                this.player._contJump = this.add.container(0,  - (this.player.displayHeight / 2), [this.player])
                this.player.y = this.player.displayHeight / 2 // key: used to rotate player form the middle, shift player middle to the middle of container
                this.player._contMove = this.add.container(this.curPlate.x, this.curPlate.y, [ this.player._contJump ])
    
            }
        }, null, this)
        
    }

}

export default MainScene