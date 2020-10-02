function positive(x) {
    return x < 0 ? -x : x;
}

var objs = [];
var powerups = [];

class PowerUp {
    constructor(x,y,n) {
        this.pos = createVector(x,y);
        this.name = 'Power'
        powerups.push(this);
    }

    update(obj) {
        if (
            dist(
                this.pos.x,this.pos.y,
                obj.pos.x,obj.pos.y
            ) < 10
        ) {
            obj.up(this.name)
        }
    }

    show() {
        stroke(255,0,0);
        fill(255,0,0);

        rect(
            this.pos.x,this.pos.y,
            10,10
        )
    }
}

class VisonPoint extends PowerUp {
    constructor (x,y) {
        super(x,y,'vision')
        this.name = 'vision'
    }

    update(obj) {
        if (
            dist(
                this.pos.x,this.pos.y,
                obj.pos.x,obj.pos.y
            ) < 20
        ) {
            obj.up(this.name)
        } else {
            obj.up(`-${this.name}`)
        }
    }
}

class Obstacle {
    constructor(x,y,w,h) {
        this.pos = createVector(x,y)
        this.width  = w;
        this.height = h;

        objs.push(this);
    }

    show() {
        fill(255);
        stroke(255);

        rect(
            this.pos.x,
            this.pos.y,
            this.width,
            this.height
        )
    }
}

class Player {
    constructor(x,y,vr) {
        this.pos = createVector(x,y);
        this.range = vr;
    }

    move(x,y) {
        this.pos = createVector(this.pos.x+x,this.pos.y+y);
    }

    up(trait) {
        switch (trait) {
            case 'vision':
                this.range += 10;
            break;

            case '-vision':
                if (this.range > 50)
                    this.range -= 10;
            break;
            
            default:
            break;
        }
    }

    show() {
        fill(255);
        stroke(255);

        for (let obj of objs) {
            if (
                dist(
                    this.pos.x,this.pos.y,
                    obj.pos.x,obj.pos.y,
                ) < this.range
                &&
                dist(
                    this.pos.x,this.pos.y,
                    obj.pos.x,obj.pos.y,
                ) > 10
            ) {
                obj.show();
            } else if (
                dist(
                    this.pos.x,this.pos.y,
                    obj.pos.x,obj.pos.y,
                ) < 10
            ) {
                obj.show();
                this.move(
                    this.pos.x-obj.pos.x,
                    this.pos.y-obj.pos.y
                )
            }
        }

        for (let obj of powerups) {
            if (
                dist(
                    this.pos.x,this.pos.y,
                    obj.pos.x,obj.pos.y,
                ) < this.range
            ) {
                obj.show();
            }
        }

        fill(29,155,203)
        stroke(29,155,203)

        rect(
            this.pos.x-5,
            this.pos.y-5,
            10,10
        )
    }
}

let charecter;

function setup() {
    createCanvas(400,400);

    charecter = new Player(10,10,50);

    for (let i = 0; i < 10 ; i++ ) {
        new Obstacle(
            (Math.floor(Math.random()*width)%10)*width/10,(Math.floor(Math.random()*height)%10)*height/10,
            10,10
        );
    }

    new VisonPoint(200,200);
}

document.addEventListener('keydown', (e) => {
    
    switch (e.key) {
        case 'w':
            charecter.move(0,-10)
        break;

        case 'a':
            charecter.move(-10,0)
        break;

        case 's':
            charecter.move(0,10)
        break;

        case 'd':
            charecter.move(10,0)
        break;
    }
})

function draw() {
    background(0);
    for (let pu of powerups) {
        pu.update(charecter)
    }
    charecter.show();
}