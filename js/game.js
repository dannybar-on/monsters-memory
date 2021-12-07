// Define elements
var restartBtn = document.getElementById('restartBtn');
var cards = document.querySelectorAll('.card');
var usernameSpan = document.getElementById('usernameSpan');
var stopwatchSpan = document.getElementById('stopwatch');
var bestTime = document.getElementById('bestTime');
var gameBoard = document.getElementById('gameBoard');
var muteBtn = document.querySelector('.bi');

// Those are global variables, they stay alive and reflect the state of the game
var elPreviousCard = null;
var flippedCouplesCount = 0;
var isProcessing = false;
var startTime = false;
var hh = 0;
var mm = 0;
var ss = 0;
var isSoundMuted = false;

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var TOTAL_COUPLES_COUNT = 8;

// Load an audio file
var audioWin = new Audio('sound/win.mp3');
var audioWrong = new Audio('sound/wrong.mp3');
var audioRight = new Audio('sound/right.mp3');

// Check if a username is stored in localStorage
if (localStorage.getItem('username') === null) {
  var usernameInput = prompt('Enter your name!');

  if (usernameInput === '' || usernameInput === null) {
    localStorage.setItem(
      'username',
      `User${Math.floor(
        Math.random() * (Math.floor(99999) - Math.ceil(10000) + 1) + 10000
      )}`
    );
    usernameSpan.innerText = `Hello ${localStorage.getItem('username')}!`;
  } else {
    localStorage.setItem('username', usernameInput);
    usernameSpan.innerText = `Hello ${localStorage.getItem('username')}!`;
  }
} else {
  usernameSpan.innerText = `Hello ${localStorage.getItem('username')}!`;
}

if (localStorage.getItem('bestTimer') === null) {
  bestTime.innerText = `Best Time: N/A`;
} else {
  bestTime.innerText = `Best Time: ${localStorage.getItem('bestTimer')}`;
}

// This function is called to ask for the player name
function changeUser() {
  var usernameInput = prompt('Enter your name!');

  if (usernameInput === '' || usernameInput === null) {
    localStorage.setItem(
      'username',
      `User${Math.floor(
        Math.random() * (Math.floor(99999) - Math.ceil(10000) + 1) + 10000
      )}`
    );
    usernameSpan.innerText = `Hello ${localStorage.getItem('username')}!`;
  } else {
    localStorage.setItem('username', usernameInput);
    usernameSpan.innerText = `Hello ${localStorage.getItem('username')}!`;
  }
}
// This function is called whenever the user click a card
function cardClicked(elCard) {
  // If the user clicked an already flipped card - do nothing and return from the function
  if (elCard.classList.contains('flipped')) {
    return;
  }
  if (isProcessing) {
    return;
  }
  if (!startTime) {
    startTime = true;
    stopwatchFunc();
  }
  // Flip it
  elCard.classList.add('flipped');

  // This is a first card, only keep it in the global variable
  if (elPreviousCard === null) {
    elPreviousCard = elCard;
  } else {
    // get the data-card attribute's value from both cards
    var card1 = elPreviousCard.getAttribute('data-card');
    var card2 = elCard.getAttribute('data-card');
    isProcessing = true;
    // No match, schedule to flip them back in 1 second
    if (card1 !== card2) {
      setTimeout(function () {
        elCard.classList.remove('flipped');
        elPreviousCard.classList.remove('flipped');
        elPreviousCard = null;
        isProcessing = false;
      }, 1000);

      if (!isSoundMuted) {
        audioWrong.play();
      }
    } else {
      // Yes! a match!
      flippedCouplesCount++;
      elPreviousCard = null;
      isProcessing = false;
      // All cards flipped!
      if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
        if (!isSoundMuted) {
          audioWin.play();
        }
        restartBtn.classList.remove('hidden');
        startTime = false;

        if (localStorage.getItem('bestTimer') === null) {
          localStorage.setItem('bestTimer', `${hh}:${mm}:${ss}`);
        } else {
          var [sHH, sMM, sSS] = localStorage.getItem('bestTimer').split(':');
          var compareStored = sHH + sMM + sSS;
          var compareCurrent = hh + mm + ss;

          if (parseInt(compareCurrent) < parseInt(compareStored)) {
            localStorage.setItem('bestTimer', `${hh}:${mm}:${ss}`);
          }
        }

        bestTime.innerText = `Best Time: ${localStorage.getItem('bestTimer')}`;
      } else {
        if (!isSoundMuted) {
          audioRight.play();
        }
      }
    }
  }
}

function restartGame() {
  shuffleBoard();
  stopwatchSpan.innerText = `00:00:00`;
  ss = 0;
  mm = 0;
  hh = 0;
  elPreviousCard = null;
  flippedCouplesCount = 0;
  restartBtn.classList.add('hidden');
  for (var i = 0; i < cards.length; i++) {
    cards[i].classList.remove('flipped');
  }
}

function stopwatchFunc() {
  if (!startTime) return;

  ss = parseInt(ss);
  mm = parseInt(mm);
  hh = parseInt(hh);

  ss += 1;

  if (ss === 60) {
    ss = 0;
    mm += 1;
  }

  if (mm === 60) {
    ss = 0;
    mm = 0;
    hh += 1;
  }

  if (ss < 10 || ss === 0) {
    ss = '0' + ss;
  }

  if (mm < 10 || mm === 0) {
    mm = '0' + mm;
  }

  if (hh < 10 || hh === 0) {
    hh = '0' + hh;
  }

  stopwatchSpan.innerText = `${hh}:${mm}:${ss}`;
  setTimeout('stopwatchFunc()', 1000);
}

function shuffleBoard() {
  for (var i = gameBoard.children.length; i >= 0; i--) {
    gameBoard.appendChild(gameBoard.children[(Math.random() * i) | 0]);
  }
}

shuffleBoard();

// Toggle Sound Function
function toggleMute() {
  if (isSoundMuted) {
    isSoundMuted = false;
    muteBtn.classList.remove('bi-volume-mute-fill');
    muteBtn.classList.add('bi-volume-up-fill');
  } else {
    isSoundMuted = true;
    muteBtn.classList.add('bi-volume-mute-fill');
    muteBtn.classList.remove('bi-volume-up-fill');
  }
}
