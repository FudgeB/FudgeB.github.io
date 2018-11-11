




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
	this.dir = new Coord(randomInt(-1,2),-1)
	this.movMin = 5;
	this.movMax = 10;
	//randomInt(start,end);//
	var movX = randomFloat(this.movMin*10, this.movMax*10)/(this.movMax*10);//Math.random();//
	var movY = randomFloat(this.movMin*10, this.movMax*10)/(this.movMax*10);//Math.random();//randomFloat(this.movMin,0);
	this.mov = new Coord(movX,movY);
	this.hitRect = new Coord(0,0);
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
		collision: function(rect){ 
			var xAmount = this.mov.x*this.movMax*this.dir.x;
			var yAmount = this.mov.y*this.movMax*this.dir.y;
			
			var xUnit = (xAmount/((xAmount**2 + yAmount**2)**0.5));
			var yUnit = (yAmount/((xAmount**2 + yAmount**2)**0.5));
			var yIntersect, xIntersect;
			var hit = false;

			if(this.pos.y + this.size + yAmount >= rect.pos.y && (this.pos.y - this.size) + yAmount <= rect.pos.y + rect.size.y){
				if(this.pos.x + this.size + xAmount >= rect.pos.x && (this.pos.x - this.size) + xAmount <= rect.pos.x + rect.size.x){
					
					
					var yOffset = this.pos.y - yAmount/xAmount*this.pos.x;
//					var thisXoff = -1*yOffset*xAmount/yAmount;
					
					
					if(this.dir.y == 1){

						var ballBottom = (this.pos.y + this.size) - yAmount/xAmount*this.pos.x;
						var topXintersect = (rect.pos.y-ballBottom)*xAmount/yAmount;
						if(xAmount === 0){
							topXintersect = this.pos.x
						}
						
						if(topXintersect <= rect.pos.x + rect.size.x && topXintersect >= rect.pos.x){
							yIntersect = rect.pos.y;
							xIntersect = topXintersect;
							this.hitPos.x = xIntersect;
							this.hitPos.y = yIntersect-this.size;
							this.hitTop = true;
							this.hitBounce = true;
							hit = true;
						}
						else if(this.dir.x == 0){
							if(topXintersect <= rect.pos.x + rect.size.x && topXintersect >= rect.pos.x){
								yIntersect = rect.pos.y;
								xIntercept = topXintersect;
								this.hitPos.x = xIntersect;
								this.hitPos.y = yIntersect-this.size;
								this.hitTop = true;
								this.hitBounce = true;
							}
							else{
								var xUnit45 = (1/((1**2 + 1**2)**0.5));
								var yUnit45 = (1/((1**2 + 1**2)**0.5));
								var offLowerRight45 = this.pos.x + (this.size*xUnit45);
								var offLowerLeft45 = this.pos.x - (this.size*xUnit45);
								var topRightXintersect45 = offLowerLeft45;
								var topLeftXintersect45 = offLowerRight45;
								if(topRightXintersect45 <= rect.pos.x + rect.size.x && topRightXintersect45 >= rect.pos.x){
									yIntersect = rect.pos.y;
									xIntersect = topRightXintersect45;
									this.hitPos.x = xIntersect + this.dir.x * -1 * (this.size*xUnit45);									
									this.hitPos.y = yIntersect - (this.size*yUnit45); 
									this.hitTop = true;
									this.hitBounce = true;
									hit = true;
								}
								else if(topLeftXintersect45 <= rect.pos.x + rect.size.x && topLeftXintersect45 >= rect.pos.x){
									yIntersect = rect.pos.y;
									xIntersect = topLeftXintersect45;
									this.hitPos.x = xIntersect + this.dir.x * (this.size*xUnit45);									
									this.hitPos.y = yIntersect - (this.size*yUnit45); 
									this.hitTop = true;
									this.hitBounce = true;
									hit = true;
								}
							}
						}						 
						else {
							var offLowerRight, offLowerLeft;
							if(this.dir.x == 1){
								offLowerRight = (this.pos.y + (this.size*yUnit)) - yAmount/xAmount*(this.pos.x + (this.size*xUnit));
								offLowerLeft = (this.pos.y + (this.size*yUnit)) - yAmount/xAmount*(this.pos.x - (this.size*xUnit));
							}
							else if(this.dir.x == -1){
								offLowerRight = (this.pos.y + (this.size*yUnit)) - yAmount/xAmount*(this.pos.x - (this.size*xUnit));
								offLowerLeft = (this.pos.y + (this.size*yUnit)) - yAmount/xAmount*(this.pos.x + (this.size*xUnit));
							}								
							
							if(offLowerRight !== undefined && offLowerLeft != undefined){
								var topRightXintersect = (rect.pos.y-offLowerLeft)*xAmount/yAmount;
								var topLeftXintersect = (rect.pos.y-offLowerRight)*xAmount/yAmount;
								if(topRightXintersect <= rect.pos.x + rect.size.x && topRightXintersect >= rect.pos.x){
									yIntersect = rect.pos.y;
									xIntersect = topRightXintersect;
									this.hitPos.x = xIntersect + this.dir.x * -1 * (this.size*xUnit);									
									this.hitPos.y = yIntersect - (this.size*yUnit); 
									this.hitTop = true;
									this.hitBounce = true;
									hit = true;
								}
								else if(topLeftXintersect <= rect.pos.x + rect.size.x && topLeftXintersect >= rect.pos.x){
									yIntersect = rect.pos.y;
									xIntersect = topLeftXintersect;
									this.hitPos.x = xIntersect + this.dir.x * (this.size*xUnit);									
									this.hitPos.y = yIntersect - (this.size*yUnit); 
									this.hitTop = true;
									this.hitBounce = true;
									hit = true;
								}
							}
							
						}
					}
					else if(this.dir.y == -1){
						var ballTop = (this.pos.y - this.size) - yAmount/xAmount*this.pos.x;
						var bottomXintersect = ((rect.pos.y+rect.size.y)-ballTop)*xAmount/yAmount;
						if(xAmount === 0){
							bottomXintersect = this.pos.x
						}
						
						if(bottomXintersect <= rect.pos.x + rect.size.x && bottomXintersect >= rect.pos.x){
							yIntersect = rect.pos.y + rect.size.y;
							xIntersect = bottomXintersect;
							this.hitPos.x = xIntersect;
							this.hitPos.y = yIntersect+this.size;
							this.hitBottom = true;
							this.hitBounce = true;
							hit = true;
						}
						else if(this.dir.x == 0){
							if(bottomXintersect <= rect.pos.x + rect.size.x && bottomXintersect >= rect.pos.x){
								yIntersect = rect.pos.y + rect.size.y;
								xIntercept = bottomXintersect;
								this.hitPos.x = xIntersect;
								this.hitPos.y = yIntersect+this.size;
								this.hitBottom = true;
								this.hitBounce = true;
							}
							else{
								var xUnit45 = (1/((1**2 + 1**2)**0.5));
								var yUnit45 = (-1/((1**2 + 1**2)**0.5));
								var offUpperRight45 = this.pos.x + (this.size*xUnit45);
								var offUpperLeft45 = this.pos.x - (this.size*xUnit45);
								var bottomRightXintersect45 = offUpperLeft45;
								var bottomLeftXintersect45 = offUpperRight45;
								if(bottomRightXintersect45 <= rect.pos.x + rect.size.x && bottomRightXintersect45 >= rect.pos.x){
									yIntersect = rect.pos.y+rect.size.y;
									xIntersect = bottomRightXintersect45;
									this.hitPos.x = xIntersect + this.dir.x * -1 * (this.size*xUnit45);									
									this.hitPos.y = yIntersect - (this.size*yUnit45); 
									this.hitBottom = true;
									this.hitBounce = true;
									hit = true;
								}
								else if(bottomLeftXintersect45 <= rect.pos.x + rect.size.x && bottomLeftXintersect45 >= rect.pos.x){
									yIntersect = rect.pos.y+rect.size.y;
									xIntersect = bottomLeftXintersect45;
									this.hitPos.x = xIntersect + this.dir.x * (this.size*xUnit45);									
									this.hitPos.y = yIntersect - (this.size*yUnit45); 
									this.hitBottom = true;
									this.hitBounce = true;
									hit = true;
								}
							}
						}						 
						else {
							var offUpperRight, offUpperLeft;
							if(this.dir.x == 1){
								offUpperRight = (this.pos.y + (this.size*yUnit)) - yAmount/xAmount*(this.pos.x + (this.size*xUnit));
								offUpperLeft = (this.pos.y + (this.size*yUnit)) - yAmount/xAmount*(this.pos.x - (this.size*xUnit));
							}
							else if(this.dir.x == -1){
								offUpperRight = (this.pos.y + (this.size*yUnit)) - yAmount/xAmount*(this.pos.x - (this.size*xUnit));
								offUpperLeft = (this.pos.y + (this.size*yUnit)) - yAmount/xAmount*(this.pos.x + (this.size*xUnit));
							}								
							
							if(offUpperRight !== undefined && offUpperLeft != undefined){
								var bottomRightXintersect = ((rect.pos.y+rect.size.y)-offUpperLeft)*xAmount/yAmount;
								var bottomLeftXintersect = ((rect.pos.y+rect.size.y)-offUpperRight)*xAmount/yAmount;
								if(bottomRightXintersect <= rect.pos.x + rect.size.x && bottomRightXintersect >= rect.pos.x){
									yIntersect = rect.pos.y + rect.size.y;
									xIntersect = bottomRightXintersect;
									this.hitPos.x = xIntersect + this.dir.x * -1 * (this.size*xUnit);									
									this.hitPos.y = yIntersect - (this.size*yUnit); 
									this.hitBottom = true;
									this.hitBounce = true;
									hit = true;
								}
								else if(bottomLeftXintersect <= rect.pos.x + rect.size.x && bottomLeftXintersect >= rect.pos.x){
									yIntersect = rect.pos.y+rect.size.y;
									xIntersect = bottomLeftXintersect;
									this.hitPos.x = xIntersect + this.dir.x * (this.size*xUnit);									
									this.hitPos.y = yIntersect - (this.size*yUnit); 
									this.hitBottom = true;
									this.hitBounce = true;
									hit = true;
								}
							}
							
						}
					}

					var leftYintersect = yAmount/xAmount*rect.pos.x + yOffset;
					var rightYintersect = yAmount/xAmount*(rect.pos.x + rect.size.x) + yOffset;
					
					if(this.dir.x == 1){
						if(leftYintersect <= rect.pos.y + rect.size.y && leftYintersect >= rect.pos.y){
							yIntersect = leftYintersect;
							xIntersect = rect.pos.x;
							this.hitLeft = true;
							this.hitBounce = true;
							hit = true;
						}
					}
					else if(this.dir.x == -1){
						if(rightYintersect <= rect.pos.y + rect.size.y && rightYintersect >= rect.pos.y){
							yIntersect = rightYintersect;
							xIntersect = rect.pos.x + rect.size.x;
							this.hitRight = true;
							this.hitBounce = true;
							hit = true;
						}
					}

					
					if(hit){
						this.hitRect.y = yIntersect;
						this.hitRect.x = xIntersect;
						// this.hitPos
					}
					
					return hit;
					
					
					/*
					 *  -1,1
					 *  -1,-1
					 *  1,-1
					 *  1,1
					 *  0,1
					 *  0,-1
					 *  
					 *  
					 *  	this.hitPaddle = false;
					 *  	this.hitTop = false;
					 *  	this.hitBottom = false;
					 *  	this.hitLeft = false;
					 *  	this.hitRight = false;
					 *  	this.hitBounce = false;
					 *  
					 *  
					 *  
					 *     Given points a, b find point c
					 *     D = a to b
					 *     D2 = a to c
					 *     
					 *     D = √( (Xa-Xb)^2 + (Ya-Yb)^2 )
					 *     
					 *     The formulas that you can find Xa, Xb, Xc, D, D2
					 *     
					 *     SINab = (Xa-Xb)  /  D
					 *     
					 *     SINac = (Xa-Xc)  /  D2
					 *     
					 *     
					 *     But SINab and SINac share the same corner so they are equal:
					 *     SINab = SINac
					 *     
					 *     (Xa-Xb) / D = (Xa-Xc) / R 
					 *     
					 *     Since you know the distance (D2) between Xa and Xc that you are looking for, 
					 *     you can easily solve the following:
					 *     
					 *     Xc = Xa - (D2*(Xa-Xb)) / D
					 *     Yc = Ya - (D2*(Ya-Yb)) / D
					 *     
					 *     
					 *     In conclusion by solving the formulas for D and Xc you are done. 
					 *     (You need one for the Y as well, just replace X with Y in last formula)
					 *  
					 *  /////////////////////////////////////////////////////////////////////////
					 *  
					 *  Let v=(x1,y1)−(x0,y0). Normalize this to u = v / ||v||. 
					 *  
					 *  The point along your line at a distance d from (x0,y0) is 
					 *  then (x0,y0)+du, if you want it in the direction of (x1,y1), 
					 *  or (x0,y0)−du, if you want it in the opposite direction. 
					 *  One advantage of doing the calculation this way is that you won't run into 
					 *  a problem with division by zero in the case that x0=x1.
					 *  
					 *  The length of a vector v=(v1,v2) is defined as 
					 *  
					 *  ||v|| = √(v1^2 + v2^2)
					 *   
					 *  The vector v / (||v||), that is, 
					 *  
					 *  (v1/ √(v1^2+v2^2),v2/ √(v1^2+v2^2) ),
					 *  
					 *   
					 *  points in the same direction as v and has unit length. 
					 *  For example, if v=(3,4), then u=(3/5,4/5).
					 *  
					 *  
					 *  ////////////////////////////////////////////////////////////////////////////
					 *  
					 *  
					 *          −(2(mc−mq−p)) ± √((2(mc−mq−p))^2−4(m^2+1)(q^2−r^2+p^2−2cq+c^2))
					 *   y = m (−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−)   + (q^2−r^2+p^2−2cq+c^2)
					 *                2(m^2+1)
					 *  
					 *  
					 *  
					 *  Let's say you have the line   Y = mX + c   and the circle   (x − p)^2 + (y − q)^2 = r^2.
					 *  First, substitute y=mx+c into (x−p)^2+(y−q)^2=r^2 to give
					 *  
					 *  (x−p)^2+(mx+c−q)^2=r^2.
					 *  
					 *  Next, expand out both brackets, bring the r^2 over to the left, and collect like terms:
					 *  
					 *  (m^2+1)x^2+2(mc−mq−p)x+(q^2−r^2+p^2−2cq+c^2)=0.
					 *  This is a quadratic in x and can be solved using the quadratic formula.
					 *  Let us relabel the coefficients to give Ax^2+Bx+C=0, then we have
					 *  
					 *     x = −B ± √(B^2−4AC)
					 *    −−−−−−−−−−−−−−−−−−−−
					 *             2A
					 *  
					 *  If B^2−4AC < 0 then the line misses the circle.
					 *  If B^2−4AC = 0 then the line is tangent to the circle.
					 *  If B^2−4AC > 0 then the line meets the circle in two distinct points.
					 *  
					 *  Since y=mx+c, we can see that if x is as above then
					 *
					 *
					 *          −B ± √(B^2−4AC)
					 *   y = m (−−−−−−−−−−−−−−−)   + c
					 *                2A
					 * 
					 */
					
				}/// end check width bound	
			}/// end check height bound
		},/// end collision()
		checkPaddle: function(paddle){
			if(this.collision(paddle)){
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
			if(this.ball != undefined){
				this.ball.checkPaddle(this.paddle);
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














