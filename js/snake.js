$(document).ready(function(){
	//Initializing canvas properties
	var canvas = $('#canvas')[0];
	var ctx = canvas.getContext("2d");
	var width = $('#canvas').width();
	var height = $('#canvas').height();

	//Default Properties
	var cell_w = 10; //Our default cell size for our snake
	var d;
	var food;

	//Declaring array that represents snake
	var snake;

	//Initialization function
	function init()
	{ 
		d = "right"; //default direction
		create_snake();
		create_food();

		//A timer to move the snake. Triggers the paint 
		//function every set amount of milliseconds
		if(typeof timer != "undefined") clearInterval(timer);
		timer = setInterval(paint, 60);
	}
	init();
	

	//Function to create set-up the snake
	function create_snake()
	{
		var length = 5; //Initial length of snake
		snake = []; //Starting with an empty snake
		for (var i = length - 1; i >= 0; i--) {
			snake.push({x:i, y:0});
		};
	}

	function create_food()
	{
		//Food will be randomly generated somewhere on the board
		food = {
			x: Math.round(Math.random()*(width-cell_w)/cell_w),
			y: Math.round(Math.random()*(height-cell_w)/cell_w),
		};
	}

	//Painting all components of the game, as well as checking for game status
	function paint()
	{

		//Painting the initial canvas for the game
		//Also resets the background at end of every frame/timer
		ctx.fillStyle = "#303030";
		ctx.fillRect(0, 0, width, height);
		ctx.strokeStyle = "#FFC365";
		ctx.strokeRect(0, 0, width, height);

		//Painting/filling in the snake
		for (var i = 0; i < snake.length; i++) {
			var a = snake[i];

			//We're going to paint the snake cells 10px wide
			paint_cell(a.x, a.y);
		};

		//Painting the food block
		paint_cell(food.x, food.y);

		//Code to control snake movement by popping out tail cell
		//Then place tail cell in front of head cell

		//Positions of head cell
		var hx = snake[0].x;
		var hy = snake[0].y;
		
		//User-input-based directional movement
		if (d == "right") hx++;
		else if (d == "left") hx--;
		else if (d == "up") hy--;
		else if (d == "down") hy++;

		//Logic to control when the snake eats the food
		//If new head position matches food
		//Create new head instead of moving tail
		if(hx == food.x && hy == food.y)
		{
			var tail = {x: hx, y: hy};
			//We now generate a new piece of food
			create_food();
		}
		else
		{
			var tail = snake.pop(); //Pops out the last cell
			tail.x = hx;
			tail.y = hy;
		}

		snake.unshift(tail); //Places tail in new head position

		//Game Over Condition Check
		if(hx == -1 || hx == width/cell_w || hy == -1 || hy == height/cell_w || check_collision(hx, hy, snake))
		{
			//restart game
			init();
			return;
		}
	}

	function paint_cell(x, y)
		{
			ctx.fillStyle = "#FF8800";
			ctx.fillRect(x*cell_w, y*cell_w, cell_w, cell_w);
			ctx.strokeStyle = "#black";		
			ctx.strokeRect(x*cell_w, y*cell_w, cell_w, cell_w);
		}

	function check_collision(x, y, array)
		{
			//This function will check if the provided x/y coordinates exist
			//in an array of cells or not
			for (var i = 1; i < array.length; i++)
			{
				if(array[i].x == x && array[i].y == y)
					return true;
			}
			return false;
		}

	//Receiving and interpreting keyboard input
	// && condition prevents snake from going in reverse
	$(document).keydown(function(e){
		var key = e.which;
		if (key == "37" && d != "right") d = "left";
		else if (key == "38" && d != "down") d = "up";
		else if (key == "39" && d != "left") d = "right";
		else if (key == "40" && d != "up") d = "down";
	})
})