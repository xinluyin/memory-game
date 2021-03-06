const restartBtn = document.querySelector('.restart');
const movesCount = document.querySelector('.moves-count');
const movesTxt = document.querySelector('.moves-text');
const stars = document.querySelectorAll('.star');
const deck = document.querySelector('.deck');
const modal = document.querySelector('#simpleModal');
const modalCloseBtn = document.querySelector('.modal-close-btn');
const modalReplayBtn = document.querySelector('.modal-replay-btn');
const modalRating = document.querySelector('.modal-body .rating');
const modalMoves = document.querySelector('.modal-body .moves-count');

// timer
const timerHours = document.querySelector('#timer .hours');
const timerMins = document.querySelector('#timer .minutes');
const timerSeconds = document.querySelector('#timer .seconds');
const modalHours = document.querySelector('.modal-body .hours');
const modalMins = document.querySelector('.modal-body .mins');
const modalSeconds = document.querySelector('.modal-body .seconds');


const cards = [].slice.call(deck.children);

// List of opened cards
let openCards = [];

// Number of start
let rating = 3;

// Number of wrong moves
let moves = 0;

// Number of matches. Max is 8
let matches = 0;

// Total seconds elapsed since game start
let elapsedSeconds = 0;
let hour = 0;
let min = 0;
let sec = 0;

// Timer
let timer = undefined;

// Game status
let gameStarted = false;

// Add event listeners
// Click event listener attached to cards
deck.addEventListener('click', openCard);

// Click event listener attached to restart button
restartBtn.addEventListener('click', restartGame);

// Click event listener attached to x button to close modal
modalCloseBtn.addEventListener('click', closeModal);

// Click event listener attached to modal's replay button to restart the game
modalReplayBtn.addEventListener('click', restartGame);


// Open page, start new game
restartGame();


/* ----------- Main functions ----------- */

function openCard(event) {
    startTimer();

    let target=event.target;
    const parent=target.parentElement;
    if (parent.classList.contains('card')){
        target=parent;
    }

    if (!openCards.includes(target)){
        target.classList.add('open','show');
        openCards.push(target);
        checkMatch();
    }
}

function startTimer() {
    if (!gameStarted){
        gameStarted = true;
        timer = setInterval(setTime,1000);
    }
}

function stopTimer(){
    gameStarted = false;
    clearInterval(timer);
}

function setTime(){
    let remainderSeconds=++elapsedSeconds;
    hour=parseInt(remainderSeconds/3600);
    timerHours.textContent=stringifyTime(hour);
    remainderSeconds=remainderSeconds%360;
    min=parseInt(remainderSeconds/60);
    timerMins.textContent=stringifyTime(min);
    remainderSeconds=remainderSeconds%60;
    sec=remainderSeconds;
    timerSeconds.textContent=stringifyTime(sec);
}


function closeCard(card){
    setTimeout(() => {
        card.classList.remove('open', 'show');
    }, 500)
}

function matchCard(card){
    setTimeout(()=>{
        card.classList.add('match');
    },500)
}

function checkMatch(){
    const length=openCards.length;
    if(length===2){
        const last=openCards[1];
        const preLast=openCards[0];

        if (last.children[0].classList.toString() ===
            preLast.children[0].classList.toString()
        ){
            incrementMatches();
            matchCard(last);
            matchCard(preLast);
        }else{
            closeCard(last);
            closeCard(preLast);
        }
        incrementMove();
        openCards=[];
        checkGameWin();
    }
}

function incrementMove(){
    moves++;
    movesCount.textContent=String(moves);
    if (moves===1){
        movesTxt.textContent=' Move';
    }else{
        movesTxt.textContent=' Moves';
    }
    determineRating();
}

function determineRating(){
    if (moves===17){
        rating--;
        stars[2].classList.add('empty-star');
    }else if (moves===26){
        rating--;
        stars[1].classList.add('empty-star');
    }else if (moves === 34) {
        rating--;
        stars[0].classList.add('empty-star');
    }
}

function incrementMatches(){
    matches++;
}

function checkGameWin(){
    if (matches === 8){
        stopTimer();
        openModal();
    }
}

function restartGame(){
    closeModal();
    resetScore();
    resetDeck();
}

function resetScore(){
    // reset rating
    rating =3;
    stars.forEach(star => star.classList.remove('empty-star'));

    // reset moves
    moves=0;
    movesCount.textContent=moves;

    // reset matches
    matches=0;

    // reset time
    elapsedSeconds=0;
    hour=0;
    min=0;
    sec=0;
    timerHours.textContent='00';
    timerMins.textContent='00';
    timerSeconds.textContent='00';

    stopTimer();
}

function resetDeck() {
    openCards=[];
    let newCards=shuffle(cards);

    // remove classes
    newCards.forEach(card=>{
        card.classList.remove('open', 'show', 'match');
    });

    // remove all children in deck
    let child=deck.lastElementChild;
    while(child){
        deck.removeChild(child);
        child=deck.lastElementChild;
    }

    // add new children in deck
    newCards.forEach(element=>{deck.appendChild(element)});
}

function openModal(){
    modalHours.textContent = hour > 0 ? `${hour} hours, ` : '';
    modalMins.textContent = min > 0 ? `${min} minutes, ` : '';
    modalSeconds.textContent = `${sec} seconds`;
    modalMoves.textContent = `${moves} moves`;
    modalRating.textContent = rating;
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}


/* ----------- Helper functions ----------- */
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function stringifyTime(val) {
    var valString = val + '';
    return valString.length >= 2 ? `${val}` : `0${val}`;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
