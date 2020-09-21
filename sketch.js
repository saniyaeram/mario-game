var mario,mario_running,mario_collided;
var ground,groundimage,invisibleground;
var bricksimage,bricksGroup,score,obstacleimage, obstaclesGroup;

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var ground1;

function preload(){
  bg=loadImage("bg.png");
  
  mario_running =      loadAnimation("mario00.png","mario01.png","mario03.png");
  
  mario_collided =loadAnimation("collided.png");
  
  groundimage=loadImage("ground2.png");
  
  brickimage=loadImage("brick.png");
  
  obstacleimage=loadAnimation("obstacle1.png", "obstacle2.png","obstacle3.png","obstacle4.png");
  
  restartImage = loadImage("restart.png");
  gameOverImage = loadImage("gameOver.png");
}

function setup(){
  createCanvas(600,350);
  
  //creating mario sprite and adding animation
  mario=createSprite(50,295,20,50);
  mario.addAnimation("running",mario_running);
  mario.addAnimation("collided",mario_collided);
  mario.scale = 2;
  
  //creating ground sprite and adding image
  ground=createSprite(300,330,600,20);
  ground.addImage(groundimage);
  
  //making the player walk on the ground
  invisibleground=createSprite(300,300,600,10);
  invisibleground.visible=false;
  
  //creating for bricks and obstacles
  bricksGroup = new Group();
  obstaclesGroup = new Group();
  
  textSize(24);
  fill(0)
  score=0;
  
  restart = createSprite(300,100);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  gameOver = createSprite(300,140);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;
  restart.visible= false;
  gameOver.visible=false;
}

function draw(){
  //adding background
  background(bg);
  text("Score: "+score,480,30);
  if(gameState === PLAY){
    //jump when space is pressed
    if(keyDown("space")&&mario.y>250){
     mario.velocityY=-18; 
     }
    
    //adding gravity
    mario.velocityY=mario.velocityY+0.8;
    
    
     //making the ground move
      ground.velocityX=-(6+3*score/100);
    
    //reset the ground back to center
    if(ground.x<0){
     ground.x =ground.width/2
    }
    
    //calling function spawn bricks
  spawnBricks();
    
    //destroy each brick
  for(var i = 0; i<bricksGroup.length;i++){
    if(bricksGroup.get(i).isTouching(mario)){
      bricksGroup.get(i).remove();
   score=score+1; 
  }
  }
    
    //calling function spawn obstacles
  spawnObstacles();
    
    if(obstaclesGroup.isTouching(mario)){
     gameState = END 
    }
  }
  
  else if(gameState === END){
     ground.velocityX=-0;
    
    obstaclesGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
    mario.velocityY = 0;
    mario.changeAnimation("collided",mario_collided);
    
    restart.visible= true;
  gameOver.visible=true;
    
    if(mousePressedOver(restart)){
     reset(); 
    }
  }
  
  //stop mario from falling down
  mario.collide(invisibleground);

  drawSprites();
}

function reset(){
  restart.visible= false;
  gameOver.visible=false;
  gameState = PLAY;
  mario.changeAnimation("running",mario_running);
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  score = 0; 
}

function spawnBricks(){
  if(frameCount%60===0){
   var brick = createSprite(600,120,40,10);
    brick.addImage(brickimage);
    brick.velocityX=-3
    brick.y=random(150,180);
    brick.lifetime = 200;
    mario.depth=brick.depth+1;
    bricksGroup.add(brick);
  }
}

function spawnObstacles(){
 if(frameCount%60===0){
  var obstacle = createSprite(600,270,10,40);
   obstacle.velocityX=-(6+3*score/100);
   obstacle.addAnimation("obstacle",obstacleimage);
   obstacle.lifetime=100;
   obstaclesGroup.add(obstacle);
 }
}
