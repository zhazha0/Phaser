// import Phaser from 'phaser'
import cons from '../constants'
import Score from '../objects/score';

// var captionStyle = {
//     fill: '#7fdbff',
//     fontFamily: 'monospace',
//     lineSpacing: 4
// }
// var captionTextFormat = (
//     'Total:    %1\n' +
//     'Max:      %2\n' +
//     'Active:   %3\n' +
//     'Inactive: %4\n' +
//     'Used:     %5\n' +
//     'Free:     %6\n' +
//     'Full:     %7\n'
// )

// class MainScene extends Phaser.Scene {
class MainScene {
    constructor () {
        // super();

        this.gameOver = false
        this._background = null
        this._bird = null

    }

    preload () {
        this.load.image('background', 'assets/background.png');
        this.load.image('pipe', 'assets/pipe.png');

        this.load.spritesheet('bird', 
            'assets/bird.png',
            { frameWidth: 92, frameHeight: 64 }
        )


    }

    create () {
        this.physics.world.setBounds(0, 0, cons.WIDTH_SCENE * 2, cons.HEIGHT_SCENE, true, true, true, true)

        // let background = this.add.image(cons.WIDTH_SCENE / 2, cons.HEIGHT_SCENE / 2, 'background')
        this._background = this.add.tileSprite(0, 0, cons.WIDTH_SCENE , cons.HEIGHT_SCENE , 'background', 1)
            .setOrigin(0)
            .setScrollFactor(0, 1); //this line keeps your background from scrolling outside of camera bounds

        // background.scaleX = cons.WIDTH_SCENE / cons.WIDTH_BACKIMG
        // background.scaleY = cons.HEIGHT_SCENE / cons.HEIGHT_BACKIMG
   
        this._bird = this.physics.add.sprite(150, 450, 'bird').setScale(0.6)
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1 // to repeat
        });
        this._bird.setCollideWorldBounds(true)
        this._bird.anims.play('fly', true)

        this.cameras.main.setBounds(0, 0, cons.WIDTH_SCENE * 2 , cons.HEIGHT_SCENE);
        // this.cameras.main.startFollow(this._bird)
        // this.cameras.main.setLerp(0,0);

        // create pipes
        this._pipes = this.physics.add.staticGroup();
        this.addPipes(this._pipes, 500)

        // add physics
        // this.physics.add.collider(this._bird, this._pipes);
        this.physics.add.collider(this._bird, this._pipes, this.hitPipes, null, this)

        // console.log(this._pipes)
        // pointer control
        this.input.on('pointerdown',  (pointer) => {
            if (this.gameOver) return

            this._bird.body.velocity.y = -200;

            // this._bird.applyForce(0, 22);
            // this.time.delayedCall(1*1000, 
            //           () => this._bird.body.setAcceleration(0,0));
           
        }, this);


        // let { width, height } = this.sys.game.canvas;
        // console.log('scene size', width, height) // size in config obj

        // this._bird.onWorldBounds = true
        // this.physics.world.on('worldbounds', function (body) {
        //     console.log('hello from the edge of the world', body);
        // }, this)

        // debug information
        // this._caption = this.add.text(16, 16, '', captionStyle);

    }

    update () {
        if (this.gameOver) return;

        // this.cameras.main.x = -this._bird.x + 150
        this.cameras.main.scrollX = this._bird.x - 150
        this._bird.body.velocity.x = 160
        this._background.tilePositionX = this.cameras.main.scrollX;
        // this._background.tilePositionX += 15

        // console.log(this._bird.x, this._bird.displayWidth, this._bird.body.x,
                    // this._bird.y, this._bird.displayHeight, this._bird.body.y)
        // console.log(this.cameras.main.scrollX + this.cameras.main.width, this._pipes.children.entries[0].x)
        // console.log(this._bird.x)

        // this._caption.setText(Phaser.Utils.String.Format(captionTextFormat, [
        //     this._pipes.children.entries.length
        // ]))
        if (this._bird.x + 400 >= this._pipes.children.entries[this._pipes.children.entries.length - 1].x ) {
            this.addPipes(this._pipes, this._bird.x + 700)
        }

        
        // expand world and camera view when reach end
        console.log(this.cameras.main.scrollX + 150, this.physics.world.bounds.width - 200)
        if (this.cameras.main.scrollX + 150 >= this.physics.world.bounds.width - cons.WIDTH_SCENE) {
            console.log('reach end')
            this.physics.world.setBounds(0, 0, this.physics.world.bounds.width + cons.WIDTH_SCENE * 2, cons.HEIGHT_SCENE, true, true, true, true)
            this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width + cons.WIDTH_SCENE * 2, cons.HEIGHT_SCENE);
        }

    }

    hitPipes () {
        this.gameOver = true
        
        this.add.text(this.cameras.main.centerX + this.cameras.main.scrollX - 150, this.cameras.main.centerY, 
            'Game Over',
            { fontSize: '48px', fill: '#fff' }).setOrigin(0.5)
        this.add.text(this.cameras.main.centerX + this.cameras.main.scrollX - 150, this.cameras.main.centerY + 100, 
            '点击任意处重新开始',
            { fontSize: '48px', fill: '#fff' }).setOrigin(0.5)

        this.input.on('pointerup',  (pointer) => {
        
            this.scene.restart() // restart current scene
            this.gameOver = false
        }, this);
        this._bird.body.velocity.x = 0
        this._bird.anims.stop()
        console.log('game over')
    }

    addPipes (pipes, posX) {
        let disMin = 100
        let disMax = 300
        let pipeHeightMin = 150
        let disPipe = Phaser.Math.Between(disMin, disMax) // distance between two pipes
        let heightTop =  Phaser.Math.Between(pipeHeightMin, cons.HEIGHT_SCENE - disPipe - pipeHeightMin) // height of top pipe
        let heightBottom = cons.HEIGHT_SCENE - heightTop - disPipe // height of bottom pipe

        // console.log(disPipe, heightTop, heightBottom, cons.HEIGHT_SCENE)
        pipes.create(posX, cons.HEIGHT_SCENE, 'pipe')
            .setScale(0.8, heightTop / cons.HEIGHT_PIPE)
            .setOrigin(0.5, 1)
            .refreshBody()
        let top = pipes.create(posX, heightBottom / 2, 'pipe')
            .setScale(0.8, heightBottom / cons.HEIGHT_PIPE)
            // .setAngle(10)
            // .setOrigin(0.5, 0)
            .refreshBody()
        top.angle = 180 // rotate image 180
        // top.refreshBody()
    }
}

export default MainScene
