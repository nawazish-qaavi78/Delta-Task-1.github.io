var MOVE_DISTANCE = 20;
var MOVE_DIRECTION = "X";
var TIME_DELAY = 305;
var GAME_SCREEN_DIMENSION = 400 < parseFloat(screen.width) ? 400 : parseFloat(screen.width);// this is for when mobile is used the screen is small so we adjust the game screen to it
var SNAKE_BOUNDARY = GAME_SCREEN_DIMENSION - 30;
var BITE_DISTANCE = 20;
var MAX_FRUITS_AT_ONCE = 5;
var game_time = 300;
var color_range = ["silver", "chocolate", "maroon", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "blue", "teal", "aqua"];
var colors = [];
var score = 0;
var high_score = localStorage.getItem("highscore") ? localStorage.getItem("highscore") : 0;

// adjusting the game_screen
document.getElementById("game-screen").style.width = GAME_SCREEN_DIMENSION.toString() + "px";
document.getElementById("game-screen").style.height = GAME_SCREEN_DIMENSION.toString() + "px";

// printing the highscore
document.getElementById("high-score").innerText = "High Score: " + high_score;

// setting the game-pad according to the screen
document.getElementById("up").style.marginLeft = ((GAME_SCREEN_DIMENSION / 2) - 25).toString() + "px";
document.getElementById("down").style.marginLeft = ((GAME_SCREEN_DIMENSION / 2) - 25).toString() + "px";
document.getElementById("left").style.marginLeft = ((GAME_SCREEN_DIMENSION / 2) - 76).toString() + "px";


class Snake {

    constructor() {
        const game_screen = document.getElementById("game-screen");

        var snake_head, snake_tail;
        this.snake_head = document.createElement("div");
        this.snake_head.setAttribute("id", "snake-head");
        this.snake_head.classList.add("snake");

        game_screen.appendChild(this.snake_head);

        for (let i = 0; i < 2; i++) {
            var block = document.createElement("div");
            block.setAttribute("class", "snake");
            game_screen.appendChild(block);
        }
        this.snake_tail = document.querySelectorAll(".snake")[2];
        this.snake_tail.style.marginLeft = "20px";
        this.snake_tail.style.marginLeft = document.querySelectorAll(".snake")[1].style.marginLeft;
    }

    // function to move the snake 
    move_snake() {
        var element = document.getElementById("snake-head");
        var style = element.currentStyle || window.getComputedStyle(element);
        for (var i = document.querySelectorAll(".snake").length - 1; i > 0; i--) {
            var x_cor = document.querySelectorAll(".snake")[i - 1].style.marginLeft;
            var y_cor = document.querySelectorAll(".snake")[i - 1].style.marginTop;
            document.querySelectorAll(".snake")[i].style.marginLeft = x_cor;
            document.querySelectorAll(".snake")[i].style.marginTop = y_cor;
        }
        if (MOVE_DIRECTION === 'X') {
            document.getElementById("snake-head").style.marginLeft = (MOVE_DISTANCE + parseFloat(style.marginLeft)).toString() + "px";
        } else {
            document.getElementById("snake-head").style.marginTop = (MOVE_DISTANCE + parseFloat(style.marginTop)).toString() + "px";
        }
    }

    //create a new div for new snake tail
    extend_tail() {
        const game_screen = document.getElementById("game-screen");

        const block = document.createElement("div");
        block.classList.add("snake");
        this.snake_tail = block;

        game_screen.appendChild(block);
    }

    bit_self() {
        var snake_style = this.snake_head.currentStyle || window.getComputedStyle(this.snake_head);
        for (let i = 1; i < document.querySelectorAll(".snake").length; i++) {
            var body_block = document.querySelectorAll(".snake")[i];
            var block_style = body_block.currentStyle || window.getComputedStyle(body_block);
            var same_x_cor = Math.abs(parseFloat(snake_style.marginLeft) - parseFloat(block_style.marginLeft)) < BITE_DISTANCE;
            var same_y_cor = Math.abs(parseFloat(snake_style.marginTop) - parseFloat(block_style.marginTop)) < BITE_DISTANCE
            if (same_x_cor && same_y_cor) {
                return true;
            }
        }
        return false;
    }
}

// to set the direction in which the snake head must move
function set_head(input_key) {
    switch (input_key) {
        case 'w':
            if (MOVE_DIRECTION === 'X') {
                MOVE_DIRECTION = 'Y';
                MOVE_DISTANCE = -1 * Math.abs(MOVE_DISTANCE);
            }
            break;
        case 'a':
            if (MOVE_DIRECTION === 'Y') {
                MOVE_DIRECTION = 'X';
                MOVE_DISTANCE = -1 * Math.abs(MOVE_DISTANCE);
            }
            break;
        case 's':
            if (MOVE_DIRECTION === 'X') {
                MOVE_DIRECTION = 'Y';
                MOVE_DISTANCE = Math.abs(MOVE_DISTANCE);
            }
            break;
        case 'd':
            if (MOVE_DIRECTION === 'Y') {
                MOVE_DIRECTION = 'X';
                MOVE_DISTANCE = Math.abs(MOVE_DISTANCE);
            }
            break;
    }
}

//setting the direction of snake when keyboard input is given
document.addEventListener("keydown", function (e) {
    set_head(e.key);
});

// setting the direction of snake when steering is used
document.getElementById("up").addEventListener("click", function () {
    set_head("w");
});
document.getElementById("down").addEventListener("click", function () {
    set_head("s");
});
document.getElementById("right").addEventListener("click", function () {
    set_head("d");
});
document.getElementById("left").addEventListener("click", function () {
    set_head("a");
});
document.getElementById("up").addEventListener("click", function () {
    set_head("w");
});
document.getElementById("up").addEventListener("click", function () {
    set_head("w");
});


// function to check when the snake head moves out of the screen
function out_of_game_screen() {
    var element = document.getElementById("snake-head");
    var style = element.currentStyle || window.getComputedStyle(element);
    var x_cor = style.marginLeft;
    var y_cor = style.marginTop;
    if (parseFloat(x_cor) > SNAKE_BOUNDARY || parseFloat(x_cor) < 0 || parseFloat(y_cor) > SNAKE_BOUNDARY || parseFloat(y_cor) < 0) {
        return true;
    }
    return false;
}

function random_color() {
    var color = color_range[Math.floor(Math.random() * color_range.length)];
    while (colors.includes(color)) {
        color = color_range[Math.floor(Math.random() * color_range.length)];
    }
    return color;
}

function increase_score() {
    score++;
    document.getElementById("score").innerText = "Score: " + score.toString();
}

function snake_speed_up() {
    TIME_DELAY -= 10;
}

// when called it should create fruits, of different color... should appened each color in the "colors"
function create_furits() {
    snake_speed_up();
    const game_screen = document.getElementById("game-screen");
    const order_screen = document.getElementById("order-screen");

    var no_of_fruits = Math.floor(Math.random() * MAX_FRUITS_AT_ONCE) + 1;

    // this part will create and place the food in the game screen
    for (let i = 0; i < no_of_fruits; i++) {
        var color = random_color();
        colors.push(color);
        var new_fruit = document.createElement("div");
        new_fruit.classList.add("fruit");
        game_screen.appendChild(new_fruit);
        new_fruit.style.marginLeft = (Math.random() * 150 + 10).toString() + "px";
        new_fruit.style.marginTop = (Math.random() * 150 + 10).toString() + "px";
        new_fruit.style.backgroundColor = color;
    }

    // this part will show the sequence of the color blocks
    for (let j = colors.length - 1; j >= 0; j--) {
        var color_block = document.createElement("div");
        color_block.classList.add("fruit-display");
        order_screen.appendChild(color_block);
        color_block.style.backgroundColor = colors[j];
    }
}



// will return the div element which is to be eaten next or the the first div to be eatern
function next_fruit() {
    var fruits_on_screen = document.querySelectorAll(".fruit");
    return fruits_on_screen[fruits_on_screen.length - 1];
}

// check if ate the ryt fruit, remove the fruit when it ate the ryt fruit
function ate_fruit(colors) {
    if (colors.length <= 0) {
        create_furits();
        return;
    }

    var fruit = next_fruit();

    var fruit_style = fruit.currentStyle || window.getComputedStyle(fruit);
    var snake_style = snake.snake_head.currentStyle || window.getComputedStyle(snake.snake_head);

    fruit_x_cor = parseFloat(fruit_style.marginLeft);
    fruit_y_cor = parseFloat(fruit_style.marginTop);

    snake_x_cor = parseFloat(snake_style.marginLeft);
    snake_y_cor = parseFloat(snake_style.marginTop);

    var did_bite = Math.abs(fruit_x_cor - snake_x_cor) < BITE_DISTANCE && Math.abs(fruit_y_cor - snake_y_cor) < BITE_DISTANCE;

    if (did_bite) {
        game_time += 30;
        increase_score();
        snake.extend_tail();
        fruit.remove();
        document.querySelectorAll(".fruit-display")[0].remove();
        colors.pop();
    }
}

// creating snake object
var snake = new Snake();

function game() {
    snake.move_snake();
    ate_fruit(colors);
    if (out_of_game_screen() || game_time <= 0 || snake.bit_self()) {
        clearInterval(start_game);
        clearInterval(clock);
        if (score > high_score) {
            localStorage.setItem("highscore", score);
            document.getElementById("high-score").innerText = "High Score: " + high_score;
        }
    }
}

// starting the game loop
var start_game = setInterval(game, TIME_DELAY);


// initializing clock
var clock = setInterval(function () {
    game_time -= 1;
    document.getElementById("clock").innerText = "Time: " + game_time.toString() + " sec";
}, 1000)

// pausing the game at at particular place
document.addEventListener("keydown", function (e) {
    if (e.key === "k") {
        clearInterval(start_game);
        clearInterval(clock);
    } else if (e.key === 'j') {
        start_game = setInterval(game, TIME_DELAY);
    }
});
