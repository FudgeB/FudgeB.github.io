




var canvas, context;
var gridWidth = 20;
var gridHeight = 12;
var paddleWidth = 40;
var paddleHeight = 5;
var playing = true;
var brickGame;
//var movePaddle = false;

////////////////////////////  Coord  ////////////////////////////
function Coord (x, y){
	this.x = x;
	this.y = y;
}
//Coord.prototype = {
//	constructor: Coord,
//	setCoord: function (pos){
//		if(pos instanceof Coord){
//			this.x = pos.x;
//			this.y = pos.y;
//		}
//	}
//}
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
		this.red = Math.floor(Math.random() * (end-start) + start);
		this.green = Math.floor(Math.random() * (end-start) + start);
		this.blue = Math.floor(Math.random() * (end-start) + start);
		//return new Color(red, green, blue);
	},
	rgbString: function(){
		//     'rgb(100, 200, 150)'
		var rgb = 'rgb(' + this.red + ',' + this.green +',' + this.blue + ')';
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
	
	var red = Math.floor(Math.random() * 128);
	var green = Math.floor(Math.random() * 128);
	var blue = Math.floor(Math.random() * 128);
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
				this.squares[l].draw(context,this.color)
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

///////////////////////  Paddle  ////////////////////////
function Paddle(pos, canvasWidth){
	this.size = new Coord(paddleWidth, paddleHeight);
	this.pos = new Coord(canvasWidth/2, pos);
	this.color = new Color(50, 50, 50);
}
Paddle.prototype = {
		constructor: Paddle,
		draw: function(context){
			//var context = 
			context.fillStyle = this.color.rgbString();
			context.strokeStyle = this.color.rgbString();
			context.strokeRect(this.pos.x - this.size.x/2, this.pos.y - this.size.y/2, this.size.x, this.size.y);
			context.fillRect(this.pos.x - this.size.x/2, this.pos.y - this.size.y/2, this.size.x, this.size.y);
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
	//grid.draw(context);
	this.paddle = new Paddle(this.canvas.height-(paddleHeight*3),this.canvas.width);
	//paddle.draw(context);
	this.numBackgroundColors = 3;
	this.backgroundColors = [];
	this.setBackgroundColors();
	//this.canvas.addEventListener('mousemove',mouseMoveEvent(event,this));
}
BrickGame.prototype = {
		constructor:BrickGame,
		setBackgroundColors: function(){
			for(var i=0; i<this.numBackgroundColors; i++){
				var randColor = new Color(1,1,1);
				randColor.random(0, 255);
				this.backgroundColors.push(randColor);
			}
		},
		clear: function(){
			// Create gradient
			var context = this.context;
			var gradient = context.createRadialGradient(this.canvas.width/2,this.canvas.height/2,0,
					this.canvas.width/2,this.canvas.height/2,this.canvas.width/2);
			// 0: Color {red: 166, green: 198, blue: 123}
			// 1: Color {red: 82, green: 175, blue: 23}
			// 2: Color {red: 21, green: 38, blue: 24}
			gradient.addColorStop(0,this.backgroundColors[0].rgbString());//"rgb(100, 200, 150)");
			gradient.addColorStop(0.5,this.backgroundColors[1].rgbString());//"rgb(200, 100, 150)");
			gradient.addColorStop(1,this.backgroundColors[2].rgbString());//"rgb(15, 150, 150)");
	
			// Fill with gradient
			context.fillStyle = gradient;
			context.fillRect(0,0,this.canvas.width,this.canvas.height);
		},
		draw: function(){
			this.grid.draw(this.context);
			this.paddle.draw(this.context);
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

	if(canvas.getContext){
		context = canvas.getContext('2d');
		
		var grid = new Grid(canvas.height/8);
		grid.draw(context);
		
		var paddle = new Paddle(canvas.height-(paddleHeight*3));
		paddle.draw(context);
		
		//canvas.addEventListener(onmouseover) =
		// onmouseout
		// onmousemove

		
		
//		context.fillStyle = 'rgb(100, 200, 150)';
//		context.fillRect(10, 10, 50, 50);
		
		//pos, speed, size, color
//		var red = Math.floor(Math.random() * 255);
//		var green = Math.floor(Math.random() * 255);
//		var blue = Math.floor(Math.random() * 255);
//		var posX = Math.floor(Math.random() * canvas.width);
//		var posY = Math.floor(Math.random() * canvas.height);
//		var size = canvas.width / 40;
//		
//		var sq1 = new Square(new Coord(posX,posY), new Coord(1,1), size, new Color(red,green,blue));
		
		//var sq1 = new Square(new Coord(Math.floor(Math.random() * canvas.width),Math.floor(Math.random() * canvas.height), 
		//		new Coord(1,1), Math.floor(Math.random() * 30) + 10, new Color(red, green, blue)));

//		red = Math.floor(Math.random() * 255);
//		green = Math.floor(Math.random() * 255);
//		blue = Math.floor(Math.random() * 255);
//		posX = Math.floor(Math.random() * canvas.width);
//		posY = Math.floor(Math.random() * canvas.height);
//		size = canvas.width / 40;
//		var sq2 = new Square(new Coord(posX,posY), new Coord(1,1), size, new Color(red, green, blue));
//		
//		sq1.draw(context);
//		sq2.draw(context);
	}

}

function loader(){
	//canvas = document.getElementById('gameCanvas');
	resize();
	brickGame = new BrickGame();
	//brickGame.setBackgroundColors(0,255);
	//brickGame.canvas.addEventListener('mousemove',mouseMoveEvent(event, brickGame));
	brickGame.clear();
	brickGame.draw();
	//drawBeginning();
}
//if(test.getContext){
//	var contextTest = this.canvas.getContext('2d');
//}

function mouseMoveEvent(event/*,brickGame*/){
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
		if(posX - paddle.size.x/2 < 0){
			posX = paddle.size.x/2;
		}
		else if(posX + paddle.size.x/2 > brickGame.canvas.width){
			posX = brickGame.canvas.width - paddle.size.x/2;
		}
		paddle.pos.x = posX;
		brickGame.clear();
		brickGame.draw();
	}
}







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













