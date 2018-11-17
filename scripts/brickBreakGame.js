




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
function polarToXY(radius, angle){
	//var angle = this.angleTo(target);
	var x = radius*Math.cos(angle*Math.PI/180);
	var y = radius*Math.sin(angle*Math.PI/180);
	return new Coord(x, y);
}
function xyToPolar(x,y){
	var radius = (x**2 + y**2)**0.5;
	var angle = Math.atan2(y,x)*(180/Math.PI);
	return new Coord(radius, angle);
	/*
	 * var deltaX = x2 - x1;
	 * var deltaY = y2 - y1;
	 * var rad = Math.atan2(deltaY, deltaX); // In radians
	 * Then you can convert it to degrees as easy as:
	 * var deg = rad * (180 / Math.PI)
	 * -----------------------------------------------------
	 * 
	 * r = (x2 + y2)1/2                            (1)
	 * where
	 * r = distance from origin to the point
	 * x = Cartesian x-coordinate
	 * y = Cartesian y-coordinate
	 * θ = atan(y / x)
	 *  = tan-1(y / x)                          (2)
	 *  where
	 *  θ = angle relative to the zero axis (degrees)  
	 */
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
			context.lineWidth = 1;
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

	this.outlineWidth = 3;
	this.pos = pos;
	this.hit = false;
	
	this.red = randomInt(64,192);//Math.floor(Math.random() * 128)+64;
	this.green = randomInt(64,192);//Math.floor(Math.random() * 128)+64;
	this.blue = randomInt(64,192);//Math.floor(Math.random() * 128)+64;
	//this.color = new Color(red,green,blue);
	
	this.size = brickSize;
//	this.size.x -= 3;
//	this.size.y -= 3;
//	var sqrSize = this.size.x/3;
//	this.squares = [];
//	
//	for(var i=0; i<brickSize.y/sqrSize; i++){
//		for(var j=0; j<brickSize.x/sqrSize; j++){
//			this.squares.push(new Square(new Coord(this.pos.x + j*sqrSize,this.pos.y + i*sqrSize),sqrSize))
//		}
//	}
}
Brick.prototype = {
		constructor: Brick,
		draw: function (context){
			var color = new Color(this.red, this.green, this.blue);
			var outline = new Color(this.red+30, this.green+30, this.blue+30);
			context.fillStyle = color.rgbString();
			context.lineWidth = this.outlineWidth;
			context.strokeStyle = outline.rgbString();
			context.strokeRect(this.pos.x+this.outlineWidth/2, this.pos.y+this.outlineWidth/2, this.size.x-this.outlineWidth, this.size.y-this.outlineWidth);
			context.fillRect(this.pos.x+this.outlineWidth/2, this.pos.y+this.outlineWidth/2, this.size.x-this.outlineWidth, this.size.y-this.outlineWidth);
//			for(var l=0; l<this.squares.length; l++){
//				if(!this.hit){
//					this.squares[l].draw(context,this.color)
//				}
//			}
		}
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
		draw: function(context,ball){
			for(var l=0; l<this.bricks.length; l++){
				if(!this.bricks[l].hit){
					this.bricks[l].draw(context);
					if(ball !== undefined){
						ball.checkBrick(this.bricks[l]);
					}
				}
			}
		}
}
/////////////////////  end Grid  ////////////////////////

///////////////////////  Ball  /////////////////////////
function Ball(paddle,area){
	this.size = 3.5;
	this.pos = new Coord(paddle.pos.x + paddle.size.x/2, paddle.pos.y - this.size);
//	this.pos = pos;
//	this.pos.y -= (this.size/2+1);
//	this.startY = this.pos.y;
	this.area = area;
	this.isMoving = false;
	var xDir = randomInt(-1,2);
	while(xDir === 0){
		xDir = randomInt(-1,2);
	}
	this.dir = new Coord(xDir,-1)
//	this.movMin = 5;
//	this.movMax = 10;
//	//randomInt(start,end);//
//	var movX = randomFloat(this.movMin*10, this.movMax*10)/(this.movMax*10);//Math.random();//
//	var movY = randomFloat(this.movMin*10, this.movMax*10)/(this.movMax*10);//Math.random();//randomFloat(this.movMin,0);
	
	this.movMax = 10;
	this.maxAngle = 90;
	this.minAngle = 20;
	this.maxMagnitude = 12;
	this.minMagnitude = 6;
	var mag = randomFloat(this.minMagnitude, this.maxMagnitude);
	var angle = randomFloat(this.minAngle, this.maxAngle);
	while(angle === 90){
		angle = randomFloat(this.minAngle, this.maxAngle);
	}
	
	var cartesian = polarToXY(mag, angle);
	var movX = cartesian.x/this.movMax;
	var movY = cartesian.y/this.movMax;
	
	this.mov = new Coord(movX,movY);
	this.hitRect = new Coord(0,0);
	this.intersectH = null;
	this.intersectV = null;
	this.hitPos = new Coord(0,0);
	this.hitTop = false;
	this.hitBottom = false;
	this.hitLeft = false;
	this.hitRight = false;
	this.hitBounce = false;
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
			context.lineWidth = 0.25;
			context.strokeStyle = '#000000';
			context.stroke();
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
			var xAmount = this.mov.x*this.movMax*this.dir.x;
			var yAmount = this.mov.y*this.movMax*this.dir.y;
			if(this.isMoving){
				if(!this.hitBounce){
					if(this.pos.x + xAmount < this.size){
						this.pos.x = this.size;
						this.dir.x *= -1;
					}
					else if(this.pos.x + xAmount > this.area.x-this.size){
						this.pos.x = this.area.x-this.size;
						this.dir.x *= -1;
					}
					else {
						this.pos.x += xAmount;
					}
					if(this.pos.y + yAmount < this.size){
						this.pos.y = this.size;
						this.dir.y *= -1;
					}
					else if(this.pos.y + yAmount > this.area.y-this.size){
						//// lose ball
						this.pos.y = this.area.y-this.size;
						this.dir.y *= -1;
					}
					else{
						this.pos.y += yAmount;
					}
				}
				else{
					this.hitBounce = false;
					this.pos.y = this.hitPos.y;
					this.pos.x = this.hitPos.x;
				}
			}
		},
		followPaddle: function(paddle){//,posY,paddleHeight){
			this.pos.x = paddle.pos.x + paddle.size.x/2;
			this.pos.y = paddle.pos.y - this.size;
			
//			if(posX - this.size.x/2 < 0){
//				posX = this.size.x/2;
//			}
//			else if(posX + this.size.x/2 > this.moveWidth){
//				posX = this.moveWidth - this.size.x/2;
//			}
//			this.pos.x = posX;
//			this.pos.y = this.startY;
		},
		checkHorizontal: function(bRight, bLeft, rect, slope){ // top and bottom
			var hit = false;
			
			var yLine;
			if(this.dir.y === 1){
				yLine = rect.pos.y;
			}
			else if(this.dir.y === -1){
				yLine = rect.pos.y + rect.size.y;
			}
			else{
				console.log("error in checkHorizontal()");
			}
			
			var offset = (this.pos.y + this.dir.y*this.size) - slope.y/slope.x*this.pos.x; // b = Y - mX with (X,Y) as the bottom point of the ball
			
			// X = (Y - b) * (1/m)
			var flatMid = (yLine - offset)*(slope.x/slope.y); // intercept to check top or bottom
			var flatLeft = (yLine - bRight)*(slope.x/slope.y); // intercept to check left corner of top or bottom
			var flatRight = (yLine - bLeft)*(slope.x/slope.y); // intercept to check right corner of top or bottom
			
			var xIntersect = null;
			var where = null;
		
			if(flatMid >= rect.pos.x && flatMid <= rect.pos.x + rect.size.x){ // check top or bottom
				xIntersect = flatMid;
				where = "flatMid";
				this.hitBounce = true;
				hit = true;
			}
			else if(flatLeft >= rect.pos.x && flatLeft <= rect.pos.x + rect.size.x){ // check left corner of top or bottom
				xIntersect = flatLeft;
				where = "flatLeft";
				this.hitBounce = true;
				hit = true;
			}
			else if(flatRight >= rect.pos.x && flatRight <= rect.pos.x + rect.size.x){ // check right corner of top or bottom
				xIntersect = flatRight;
				where = "flatRight";
				this.hitBounce = true;
				hit = true;
			}
			
			if(hit){
				this.intersectH = new Coord(xIntersect, yLine);
				if(this.dir.y === 1){
					this.hitTop = true;
				}
				else if(this.dir.y === -1){
					this.hitBottom = true;
				}
			}
			
			return where;
		},
		checkVertical: function(bTop, bBottom, rect, slope){ // left and right
			// Y = mX + bOffset
			var hit = false;
			
			var xLine;
			if(this.dir.x === 1){
				xLine = rect.pos.x;
			}
			else if(this.dir.x === -1){
				xLine = rect.pos.x + rect.size.x;
			}
			else{
				console.log("error in checkVertical()")
			}
			
			var offset =  this.pos.y - slope.y/slope.x*(this.pos.x + this.dir.x*this.size); // b = Y - mX with (X,Y) as the right point of the ball
			
			var sideMid = (slope.y/slope.x)*xLine + offset; // intercept to check left or right
			var sideTop = (slope.y/slope.x)*xLine + bTop; // intercept to check top corner of left or right
			var sideBottom = (slope.y/slope.x)*xLine + bBottom; // intercept to check bottom corner of left or right
			
			var yIntersect = null;
			var where = null;
			
			if(sideMid >= rect.pos.y && sideMid <= rect.pos.y + rect.size.y){ // check left or right
				yIntersect = sideMid;
				where = "sideMid";
				this.hitBounce = true;
				hit = true;
			}
			else if(sideTop >= rect.pos.y && sideTop <= rect.pos.y + rect.size.y){ // check top corner of left or right
				yIntersect = sideTop;
				where = "sideTop";
				this.hitBounce = true;	
				hit = true;				
			}
			else if(sideBottom >= rect.pos.y && sideBottom <= rect.pos.y + rect.size.y){ // check bottom corner of left or right
				yIntersect = sideBottom;
				where = "sideBottom";
				this.hitBounce = true;	
				hit = true;				
			}
			
			if(hit){
				this.intersectV = new Coord(xLine, yIntersect);
				if(this.dir.x === 1){
					this.hitLeft = true;
				}
				else if(this.dir.x === -1){
					this.hitRight = true;
				}
			}
			
			return where;
		},
		collision: function (rect){
			var xAmount = this.mov.x*this.movMax*this.dir.x;
			var yAmount = this.mov.y*this.movMax*this.dir.y;
			var slope = new Coord(xAmount, yAmount);
			
			var xUnit = (xAmount/((xAmount**2 + yAmount**2)**0.5));
			var yUnit = (yAmount/((xAmount**2 + yAmount**2)**0.5));
			
			var hit = false;
			if(this.pos.y + this.size + yAmount >= rect.pos.y && (this.pos.y - this.size) + yAmount <= rect.pos.y + rect.size.y){
				if(this.pos.x + this.size + xAmount >= rect.pos.x && (this.pos.x - this.size) + xAmount <= rect.pos.x + rect.size.x){
					// b = Y - mX with (X,Y) as the points on the edge of the ball that
					// the line of the ball's movement passes through and its mirror across the vertical or horizontal
					
					// right and left for checking horizontal corners
					var bRight = (this.pos.y + yUnit*this.size) - ((slope.y/slope.x) * (this.pos.x + this.dir.x * (xUnit*this.size)));
					var bLeft = (this.pos.y + yUnit*this.size) - ((slope.y/slope.x) * (this.pos.x + this.dir.x * -1 * (xUnit*this.size)));

					// top an bottom for checking vertical corners
					var bTop = (this.pos.y + this.dir.y * -1 *(yUnit*this.size)) - ((slope.y/slope.x) * (this.pos.x + (xUnit*this.size)));
					var bBottom = (this.pos.y + this.dir.y *(yUnit*this.size)) - ((slope.y/slope.x) * (this.pos.x + (xUnit*this.size)));



					var whereH = this.checkHorizontal(bRight, bLeft, rect, slope);
					var whereV = this.checkVertical(bTop, bBottom, rect, slope);

					if(this.hitTop || this.hitBottom){
						hit = true;
						if(whereH == "flatMid"){
							this.hitPos.x = this.intersectH.x;
							this.hitPos.y = this.intersectH.y - this.dir.y*this.size;
						}
						else if(whereH == "flatLeft"){
							this.hitPos.x = this.intersectH.x + this.dir.x * (this.size*xUnit);									
							this.hitPos.y = this.intersectH.y - (this.size*yUnit); 
						}
						else if(whereH == "flatRight"){
							this.hitPos.x = this.intersectH.x + this.dir.x * -1 * (this.size*xUnit);
							this.hitPos.y = this.intersectH.y - (this.size*yUnit); 
						}
						else{
							console.log("error in collision() hitTop || hitBottom")
						}
					}
					if(this.hitLeft || this.hitRight){
						hit = true;
						if(whereV == "sideMid"){
							this.hitPos.x = this.intersectV.x - this.dir.y*this.size;
							this.hitPos.y = this.intersectV.y;
						}
						else if(whereV == "sideTop"){
							this.hitPos.x = this.intersectV.x - (xUnit*this.size);
							this.hitPos.y = this.intersectV.y + this.dir.y *(yUnit*this.size) 
						}
						else if(whereV == "sideBottom"){
							this.hitPos.x = this.intersectV.x - (xUnit*this.size);
							this.hitPos.y =  this.intersectV.y + this.dir.y * -1 *(yUnit*this.size)
						}
						else{
							console.log("error in collision() hitLeft || hitRight")
						}
					}

				}
			}
			return hit;
		},
		findBounceAngle: function(rect){
			//scaleMov: function(){
		//	
		//   //            (b-a)(x - min)
		//   //     f(x) = --------------  + a
		//   //              max - min
		//},
			if(this.intersectH.x - (rect.pos.x + rect.size.x/2) > 0){
				this.dir.x = 1;
			}
			else if(this.intersectH.x - (rect.pos.x + rect.size.x/2) < 0){
				this.dir.x = -1;
			}
			else{
				var xDir = randomInt(-1,2);
				while(xDir === 0){
					xDir = randomInt(-1,2);
				}
				this.dir = new Coord(xDir,-1)
			}
			
			var angle = (this.maxAngle - this.minAngle) * (rect.size.x/2 - Math.abs(this.intersectH.x - (rect.pos.x+rect.size.x/2)))/(rect.size.x/2) + this.minAngle;
			if(angle === 90){
				angle -= 0.1;
			}	
			var mag = randomFloat(this.minMagnitude, this.maxMagnitude);

			var cartesian = polarToXY(mag, angle);
			this.mov.x = cartesian.x/this.movMax;
			this.mov.y = cartesian.y/this.movMax;
			
			//this.mov = new Coord(movX,movY);
			
		},
		checkPaddle: function(paddle){
			if(this.collision(paddle)){
				if(this.hitTop){
					this.findBounceAngle(paddle);
					this.dir.y = -1;
				}
				if(this.hitLeft){
					this.dir.x = -1;
				}
				if(this.hitRight){
					this.dir.x = 1;
				}
				if(this.hitBottom){
					this.dir.y = 1;
				}
				this.hitTop = false;
				this.hitBottom = false;
				this.hitLeft = false;
				this.hitRight = false;
			}
		},
		checkBrick: function(brick){
			if(this.collision(brick)){
				if(this.hitTop){
					this.dir.y = -1;
				}
				if(this.hitLeft){
					this.dir.x = -1;
				}
				if(this.hitRight){
					this.dir.x = 1;
				}
				if(this.hitBottom){
					this.dir.y = 1;
				}
				brick.hit = true;
				this.hitTop = false;
				this.hitBottom = false;
				this.hitLeft = false;
				this.hitRight = false;
			}
		}
}
////////////////////  end Ball  ////////////////////////

///////////////////////  Paddle  ////////////////////////
function Paddle(pos, canvasWidth){
	this.size = new Coord(paddleWidth, paddleHeight);
	this.pos = new Coord(canvasWidth/2, pos);
	this.colorFill = new Color(50, 50, 50);
	this.colorOutline = new Color(100, 100, 100);
	this.outlineWidth = 2;
	this.moveWidth = canvasWidth;
}
Paddle.prototype = {
		constructor: Paddle,
		draw: function(context){
			//var context = 
			context.lineWidth = this.outlineWidth;
			context.fillStyle = this.colorFill.rgbString();
			context.strokeStyle = this.colorOutline.rgbString();
			context.strokeRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
			context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
			
//			context.strokeRect(this.pos.x - this.size.x/2, this.pos.y - this.size.y/2, this.size.x, this.size.y);
//			context.fillRect(this.pos.x - this.size.x/2, this.pos.y - this.size.y/2, this.size.x, this.size.y);
		},
		move: function(posX,posY){
			if(posX < this.size.x/2){  // - this.size.x/2 < 0){
				posX = this.size.x/2;
			}
			else if(posX > this.moveWidth - this.size.x/2){ // + this.size.x/2 > this.moveWidth){
				posX = this.moveWidth - this.size.x/2; //  /2;
			}
			this.pos.x = posX - this.size.x/2;
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

	this.ball = new Ball(this.paddle, new Coord(this.canvas.width,this.canvas.height));// ,this.context);
	
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
			this.grid.draw(this.context,this.ball);
			this.paddle.draw(this.context);
			this.ball.draw(this.context);
		},
		move: function(){
			if(this.ball !== undefined){
				this.ball.checkPaddle(this.paddle);
				this.ball.move();
			}
			this.clear();
			this.draw();
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
			brickGame.ball.followPaddle(paddle);//,paddle.pos.y,paddle.size.y);
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


/*																														Y=mX+b
 * if(this.dir.y == -1){
 * 		var ballTop = (this.pos.y - this.size) - yAmount/xAmount*this.pos.x;											b = Y - mX   based on point on ball that would hit
		var bottomXintersect = ((rect.pos.y+rect.size.y)-ballTop)*xAmount/yAmount;										X = (Y-b) * m  or Y = mX + b point on line where ball hits 
		if(xAmount === 0){																								if slope is vertical
			bottomXintersect = this.pos.x																					ball's x is where it would hit
		}
						
		if(bottomXintersect <= rect.pos.x + rect.size.x && bottomXintersect >= rect.pos.x){                              if the intersection point is within the line segment (edge of block)
			yIntersect = rect.pos.y + rect.size.y;																			y on block where ball hits
			xIntersect = bottomXintersect;																					x on block where ball hits
			this.hitPos.x = xIntersect;																						x of ball when it hits
			this.hitPos.y = yIntersect+this.size;																			y of ball when it hits
			this.hitBottom = true;																							bool of which side is being checked
			this.hitBounce = true;																							bool showing hit to keep move() from moving ball twice in one frame
			hit = true;																										bool returned at end of function
		}
		else if(this.dir.x == 0){																						if slope is vertical
			if(bottomXintersect <= rect.pos.x + rect.size.x && bottomXintersect >= rect.pos.x){								if intersection is within line segment bound
				yIntersect = rect.pos.y + rect.size.y;																			point on block where ball hits
				xIntercept = bottomXintersect;
				this.hitPos.x = xIntersect;																						position of ball when it hits
				this.hitPos.y = yIntersect+this.size;
				this.hitBottom = true;																							bools for hit
				this.hitBounce = true;
			}
			else{																											else check for corner hit
				var xUnit45 = (1/((1**2 + 1**2)**0.5));																			x of unit vector at 45 degree angle
				var yUnit45 = (-1/((1**2 + 1**2)**0.5));																		y of unit vector at 45 degree angle
				var offUpperRight45 = this.pos.x + (this.size*xUnit45);															45 degrees form vertical closest point to corner being checked
																																		should have corresponding y values so collision isn't based off the y at ball's center
				var offUpperLeft45 = this.pos.x - (this.size*xUnit45);															the other point on ball for the other corner
				var bottomRightXintersect45 = offUpperLeft45;																	point on line where 45 degree point on ball would hit
				var bottomLeftXintersect45 = offUpperRight45;																	same but for other point
				if(bottomRightXintersect45 <= rect.pos.x + rect.size.x && bottomRightXintersect45 >= rect.pos.x){				if one 45 degree point is within line segment bound
					yIntersect = rect.pos.y+rect.size.y;																			point on block where ball hit
					xIntersect = bottomRightXintersect45;
					this.hitPos.x = xIntersect + this.dir.x * -1 * (this.size*xUnit45);												position of ball when it hits this is where the y of the 45 degree point is needed
					this.hitPos.y = yIntersect - (this.size*yUnit45); 
					this.hitBottom = true;																							bools for hit
					this.hitBounce = true;
					hit = true;
				}
				else if(bottomLeftXintersect45 <= rect.pos.x + rect.size.x && bottomLeftXintersect45 >= rect.pos.x){			else if other 45 degree point is within linesegment bound
					yIntersect = rect.pos.y+rect.size.y;																			point on block where ball hits
					xIntersect = bottomLeftXintersect45;
					this.hitPos.x = xIntersect + this.dir.x * (this.size*xUnit45);													position of ball when it hits
					this.hitPos.y = yIntersect - (this.size*yUnit45); 
					this.hitBottom = true;																							bools for hit
					this.hitBounce = true;
					hit = true;
				}
			}
		}						 
		else {																											else slope is not vertical and did not hit main portion check for hitting corners
			var offUpperRight, offUpperLeft;																				offset of points on ball that would hit the corners
			if(this.dir.x == 1){																							calculate those offsets
				offUpperRight = (this.pos.y + (this.size*yUnit)) - yAmount/xAmount*(this.pos.x + (this.size*xUnit));			b = Y - mX: right = (ball.y + unit vector*radius) - (slope * (ball.x + this.dir.x * (unit vector*radius)))
				offUpperLeft = (this.pos.y + (this.size*yUnit)) - yAmount/xAmount*(this.pos.x - (this.size*xUnit));                       : left = (ball.y + (unit vector*radius)) - (slope * (ball.x + this.dir.x * -1 * (unit vector*radius)))
			}
			else if(this.dir.x == -1){
				offUpperRight = (this.pos.y + (this.size*yUnit)) - yAmount/xAmount*(this.pos.x - (this.size*xUnit));					  : bottom = (ball.y + this.dir.y *(unit vector*radius)) - (slope * (ball.x + (unit vector*radius)))
				offUpperLeft = (this.pos.y + (this.size*yUnit)) - yAmount/xAmount*(this.pos.x + (this.size*xUnit));						  : top = (ball.y + this.dir.y * -1 *(unit vector*radius)) - (slope * (ball.x + (unit vector*radius)))
			}								
			
			if(offUpperRight !== undefined && offUpperLeft != undefined){
				var bottomRightXintersect = ((rect.pos.y+rect.size.y)-offUpperLeft)*xAmount/yAmount;						point on line where one point ball would hit
				var bottomLeftXintersect = ((rect.pos.y+rect.size.y)-offUpperRight)*xAmount/yAmount;						point on line where other point on ball would hit
				if(bottomRightXintersect <= rect.pos.x + rect.size.x && bottomRightXintersect >= rect.pos.x){				if one point is with in line segment bounds
					yIntersect = rect.pos.y + rect.size.y;																		point on block where ball hit
					xIntersect = bottomRightXintersect;
					this.hitPos.x = xIntersect + this.dir.x * -1 * (this.size*xUnit);											position of ball when it hits
					this.hitPos.y = yIntersect - (this.size*yUnit); 
					this.hitBottom = true;																						bools for hit
					this.hitBounce = true;
					hit = true;
				}
				else if(bottomLeftXintersect <= rect.pos.x + rect.size.x && bottomLeftXintersect >= rect.pos.x){			if other point is with in line segment bounds
					yIntersect = rect.pos.y+rect.size.y;																		point on block where ball hit
					xIntersect = bottomLeftXintersect;
					this.hitPos.x = xIntersect + this.dir.x * (this.size*xUnit);												position of ball when it hits
					this.hitPos.y = yIntersect - (this.size*yUnit); 
					this.hitBottom = true;																						bools for hit
					this.hitBounce = true;
					hit = true;
				}
			}
			
		}
	}
 * 
 */












