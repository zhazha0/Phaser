
class Ball {
    constructor (
        scene, 
        posX = 0,
        posY = 0,
        texture = '1') {

        this.scene = scene
        this.obj = scene.physics.add.image(posX, posY, texture)
        this.obj.body.allowGravity = false
        this.obj.setCollideWorldBounds(true);
        this.obj.setBounce(0.2)
    }

}

export default Ball
