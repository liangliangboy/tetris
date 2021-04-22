class Game {
    constructor() {
        this.backLayer = new LSprite() //背景层
        this.graphicsMap = new LSprite() //方块控制层
        this.nextLayer = new LSprite() //方块预览层
        // this.loadingLayer = new LoadingSample1()//进度条读取层
        this.box = new Box()
        
        LInit(50, 'game', 340, 480, this.main)
    }
    main() {
        console.log(this.backLayer);
        
        this.backLayer.graphics.drawRect(1, '#000000', [0, 0, 340, 480], true, '#000000')
    }
}