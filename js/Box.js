class Box {
    constructor() {
        this.box1 = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0]
        ]
        this.box2 = [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0]
        ]
        this.box3 = [
            [0, 0, 0, 0],
            [1, 1, 1, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0]
        ]
        this.box4 = [
            [0, 1, 1, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0]
        ]
        this.box5 = [
            [0, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0]
        ]
        this.box6 = [
            [0, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 0]
        ]
        this.box7 = [
            [0, 0, 0, 0],
            [0, 0, 1, 0],
            [0, 1, 1, 0],
            [0, 1, 0, 0]
        ]
        this.box = [
            this.box1, this.box2, this.box3, this.box4,
            this.box5, this.box6, this.box7,
        ]
    }
}
