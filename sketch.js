//GS start
var PLAY = 1;
var END = 0;
var gameState = PLAY;
//Sprites
var ground,ground_image,invisible_ground
var girl,girl_running,girl_collided,girlImage
var zombie,zombie_running,zombie_attack
var obstaclesGroup
var jumpSound,dieSound,checkpointSound
var score
var gameOver,restart,gameOverImage,restartImage
//----------------------------------------------------------
function preload(){
  ground_image = loadImage("Background.png");
  girl_running = loadAnimation("Run (1).png","Run (2).png","Run (3).png","Run (4).png","Run (5).png","Run (6).png","Run (7).png","Run (8).png","Run (9).png","Run (10).png","Run (11).png","Run (12).png","Run (14).png","Run (15).png","Run (16).png","Run (17).png","Run (18).png","Run (19).png","Run (20).png");
  zombie_running = loadAnimation("Walk (1).png","Walk (2).png","Walk (3).png","Walk (4).png","Walk (5).png","Walk (6).png","Walk (7).png","Walk (8).png","Walk (9).png","Walk (10).png");
  zombie_attack = loadAnimation("Attack (2).png","Attack (3).png","Attack (4).png","Attack (5).png","Attack (6).png","Attack (7).png","Attack (8).png");
  obstacle1 = loadImage("obstacle1.png");
  zombie_idle = loadImage("Stand.png");
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  gameOverImage = loadImage("gameOver1.png");
  restartImage = loadImage("restart1.png");
  girl_collided = loadImage("Dead (30).png");
  girlImage = loadImage("Idle (1).png");
}

function setup() {
  
  //canvas
 createCanvas(600,500);
  
  //Ground
  ground = createSprite(0,0,0,0);
  ground.shapeColor="white";
  ground.addImage("ground_image",ground_image);
  ground.scale=1.4;
  ground.velocityX=-1
  
  //Girl
  girl = createSprite(300,420,600,10);
  girl.addAnimation("girl_running",girl_running);
  girl.addImage("girl_collided",girl_collided);
  girl.addImage("girlImage",girlImage);
  girl.scale=0.2;
  girl.setCollider("rectangle",0,0,girl.width,girl.height)
  
  //Zombie
  zombie = createSprite(50,410,600,10);
  zombie.addAnimation("zombie_running",zombie_running);
  zombie.addAnimation("zombie_attack",zombie_attack);
  zombie.addImage("zombie_idle",zombie_idle);
  zombie.scale=0.2;
  invisible_ground=createSprite(300,470,600,10);
  invisible_ground.visible=false;
  
  //gameState Details
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImage);
  restart = createSprite(300,180);
  restart.addImage(restartImage);
  
  obstaclesGroup=new Group();
  score=0;
  
}

function draw() {
  
 background("black");
  
   //Gravity
  girl.velocityY = girl.velocityY + 0.8;
  girl.collide(invisible_ground); 
  zombie.velocityY = zombie.velocityY + 0.8;
  zombie.collide(invisible_ground); 
  
  //Change PLAY State
if (gameState===PLAY){
      gameOver.visible=false;
      restart.visible=false;
      score = frameCount;
      ground.velocityX = -(4 + 3* score/100);
  
      spawnObstacles();
       //Zombie AI
         if (obstaclesGroup.isTouching(zombie)){
               zombie.velocityY=-12;
             }
    //Repeat
         if (ground.x < 0){
              ground.x = ground.width/2;
            }
      //CheckPoint
       if(score>0 && score%200 === 0){
           checkPointSound.play() 
            }
   //Jump Girl 
 if((keyDown("space")&& girl.y >= 410)) {
   girl.velocityY = -12;
    jumpSound.play();
  }  
  
  //GameState END
    if (girl.isTouching(obstaclesGroup)){
      gameState=END;
       dieSound.play();
      }
    }  else if (gameState===END) {
      gameOver.visible=true;
      restart.visible=true;
      ground.velocityX = 0;
      girl.velocityY = 0
      girl.changeImage("girlImage",girlImage);
      zombie.changeAnimation("zombie_attack",zombie_attack);
       zombie.x=girl.x;
      //End Animation
          if (zombie.isTouching(girl)) {
              girl.changeImage("girl_collided",girl_collided);
              zombie.changeImage("zombie_idle",zombie_idle);
              }
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
  //Restart
    if(mousePressedOver(restart)) {
      reset();
    }
} 
 
  drawSprites();
  fill("white");
  textSize(15);
   text("Score: "+ score, 450,50);
}
//--------------------------------------------------------
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible =  false;
  
  girl.changeAnimation("girl_running",girl_running);
  zombie.changeAnimation("zombie_running",zombie_running);
  
  obstaclesGroup.destroyEach();
  score=0;
  zombie.x=50;
  frameCount=0;
}

function spawnObstacles() {
   if (frameCount % 80 === 0 && score>100){
     var obstacle = createSprite(600,450,10,40);
     obstacle.velocityX = -6.5 - (score/300);
     obstacle.addImage(obstacle1);
     obstacle.scale=0.15;
     obstaclesGroup.add(obstacle);
     obstacle.setCollider("circle",0,0,1);
   }
     
}

//Taken Animation from "https://editor.p5js.org/shivamsamarthsingh/sketches/jzSUi4bcZ" ma'am... I tried finding the best of the Animations from Code.org, but I failed to find a good one.. So I took this project for as a  linkage and then started to code ma'am..
