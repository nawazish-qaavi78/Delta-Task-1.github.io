var MOVE_DISTANCE = 20;
var MOVE_DIRECTION = "X";
var TIME_DELAY = 305;
var TIME_GAIN = 5;
var GAME_SCREEN_DIMENSION = 400 < parseFloat(screen.width) ? 400 : parseFloat(screen.width);// this is for when mobile is used the screen is small so we adjust the game screen to it
var SNAKE_BOUNDARY = GAME_SCREEN_DIMENSION - 30;
var BITE_DISTANCE = 20;
var SOUND = new Audio("sounds/eat.wav");
var To_PAUSE = true;

const body = document.getElementsByTagName("body")[0];
var body_style = window.getComputedStyle(body);
var BODY_MARGIN = body_style.getPropertyValue('margin-top');

// this will ensure that game screen has at least some margin to end of the screen
if (GAME_SCREEN_DIMENSION < 400) {
    GAME_SCREEN_DIMENSION -= 2 * BODY_MARGIN;
}


var game_time = 300;
var words = ["red", "trichy", "NIT", "Delta", "Force", "webdev", "coding"];
var letters = [];
var score = 0;
var high_score = localStorage.getItem("highscore") ? localStorage.getItem("highscore") : 0;


// adjusting the game_screen
document.getElementById("game-screen").style.width = GAME_SCREEN_DIMENSION.toString() + "px";
document.getElementById("game-screen").style.height = GAME_SCREEN_DIMENSION.toString() + "px";


// printing the highscore
document.getElementById("high-score").innerText = "High Score: " + high_score;

// since we need another snake for multi-player mode
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

    // adds a new snake div to the game-screen
    extend_tail() {
        const game_screen = document.getElementById("game-screen");

        const block = document.createElement("div");
        block.classList.add("snake");

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

// creating snake object
var snake = new Snake();

// to set the direction in which the snake head must move
function set_head(input_key) {
    var game_on = game_time>0 && !out_of_game_screen() && !snake.bit_self();
    if(game_on) {
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
        snake.move_snake();// this is to ensure that the snake moves in the direction before another input is taken and it's direction is changed again
    }
}

//setting the direction of snake when keyboard input is given
document.addEventListener("keydown", function (e) {
    var game_on = game_time>0 && !out_of_game_screen() && !snake.bit_self();
    if(game_on){
        var letter = e.key;
        if(letter==='w' || letter==='a' || letter==='s' || letter==='d'){
            set_head(e.key);
        }
    }
});


// setting the direction of snake when steering is used
document.getElementById("w").addEventListener("click", function () {
   set_head("w");
});
document.getElementById("s").addEventListener("click", function () {
    set_head("s");
    
});
document.getElementById("d").addEventListener("click", function () {
    set_head("d");
    
});
document.getElementById("a").addEventListener("click", function () {
    set_head("a");
    
});


// function to check when the snake head moves out of the screen
function out_of_game_screen() {
    var element = document.getElementById("snake-head");
    var style = element.currentStyle || window.getComputedStyle(element);
    var x_cor = style.marginLeft;
    var y_cor = style.marginTop;
    var x_out_of_boundary = parseFloat(x_cor) > SNAKE_BOUNDARY || parseFloat(x_cor) < parseFloat(BODY_MARGIN);
    var y_out_boundary = parseFloat(y_cor) < 0 || parseFloat(y_cor) > SNAKE_BOUNDARY;
    if (x_out_of_boundary || y_out_boundary) {
        return true;
    }
    return false;
}

function random_word() {
    var word = words[Math.floor(Math.random() * words.length)];
    return word;
}

function increase_score() {
    score++;
    document.getElementById("score").innerText = "Score: " + score.toString();
}

function snake_speed_up() {
    TIME_DELAY -= 10;
}

function power_up_fruit(){
    const game_screen = document.getElementById("game-screen");
    
    var fruit = document.createElement("div");
    fruit.classList.add("fruit");
    
    game_screen.appendChild(fruit);

    fruit.style.marginLeft = (Math.random() * 150 + 10).toString() + "px";
    fruit.style.marginTop = (Math.random() * 150 + 10).toString() + "px";
}

function ate_power_up(){
    if(document.getElementsByClassName("fruit").length<1){
        return;
    }
    var fruit = document.getElementsByClassName("fruit")[0];

    var fruit_style = fruit.currentStyle || window.getComputedStyle(fruit);
    var snake_style = snake.snake_head.currentStyle || window.getComputedStyle(snake.snake_head);

    var fruit_x_cor = parseFloat(fruit_style.marginLeft);
    var fruit_y_cor = parseFloat(fruit_style.marginTop);

    var snake_x_cor = parseFloat(snake_style.marginLeft);
    var snake_y_cor = parseFloat(snake_style.marginTop);
    
    var did_bite = Math.abs(fruit_x_cor - snake_x_cor) < BITE_DISTANCE && Math.abs(fruit_y_cor - snake_y_cor) < BITE_DISTANCE;

    if(did_bite){
        TIME_DELAY+=10;
        fruit.remove();
    }
}


function set_words() {
    snake_speed_up();
    if(document.getElementsByClassName("fruit").length<1 && Math.floor(Math.random()*8)===1){ // this is reduces the probability of a power-up showing up and make sure that only one fruit is shown at once
        power_up_fruit();
    }
    const game_screen = document.getElementById("game-screen");
    const order_screen = document.getElementById("order-screen");

    var game_word = random_word();
    letters = game_word.split("");

    for (let i = 0; i < letters.length; i++) {
        var taken_letter = document.createElement("p");
        taken_letter.classList.add("letter");
        game_screen.appendChild(taken_letter);
        taken_letter.style.marginLeft = (Math.random() * 150 + 10).toString() + "px";
        taken_letter.style.marginTop = (Math.random() * 150 + 10).toString() + "px";
        taken_letter.innerText = letters[i];
    }

    for (let j = 0; j<letters.length; j++) {
        var letter_order = document.createElement("p");
        letter_order.classList.add("letter-display");
        order_screen.appendChild(letter_order);
        letter_order.innerText= letters[j];
    }
}


function next_letter() {
    var letters_on_screen = document.querySelectorAll(".letter");
    return letters_on_screen[0];
}

function ate_letter(letters) {
    // to check when all the fruits are eaten
    if (letters.length <= 0) {
        set_words();
        return;
    }

    var letter_to_eat = next_letter();

    var letter_style = letter_to_eat.currentStyle || window.getComputedStyle(letter_to_eat);
    var snake_style = snake.snake_head.currentStyle || window.getComputedStyle(snake.snake_head);

    var letter_x_cor = parseFloat(letter_style.marginLeft);
    var letter_y_cor = parseFloat(letter_style.marginTop);

    var snake_x_cor = parseFloat(snake_style.marginLeft);
    var snake_y_cor = parseFloat(snake_style.marginTop);

    var did_bite = Math.abs(letter_x_cor - snake_x_cor) < BITE_DISTANCE && Math.abs(letter_y_cor - snake_y_cor) < BITE_DISTANCE;

    if (did_bite) {
        SOUND.play();
        game_time += TIME_GAIN;
        increase_score();
        snake.extend_tail();
        letter_to_eat.remove();
        document.querySelectorAll(".letter-display")[0].remove();
        letters.shift();
    }
}


function game() {
    snake.move_snake();
    ate_letter(letters);
    ate_power_up();
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
}, 1000);

// pausing the game
document.addEventListener("keydown", function (e) {
    if (e.key === "k") {
        if(To_PAUSE){
            clearInterval(start_game);
            clearInterval(clock);
            To_PAUSE = false;
        }
        else{
            var game_on = game_time>0 && !out_of_game_screen() && !snake.bit_self();
            if(game_on){
                start_game = setInterval(game, TIME_DELAY);
                To_PAUSE= true;
            }
        }
    }
});
document.getElementById("pause").addEventListener("click", function(){
    if(document.getElementById("pause").innerText === "pause"){
        clearInterval(start_game);
        clearInterval(clock);
        document.getElementById("pause").innerText = "play";
        To_PAUSE = false;
    } else {
        var game_on = game_time>0 && !out_of_game_screen() && !snake.bit_self();
        if(game_on) {
            start_game = setInterval(game, TIME_DELAY);
            document.getElementById("pause").innerText = "pause";
            To_PAUSE= true;
        }
    }
});
