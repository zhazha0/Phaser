// import Phaser from 'phaser'
import cons from '../constants'
import Score from '../components/score';
// import Ball from '../objects/ball'
// class MainScene extends Phaser.Scene {
class MainScene {
    constructor () {
        // super();

        this.main = null
        this.arm = null
        this.hook = null
        this.armLine = null
    }

    preload () {
        this.load.image('arm', 'assets/cranetower_arm.png');
        this.load.image('main', 'assets/cranetower_main.png');
        this.load.image('hook', 'assets/cranetower_hook.png');
        this.load.image('hook_top', 'assets/hook_top.png');
        this.load.image('hook_string', 'assets/hook_string.png');
        this.load.image('hook_bottom', 'assets/hook_bottom.png');

        this.cameras.main.backgroundColor.setTo(255, 255, 255)
    }

    create () {
        // create crane tower
        this.main = this.add.image(100, 300, 'main')
            .setScale(0.5)
        this.arm = this.add.image(190, 160, 'arm')
            .setScale(0.5)
        this.hook_top = this.add.image(260, 185, 'hook_top')
            .setScale(0.5)
        this.hook_string = this.add.image(260, 190, 'hook_string')
            .setScale(0.5)
            .setOrigin(0.5, 0)
        this.hook_bottom = this.add.image(260, this.hook_string.y + this.hook_string.displayHeight , 'hook_bottom')
            .setScale(0.5)
            .setOrigin(0.5, 0)

        // 绘制俯视旋转图
        var graphics = this.add.graphics();
        graphics.lineStyle(4, 0x000, 1);
        let circle = new Phaser.Geom.Circle(400, 550, 70);
        graphics.strokeCircleShape(circle)
        this.armLine = this.add.line(circle.x, circle.y, 0, 0, 70, 0, 0xff0000).setOrigin(0, 0)
 

        // create button actions
        let scene = this
        document.querySelector('#hook_near').addEventListener('click', function() {
            let xTo = scene.hook_top.x <= cons.HOOK_NEAR_MIN ? cons.HOOK_NEAR_MIN : (scene.hook_top.x - 10)
            scene.tweens.add({
                targets: [scene.hook_top, scene.hook_string, scene.hook_bottom],
                x: xTo,
                duration: 300,
            });
        })

        document.querySelector('#hook_far').addEventListener('click', function() {
            let xTo = scene.hook_top.x >= cons.HOOK_FAR_MAX ? cons.HOOK_FAR_MAX : (scene.hook_top.x + 10)
            scene.tweens.add({
                targets: [scene.hook_top, scene.hook_string, scene.hook_bottom],
                x: xTo,
                duration: 300,
            });
        })

        document.querySelector('#hook_up').addEventListener('click', function() {
            let yScaleTo = scene.hook_string.scaleY <= cons.HOOK_UP_MIN ? cons.HOOK_UP_MIN : (scene.hook_string.scaleY - 0.5)
    
            scene.tweens.add({
                targets: scene.hook_string,
                scaleY: yScaleTo,
                ease: 'Linear',
                duration: 300,
                repeat: 0,
              });
        })

        document.querySelector('#hook_down').addEventListener('click', function() {
            let yScaleTo = scene.hook_string.scaleY >= cons.HOOK_DOWN_MAX ? cons.HOOK_DOWN_MAX : (scene.hook_string.scaleY + 0.5)
    
            scene.tweens.add({
                targets: scene.hook_string,
                scaleY: yScaleTo,
                ease: 'Linear',
                duration: 300,
                repeat: 0,
              });
        })

        document.querySelector('#arm_clock').addEventListener('click', function() {
            let angleTo = scene.armLine.angle + 10

            scene.tweens.add({
                targets: scene.armLine,
                angle: angleTo,
                duration: 300,
                repeat: 0
              });
        })
        document.querySelector('#arm_anticlock').addEventListener('click', function() {
            let angleTo = scene.armLine.angle - 10

            scene.tweens.add({
                targets: scene.armLine,
                angle: angleTo,
                duration: 300,
                repeat: 0
              });
        })

    }

    update () {
        this.hook_bottom.y = this.hook_string.y + this.hook_string.displayHeight
  
    }
}

export default MainScene
