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
        this.score = 0
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
        // icons
        this.load.spritesheet("icon", "./assets/icons.png", { frameWidth: 20, frameHeight: 20 })

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
        background.setScrollFactor(0)
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

        // create plate
        this.curPlate = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, "plate", 0); // 0 - 7
        this._hwRatio = this.curPlate.displayHeight / this.curPlate.displayWidth // 40 / 64
        this.curPlate.setOrigin(0.5, this._hwRatio)

        // create next plate
        this.geneNewPillar()

        this.geneNewPlayer()

        this.focus = this.add.sprite(0, 0, "button", 7)
        this.focus.setScale(0.5)
        this.focus.setVisible(false)

        // 光效
        this.effect = this.add.sprite(0, 0, "button", 6)
        this.effect.setVisible(false)

        // create blood:
        this.bloodText = new Counter(this, { 
            type: 'icon' , 
            texture: 'icon', 
            frame: 0, 
            posX: 16,
            posY: 16
        })
        this.bloodText.update(this.blood)

        // create focus:
        this.focusText = new Counter(this, {
            type: 'icon',
            texture: 'icon',
            frame: 1,
            posX: 86,
            posY: 16
        })
        this.focusText.update(100)

        // create score
        this.scoreText = this.add.text(
            this.cameras.main.centerX, 80, '0', 
            { fontSize: "48px", fill: "#999" }).setScrollFactor(0)

        this.downTime = 0
        this.input.on('pointerdown', function (pointer) {
            if (this.canPress) {
                this.downTime = Date.now()
                // if (this.focusOn) {

                // }
                this.focus.setVisible(true)
                this.focus.x = this.curPlate.x
                this.focus.y = this.curPlate.y - 6
            }
            
        }, this)
        this.input.on('pointerup', function (pointer) {
            if (this.canPress) {
                this.player.setScale(1, 1)
                this.focus.setVisible(false)
                this.focusText.update(this.focusText.value - 1)
                this.canPress = false
                this.jump()
            }
            
            
        }, this)

        
     
    }

    update () {
        if (this.gameOver) return;
        
        var pointer = this.input.activePointer
        if (pointer.isDown && this.canPress) {
            let downDuration = Date.now() - this.downTime
            this.scale = Math.min(2000, downDuration * 2) / 3000 // (0 - 2000) / 3000
            console.log(this.downTime, downDuration, 1 - this.scale)

            this.player.setScale(1, 1 - this.scale)
            this.focus.x = this.curPlate.x + this.curDirect * (this.scale * 3000 / 10)
            this.focus.y = this.curPlate.y - 7 - this._hwRatio * (this.scale * 3000 / 10)
        }
    }

    geneNewPillar () {
        this.curDirect = Phaser.Math.Between(1, 2) === 1 ? 1 : -1
        let distance = Phaser.Math.Between(50, 150)

        let newX = this.curPlate.x + this.curDirect * distance
        let newY = this.curPlate.y - distance * this._hwRatio
        this.nextPlate =  this.add.sprite(newX, newY, "plate", Phaser.Math.Between(0, 1))
        this.nextPlate.setOrigin(0.5, this._hwRatio)
        this.player && (this.player._contMove.depth = this.nextPlate.depth + 1)
        this.focus && (this.focus.depth = this.nextPlate.depth + 1)

        this.canPress = true

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

                    this.scoreText.setText(++this.score)

                    if (this.player._contMove.x < this.nextPlate.x + 3 &&
                        this.player._contMove.x > this.nextPlate.x - 3 &&
                        this.player._contMove.y > this.nextPlate.y - 3 &&
                        this.player._contMove.y < this.nextPlate.y + 3) {
                            this.effect.x = this.nextPlate.x
                            this.effect.y = this.nextPlate.y
                            this.effect.setVisible(true)
                            this.tweens.add({
                                targets: this.effect,
                                scale: 3,
                                alpha: 0,
                                ease: 'Power0',
                                duration: 250,
                                completeDelay: 10,
                                onComplete: () => {
                                    this.effect.alpha = 1
                                    this.effect.scale = 1
                                    this.effect.setVisible(false)
                                }
                            })
                        }

                        // move camera
                        // this.cameras.main.scrollX = this.nextPlate.x - this.curPlate.x
                        // this.cameras.main.scrollY = this.nextPlate.y - this.curPlate.y // move too fast
                        this.tweens.add({
                            targets: this.cameras.main,
                            scrollX: this.nextPlate.x - this.cameras.main.centerX, // dont use this.nextPlate.x - this.curPlate.x, camera.scrollX is relative to original point
                            scrollY: this.nextPlate.y - this.cameras.main.centerY,
                            ease: 'Power0',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                            duration: 250,
                            completeDelay: 10,
                            onComplete: () => {
                                this.curPlate = this.nextPlate
                                this.geneNewPillar()
                            }
                        })

                        

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

        // jump animation
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
    }

    geneNewPlayer (time = 10) {
        this.time.delayedCall(time, function () {
            if (this.blood > 0) {
                this.blood --
                this.bloodText.update(this.blood)
                // multiple layer of animations use container to apply simultaneously
                this.player = this.add.sprite(0, 0, 'player', 0).setOrigin(0.5, 1) // used to scale from bottom
                this.player._contJump = this.add.container(0,  - (this.player.displayHeight / 2), [this.player])
                this.player.y = this.player.displayHeight / 2 // key: used to rotate player form the middle, shift player middle to the middle of container
                this.player._contMove = this.add.container(this.curPlate.x, this.curPlate.y, [ this.player._contJump ])

                this.canPress = true
    
            }
        }, null, this)
        
    }

}

export default MainScene
