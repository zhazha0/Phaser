class Counter {
    constructor (scene, config = {}) {
        this.scene = scene
        this.config = config
        this.value = 0

        if (config.type === 'icon') {
            this.icon = this.scene.add.sprite(
                config.posX || 16,
                config.posY || 16,
                config.texture,
                config.frame)
                .setScrollFactor(0)
            this.text = this.scene.add.text(
                this.icon.x + this.icon.displayWidth / 2 + 10, 
                this.icon.y,
                this.value,
                { fontSize: '22px', fill: '#fff' })
                .setOrigin(0, .5)
                .setScrollFactor(0)
        } else {
            this.text = this.scene.add.text(
                config.posX || 16,
                config.posY || 16,
                `${this.config.title || '分数'}:  ${this.value}`,
                { fontSize: '32px', fill: '#fff' })
                .setScrollFactor(0)
        }
        
    }
    update (score) {
        this.value = score
        if (this.config.type === 'icon') {
            this.text.setText(this.value)
        } else {
            this.text.setText(`${this.config.title || '分数'}:  ${this.value}`)
        }
        
    }
}

export default Counter
