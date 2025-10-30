// add javascript here
let level, answer, score;
const levelArr = document.getElementsByName("level"); 
const scoreArr = [];
date.textContent = time();

playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);

function play(){
    score = 0;
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guess.disabled = false;
    for(let i=0; i<levelArr.length; i++){
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
        levelArr[i].disabled = true;
    } 
    msg.textContent = "Guess a number from 1-"+level;
    answer = Math.floor(Math.random()*level)+1;
    guess.placeholder = answer;
}

function makeGuess(){
    let userGuess = parseInt(guess.value); 
    if(isNaN(userGuess)|| userGuess<1 || userGuess>level){
        msg.textContent = "Enter a Valid #1-" + level;
        return;
    }
    score++;
    if(userGuess==answer){
        if(score==1){
            msg.textContent = "Wow, you got it on your first attempt. Press play to play again";
            updateScore();
            reset();
        }
        else{
            msg.textContent = "You are right! It took you " + score + " attempts. Press play to play again";
            updateScore();
            reset();
        }
    }
    else if(userGuess > answer){
        msg.textContent = "To high! Try again."
        score++;
    }
    else if(userGuess < answer){
        msg.textContent = "To low! Try again."
        score++;
    }
}

function reset(){
    guessBtn.disabled = true;
    guess.disabled = true;
    guess.value = "";
    guess.placeholder = "";
    playBtn.disabled = false;
    for(let i=0; i<levelArr.length; i++){
        levelArr[i].disabled = false;
    } 
}

function updateScore(){
    scoreArr.push(score);
    scoreArr.sort((a,b) =>a-b);
    let lb = document.getElementsByName("leaderboard");
    wins.textContent = "Total wins:" + scoreArr.length;
    let sum = 0;
    for(let i=0; i<scoreArr; i++){
        sum+= scoreArr[i];
        if(i<lb.length){
            lb[i].textContent = scoreArr[i];
        }
    }
    let avg = sum/scoreArr.length;
    avgScore.textContent = "Average Score: " + avg.toFixed(2);
}

function time(){
    let d = new Date();
    return d;
}