/* Document constants */
const username = document.getElementById('username')
const enterName = document.getElementById('enter-name')
const gameOver = document.getElementById('game-over')
const grid = document.querySelector('.grid')
const scoreDisplay = document.getElementById('score')
const hello = document.getElementById('hello')
const highScoresDisplay = document.getElementById('high-scores')
const playAgainBtn = document.getElementById('play-again')
const endScoreDisplay = document.getElementById('end-score')
const pulseOverlay = document.getElementById('pulse')
const disconnectBtn = document.getElementById('disconnect-btn')

/* Global variables */
let squares = []
let currentSnake = [2,1,0]
let direction = 1
const width = 10
let appleIndex = 0
let score = 0
let intervalTime = 1000
let speed = 0.9
let timerId = 0
let usernameValue = ''
let highScores = JSON.parse(window.localStorage.getItem("highScores")) || []
if(length != 0) {
    highScores = sort((a,b) => b.score - a.score)
}
  

/* Functions */
function createGrid() {
    //create 100 of these elements with a for loop
    for (let i=0; i < width*width; i++) {
     //create element
    const square = document.createElement('div')
    //add styling to the element
    square.classList.add('square')
    //put the element into our grid
    grid.appendChild(square)
    //push it into a new squares array    
    squares.push(square)
    }
}

function startGame() {
    //remove the snake
    currentSnake.forEach(index => squares[index].classList.remove('snake'))
    squares[currentSnake[0]].classList.remove('snake-head')
    //remove the apple
    squares[appleIndex].classList.remove('apple')
    clearInterval(timerId)
    currentSnake = [2,1,0]
    score = 0
    //re add new score to browser
    scoreDisplay.textContent = score
    direction = 1
    intervalTime = 1000
    //re add the class of snake to our new currentSnake
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    squares[currentSnake[0]].classList.add('snake-head')
    squares[currentSnake[0]].classList.add('rotate-right')
    //generate the new apple
    generateApple()
    timerId = setInterval(move, intervalTime)
}

function move() {
    if (
        (currentSnake[0] + width >= width*width && direction === width) || //if snake has hit bottom
        (currentSnake[0] % width === width-1 && direction === 1) || //if snake has hit right wall
        (currentSnake[0] % width === 0 && direction === -1) || //if snake has hit left wall
        (currentSnake[0] - width < 0 && direction === -width) || //if snake has hit top
        squares[currentSnake[0] + direction].classList.contains('snake')
    )
    {
        gameOver.style.display = 'block'
        pulseOverlay.style.animation = ''
        endScoreDisplay.textContent = `Your score: ${score}`
        if(length < 10 || score > highScores[9].score) {
            if(length === 10) {
                pop()
            }
            push({
                "username": usernameValue,
                "score": score
            })
            sort((a,b) => b.score - a.score)
        }
        window.localStorage.setItem("highScores", JSON.stringify(highScores))
        displayScores();
        return clearInterval(timerId)
    }

    //remove last element from our currentSnake array
    const tail = currentSnake.pop()
    //remove styling from last element
    squares[tail].classList.remove('snake')
    //remove styling from the last snake head
    squares[currentSnake[0]].classList.remove('snake-head')
    //add square in direction we are heading
    currentSnake.unshift(currentSnake[0] + direction)
    //add styling so we can see it
    switch (direction) {
        case -1:
            if (squares[currentSnake[0]].classList.contains('rotate-down'))
            {
                squares[currentSnake[0]].classList.remove('rotate-down')
            }
            if (squares[currentSnake[0]].classList.contains('rotate-up'))
            {
                squares[currentSnake[0]].classList.remove('rotate-up')
            }
            if (squares[currentSnake[0]].classList.contains('rotate-right'))
            {
                squares[currentSnake[0]].classList.remove('rotate-right')
            }
            break;
        case +width:
            if (squares[currentSnake[0]].classList.contains('rotate-up'))
            {
                squares[currentSnake[0]].classList.remove('rotate-up')
            }
            if (squares[currentSnake[0]].classList.contains('rotate-right'))
            {
                squares[currentSnake[0]].classList.remove('rotate-right')
            }
            if (!squares[currentSnake[0]].classList.contains('rotate-down'))
            {
                squares[currentSnake[0]].classList.add('rotate-down')
            }
            break;
        case -width:
            if (squares[currentSnake[0]].classList.contains('rotate-down'))
            {
                squares[currentSnake[0]].classList.remove('rotate-down')
            }
            if (squares[currentSnake[0]].classList.contains('rotate-right'))
            {
                squares[currentSnake[0]].classList.remove('rotate-right')
            }
            if (!squares[currentSnake[0]].classList.contains('rotate-up'))
            {
                squares[currentSnake[0]].classList.add('rotate-up')
            }
            break;
        case 1:
            if (squares[currentSnake[0]].classList.contains('rotate-down'))
            {
                squares[currentSnake[0]].classList.remove('rotate-down')
            }
            if (squares[currentSnake[0]].classList.contains('rotate-up'))
            {
                squares[currentSnake[0]].classList.remove('rotate-up')
            }
            if (!squares[currentSnake[0]].classList.contains('rotate-right'))
            {
                squares[currentSnake[0]].classList.add('rotate-right')
            }
        default:
            break;
    }
    
    //deal with snake head gets apple
    if (squares[currentSnake[0]].classList.contains('apple')) {
        //remove the class of apple
        squares[currentSnake[0]].classList.remove('apple')
        //grow our snake by adding class of snake to it
        squares[tail].classList.add('snake')
        //grow our snake array
        currentSnake.push(tail)
        //generate new apple
        generateApple()
        //add one to the score
        score++
        //display our score
        scoreDisplay.textContent = score
        //speed up our snake
        clearInterval(timerId)
        intervalTime = intervalTime * speed
        timerId = setInterval(move, intervalTime)
        if (score >= 15) {
            pulseOverlay.style.animation = `pulse ${intervalTime}ms infinite`
        }
    }
    squares[currentSnake[0]].classList.add('snake')
    squares[currentSnake[0]].classList.add('snake-head')
}

function generateApple() {
    do {
        appleIndex = Math.floor(Math.random() * squares.length)
    } while (squares[appleIndex].classList.contains('snake'))
    squares[appleIndex].classList.add('apple')
}

function control(e) {
    if (e.keyCode === 39) {
        direction = 1
    } else if (e.keyCode === 38) {
        direction = -width
    } else if (e.keyCode === 37) {
        direction = -1
    } else if (e.keyCode === 40) {
        direction = +width
    }
}

function displayGame(e) {
    if (e.keyCode === 13) {
        enterName.style.display = 'none'
        usernameValue = username.value
        hello.textContent = `Hello ${usernameValue}!`
        disconnectBtn.style.display = 'block'
        displayScores()
        username.value = ''
        startGame()
    }
}

function displayScores() {
    highScoresDisplay.innerHTML = ''
    highScores.forEach(score => {
        const newScore = document.createElement('li')
        newScore.textContent = `${score.username}: ${score.score}`
        highScoresDisplay.appendChild(newScore)
    })
}

createGrid()
username.addEventListener('keydown', displayGame)
playAgainBtn.addEventListener('click', function() {
    gameOver.style.display = 'none'
    startGame()
})
disconnectBtn.addEventListener('click', function() {
    enterName.style.display = 'block'
})
document.addEventListener('keyup', control)