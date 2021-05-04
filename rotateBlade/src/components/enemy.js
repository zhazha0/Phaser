class Enemy {
    constructor (scene, 
        blood = 100, 
        posX = 0, 
        posY = 0, 
        texture,
        speedX = 200,
        speedY = 200) {
        this.scene = scene
        this.blood = blood

        // this.gobj = scene.physics.add.sprite(posX, posY, texture)
        this.subObj = scene.add.sprite(0, 0, texture)
        this.subObjBloodText = scene.add.text(
            0,
            0,
            this.blood,
            {
                fontSize: '24px',
                fill: '#fff'
            }).setOrigin(0.5)
        this.gobj = scene.add.container(posX, posY, [ this.subObj, this.subObjBloodText ])
        this.gobj.setSize(48, 48)
        scene.physics.world.enable(this.gobj)

        this.gobj._parent = this
        this.oriVX = speedX // store original speed to slow down and restore
        this.oriVY = speedY
        this.gobj.body.setVelocity(speedX, speedY)

        let self = this
        this.gobj.on('overlapend', function (bombs) {
            self.gobj.body.setVelocity(self.oriVX, self.oriVY)
            self.shakeAnim.pause()
            // console.log('overlapend')
        });
        this.shakeAnim = this.createShakeAnim()
    }

    beat (minusBlood) {
        this.blood -= minusBlood
        // this.scene.juice.shake(this.subObj)
        // this.scene.juice.shake(this.subObjBloodText)
        this.shakeAnim.play()
        if (this.blood <= 0) {
            this.subObjBloodText.destroy()
            this.subObj.destroy()
            this.gobj.destroy()
        }
    }

    createShakeAnim () {
        var timeline = this.scene.tweens.timeline({
            loop: -1,
            targets: [ this.subObj, this.subObjBloodText ],
            tweens: [{
                // targets: this.subObj,
                x: 5,
                ease: 'Power0',
                duration: 50
            },
            {
                // targets: this.subObj,
                x: -5,
                ease: 'Power0',
                duration: 50
            },
            {
                // targets: this.subObj,
                x: 5,
                ease: 'Power0',
                duration: 50
            },
            {
                // targets: this.subObj,
                x: -5,
                ease: 'Power0',
                duration: 50
            },
            {
                // targets: this.subObj,
                x: -5,
                ease: 'Power0',
                duration: 50
            },
            {
                // targets: this.subObj,
                x: 5,
                ease: 'Power0',
                duration: 50
            },
            {
                // targets: this.subObj,
                x: 0,
                ease: 'Power0',
                duration: 50
            }]
    
        })
        timeline.pause()
        return timeline
    }

    update () {
        if (this.blood <= 0 || !this.gobj) { // the game object may have been destroyed
            return
        }
        // set blood text
        // this.bloodText.x = this.gobj.x
        // this.bloodText.y = this.gobj.y
        this.subObjBloodText.setText(this.blood)

        // set touch status
        var touching = !this.gobj.body.touching.none
        var wasTouching = !this.gobj.body.wasTouching.none

        if (!touching && wasTouching) {
            this.gobj.emit('overlapend')
        }
    }

}

export default Enemy