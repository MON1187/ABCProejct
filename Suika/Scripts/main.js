// 이미지 및 반지름 추가
import { FRUITS } from "./fruits.js";

const loadTexture = async () => {

    const textureList = [
    'image/00_cherry.png',
    'image/01_strawberry.png',
    'image/02_grape.png',
    'image/03_gyool.png',
    'image/04_orange.png',
    'image/05_apple.png',
    'image/06_pear.png',
    'image/07_peach.png',
    'image/08_pineapple.png',
    'image/09_melon.png',
    'image/10_watermelon.png',
    ]
    
    const load = textureUrl => {
    const reader = new FileReader()
    
    return new Promise( resolve => {
    reader.onloadend = ev => {
    resolve(ev.target.result)
    }
    fetch(textureUrl).then( res => {
    res.blob().then( blob => {
    reader.readAsDataURL(blob)
    })
    })
    })
    }
    
    const ret = {}
    
    for ( let i = 0; i < textureList.length; i++ ) {
    ret[textureList[i]] = await load(`${textureList[i]}`)
    }
    
    return ret
    }
    
    const textureMap = await loadTexture()

// 모듈 불러오기
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,

    //add Body
    Body = Matter.Body,

    //Add Events
    Events = Matter.Events;

// 엔진 선언
const engine = Engine.create();

// 렌더 선언
const render = Render.create({
    engine,
    // 어디에 그릴 것인지
    element: document.body,
    options: {
        wireframes: false,
        background: '#F7F4C8',
        width: 620,
        height: 850,
    }
});

// 벽 생성을 위한 월드 생성
const world = engine.world;

// 벽 생성
const leftWall = Bodies.rectangle(15, 395, 30, 790, { // x 좌표, y 좌표, width, height
    isStatic: true,
    render: {fillStyle: '#E6B143'}
})

const rightWall = Bodies.rectangle(605, 395, 30, 790, { // x 좌표, y 좌표, width, height
    isStatic: true,
    render: {fillStyle: '#E6B143'}
})

const ground = Bodies.rectangle(310, 820, 620, 60, { // x 좌표, y 좌표, width, height
    isStatic: true,
    render: {fillStyle: '#E6B143'}
})

const deadLine = Bodies.rectangle(310, 150, 620, 2, { // x 좌표, y 좌표, width, height
    //play event
    name : "deadLine",
    
    isStatic: true,
    isSensor:true,  //센서 감지 기능
    render: {fillStyle: '#E6B143'}
})


World.add(world, [leftWall, rightWall, ground, deadLine]);

// 실행
Render.run(render);
Runner.run(engine);

// 현재 과일 값을 저장하는 변수
let currentBody = null
let currentFruit = null

//Key 조작을 제어하는 변수
let disableAction = false

let interval = true;

// 과일을 추가하는 함수
function addFruits()
{
    //난수 생성
    const index = Math.floor(Math.random() * 5);
    
    const fruits = FRUITS[index];

    const body = Bodies.circle(300, 50, fruits.radius,
        {
            // 해당 과일의 변호값을 저장
            index : index,
            isSleeping : true,  //처음 멈춤


            render:{
                sprite: {texture: `${fruits.name}.png`}
            },
            restitution : 0.8,
        });

        // 현재 과일값 저장
        currentBody = body;
        currentFruit = fruits;

        World.add(world, body);
}

//Get Keybod
window.onkeydown = (event) => {

    if(disableAction) return;
    switch(event.code)
    {
        case "KeyA":

            if(interval)
            return;

            interval = setInterval(() => {
                if(currentBody.position.x + currentFruit.radius > 30){
                    Body.setPosition(currentBody,
                    {
                        x : currentBody.position.x - 1,
                        y : currentBody.position.y
                    })
                }
            }, 5)
            break;
        case "KeyD":

            if(interval)
            return;

            interval = setInterval(() => {
                if(currentBody.position.x + currentFruit.radius < 590){
                    Body.setPosition(currentBody,{
                    x : currentBody.position.x + 1,
                    y : currentBody.position.y
                    })
                }
            }, 5)
        break;
        case "KeyS":
            currentBody.isSleeping = false;
            //addFruits();
            disableAction = true
            //지연 시키는 함수
            setTimeout(() => {
               addFruits(); 
                disableAction = false;
            }, 500);

            break;
    }
}

window.onkeyup = (event) => {
    switch(event.code){
        case "KeyA":
        case "KeyD":
            clearInterval(interval);
            interval = null;
    }
}

Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((collision)=>{
        //같은 과일일 경우
        if(collision.bodyA.index == collision.bodyB.index)
        {
            //지우기 전에 해당 과일 값을 저장
            const index = collision.bodyA.index;

            if(index == FRUITS.length - 1)
                return;

            World.remove(world,[collision.bodyA,collision.bodyB]);
                
            const newFruit = FRUITS[index + 1];
            const newBody = Bodies.circle(
                //충돌한 지점의 x,y
                collision.collision.supports[0].x,
                collision.collision.supports[0].y,
                newFruit.radius,
                {
                index : index + 1,
                render : { sprite: {texture: `${newFruit.name}.png`}},
                }
            );

                //New add fruit
                World.add(world, newBody);

                if(newBody.index === 10)
                {
                    setTimeout(() =>{
                        alert("You made Suika!\nCongratulation");
                        disableAction == true;
                    },1000)
                }
        }

        if(!disableAction &&collision.bodyA.name === "deadLine" || collision.bodyB.name === "deadLine")
        {
            alert("Game Over");
            disableAction == true;
        }
   
    })
})


addFruits();//함수 호출