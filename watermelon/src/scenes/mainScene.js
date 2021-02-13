// import Phaser from 'phaser'
import cons from '../constants'
import Score from '../objects/score';
// import Ball from '../objects/ball'
// class MainScene extends Phaser.Scene {
class MainScene {
    constructor () {
        // super();

        // this.game = null
        this.gameOver = false
        this.score = null
        this.allBalls = {}
    }

    preload () {
        this.load.image('1', 'assets/1.png');
        this.load.image('2', 'assets/2.png');
        this.load.image('3', 'assets/3.png');
        this.load.image('4', 'assets/4.png');
        this.load.image('5', 'assets/5.png');
        this.load.image('6', 'assets/6.png');
        this.load.image('7', 'assets/7.png');
        this.load.image('8', 'assets/8.png');
        this.load.image('9', 'assets/9.png');
        this.load.image('10', 'assets/10.png');
        this.load.image('11', 'assets/11.png');
        this.load.image('11', 'assets/11.png');

        this.load.image('bar', 'assets/bar.png');

        this.cameras.main.backgroundColor.setTo(232, 135, 30)
    }

    create () {
        this.matter.set60Hz()
        this.matter.world.setBounds(0, 0, this.sys.scale.width, this.sys.scale.height);

        let bar = this.add.image(cons.SPAWN_X, 200, 'bar')
        bar.alpha = 0.3;

        this.score = new Score(this)

        // create inital object
        let ball = this.matter.add.image(cons.SPAWN_X, 100, '1')
        this.allBalls['1'] = this.allBalls['1'] || []
        this.allBalls['1'].push(ball)
        ball.setCircle();
        ball.setFriction(0.3);
        ball.setBounce(0.3);
        ball.body.ignoreGravity = true;

        // let ball = new Ball(this, cons.WIDTH_SCENE / 2, 100, '1')
        

        // pointer control
        this.input.on('pointerup',  (pointer) => {
            if (this.gameOver) return

            if (ball && ball.body && ball.body.ignoreGravity === true) { // ball can be destroied anytime
                ball.x = pointer.x
                ball.body.ignoreGravity = false
                let nBall = ball
                ball = null // 没有这个, 点快了可能顶部有两个球
                
                this.time.delayedCall(1000, () => {
                    nBall && (nBall._isAdded = true)
                    this.score.update(+nBall.texture.key * 10)
                    nBall = null
                }, null, this)

                // regenerate new ball
                this.time.delayedCall(1200, () => {
                    // ball = new Ball(this, cons.WIDTH_SCENE / 2, 100, '1')
                    let texture = Phaser.Math.Between(1, 6)
                    ball = this.matter.add.image(cons.SPAWN_X, 100, texture)
                    this.allBalls[texture] = this.allBalls[texture] || []
                    this.allBalls[texture].push(ball)
                    // console.clear()
                    // console.log(this.allBalls)
                    ball.setCircle();
                    ball.setFriction(0.3);
                    ball.setBounce(0.3);
                    ball.body.ignoreGravity = true
                }, null, this)
            }
        }, this);

        // overlap event
        // let scene = this
        // this.matter.world.on('collisionstart', function (event, a, b) {
        //     // console.log(event, a, b)
        //     let keyA = a.gameObject && a.gameObject.texture && a.gameObject.texture.key
        //     let keyB = b.gameObject && b.gameObject.texture && b.gameObject.texture.key
        //     // console.log('collision: ', keyA, keyB)
        //     if (keyA === keyB) {
        //         // debugger
        //         // console.log('matched: ', a, b)

        //         scene.combine(a, b)
        //     }
        // })
    }

    update () {
        if (this.gameOver) return;

        Object.keys(this.allBalls).forEach(key => {
            let oneKeyBalls = this.allBalls[key]
            if (oneKeyBalls.length > 1) {
                oneKeyBalls.forEach((ball, idx) => {
                    let res = this.matter.intersectBody(ball.body, oneKeyBalls)
                    if (res && res.length >= 1) {
                        this.combine(res[0], ball.body)
                    }
                })
                
            }

            oneKeyBalls.forEach(ball => {
                if (ball._isAdded && ((ball.y - ball.height / 2) < 200)) {
                    this.gameOver = true
                    this.add.text(cons.WIDTH_SCENE / 2, cons.HEIGHT_SCENE / 2, 
                        'Game Over', 
                        { fontSize: '64px', fill: '#fff' }).setOrigin(0.5)
                    console.log('game over')
                }
            })
        })

    }

    combine (a, b) {
        if (!a.gameObject || !b.gameObject) return
        if (a._comd || b._comd) return
        a._comd = b._comd = true
        let keyA = a.gameObject && a.gameObject.texture && a.gameObject.texture.key
        let keyB = b.gameObject && b.gameObject.texture && b.gameObject.texture.key
        let posYa = a.gameObject.y
        let posYb = b.gameObject.y
        let from = (posYa <= posYb) ? a : b
        let to = (posYa <= posYb) ? b : a


        let posXto = to.gameObject.x
        let posYto = to.gameObject.y
        let nTexture = (+keyA + 1) + ''

        from.gameObject.setCollisionCategory(null) // disable one's collider, or will collide with tween
        from.ignoreGravity = true
        var tween = this.tweens.add({
            targets: from.gameObject,
            x: posXto,
            y: posYto,
            duration: 300,
        });

        this.time.delayedCall(360, () => { // key: don't less than 50ms
            let idxFrom = this.allBalls[from.gameObject.texture.key].indexOf(from.gameObject)
            this.allBalls[from.gameObject.texture.key].splice(idxFrom, 1)
            let idxTo = this.allBalls[to.gameObject.texture.key].indexOf(to.gameObject)
            this.allBalls[to.gameObject.texture.key].splice(idxTo, 1)
            from.gameObject.destroy()
            to.gameObject.destroy()

            let nBall = this.matter.add.image(posXto, posYto, nTexture)
            this.allBalls[nTexture] = this.allBalls[nTexture] || []
            this.allBalls[nTexture].push(nBall)
            nBall.setCircle();
            nBall.setFriction(0.3);
            nBall.setBounce(0.3);
            nBall._isAdded = true
            this.score.update(+nBall.texture.key * 10)

            let res = this.matter.intersectBody(nBall.body) || []
            // console.log('check combinded with others', from, to, res)
            res.forEach(v => {
                if (v.gameObject && (v.gameObject.texture.key === nTexture)) {
                    // console.log('get one new same: ', v.gameObject.texture.key)
                    this.combine(nBall.body, v)
                }
            })
        }, null, this)

    }

}

export default MainScene
