// import Phaser from 'phaser'
import cons from '../constants'
import Score from '../objects/score';
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

        // this.cameras.main.setBounds(0, 0, cons.WIDTH_SCENE * 500 , cons.HEIGHT_SCENE);
        // this.cameras.main.startFollow(this._bird);

        // create pipes
        this._pipes = this.physics.add.staticGroup();
        this._pipes.create(400, cons.HEIGHT_SCENE, 'pipe').setScale(0.5).setOrigin(0.5, 1).refreshBody()
        let top = this._pipes.create(400, 0, 'pipe').setScale(0.5).setOrigin(0.5, 1).refreshBody()
        top.angle = 180

        // add physics
        this.physics.add.collider(this._bird, this._pipes);

        console.log(this._pipes)
        // pointer control
        this.input.on('pointerdown',  (pointer) => {
            if (this.gameOver) return

            this._bird.body.velocity.y = -200;
           
        }, this);


    }

    update () {
        if (this.gameOver) return;

        
        this.cameras.main.scrollX = this._bird.x - 150
        this._bird.body.velocity.x = 60
        this._background.tilePositionX = this.cameras.main.scrollX;
        // this._background.tilePositionX += 15

        
    }

 

}

export default MainScene
