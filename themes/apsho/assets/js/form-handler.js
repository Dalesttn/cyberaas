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

// quiz
(function () {
  $("#client-info").hide();
  $("#thank-you").hide();
  var questions = [
    {
      question: "Are you in any of these industries?",
      choices: [
        "Financial Services",
        "Corporate Secretarial Services",
        "Accounting Services",
        "Healthcare",
        "Education",
        "Recruitment",
        "Logistics",
        "Real Estate",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "When there is a data breach, do you or your staff know how to respond correctly?",
      choices: ["Yes", "No"],
      correctAnswer: 1,
    },
    {
      question: "Do you have basic cybersecurity hygiene in place?",
      choices: [
        "Anti-virus",
        "Firewall",
        "User Access Controls",
        "Password Policy & Enforcement",
        "Regular Software Patching",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Do you and your staff receive PDPA and cyber awareness training at least once a year?",
      choices: ["Yes", "No"],
      correctAnswer: 1,
    },
    {
      question: "Do you have a data loss prevention solution in place?",
      choices: ["Yes", "No"],
      correctAnswer: 1,
    },
  ];

  var questionCounter = 0; //Tracks question number
  var selections = []; //Array containing user choices
  var quiz = $("#quiz"); //Quiz div object

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
    var radioList = $("<ul>");
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
        $("#start").show();
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
    for (var i = 0; i < selections.length; i++) {
      correct +=
        "<p>" +
        questions[i].question +
        "Answer: " +
        questions[i].choices[selections[i]] +
        "</p>";
    }

    console.log(correct);

    $("#client-info").show();

    return score;
  }
})();

function sendMsg(e) {
  e.preventDefault();

  const name = document.querySelector("#name");
  const email = document.querySelector("#email");

  Email.send({
    SecureToken: "5d34dcfd-3bb5-47f0-999a-a72079a49458",
    To: "online@ignitesearch.com.au",
    From: "d.sutton@ignitesearch.com.au",
    Subject: "New PDPA Assessment",
    Body:
      "<h1>You have a new entry for an Assessment</h1>" +
      "<h4>Assessment made by " +
      name.value +
      " " +
      email.value +
      "</h4>" +
      "<h2>Answers</h2>" +
      correct,
  }).then((message) => alert(message));

  Email.send({
    SecureToken: "5d34dcfd-3bb5-47f0-999a-a72079a49458",
    To: email.value,
    From: "d.sutton@ignitesearch.com.au",
    Subject: "New PDPA Assessment",
    Body:
      "<h1>Thank you for taking the Assessment, here are your results ...</h1>" +
      "<h4>Assessment made by " +
      name.value +
      " " +
      email.value +
      "</h4>" +
      "<h2>Answers</h2>" +
      correct,
  }).then((message) => alert(message));

  $("#client-info").hide();
  $("#thank-you").show();
}

const form = document.querySelector("#contact_form");
form.addEventListener("submit", sendMsg);
