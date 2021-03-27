
// import 'phaser'
import mainScene from './scenes/mainScene'
import cons from './constants'

const initGame = () => {
    const config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.ENVELOP, // ENVELOP, FIT
            width: cons.WIDTH_SCENE,
            height: cons.HEIGHT_SCENE
        },
        // physics: {
        //     default: 'matter',
        //     matter: {
        //         gravity: {
        //             y: 2
        //         },
        //         // enableSleeping: true,
        //         debug: false
        //     }
        // },
        scene: [
            mainScene
        ]
    }

    const game = new Phaser.Game(config)
}

const loadPhaser = () => {
    if (location.origin.indexOf('pingan.com.cn') > 0) {
        var phaserUrl = 'https://test-b-fat.pingan.com.cn/mkt/youhui/1901/dtwxqx-ht/js/phaser.min.js.gz'

        var xhr = new XMLHttpRequest();
        xhr.responseType = 'arraybuffer'
        xhr.onload = function () {
            console.log('Data got.')
            var data = new Uint8Array(xhr.response, 0)
            var res = pako.inflate(data, { to: 'string' })
            var phaserjs = document.createElement('script')
            var head = document.head
            phaserjs.type = 'text/javascript';
            phaserjs.innerHTML = res
            head.appendChild(phaserjs)

            initGame()
        }
        xhr.open('get', phaserUrl, true);
        xhr.send();
    } else {
        initGame()
    }
}

loadPhaser()
