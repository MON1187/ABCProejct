// 이미지 및 반지름 추가
import { FRUITS } from "./fruits.js";

// 모듈 불러오기
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,

    //add Body
    Body = Matter.Body;

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

    if(disableAction) returns
    switch(event.code)
    {
        case "KeyA":
            Body.setPosition(currentBody,
            {
                x : currentBody.position.x - 10,
                y : currentBody.position.y
            })
            break;
        case "KeyD":
            Body.setPosition(currentBody,{
            x : currentBody.position.x + 10,
            y : currentBody.position.y
        })
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

addFruits();//함수 호출