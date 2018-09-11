

function drawBeginning(){
	var canvas = document.getElementById('beginning');
	if(canvas.getContext){
		var context = canvas.getContext('2d');
		
		context.fillStyle = 'rgb(100, 200, 150)';
		context.fillRect(10, 10, 50, 50);
	}

}