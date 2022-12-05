window.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("contact-form");
  var button = document.getElementById("contact-form-button");
  var status = document.getElementById("contact-form-status");

  function success() {
    form.reset();
    button.style = "display: none";
    status.innerHTML = "Thanks! Contact form is submitted successfully.";
  }

  function error() {
    status.innerHTML = "Oops! There was a problem.";
  }

  // handle the form submission event
  if (form != null) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var data = new FormData(form);
      ajax(form.method, form.action, data, success, error);
    });
  }
});

// helper function for sending an AJAX request

function ajax(method, url, data, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;
    if (xhr.status === 200) {
      success(xhr.response, xhr.responseType);
    } else {
      error(xhr.status, xhr.response, xhr.responseType);
    }
  };
  xhr.send(data);
}

function pdpa() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}

var score;
var result;
var correct;
var wrong;
var email_text;

// quiz
(function () {
  $("#client-info").hide();
  $("#thank-you").hide();
  var questions = [
    {
      question:
        "Is your org/business nature in FSI, Healthcare, Education, Recruitment, Logistics or Real Estate?",
      choices: ["No", "Yes"],
      correctAnswer: 1,
    },
    {
      question:
        "Do you know how to respond to a data breach properly/correctly?",
      choices: ["No", "Yes"],
      correctAnswer: 1,
    },
    {
      question: "Do you have a data loss prevention solution implemented?",
      choices: ["No", "Yes"],
      correctAnswer: 1,
    },
    {
      question: "Do you take cyber awareness training at least once a year?",
      choices: ["No", "Yes"],
      correctAnswer: 1,
    },
    {
      question:
        "Do all your users have Administrator rights to their workstations?",
      choices: ["No", "Yes"],
      correctAnswer: 1,
    },
  ];

  var questionCounter = 0; //Tracks question number
  var selections = []; //Array containing user choices
  var quiz = $("#quiz"); //Quiz div object
  $("#start").hide();

  // Display initial question
  displayNext();

  // Click handler for the 'next' button
  $("#next").on("click", function (e) {
    e.preventDefault();

    // Suspend click listener during fade animation
    if (quiz.is(":animated")) {
      return false;
    }
    choose();

    // If no user selection, progress is stopped
    if (isNaN(selections[questionCounter])) {
      alert("Please make a selection!");
    } else {
      questionCounter++;
      displayNext();
    }
  });

  // Click handler for the 'prev' button
  $("#prev").on("click", function (e) {
    e.preventDefault();

    if (quiz.is(":animated")) {
      return false;
    }
    choose();
    questionCounter--;
    displayNext();
  });

  // Click handler for the 'Start Over' button
  $("#start").on("click", function (e) {
    e.preventDefault();

    if (quiz.is(":animated")) {
      return false;
    }
    questionCounter = 0;
    selections = [];
    displayNext();
    $("#start").hide();
  });

  // Animates buttons on hover
  $(".button").on("mouseenter", function () {
    $(this).addClass("active");
  });
  $(".button").on("mouseleave", function () {
    $(this).removeClass("active");
  });

  // Creates and returns the div that contains the questions and
  // the answer selections
  function createQuestionElement(index) {
    var qElement = $("<div>", {
      id: "question",
    });

    var header = $("<h2>Question " + (index + 1) + ":</h2>");
    qElement.append(header);

    var question = $("<p>").append(questions[index].question);
    qElement.append(question);

    var radioButtons = createRadios(index);
    qElement.append(radioButtons);

    return qElement;
  }

  // Creates a list of the answer choices as radio inputs
  function createRadios(index) {
    var radioList = $("<ul class='quiz-radio'>");
    var item;
    var input = "";
    for (var i = 0; i < questions[index].choices.length; i++) {
      item = $("<li>");
      input = '<input type="radio" name="answer" value=' + i + " />";
      input += questions[index].choices[i];
      item.append(input);
      radioList.append(item);
    }
    return radioList;
  }

  // Reads the user selection and pushes the value to an array
  function choose() {
    selections[questionCounter] = +$('input[name="answer"]:checked').val();
  }

  // Displays next requested element
  function displayNext() {
    quiz.fadeOut(function () {
      $("#question").remove();

      if (questionCounter < questions.length) {
        var nextQuestion = createQuestionElement(questionCounter);
        quiz.append(nextQuestion).fadeIn();
        if (!isNaN(selections[questionCounter])) {
          $("input[value=" + selections[questionCounter] + "]").prop(
            "checked",
            true
          );
        }

        // Controls display of 'prev' button
        if (questionCounter === 1) {
          $("#prev").show();
        } else if (questionCounter === 0) {
          $("#prev").hide();
          $("#next").show();
        }
      } else {
        var scoreElem = displayScore();
        quiz.append(scoreElem).fadeIn();
        $("#next").hide();
        $("#prev").hide();
        $("#start").hide();
      }
    });
  }

  // Computes score and returns a paragraph element to be displayed
  function displayScore() {
    score = $("<p>", { id: "question" });

    var numCorrect = 0;
    correct = "";
    wrong = "";
    console.log(selections);

    // match scenario matrix
    const a = [1, 0, 0, 0, 0]; // scenario 1
    const b = [1, 1, 0, 0, 0]; // scenario 2
    const c = [1, 1, 1, 0, 0]; // scenario 3
    const d = [1, 1, 1, 1, 0]; // scenario 4
    const e = [1, 1, 1, 1, 1]; // scenario 5
    const f = [0, 0, 0, 0, 0]; // scenario 6
    const g = [0, 1, 0, 0, 0]; // scenario 7
    const h = [0, 1, 1, 0, 0]; // scenario 8
    const j = [0, 1, 1, 1, 0]; // scenario 9
    const k = [0, 1, 1, 1, 1]; // scenario 10

    email_text =
      "<h3 style='color:orange;'>Not Enough data to make the assessment</h3>" +
      "<ul>" +
      "<li>Please reach out to us to verify if you are fully compliant with the PDPA..</li>" +
      "</ul>";

    //1
    if (arrayEquals(selections, a)) {
      email_text =
        "<h3 style='color:red;'>You are not compliant with the PDPA.</h3>" +
        "<ul>" +
        "<li><b>High risk</b> of data leakage and breaches as there is no personal data protection for your customers data at all.</li>" +
        "<li><b>High impact.</b> When a data breach occurs, you will face regulatory action from the PDPC, and suffer financial and reputational damage.</li>" +
        "</ul>";
    }
    //2
    if (arrayEquals(selections, b)) {
      email_text =
        "<h3 style='color:red;'>You are not compliant with the PDPA.</h3>" +
        "<ul>" +
        "<li><b>High risk</b> of data leakage and breaches as there is no personal data protection for your customers data at all.</li>" +
        "<li><b>High impact.</b> When a data breach occurs, you will face regulatory action from the PDPC, and suffer financial and reputational damage.</li>" +
        "</ul>";
    }
    //3
    if (arrayEquals(selections, c)) {
      email_text =
        "<h3 style='color:red;'>You are not compliant with the PDPA.</h3>" +
        "<ul>" +
        "<li><b>Medium Risk.</b> You have your basic cybersecurity hygiene covered, however, PDPA policies and processes are not in place and your staff are not educated in cyber awareness; humans are the weakest link.</li>" +
        "<li><b>High impact.</b> When a data breach occurs, you will face regulatory action from the PDPC, and suffer financial and reputational damage.</li>" +
        "</ul>";
    }
    //4
    if (arrayEquals(selections, d)) {
      email_text =
        "<h3 style='color:red;'>You are not compliant with the PDPA.</h3>" +
        "<ul>" +
        "<li><b>Medium Risk.</b> You have your basic cybersecurity hygiene covered, however, PDPA policies and processes are not in place and your staff are not educated in cyber awareness; humans are the weakest link.</li>" +
        "<li><b>High impact.</b> When a data breach occurs, you will face regulatory action from the PDPC, and suffer financial and reputational damage.</li>" +
        "</ul>";
    }
    //5
    if (arrayEquals(selections, e)) {
      email_text =
        "<h3 style='color:green;'>Your organisation and customers are safe.</h3>" +
        "<ul>" +
        "<li>Please reach out to us to verify if you are fully compliant with the PDPA..</li>" +
        "</ul>";
    }
    //6
    if (arrayEquals(selections, f)) {
      email_text =
        "<h3 style='color:red;'>You are not compliant with the PDPA.</h3>" +
        "<ul>" +
        "<li><b>High risk</b> of a malware attack as there is no data protection at all. You are walking 'naked'. </li>" +
        "<li><b>High impact.</b>  The average downtime of a malware attack to SME is 7 days, provided if you have data backups. Your organisation is crippled as your day-to-day operations will be affected.</li>" +
        "</ul>";
    }
    //7
    if (arrayEquals(selections, g)) {
      email_text =
        "<h3 style='color:red;'>You are not compliant with the PDPA.</h3>" +
        "<ul>" +
        "<li><b>High risk</b> of a malware attack as there is no data protection at all. You are walking 'naked'. </li>" +
        "<li><b>High impact.</b>  The average downtime of a malware attack to SME is 7 days, provided if you have data backups. Your organisation is crippled as your day-to-day operations will be affected.</li>" +
        "</ul>";
    }
    //8
    if (arrayEquals(selections, h)) {
      email_text =
        "<h3 style='color:red;'>You are not compliant with the PDPA.</h3>" +
        "<ul>" +
        "<li><b>Medium Risk.</b> You have your basic cybersecurity hygiene covered, however, PDPA policies and processes are not in place and your staff are not educated in cyber awareness; humans are the weakest link.</li>" +
        "<li><b>High impact.</b> When a data breach occurs, you will face regulatory action from the PDPC, and suffer financial and reputational damage.</li>" +
        "</ul>";
    }
    //9
    if (arrayEquals(selections, j)) {
      email_text =
        "<h3 style='color:red;'>You are not compliant with the PDPA.</h3>" +
        "<ul>" +
        "<li><b>Low risk and low impact.</b> You have your basic cybersecurity hygiene covered, however, your PDPA policies and processes are not in place. </li>" +
        "</ul>";
    }
    //10
    if (arrayEquals(selections, k)) {
      email_text =
        "<h3 style='color:green;'>Your organisation and customers are safe.</h3>" +
        "<ul>" +
        "<li>Please reach out to us to verify if you are fully compliant with the PDPA..</li>" +
        "</ul>";
    }

    for (var i = 0; i < selections.length; i++) {
      correct +=
        "<p>" +
        questions[i].question +
        "Answer: " +
        questions[i].choices[selections[i]] +
        "</p>";
    }

    if (arrayEquals(selections, j)) {
      email_text =
        "<h3 style='color:green;'>Your organisation and customers are safe.</h3>" +
        "<ul>" +
        "<li>Please reach out to us to verify if you are fully compliant with the PDPA..</li>" +
        "</ul>";
    }

    console.log(correct);

    $("#client-info").show();

    return score;
  }
})();

function sendMsg(e) {
  var getUrl = window.location;
  var baseUrl =
    getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split("/")[1];
  e.preventDefault();

  const name = document.querySelector("#name");
  const email = document.querySelector("#email");

  Email.send({
    SecureToken: "5d34dcfd-3bb5-47f0-999a-a72079a49458",
    To: "online@ignitesearch.com.au",
    From: "d.sutton@ignitesearch.com.au",
    Subject: "New PDPA Assessment",
    Body:
      "<div id='a3s'>" +
      "<div><img src='https://www.ignitesearch.com.au/wp-content/uploads/2022/12/header.jpg'/></div>" +
      "<h1>You have a new entry for an Assessment</h1>" +
      "<h4>Assessment made by " +
      name.value +
      " " +
      email.value +
      "</h4>" +
      "<h2>Answers</h2>" +
      email_text +
      "</div>",
  }).then((message) => alert(message));

  Email.send({
    SecureToken: "5d34dcfd-3bb5-47f0-999a-a72079a49458",
    To: email.value,
    From: "d.sutton@ignitesearch.com.au",
    Subject: "New PDPA Assessment",
    Html:
      "<div id='a3s'>" +
      "<div><img src='https://www.ignitesearch.com.au/wp-content/uploads/2022/12/header.jpg'/></div>" +
      "<h1>You have a new entry for an Assessment</h1>" +
      "<h4>Assessment made by " +
      name.value +
      " " +
      email.value +
      "</h4>" +
      "<h2>Answers</h2>" +
      email_text +
      "</div>",
  }).then((message) => alert(message));

  $("#client-info").hide();
  $("#thank-you").show();
}

function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

const form = document.querySelector("#contact_form");
form.addEventListener("submit", sendMsg);
