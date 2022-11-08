/*
    Darian Range
    CPSC 332
    HW5
    11/7/2022
    Modified from https://github.com/end3r/Gamedev-Canvas-workshop
*/
var color1 = "#FFFF00";
var color2 = "#ff0000";
var color3 = "#008000";

        window.onload = function () {
            var canvas = document.getElementById("myCanvas");
            var ctx = canvas.getContext("2d");
            var ballRadius = 10;
            var x = canvas.width / 2;
            var y = canvas.height - 30;
            var dx = 1;
            var dy = -1;
            var paddleHeight = 10;
            var paddleWidth = 75;
            var paddleX = (canvas.width - paddleWidth) / 2;
            var rightPressed = false;
            var leftPressed = false;
            var brickRowCount = 5;
            var brickColumnCount = 3;
            var brickWidth = 75;
            var brickHeight = 20;
            var brickPadding = 10;
            var brickOffsetTop = 30;
            var brickOffsetLeft = 30;
            var score = 0;
            var lives = 3;
            var highScore = 0;
            var speedsld = document.getElementById("myRange");
            var speedlb = document.getElementById("scale");
            var speed = 1;
            var pauseBtn = document.getElementById("pause");
            var isPaused = false;
            var resetBtn = document.getElementById("new");
            var contBtn = document.getElementById("cont");
            var rldBtn = document.getElementById("rld");
            var lost = false;
            var visHighScore = 0;

            speedsld.addEventListener("input", adjustGameSpeed);
            pauseBtn.addEventListener("click", togglePauseGame);
            resetBtn.addEventListener("click", resetBoard);
            contBtn.addEventListener("click", continuePlaying);
            rldBtn.addEventListener("click", reloadGame);


            var bricks = [];

            function initBricks() {
                for (var c = 0; c < brickColumnCount; c++) {
                    bricks[c] = [];
                    for (var r = 0; r < brickRowCount; r++) {
                        bricks[c][r] = { x: 0, y: 0, status: 1 };
                    }
                }
            }

            initBricks();

            document.addEventListener("keydown", keyDownHandler, false);
            document.addEventListener("keyup", keyUpHandler, false);
            document.addEventListener("mousemove", mouseMoveHandler, false);

            function keyDownHandler(e) {
                if (e.keyCode == 39) {
                    rightPressed = true;
                }
                else if (e.keyCode == 37) {
                    leftPressed = true;
                }
            }

            function keyUpHandler(e) {
                if (e.keyCode == 39) {
                    rightPressed = false;
                }
                else if (e.keyCode == 37) {
                    leftPressed = false;
                }
            }

            function mouseMoveHandler(e) {
                var relativeX = e.clientX - canvas.offsetLeft;
                if (relativeX > 0 && relativeX < canvas.width) {
                    paddleX = relativeX - paddleWidth / 2;
                }
            }

            function collisionDetection() {
                for (var c = 0; c < brickColumnCount; c++) {
                    for (var r = 0; r < brickRowCount; r++) {
                        var b = bricks[c][r];
                        if (b.status == 1) {
                            if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                                dy = -dy;
                                b.status = 0;
                                score++;
                                if (score == brickRowCount * brickColumnCount) {
                                    //TODO: draw message on the canvas
                                    //TODO: pause game instead of reloading
                                    togglePauseGame();
                                    ctx.font = "28px Arial";
                                    ctx.fillStyle = color3;
                                    ctx.fillText("Good Job! You Win!", 150, 70);
                                    highScore += score;
                                    if(highScore > visHighScore) {
                                        visHighScore = highScore;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            function drawBall() {
                ctx.beginPath();
                ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
                ctx.fillStyle = color1;
                ctx.fill();
                ctx.closePath();
            }

            function drawPaddle() {
                ctx.beginPath();
                ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
                ctx.fillStyle = color1;
                ctx.fill();
                ctx.closePath();
            }

            function drawBricks() {
                for (var c = 0; c < brickColumnCount; c++) {
                    for (var r = 0; r < brickRowCount; r++) {
                        if (bricks[c][r].status == 1) {
                            var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                            var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                            bricks[c][r].x = brickX;
                            bricks[c][r].y = brickY;
                            ctx.beginPath();
                            ctx.rect(brickX, brickY, brickWidth, brickHeight);
                            ctx.fillStyle = color1;
                            ctx.fill();
                            ctx.closePath();
                        }
                    }
                }
            }
            function drawScore() {
                ctx.font = "16px Arial";
                ctx.fillStyle = color1;
                ctx.fillText("Score: " + score, 60, 20);
            }

            function drawLives() {
                ctx.font = "16px Arial";
                ctx.fillStyle = color1;
                ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
            }


            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawBricks();
                drawBall();
                drawPaddle();
                drawScore();
                drawHighScore();
                drawLives();
                collisionDetection();

                if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                    dx = -dx;
                }
                if (y + dy < ballRadius) {
                    dy = -dy;
                }
                else if (y + dy > canvas.height - ballRadius) {
                    if (x > paddleX && x < paddleX + paddleWidth) {
                        dy = -dy;
                    }
                    else {
                        lives--;
                        if (lives <= 0) {
                            //TODO: draw message on the canvas
                            ctx.font = "28px Arial";
                            ctx.fillStyle = color2;
                            ctx.fillText("Sorry, You Lose", 150, 70);
                            //TODO: pause game instead of reloading
                            togglePauseGame();
                            lost = true;
                            highScore += score;
                            if(highScore > visHighScore) {
                                visHighScore = highScore;
                            }
                        }
                        else {
                            x = canvas.width / 2;
                            y = canvas.height - 30;
                            dx = speed;
                            dy = -speed;
                            paddleX = (canvas.width - paddleWidth) / 2;
                        }
                    }
                }

                if (rightPressed && paddleX < canvas.width - paddleWidth) {
                    paddleX += 7;
                }
                else if (leftPressed && paddleX > 0) {
                    paddleX -= 7;
                }

                //TODO: adjust speed
                x += dx;
                y += dy;
                //TODO: pause game check

                if(!isPaused)
                    requestAnimationFrame(draw);
            }

            /*
                Additions to starter code
            */

            //Additional variables used to help make dimensions/locations easier to reuse            
            //controls game speed            
            //pause game variable            
            //high score tracking variables
            //other variables?            

            //event listeners added
            //game speed changes handler            
            //pause game event handler            
            //start a new game event handler            
            //continue playing
            //reload click event listener            

            //Drawing a high score
            function drawHighScore() {
                ctx.font = "16px Arial";
                ctx.fillStyle = color1;
                ctx.fillText("High: " + visHighScore, 200, 20);
            }

            //draw the menu screen, including labels and button
            function drawMenu() {
                //draw the rectangle menu backdrop
                ctx.fillStyle = color3;
                ctx.fillRect(15, 15, canvas.width - 30, canvas.height - 30);
                //draw the menu header
                ctx.font = "28px Arial";
                ctx.fillStyle = color1;
                ctx.fillText("Breakout!", 185, 50);
                //start game button area
                ctx.fillStyle = color2;
                ctx.fillRect(canvas.width / 2 - 65, canvas.height / 2 - 35, 130, 70);
                ctx.font = "28px Arial";
                ctx.fillStyle = color1;
                ctx.fillText("Start", canvas.width / 2 - 35, canvas.height / 2 + 10);
                canvas.addEventListener("click", startGameClick);
                //event listener for clicking start
                //need to add it here because the menu should be able to come back after 
                //we remove the it later                
            }

            //function used to set shadow properties
            function setShadow() {

            };

            //function used to reset shadow properties to 'normal'
            function resetShadow() {

            };

            //function to clear the menu when we want to start the game
            function clearMenu() {
                //remove event listener for menu, 
                //we don't want to trigger the start game click event during a game  
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.removeEventListener("click", startGameClick);              
            }

            //function to start the game
            //this should check to see if the player clicked the button
            //i.e., did the user click in the bounds of where the button is drawn
            //if so, we want to trigger the draw(); function to start our game
            function startGameClick(event) {
                var rect = canvas.getBoundingClientRect()
                if(event.clientX - rect.left > canvas.width / 2 - 65 && event.clientY - rect.top > canvas.height / 2 - 35 && event.clientX - rect.left < canvas.width / 2 + 65 && event.clientY - rect.top < canvas.height / 2 + 35) {
                    clearMenu();
                    resetShadow();
                    draw();
                    console.log("clicked button");
                }
            };

            //function to handle game speed adjustments when we move our slider
            function adjustGameSpeed() {
                //update the slider display                
                //update the game speed multiplier 
                speedlb.innerHTML = speedsld.value;
                speed = parseInt(speedsld.value); 
                if(dx < 0) {
                    dx = -speed;
                }
                else {
                    dx = speed
                }
                if(dy < 0) {
                    dy = -speed;
                }
                else {
                    dy = speed
                }              
            };

            //function to toggle the play/paused game state
            function togglePauseGame() {
                //toggle state    
                isPaused = !isPaused
                if(!isPaused)
                    requestAnimationFrame(draw);    
                //if we are not paused, we want to continue animating (hint: zyBook 8.9)
            };

            //function to reset the board and continue playing (accumulate high score)
            //should make sure we didn't lose before accumulating high score
            function continuePlaying() {
                if(lost) {
                    lost = false;
                    highScore = 0;
                    lives = 3;
                    score = 0;
                }
                initBricks();
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = speed;
                dy = -speed;
                paddleX = (canvas.width - paddleWidth) / 2;
                draw();
            };

            //function to reset starting game info
            function resetBoard(resetLives) {
                highScore = 0;
                score = 0;
                lives = 3;
                initBricks();
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = speed;
                dy = -speed;
                paddleX = (canvas.width - paddleWidth) / 2;
                draw();               
            };

            function reloadGame() {
                document.location.reload();
            }

            //draw the menu.
            //we don't want to immediately draw... only when we click start game          
            drawMenu();

        };//end window.onload function