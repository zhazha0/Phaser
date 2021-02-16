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

        this.load.spritesheet('bird', 
            'assets/bird.png',
            { frameWidth: 92, frameHeight: 64 }
        )


    }

    create () {
        // let background = this.add.image(cons.WIDTH_SCENE / 2, cons.HEIGHT_SCENE / 2, 'background')
        this._background = this.add.tileSprite(0, 0, cons.WIDTH_SCENE , cons.HEIGHT_SCENE , 'background', 1).setOrigin(0);

        // background.scaleX = cons.WIDTH_SCENE / cons.WIDTH_BACKIMG
        // background.scaleY = cons.HEIGHT_SCENE / cons.HEIGHT_BACKIMG
   
        this._bird = this.physics.add.sprite(100, 450, 'bird').setScale(0.6)
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1 // to repeat
        });
        this._bird.setCollideWorldBounds(true)
        this._bird.anims.play('fly', true)

        this.cameras.main.setBounds(0, 0, cons.WIDTH_SCENE * 5 , cons.HEIGHT_SCENE);
        this.cameras.main.startFollow(this._bird);

        // pointer control
        this.input.on('pointerdown',  (pointer) => {
            if (this.gameOver) return

            this._bird.body.velocity.y = -200;
           
        }, this);


    }

    update () {
        if (this.gameOver) return;

        this._bird.body.velocity.x = 50
        this._background.tilePositionX += 5;
    }

 

}

export default MainScene
