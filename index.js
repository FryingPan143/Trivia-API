//knapp med eventlyssnare
let startButton = document.getElementById('start-game-btn');
startButton.addEventListener('click', startGame);

let gameArea = document.querySelector('.game-area');
let mainBox = document.getElementById("mainBox");
mainBox.style.display = "none";

let checkedAlternatives = document.getElementById("chosen-categories"); //visar de kategorier man valt

let answerSheet = document.getElementById("answer-sheet"); //visar facit
answerSheet.style.display = "none";

let chosenDifficulty = '';
let chosenAmount = 10;
let chosenCategory = '';
let currentQuestionIndex = 0;
let questions = [];
let score = 0;


function applySettings() {
    //svårighetsgrad
    let diffDropDown = document.getElementById('difficulty');
    chosenDifficulty = diffDropDown.value;

    //inställning på om hur många frågar
    let amountDropDown = document.getElementById('amount');
    chosenAmount = amountDropDown.value;

    //kategori
    let categoryDropDown = document.getElementById('category');
    chosenCategory = categoryDropDown.value;

    //typ på fråga, antingen true/false eller 4-val


}

async function startGame() {
    mainBox.style.display = "block";

    //dölja inställningarna
    document.querySelector('.settings').style.display = 'none';
    //på klick skall första frågan genereras
    //kallar på funktionen som uppdaterar våra inställningar
    applySettings();
    //uppdaterar vår url med våra inställningar
    let URL = `https://opentdb.com/api.php?amount=${chosenAmount}&category=${chosenCategory}&difficulty=${chosenDifficulty}`;
    console.log(URL);
    //kör en liten fetch på nya url'en
    let response = await fetch(URL);
    let data = await response.json();

    questions = await data.results;
    console.log(questions[0].category);

    createCheckedAlts(questions[0].category, chosenDifficulty, chosenAmount);

    generateUI();
}

//generera UI för frågorna
function generateUI() {
    //Vi får frågorna som en lista
    //En lista kan vi loopa igenom

    let questionElement = document.createElement('h3');
    questionElement.innerHTML = questions[currentQuestionIndex].question;

    gameArea.appendChild(questionElement);
    console.log(questions);

    generateAlternatives(questions[currentQuestionIndex].incorrect_answers, questions[currentQuestionIndex].correct_answer);
    displayQuestionIndex(); //visar vilken fråga man är på nu.

}

function displayQuestionIndex() {
    //skapar en indexare för frågorna
    let currQuest = document.createElement("h4");
    currQuest.classList.add("curr-quest");
    currQuest.innerHTML = `Question ${currentQuestionIndex + 1} of ${chosenAmount}`;

    gameArea.appendChild(currQuest);
}

function generateAlternatives(incorrectAnswers, correctAnswer) {
    let answers = incorrectAnswers;
    let randomIndex = Math.floor(Math.random() * incorrectAnswers.length);
    answers.splice(randomIndex, 0, correctAnswer);

    console.log(answers);
    answers.forEach(answer => {
        let answerElement = document.createElement("button");
        answerElement.classList.add("answer-element", "btn");
        answerElement.setAttribute("id", answer);
        answerElement.innerHTML = answer;
        answerElement.addEventListener("click", function () {
            checkAnswer(answer);

        });

        gameArea.appendChild(answerElement);
    });


}

function checkAnswer(answer) {
    console.log(currentQuestionIndex);
    gameArea.innerHTML = "";
    let corrAnsw = questions[currentQuestionIndex].correct_answer;

    displayAnswerSheet(answer, corrAnsw, questions[currentQuestionIndex].question); //skickar med det valda svaret och det korrekta svaret för jämförelsen i slutet. 

    if (answer == corrAnsw) {
        score++;
    }

    //om vi spelat färdigt alla frågor
    if (currentQuestionIndex == chosenAmount - 1) {
        let winBox = document.createElement("div");
        winBox.classList.add("winbox");

        let winboxMsg = document.createElement("h2");
        winboxMsg.classList.add("win-msg");
        winboxMsg.innerHTML = `Your Score is ${score} of ${chosenAmount}`;

        let playAgainBtn = document.createElement("button");
        playAgainBtn.classList.add("play-again-btn", "btn");
        playAgainBtn.innerHTML = "Play Again";

        playAgainBtn.addEventListener("click", function () {
            window.location.reload();
        })

        winBox.appendChild(winboxMsg);
        winBox.appendChild(playAgainBtn);
        gameArea.appendChild(winBox);



    } else {
        //om vi INTE spelat färdigt alla frågor
        currentQuestionIndex++;
        generateUI();
    }




}

function createCheckedAlts(category, diff, amount) {
    let chosenAlts = document.createElement("p");
    chosenAlts.classList.add("chosen-alts");
    if (diff == "") {
        diff = "random";
    }
    chosenAlts.innerHTML = `<h3> ${category}</h3> Difficulty: <i class="chosen-i"> ${diff}</i> - ${amount} Questions.`;

    checkedAlternatives.appendChild(chosenAlts);

}

function displayAnswerSheet(answer, correct, quest) {
    //skapar en lista på det man svarat
    let answerLine = document.createElement("p");
    answerLine.classList.add("answer-line");

    let questLine = document.createElement("p");
    questLine.classList.add("quest-line");


    if (answer == correct) {
        questLine.innerHTML = quest;
        answerLine.innerHTML = `You answered <i class="correct-a">${answer}</i> and it was correct!`;
        answerSheet.appendChild(questLine);
        answerSheet.appendChild(answerLine);
    } else {
        questLine.innerHTML = quest;
        answerLine.innerHTML = `You answered <i class="wrong-a">${answer}.</i> The correct answer was: <i class="was-a">${correct}</i>`;
        answerSheet.appendChild(questLine);
        answerSheet.appendChild(answerLine);
    }


    if (currentQuestionIndex == chosenAmount - 1) {
        answerSheet.style.display = "block";
    }

}
//tidsaspekt