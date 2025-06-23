const canvas = document.querySelector("canavs");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 1024;

c.fillRect(0,0, canvas.width, canvas.height);

class Sprite{
    constructor({position, velocity}){
        this.position = position;
        
        this.width = 50;
        this.height = 150;
    }
    
    draw(){
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const player = new Sprite({
    position:{
        x :0,
        y:0,
    },
})

player.draw();