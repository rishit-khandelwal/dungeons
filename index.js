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
    constructor(x,y,vr,props={}) {
        this.pos = createVector(x,y);
        this.range = vr;
        this.props = props
        this.props['vision'] = this.range/width
    }

    move(x,y) {
        for (let obj of objs.concat(powerups))
            obj.pos = createVector(obj.pos.x+x,obj.pos.y+y);
    }

    up(trait) {
        switch (trait) {
            case 'vision':
                if (this.range < 100)
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

        if (this.pos.x > width) {
            this.pos.x = 10
        }
        
        if (this.pos.x < 0 ) {
            this.pos.x = width-10
        }

        if (this.pos.y < 0 ) {
            this.pos.y = height-10
        }

        if (this.pos.y > height ) {
            this.pos.y = 10
        }

        this.props['vision'] = this.range/width

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
                ) < 20
            ) {
                obj.show();
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
            this.pos.x - 14 + 1/this.props['vision'],
            this.pos.y - 30,
            80*this.props['vision'],
            5
        )

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

    charecter = new Player(200,200,50);

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
        case 's':
            charecter.move(0,-10)
        break;

        case 'd':
            charecter.move(-10,0)
        break;

        case 'w':
            charecter.move(0,10)
        break;

        case 'a':
            charecter.move(10,0)
        break;
    }
})

function mousePressed() {
    charecter.range = width
}

function draw() {
    background(128);
    for (let pu of powerups) {
        pu.update(charecter)
    }
    
    charecter.show();
}