class Score {
    constructor (scene) {
        this.scene = scene
        this.value = 0
        this.text = this.scene.add.text(16, 16, 
            '得分: ' + this.value, 
            { fontSize: '32px', fill: '#fff' })
    }
    update (score) {
        this.value += score
        this.text.setText('得分: ' + this.value)
    }
}

export default Score
