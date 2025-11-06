// Flash background red
function flashRedBg() {
    document.body.classList.add('flash-red');
    setTimeout(() => document.body.classList.remove('flash-red'), 1000);
}
// Confetti animation
function showConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    const confettiCount = 120;
    const confetti = [];
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            r: 6 + Math.random() * 6,
            d: Math.random() * confettiCount,
            color: `hsl(${Math.random()*360},80%,60%)`,
            tilt: Math.random() * 10 - 5
        });
    }
    let angle = 0;
    let tiltAngle = 0;
    let frame = 0;
    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < confettiCount; i++) {
            let c = confetti[i];
            ctx.beginPath();
            ctx.ellipse(c.x, c.y, c.r, c.r/2, c.tilt, 0, 2 * Math.PI);
            ctx.fillStyle = c.color;
            ctx.fill();
        }
        updateConfetti();
        frame++;
        if (frame < 120) {
            requestAnimationFrame(drawConfetti);
        } else {
            canvas.style.display = 'none';
        }
    }
    function updateConfetti() {
        angle += 0.01;
        tiltAngle += 0.1;
        for (let i = 0; i < confettiCount; i++) {
            let c = confetti[i];
            c.y += (Math.cos(angle + c.d) + 3 + c.r / 2) * 0.8;
            c.x += Math.sin(angle);
            c.tilt = Math.sin(tiltAngle - (i / 3)) * 10;
            if (c.y > canvas.height) {
                c.x = Math.random() * canvas.width;
                c.y = -10;
            }
        }
    }
    drawConfetti();
}
// add javascript here
let level, answer, score;
const levelArr = document.getElementsByName("level"); 
const scoreArr = [];
const scoreArr1 = [];
const timeArr = [];

// Grab commonly used DOM elements
const date = document.getElementById("date");
const playBtn = document.getElementById("playBtn");
const guessBtn = document.getElementById("guessBtn");
const giveUp = document.getElementById("giveUp");
const nameBtn = document.getElementById("nameBtn");
const nameInput = document.getElementById("nameInput");
const guess = document.getElementById("guess");
const msg = document.getElementById("msg");
const wins = document.getElementById("wins");
const avgScore = document.getElementById("avgScore");
let previousGuess = null;
const temp = ["","warmer", "colder", "Same distance as before"];
let tempPos = 0;
//timer
let timerInt;
let timerSeconds = 0;

// Player name (persisted)
let playerName = "";


// Initialize UI
setInterval(() => {
    date.textContent = time();
}, 1000);

function setName(){
    nameBtn.addEventListener("click", setName);
    if(playerName){
        nameInput.value = playerName;
        playBtn.disabled = false;
        msg.textContent = `${playerName}, select a level and press Play`;    
    } else {
        playBtn.disabled = true;
        msg.textContent = "Please enter your name to start.";
    }
}
// Wire up listeners

playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUp.addEventListener("click", GiveUp);
nameBtn.addEventListener("click", setName);
function GiveUp(){
    flashRedBg();
    stopTimer();
    score = Number(level); 
    msg.textContent = `${playerName}, I am disappointed in you for giving up :(, the correct answer was ${answer}. Press Play to try again. ${scoreArr1}`;
    updateScore();
    reset();
}
function play(){
    // require a name before starting
    if(!playerName){
        msg.textContent = "Please enter your name before playing.";
        return;
    }
    score = 0;
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guess.disabled = false;
    giveUp.disabled = false;
    for(let i=0; i<levelArr.length; i++){
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
        levelArr[i].disabled = true;
    } 
    msg.textContent = `${playerName}, guess a number from 1-${level}`;
    answer = Math.floor(Math.random()*level)+1;
    stopTimer();
    startTimer();
    guess.placeholder = `Enter a number 1-${level}`;
}

function setName() {
    let inputName = nameInput.value.trim();
    if (inputName) {
        playerName = toTitleCase(inputName);
        localStorage.setItem('nameInput', playerName);
        playBtn.disabled = false;
        msg.textContent = `${playerName}, select a level and press Play`;
    } else {
        playBtn.disabled = true;
        msg.textContent = "Please enter your name to start.";
    }
}

function makeGuess(){
    if(!playerName){
        msg.textContent = "Please enter your name before guessing.";
        return;
    }
    let userGuess = parseInt(guess.value); 
    if(isNaN(userGuess)|| userGuess<1 || userGuess>level){
        msg.textContent = `${playerName}, enter a valid number 1-${level}`;
        return;
    }
    score++;
    if (previousGuess!== null){
        let previousDiff = Math.abs(answer - previousGuess);
        let currentDiff = Math.abs(answer - userGuess);
        if(currentDiff < previousDiff){        
            tempPos = 1;
        }
        else if(currentDiff > previousDiff){
            tempPos = 2;
        }
        else{
            tempPos = 3;      
        }
    }
    if(userGuess==answer){
            showConfetti();
        if(score==1){
            msg.textContent = `${playerName}, wow — you got it on your first attempt, and took ${timerSeconds} seconds. Great Job! Press Play to play again.`;
            updateScore();
            stopTimer();
            reset();
        }
        else if(score<6){
            msg.textContent = `${playerName}, you are right! Nice job! It took you ${score} attempts, and took ${timerSeconds} seconds. Press Play to play again.`;
            updateScore();
            stopTimer();
            reset();
        }
        else{
            msg.textContent = `${playerName}, That was a hard one! It took you ${score} attempts, and took ${timerSeconds} seconds. Press Play to play again.`;
            updateScore();
            stopTimer();
            reset();
        }
    }
    else if(userGuess > answer){
        msg.textContent = playerName + ", too high, but " +temp[tempPos] + " try again.";
    }
    else if(userGuess < answer){
        msg.textContent = playerName + ", too low, but " + temp[tempPos] + " try again.";
    }
    previousGuess = userGuess;

}

function reset(){
    guessBtn.disabled = true;
    guess.disabled = true;
    guess.value = "";
    guess.placeholder = "";
    playBtn.disabled = false;
    giveUp.disabled = true;
    for(let i=0; i<levelArr.length; i++){
        levelArr[i].disabled = false;
    } 
}

function updateScore(){
    timeArr.push(timerSeconds);
    scoreArr.push(score + "pts in " + timerSeconds + " seconds");
    scoreArr1.push(score);
    scoreArr.sort((a,b) =>a-b);
    let lb = document.getElementsByName("leaderboard");
    wins.textContent = `${playerName}'s Total wins: ${scoreArr.length}`;
    let sum = 0;
    let sumT = 0;
    for(let i=0; i<scoreArr1.length; i++){
        sum += scoreArr1[i];
        if(i<lb.length){
            lb[i].textContent = scoreArr[i];
        }
    }
    for (let i=0; i<timeArr.length; i++){
        sumT += timeArr[i];
    }
    let avg = sum/scoreArr.length;
    avgScore.textContent = `Average Score: ${avg.toFixed(2)}`;
    avgTime.textContent = `Average time: ${(sumT/timeArr.length).toFixed(2)} seconds`;
    let fast = Math.min(...timeArr);
    fastTime.textContent = `Fastest time: ${fast} seconds`;
}

function time(){
    let d = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();
    let suffix="th";
    if(day%10==1 && day!=11){
        suffix="st";
    }
    else if(day%10==2 && day!=12){
        suffix="nd";
    }
    else if(day%10==3 && day!=13){
        suffix="rd";
    }

    let hours = d.getHours();
    let minutes = d.getMinutes();
    let seconds = d.getSeconds();
    let ampm = 'AM';
    if(hours>=12){
        ampm='PM';
        if(hours>12){
            hours -= 12;
        }
    }
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    d = `${month} ${day}${suffix}, ${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    return d;
}

function toTitleCase(s){
    return s.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function startTimer(){
    timerSeconds = 0;
        timerInt = setInterval(() => {
            timerSeconds++;
            let minutes = Math.floor(timerSeconds / 60);
            let seconds = timerSeconds % 60;
            const timerEl = document.getElementById("timer");
            timerEl.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timerEl.classList.add("bulge");
            setTimeout(() => timerEl.classList.remove("bulge"), 180);
        }, 1000);
}

function stopTimer(){
    clearInterval(timerInt);
}
function updateTimer(){
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    document.getElementById("timer").textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}