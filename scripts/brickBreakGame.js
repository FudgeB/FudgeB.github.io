




var canvas, context;
var gridWidth = 20;
var gridHeight = 12;
var paddleWidth = 40;
var paddleHeight = 5;
var playing = false;
var ballReleased = false;
var brickGame;
var timer;

function randomInt(start,end){
	return Math.floor(Math.random() * (end-start) + start);
}
function randomFloat(start,end){
	return Math.random() * (end-start) + start;
}

////////////////////////////  Coord  ////////////////////////////
function Coord (x, y){
	this.x = x;
	this.y = y;
}
////////////////////////  end Coord  ////////////////////////////

/////////////////////////  Color   /////////////////////////////
function Color (red, green, blue){
	this.red = red % 255;
	this.green = green % 255;
	this.blue = blue % 255;
}
Color.prototype = {
	constructor: Color,
	random: function (start, end){
		this.red = randomInt(start,end);//Math.floor(Math.random() * (end-start) + start);
		this.green = randomInt(start,end);//Math.floor(Math.random() * (end-start) + start);
		this.blue = randomInt(start,end);//Math.floor(Math.random() * (end-start) + start);
	},
	rgbString: function(){
		//     'rgb(100, 200, 150)'
		var rgb = 'rgb(' + this.red + ',' + this.green +',' + this.blue + ')';
		return rgb;
	},
	rgbaString: function(){
		//     'rgba(100, 200, 150,0)'
		var rgb = 'rgb(' + this.red + ',' + this.green +',' + this.blue + ',' + 0 + ')';
		return rgb;
	}
}
////////////////////////  end Color  ////////////////////////

/////////////////////////   Square   /////////////////////////
function Square (pos, size){//, color, speed){
	this.size = size;
	if(pos instanceof Coord){
		this.pos = pos;
//		if(this.pos.x + this.size/2 > canvas.width){
//			this.pos.x = canvas.width - this.size/2;
//		}
//		else if(this.pos.x - this.size/2 < 0){
//			this.pos.x = this.size/2;
//		}
//		if(this.pos.y + this.size/2 > canvas.height){
//			this.pos.y = canvas.height - this.size/2;
//		}
//		else if(this.pos.y - this.size/2 < 0){
//			this.pos.y = this.size/2;
//		}
	}
	else {
		console.log("Square: wrong type for pos")
	}
}
Square.prototype = {
		constructor: Square,
		draw: function(context, color){
			context.fillStyle = color.rgbString();
			context.strokeStyle = color.rgbString();
			context.strokeRect(this.pos.x, this.pos.y, this.size, this.size);
			context.fillRect(this.pos.x, this.pos.y, this.size, this.size);
			//context.fillStyle = 'rgb(100, 200, 150)';
			//context.fillRect(10, 10, 50, 50);
		}
}
///////////////////////  end Square   ///////////////////////

//////////////////////////   Brick  /////////////////////////
function Brick (pos, brickSize){
	if(pos instanceof Coord){
		this.pos = pos;
	}
	else {
		console.log("Brick: wrong type for pos")
	}
	this.hit = false;
	
	var red = randomInt(64,192);//Math.floor(Math.random() * 128)+64;
	var green = randomInt(64,192);//Math.floor(Math.random() * 128)+64;
	var blue = randomInt(64,192);//Math.floor(Math.random() * 128)+64;
	this.color = new Color(red,green,blue);
	
	this.brickSize = brickSize;
	var sqrSize = this.brickSize.x/3;
	this.squares = [];
	
	for(var i=0; i<brickSize.y/sqrSize; i++){
		for(var j=0; j<brickSize.x/sqrSize; j++){
			this.squares.push(new Square(new Coord(this.pos.x + j*sqrSize,this.pos.y + i*sqrSize),sqrSize))
		}
	}
}
Brick.prototype = {
		constructor: Brick,
		draw: function (context){
			for(var l=0; l<this.squares.length; l++){
				if(!this.hit){
					this.squares[l].draw(context,this.color)
				}
			}
		},
}
/////////////////////////  end Brick  ///////////////////////  

///////////////////////  Grid  //////////////////////////
function Grid(pos, canvasWidth){
	this.pos = pos;
	this.gridSize = new Coord(gridWidth, gridHeight);
	var brickWidth = /*brickGame.canvas.*/canvasWidth / gridWidth;
	var brickHeight = (brickWidth/3)*2; 
	var brickSize = new Coord(brickWidth,brickHeight);
	this.bricks = [];
	
	for(var i=0; i<gridHeight; i++){
		for(var j=0; j<gridWidth; j++){
			this.bricks.push(new Brick(new Coord(j*brickSize.x,pos+i*brickSize.y),brickSize))
		}
	}
}
Grid.prototype = {
		constructor: Grid,
		draw: function(context){
			for(var l=0; l<this.bricks.length; l++){
				this.bricks[l].draw(context);
			}
		}
}
/////////////////////  end Grid  ////////////////////////

///////////////////////  Ball  /////////////////////////
function Ball(pos,area){
	this.size = 3.5;
	this.pos = pos;
	this.pos.y -= this.size/2+1;
	this.startY = this.pos.y;
	this.area = area;
	this.isMoving = false;
	this.dir = new Coord(randomInt(-1,2),-1)
	this.movMin = -2;
	this.movMax = 10;
	//randomInt(start,end);//
	var movX = Math.random();//randomFloat(0,1);
	var movY = Math.random();//randomFloat(this.movMin,0);
	while(movY === 0){
		movY = Math.random();//randomFloat(movMin,0);
	}
	this.mov = new Coord(movX,movY);
	//this.context = context;
	this.colors = [];
	this.numColors = 3;
	this.setColors();
}
Ball.prototype = {
		constructor: Ball,
		draw: function(context){
			//this.context.fillStyle = this.gradient;
			//this.context.fillRect(this.pos.x-this.size, this.pos.y-this.size, this.size*2, this.size*2);
		    
			var gradient = context.createRadialGradient(this.pos.x,this.pos.y,0,this.pos.x,this.pos.y,this.size);
			gradient.addColorStop(0,this.colors[0].rgbString());//"rgb(100, 200, 150)");
			gradient.addColorStop(0.5,this.colors[1].rgbString());//"rgb(200, 100, 150)");
			gradient.addColorStop(1,this.colors[2].rgbString());//"rgb(15, 150, 150)");
			context.beginPath();
			context.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI, false);
			context.fillStyle = gradient;
			context.fill();
			//this.context.lineWidth = 0.25;
			//this.context.strokeStyle = '#000000';
			//this.context.stroke();
		},
		setColors: function(){
			for(var i=0; i<this.numColors; i++){
				var randColor = new Color(1,1,1);
				//if(i%2 == 1){
				//	randColor.random(128,192);
				//}
				//else{
					randColor.random(32, 192);
				//}
				this.colors.push(randColor);
			}
		},
		move: function(){
			if(this.isMoving){
				if(this.pos.x + this.mov.x*this.movMax*this.dir.x < this.size){
					this.pos.x = this.size;
					this.dir.x *= -1;
				}
				else if(this.pos.x + this.mov.x*this.movMax*this.dir.x > this.area.x-this.size){
					this.pos.x = this.area.x-this.size;
					this.dir.x *= -1;
				}
				else {
					this.pos.x += this.mov.x*this.movMax*this.dir.x;
				}
				if(this.pos.y + this.mov.y*this.movMax*this.dir.y < this.size){
					this.pos.y = this.size;
					this.dir.y *= -1;
				}
				else if(this.pos.y + this.mov.y*this.movMax*this.dir.y > this.area.y-this.size){
					this.pos.y = this.area.y-this.size;
					this.dir.y *= -1;
				}
				else{
					this.pos.y += this.mov.y*this.movMax*this.dir.y;
				}
			}
		},
		followPaddle: function(posX){//,posY,paddleHeight){
			if(posX - this.size.x/2 < 0){
				posX = this.size.x/2;
			}
			else if(posX + this.size.x/2 > this.moveWidth){
				posX = this.moveWidth - this.size.x/2;
			}
			this.pos.x = posX;
			this.pos.y = this.startY;
		}
		
		
}
////////////////////  end Ball  ////////////////////////

///////////////////////  Paddle  ////////////////////////
function Paddle(pos, canvasWidth){
	this.size = new Coord(paddleWidth, paddleHeight);
	this.pos = new Coord(canvasWidth/2, pos);
	this.color = new Color(50, 50, 50);
	this.moveWidth = canvasWidth;
}
Paddle.prototype = {
		constructor: Paddle,
		draw: function(context){
			//var context = 
			context.fillStyle = this.color.rgbString();
			context.strokeStyle = this.color.rgbString();
			context.strokeRect(this.pos.x - this.size.x/2, this.pos.y - this.size.y/2, this.size.x, this.size.y);
			context.fillRect(this.pos.x - this.size.x/2, this.pos.y - this.size.y/2, this.size.x, this.size.y);
		},
		move: function(posX,posY){
			if(posX - this.size.x/2 < 0){
				posX = this.size.x/2;
			}
			else if(posX + this.size.x/2 > this.moveWidth){
				posX = this.moveWidth - this.size.x/2;
			}
			this.pos.x = posX;
		}
}
////////////////////  end Paddle  ///////////////////////

////////////////////  BrickGame  ////////////////////////
function BrickGame(){
	this.canvas = document.getElementById('gameCanvas');
	if(this.canvas.getContext){
		this.context = this.canvas.getContext('2d');
	}
	this.grid = new Grid(this.canvas.height/8, this.canvas.width);
	this.paddle = new Paddle(this.canvas.height-(paddleHeight*3),this.canvas.width);

	this.ball = new Ball(new Coord(this.paddle.pos.x,this.paddle.pos.y-this.paddle.size.y/2-2), 
			new Coord(this.canvas.width,this.canvas.height));// ,this.context);
	
	this.gradient = this.context.createRadialGradient(this.canvas.width/2,this.canvas.height/2,0,
			this.canvas.width/2,this.canvas.height/2,this.canvas.width/2);
	this.setBackgroundColors();
	playing = true;
	//this.canvas.addEventListener('mousemove',mouseMoveEvent(event,this));
}
BrickGame.prototype = {
		constructor:BrickGame,
		setBackgroundColors: function(){
			var colors = [];
			var numColors = 3;
			for(var i=0; i<numColors; i++){
				var randColor = new Color(1,1,1);
				randColor.random(0, 255);
				colors.push(randColor);
			}
			this.gradient.addColorStop(0,colors[0].rgbString());//"rgb(100, 200, 150)");
			this.gradient.addColorStop(0.5,colors[1].rgbString());//"rgb(200, 100, 150)");
			this.gradient.addColorStop(1,colors[2].rgbString());//"rgb(15, 150, 150)");
		},
		clear: function(){
			// Create gradient
			var context = this.context;
			//var gradient = context.createRadialGradient(this.canvas.width/2,this.canvas.height/2,0,
			//		this.canvas.width/2,this.canvas.height/2,this.canvas.width/2);
			//  nice colors to recall later
			// 0: Color {red: 166, green: 198, blue: 123}
			// 1: Color {red: 82, green: 175, blue: 23}
			// 2: Color {red: 21, green: 38, blue: 24}
			
			
			//gradient.addColorStop(0,this.backgroundColors[0].rgbString());//"rgb(100, 200, 150)");
			//gradient.addColorStop(0.5,this.backgroundColors[1].rgbString());//"rgb(200, 100, 150)");
			//gradient.addColorStop(1,this.backgroundColors[2].rgbString());//"rgb(15, 150, 150)");
	
			// Fill with gradient
			context.fillStyle = this.gradient;
			context.fillRect(0,0,this.canvas.width,this.canvas.height);
		},
		draw: function(){
			this.grid.draw(this.context);
			this.paddle.draw(this.context);
			this.ball.draw(this.context);
		},
		move: function(){
			if(this.ball != undefined){
				this.ball.move();
				this.clear();
				this.draw();
			}
		}
}
///////////////////  end BrickGame  /////////////////////

function resize() {
	var canvas = document.getElementById('gameCanvas');
    var ratio = canvas.width / canvas.height;
    var canvas_height = window.innerHeight * 0.85;
    var canvas_width = window.innerWidth * 0.85;
    
    if(canvas_width>canvas_height){
        canvas_width=canvas_height/ratio;
    }
    else if(canvas_width<canvas_height){
    	canvas_height=canvas_width/ratio;
    }

    canvas.style.width = canvas_width + 'px';
    canvas.style.height = canvas_height + 'px';
}

function drawBeginning(){

//	if(canvas.getContext){
//		context = canvas.getContext('2d');
//		
//		var grid = new Grid(canvas.height/8);
//		grid.draw(context);
//		
//		var paddle = new Paddle(canvas.height-(paddleHeight*3));
//		paddle.draw(context);
//		
//		//canvas.addEventListener(onmouseover) =
//		// onmouseout
//		// onmousemove
//
//		
////		context.fillStyle = 'rgb(100, 200, 150)';
////		context.fillRect(10, 10, 50, 50);
//
//
////		red = Math.floor(Math.random() * 255);
//
//	}

}

function mover(){
	if(playing){
		brickGame.move();
	}
}

function loader(){
	resize();
	brickGame = new BrickGame();
	brickGame.clear();
	brickGame.draw();
	timer = window.setInterval(mover,50);
	//drawBeginning();
}

function mouseMoveEvent(event){
	//var rect = canvas.getBoundingClientRect();
    //return {
   //   x: evt.clientX - rect.left,
    //  y: evt.clientY - rect.top
	var rect = brickGame.canvas.getBoundingClientRect();
	var scaleX = brickGame.canvas.width / rect.width;
	var scaleY = brickGame.canvas.height / rect.height;
	var posX = (event.clientX - rect.left)*scaleX;
	var posY = (event.clientY - rect.top)*scaleY;
	if (playing === true) {
		var paddle = brickGame.paddle;
		paddle.move(posX, posY);
		if(!ballReleased){
			brickGame.ball.followPaddle(posX);//,paddle.pos.y,paddle.size.y);
		}
		brickGame.clear();
		brickGame.draw();
	}
}

function mouseClickEvent(event){
	if(!ballReleased){
		brickGame.ball.isMoving = true;
		ballReleased = true;
	}
	else{
		if(!brickGame.ball.isMoving){
			brickGame.ball.isMoving = true;
		}
		else {
			brickGame.ball.isMoving = false;
		}
		//ballReleased = false;
		//brickGame.ball.followPaddle(brickGame.paddle.pos.x);
	}
}


/*  ////////////////////  Ball shape 
 
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      context.fillStyle = 'green';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = '#773300';
      context.stroke();
 */



//scaleMov: function(){
//	
//   //            (b-a)(x - min)
//   //     f(x) = --------------  + a
//   //              max - min
//},

/*

function User (theName, theEmail) {
    this.name = theName;
    this.email = theEmail;
    this.quizScores = [];
    this.currentScore = 0;
}

User.prototype = {
    constructor: User,
    saveScore:function (theScoreToAdd)  {
        this.quizScores.push(theScoreToAdd)
    },
    showNameAndScores:function ()  {
        var scores = this.quizScores.length > 0 ? this.quizScores.join(",") : "No Scores Yet";
        return this.name + " Scores: " + scores;
    },
    changeEmail:function (newEmail)  {
        this.email = newEmail;
        return "New Email Saved: " + this.email;
    }
}

*/



//window.addEventListener('load', resize, false);
//window.addEventListener('resize', resize, false); 














