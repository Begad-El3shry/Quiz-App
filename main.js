let countBullets = document.querySelector(".count span");
let bullets = document.querySelector(".bullets .spans");
let bulletsCountainer = document.querySelector(".spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown"); 


let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval; 

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObj = JSON.parse(this.responseText);
      let qCount = questionsObj.length;
      createBullets(qCount);

      // get question
      addQuestionData(questionsObj[currentIndex], qCount);

      countdown(150, qCount);

      submitButton.onclick = () => {
        let theRightAnswer = questionsObj[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(theRightAnswer, qCount);

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // get next question
        addQuestionData(questionsObj[currentIndex], qCount);
        handleBullets();

        clearInterval(countdownInterval);
        countdown(150, qCount);

        showResults(qCount);
      };
    }
  };

  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  countBullets.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let theBullets = document.createElement("span");
    if (i === 0) {
      theBullets.className = "on";
    }
    bulletsCountainer.appendChild(theBullets);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj.title);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);

    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      let radioInput = document.createElement("input");
      radioInput.name = "questions";
      radioInput.type = "radio";
      radioInput.id = `answer-${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        radioInput.checked = true;
      }

      let thelabel = document.createElement("label");
      thelabel.htmlFor = `answer-${i}`;

      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      thelabel.appendChild(theLabelText);

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(thelabel);

      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("questions");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    countdownElement.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, You Answered ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
      theResults = `<span class="bad">Bad</span>, You Answered ${rightAnswers} From ${count}`;
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}

function countdown(duration, count) {
    if (currentIndex < count) {
      let minutes, seconds;
      countdownInterval = setInterval(function () {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);
  
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
  
        countdownElement.innerHTML = `${minutes}:${seconds}`;
  
        if (--duration < 0) {
          clearInterval(countdownInterval);
          submitButton.click();
        }
      }, 1000);
    }
}
