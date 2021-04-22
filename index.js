var loadingLayer,
    backLayer, //背景层
    graphicsMap, //方块绘制
    nextLayer, //方块预览层
    imgList = {},
    imgData = new Array({
        name: "backImage",
        path: "./img/boxlist.png"
    }, {
        name: "r0",
        path: "./img/r00.png"
    }, {
        name: "r1",
        path: "./img/r11.png"
    }, {
        name: "r2",
        path: "./img/r22.png"
    }, {
        name: "r3",
        path: "./img/r33.png"
    }, {
        name: "r4",
        path: "./img/r44.png"
    }),
    BOX,
    nodeList = [],
    bitmapdataList,
    START_X1 = 15,
    START_Y1 = 20,
    START_X2 = 245,
    START_Y2 = 65,
    map = [ //方块坐标数组初始化
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    nowBox,
    nextBox,
    pointBox = {},
    myKey = {},
    speedIndex = 0,
    speed = 20,
    del = 0, delText,
    pauseFlag = false



LInit(1000 / 30, 'mylegend', 340, 480, main)

function main() {
    //背景层初始化
    backLayer = new LSprite()
    //方块控制层初始化
    graphicsMap = new LSprite()
    //方块预览层初始化
    nextLayer = new LSprite()
    //进度条读取层初始化
    loadingLayer = new LoadingSample1()
    //初始化Box类

    BOX = new Box()
    //在背景层上绘制黑色背景
    backLayer.graphics.drawRect(1, '#000000', [0, 0, 340, 480], true, '#000000')
    //背景显示
    addChild(backLayer)
    //进度条读取层显示
    backLayer.addChild(loadingLayer)
    //利用LLoadManage类，读取所有图片，并显示进度条
    LLoadManage.load(imgData, (progress) => {
        loadingLayer.setProgress(progress)
    }, gameInit)

}
//读取完所有图片，进行游戏标签画面的初始化工作
//1 初始化所有图片，保存到nodeList中
//2 添加相应的监听
function gameInit(result) {
    //取得图片读取结果
    imgList = result
    console.log("imgList:", imgList);

    //移除进度条层
    backLayer.removeChild(loadingLayer)
    loadingLayer = null

    //显示游戏标签
    var title = new LTextField()
    title.x = 80
    title.y = 100
    title.size = 30
    title.color = "#FFFFFF"
    title.text = '俄罗斯方块'
    backLayer.addChild(title)
    //显示说明文字
    backLayer.graphics.drawRect(1, '#ffffff', [50, 240, 220, 40])
    var txtClick = new LTextField()
    txtClick.size = 18
    txtClick.color = '#ffffff'
    txtClick.text = '点击页面开始游戏'
    txtClick.x = (LGlobal.width - txtClick.getWidth()) / 2
    txtClick.y = 250
    backLayer.addChild(txtClick)

    //将方块的图片数据保存到数组内
    bitmapdataList = [
        new LBitmapData(imgList["r0"]),
        new LBitmapData(imgList["r1"]),
        new LBitmapData(imgList["r2"]),
        new LBitmapData(imgList["r3"]),
        new LBitmapData(imgList["r4"]),
    ]

    let i, j, nArr, bitmap
    for (i = 0; i < map.length; i++) {
        nArr = []
        for (j = 0; j < map[i].length; j++) {
            bitmap = new LBitmap(bitmapdataList[0])
            bitmap.x = bitmap.getWidth() * j + START_X1 + j * 3
            bitmap.y = bitmap.getHeight() * i + START_Y1 + i * 2
            graphicsMap.addChild(bitmap)
            nArr[j] = {
                "index": -1,
                "value": 0,
                "bitmap": bitmap
            }
            nodeList[i] = nArr
        }
    }

    //开始按钮添加点击事件
    txtClick.addEventListener(LMouseEvent.MOUSE_UP, gameToStart)
    /*
    //添加鼠标按下
    backLayer.addEventListener(LMouseEvent.MOUSE_DOWN, touchDown)
    //添加鼠标弹起
    backLayer.addEventListener(LMouseEvent.MOUSE_UP, touchUp)
    //添加鼠标移动
    backLayer.addEventListener(LMouseEvent.MOUSE_MOVE, touchMove)
    */
    //添加键盘 下 事件
    LEvent.addEventListener(LGlobal.window, LKeyboardEvent.KEY_DOWN, onKeyDown)
    //添加键盘 上 事件
    LEvent.addEventListener(LGlobal.window, LKeyboardEvent.KEY_UP, onKeyUp)
}

//游戏画面初始化
//对画布添加onframe监听
function gameToStart() {
    //背景层清空 移除所有
    backLayer.die()
    backLayer.removeAllChild()

    backLayer.graphics.drawRect(1, '#000000', [0, 0, 340, 480], true, '#000000')
    backLayer.addChild(graphicsMap)
    backLayer.addChild(nextLayer)
    getNewBox()

    //添加循环播放事件监听
    backLayer.addEventListener(LEvent.ENTER_FRAME, onframe)

}

function Box() {
    let self = this
    self.box1 = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0]
    ]
    self.box2 = [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ]
    self.box3 = [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ]
    self.box4 = [
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ]
    self.box5 = [
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0]
    ]
    self.box6 = [
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0]
    ]
    self.box7 = [
        [0, 0, 0, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0]
    ]
    self.box = [
        self.box1, self.box2, self.box3, self.box4,
        self.box5, self.box6, self.box7,
    ]
}
Box.prototype = {
    getBox: function () {
        let self = this
        let num = 7 * Math.random()
        let index = parseInt(num)
        let result = []
        let colorIndex = 1 + Math.floor(Math.random() * 4)
        let i, j
        for (i = 0; i < 4; i++) {
            let child = []
            for (j = 0; j < 4; j++)
                child[j] = self.box[index][i][j] * colorIndex
            result[i] = child
        }
        return result
    }
}

function getNewBox() { //获取下一个方块

    if (nextBox == null)
        nextBox = BOX.getBox()
    nowBox = nextBox
    pointBox.x = 4
    pointBox.y = -3
    nextBox = BOX.getBox()
    console.log(nowBox);

    nextLayer.removeAllChild()
    let i, j, bitmap
    for (i = 0; i < nextBox.length; i++)
        for (j = 0; j < nextBox[i].length; j++) {
            if (nextBox[i][j] == 0)
                continue
            bitmap = new LBitmap(bitmapdataList[nextBox[i][j]])
            bitmap.x = bitmap.getWidth() * j + START_X2
            bitmap.y = bitmap.getHeight() * i + START_Y2
            graphicsMap.addChild(bitmap)
            nextLayer.addChild(bitmap)
        }

}


function onframe() { //循环播放
    //首先，将当前下落方块移除画面
    minusBox()
    if (myKey.keyControl != null && myKey.stepindex-- < 0) {
        myKey.stepindex = myKey.step
        switch (myKey.keyControl) {
            case 'left':
                if (checkPlus(-1, 0)) {
                    pointBox.x -= 1
                    if (!LGlobal.canTouch) {
                        myKey.keyControl = null
                        myKey.touchMove = true
                        myKey.touchX = 0
                    }
                }
                break;
            case 'right':
                if (checkPlus(1, 0)) {
                    pointBox.x += 1
                    if (!LGlobal.canTouch) {
                        myKey.keyControl = null
                        myKey.touchMove = true
                        myKey.touchX = 0
                    }
                }
                break;
            case 'down':
                if (checkPlus(0, 1)) {
                    pointBox.y += 1
                    if (!LGlobal.canTouch) {
                        myKey.keyControl = null
                        myKey.touchMove = true
                        myKey.touchY = 0
                    }
                }
                break;
            case 'up':
                changeBox()
                if (!LGlobal.canTouch) {
                    myKey.keyControl = null
                    myKey.touchMove = true
                }
                break;
        }
    }

    if (speedIndex++ > speed) {
        speedIndex = 0

        if (checkPlus(0, 1))
            //可以下移，则将方块坐标下一一位
            pointBox.y++
        else {
            //无法下移
            plusBox()
            if (pointBox.y < 0) {
                //如果当前方块的坐标小于0，则游戏结束
                gameOver()
                return
            }
            //可能消除一行
            removeBox()
            //获取新方块
            getNewBox()
        }
    }
    plusBox()
    drawMap()

}

// 移除方块
function minusBox() {
    let i, j
    for (i = 0; i < nowBox.length; i++) {
        for (j = 0; j < nowBox[i].length; j++) {
            if (i + pointBox.y < 0 || i + pointBox.y >= map.length ||
                j + pointBox.x < 0 || j + pointBox.x >= map[0].length)
                continue
            map[i + pointBox.y][j + pointBox.x] = map[i + pointBox.y][j + pointBox.x] - nowBox[i][j]    // map标记成了0
            nodeList[i + pointBox.y][j + pointBox.x]["index"] = map[i + pointBox.y][j + pointBox.x] - 1 // 图形数组对应位置改为默认 -1
        }
    }
}

// 添加方块
function plusBox() {
    let i, j
    for (i = 0; i < nowBox.length; i++) {
        for (j = 0; j < nowBox[i].length; j++) {
            if (i + pointBox.y < 0 || i + pointBox.y >= map.length ||
                j + pointBox.x < 0 || j + pointBox.x >= map[i].length)
                continue
            map[i + pointBox.y][j + pointBox.x] = nowBox[i][j] + map[i + pointBox.y][j + pointBox.x]    // map对应Box位置标记
            nodeList[i + pointBox.y][j + pointBox.x]["index"] = map[i + pointBox.y][j + pointBox.x]     // 显示颜色 数字
        }
    }
}

//判断是否可移动
function checkPlus(nx, ny) { 
    let i, j
    if (pointBox.y < 0)
        if (pointBox.x + nx < 0 || pointBox.x + nx > map[0].length - 4)
            return false

    //循环nowBox数组的每一个元素
    for (i = 0; i < nowBox.length; i++) {
        for (j = 0; j < nowBox[i].length; j++) {
            if (i + pointBox.y + ny < 0)
                continue
            else if (i + pointBox.y + ny >= map.length || j + pointBox.x + nx < 0 ||
                j + pointBox.x + nx >= map[0].length) {
                //判断网格超出网格范围
                if (nowBox[i][j] == 0)
                    //判断网格为空继续判断 
                    continue
                else
                    return false
            }
            if (nowBox[i][j] > 0 && map[i + pointBox.y + ny][j + pointBox.x + nx] > 0)
                return false
        }
    }
    return true
}

function drawMap() { //绘制所有方块
    //遍历nodeList变量，如果node的index是-1，就作为背景，白色
    //bitmapdataList的第一个作为背景，此外还有3各作为方块颜色
    let i, j
    for (i = 0; i < map.length; i++) {
        for (j = 0; j < map[0].length; j++) {
            if (nodeList[i][j]["index"] >= 0)
                nodeList[i][j]["bitmap"].bitmapData = bitmapdataList[nodeList[i][j]["index"]]
            else
                nodeList[i][j]["bitmap"].bitmapData = bitmapdataList[0]
        }
    }
}

//游戏结束
function gameOver() {
    backLayer.die()
    var txt = new LTextField()
    txt.color = "ff0000"
    txt.size = 40
    txt.text = "游戏结束"
    txt.x = (LGlobal.width - txt.getWidth()) * 0.5
    txt.y = 200
    backLayer.addChild(txt)
}

//键盘按下事件
function onKeyDown(event) {

    if (myKey.keyControl != null) return
    if (event.keyCode == 37)
        myKey.keyControl = 'left'
    else if (event.keyCode == 38)
        myKey.keyControl = 'up'
    else if (event.keyCode == 39)
        myKey.keyControl = 'right'
    else if (event.keyCode == 40)
        myKey.keyControl = 'down'
    else if (event.keyCode == 80)
        myKey.keyControl = 'pause'

}

//键盘弹起事件
function onKeyUp(event) {
    myKey.keyControl = null
    myKey.stepindex = 0
}

function changeBox() {
    console.log("changed");

    let saveBox = nowBox
    nowBox = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    let i, j
    for (i = 0; i < saveBox.length; i++) {
        for (j = 0; j < saveBox[i].length; j++) {
            nowBox[i][j] = saveBox[(3 - j)][i]
        }
    }
    if (!checkPlus(0, 0))
        nowBox = saveBox

}

function touchDown(event) { //鼠标按下
    myKey.isTouchDown = true
    myKey.touchX = Math.floor(event.selfX / 20)
    myKey.touchY = Math.floor(event.selfY / 20)
    myKey.touchMove = false
    myKey.keyControl = null
}

function touchUp(event) { //鼠标弹起
    myKey.isTouchDown = false
    if (!myKey.touchMove)
        myKey.keyControl = 'up'
}

//鼠标移动
function touchMove(event) {
    if (!myKey.isTouchDown) return
    var mx = Math.floor(event.selx / 20)
    if (myKey.touchX == 0) {
        myKey.touchX = mx
        myKey.touchY = Math.floor(event.selfY / 20)
    }
    if (mx > myKey.touchX)
        myKey.keyControl = 'right'
    else if (mx < myKey.touchX)
        myKey.keyControl = 'left'
    if (Math.floor(event.selfY / 20) > myKey.touchY)
        myKey.keyControl = 'down'

}

//消除可消除的方块
function removeBox() {
    let i, j, count = 0
    for (i = pointBox.y; i < (pointBox.y + 4); i++) {
        if (i < 0 || i >= map.length) continue
        for (j = 0; j < map[0].length; j++) {
            if (map[i][j] == 0)
                break
            if (j == map[0].length - 1) {
                moveLine(i)
                count++
            }
        }

    }

}

//消除指定层的方块
function moveLine(line) {
    let i, j
    for (i = line; i > 1; i--) {
        for (j = 0; j < map[0].length; j++) {
            map[i][j] = map[i - 1][j]
            nodeList[i][j].index = nodeList[i - 1][j].index
        }
    }
    for (j = 0; j < map[0].length; j++) {
        map[0][j] = 0
        nodeList[0][j].index = -1
    }
    console.log(map);

}
