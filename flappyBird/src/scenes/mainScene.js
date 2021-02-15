// import Phaser from 'phaser'
import cons from '../constants'
import Score from '../objects/score';
// class MainScene extends Phaser.Scene {
class MainScene {
    constructor () {
        // super();

        this.gameOver = false

    }

    preload () {
        this.load.image('background', 'assets/background.png');

        this.load.spritesheet('bird', 
            'assets/bird.png',
            { frameWidth: 92, frameHeight: 64 }
        )


    }

    create () {
        let background = this.add.image(cons.WIDTH_SCENE / 2, cons.HEIGHT_SCENE / 2, 'background')
        background.scaleX = cons.WIDTH_SCENE / cons.WIDTH_BACKIMG
        background.scaleY = cons.HEIGHT_SCENE / cons.HEIGHT_BACKIMG
   
        let bird = this.physics.add.sprite(100, 450, 'bird').setScale(0.6)
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1 // to repeat
        });
        bird.setCollideWorldBounds(true)
        bird.anims.play('fly', true)
        // pointer control
        this.input.on('pointerup',  (pointer) => {
            if (this.gameOver) return

           
        }, this);


    }

    update () {
        if (this.gameOver) return;

      
    }

 

}

export default MainScene
