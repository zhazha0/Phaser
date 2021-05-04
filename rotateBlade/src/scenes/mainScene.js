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

    }

    preload () {
        this.load.image('blade', 'assets/blade.png')
        this.load.image('enemy', 'assets/enemy.png')
        this.load.image('player', 'assets/player.png')

        this.cameras.main.backgroundColor.setTo(232, 135, 30)

    }

    create () {

        // var circle = new Phaser.Geom.Circle(0, 0, 160);
    
        // var particles = this.add.particles('1');

        // var emitter = particles.createEmitter({
        //     // frame: { frames: ['red', 'green', 'blue'], cycle: true },
        //     x: 400,
        //     y: 300,
        //     scale: { start: 0.5, end: 0 },
        //     blendMode: 'ADD',
        //     emitZone: { 
        //         type: 'edge', 
        //         source: circle, 
        //         quantity: 48, 
        //         stepRate: 20,
        //         yoyo: false 
        //     }
        // });

// -----------------
        // create player
        this.player = this.physics.add.sprite(150, 450, 'player')
        this.player.setCollideWorldBounds(true)
        this.playerBlood = 10
        this.playerBloodText = this.add.text(
            this.player.x,
            this.player.y,
            this.playerBlood,
            {
                fontSize: '24px',
                fill: '#fff'
            }).setOrigin(0.5)

        // create protectors
        this.protectors = this.physics.add.group({
            key: 'blade',
            frameQuantity: 10 // number of protector
        });

        this.circle = new Phaser.Geom.Circle(this.player.x, this.player.y, 100);

        this.startAngle = this.tweens.addCounter({
            from: 0,
            to: 6.28,
            duration: 2000,
            repeat: -1
        })

        this.endAngle = this.tweens.addCounter({
            from: 6.28,
            to: 12.56,
            duration: 2000,
            repeat: -1
        })

        // create player moveable
        let self = this
        this.input.on('pointermove', function (pointer, currentlyOver) { 
            self.player.x += pointer.position.x - pointer.prevPosition.x
            self.player.y += pointer.position.y - pointer.prevPosition.y
        })

        // create enemies
        this.enemies = []
        
        for (let i = 0; i < 10; i++) {
            let posMatrix = [
                [52, Phaser.Math.Between(52, cons.HEIGHT_SCENE - 52)],
                [cons.WIDTH_SCENE - 52, Phaser.Math.Between(52, cons.HEIGHT_SCENE - 52)],
                [Phaser.Math.Between(52, cons.WIDTH_SCENE - 52), 52],
                [Phaser.Math.Between(52, cons.WIDTH_SCENE - 52), cons.HEIGHT_SCENE - 52]
            ]
            let posIdx = Phaser.Math.Between(0, 3)
            let e = new Enemy(this, // scene
                Phaser.Math.Between(400, 500), // blood
                posMatrix[posIdx][0], // posX
                posMatrix[posIdx][1], // posY
                'enemy', // texture
                Phaser.Math.Between(150, 200), // speedX
                Phaser.Math.Between(150, 200)) // speedY
                e.gobj.body.setCollideWorldBounds(true)
                e.gobj.body.onWorldBounds = true // need this to fire 'worldbounds' event
                // e.gobj.setBounce(1, 1)
            this.enemies.push(e.gobj)
        }

        this.physics.world.on('worldbounds', function (body, up, down, left, right) {
            if (up || down) {
                body.setVelocityY(-body.gameObject._parent.oriVY)
                body.gameObject._parent.oriVY = body.velocity.y
            }
            if (left || right) {
                body.setVelocityX(-body.gameObject._parent.oriVX)
                body.gameObject._parent.oriVX = body.velocity.x
            }
        }, this)


        // protectors kill enemy event
        this.physics.add.overlap(this.protectors, this.enemies, function (obj1, obj2) {
            try { // obj may has been destroyed
                if (obj1) {
                    obj1.body.setVelocity(obj1._parent.oriVX * 0.5, obj1._parent.oriVY * 0.5)
                    obj1._parent.beat(1)
                }
                
            }   catch (e) {
                console.log('this enemy has been destroyed')
            }
        }, null, this)

        //
        this.physics.add.overlap(this.player, this.enemies, function (obj1, obj2) {
            try { // obj may has been destroyed
                if (obj1) {
                    this.playerBlood--
                    if (this.playerBlood <= 0) {
                        console.log('game over')
                        this.gameOver = true

                        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY,
                            'Game Over',
                            { fontSize: '48px', fill: '#fff' }).setOrigin(0.5)
                        this.scene.pause()
                    }
                }
                
            }   catch (e) {
                console.log('this player has been destroyed')
            }
        }, null, this)

    }

    update () {
        if (this.gameOver) return;

        Phaser.Actions.SetXY([this.circle], this.player.x, this.player.y);

        Phaser.Actions.PlaceOnCircle(
            this.protectors.getChildren(),
            this.circle,
            this.startAngle.getValue(),
            this.endAngle.getValue()
        )

        this.enemies.forEach(e=> e._parent.update())

        this.protectors.getChildren().forEach(p => {
            p.angle += 5
        })

        this.playerBloodText.x = this.player.x
        this.playerBloodText.y = this.player.y
        this.playerBloodText.setText(this.playerBlood)



    }

}

export default MainScene

// hit effect: https://github.com/RetroVX/phaser3-juice-plugin

// collisions are not supposed to work with tweens

// this.body.touching gives only information about the direction .
// {
//     none: false,
//     down: true,
//     left: false
//     right: false,
//     up: false      
// }
