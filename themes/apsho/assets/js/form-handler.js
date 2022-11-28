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

// quiz
(function () {
  var questions = [
    {
      question: "What is 2*5?",
      choices: [2, 5, 10, 15, 20],
      correctAnswer: 2,
    },
    {
      question: "What is 3*6?",
      choices: [3, 6, 9, 12, 18],
      correctAnswer: 4,
    },
    {
      question: "What is 8*9?",
      choices: [72, 99, 108, 134, 156],
      correctAnswer: 0,
    },
    {
      question: "What is 1*7?",
      choices: [4, 5, 6, 7, 8],
      correctAnswer: 3,
    },
    {
      question: "What is 8*8?",
      choices: [20, 30, 40, 50, 64],
      correctAnswer: 4,
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
    var score = $("<p>", { id: "question" });

    var numCorrect = 0;
    for (var i = 0; i < selections.length; i++) {
      if (selections[i] === questions[i].correctAnswer) {
        numCorrect++;
      }
    }

    score.append(
      "You got " +
        numCorrect +
        " questions out of " +
        questions.length +
        " right!!!"
    );

    // score.append(
    //   '<form id="javascript_form" method="post" id="email_form>' +
    //     '<input type="text" name="subject" placeholder="Subject" /><input type="hidden" name="access_token" value="99r09rq7pbb3wy5cqm1g1vm4" />' +
    //     '<textarea name="text" placeholder="Message"></textarea>' +
    //     '<input type="submit" id="js_send" value="Send" />' +
    //     "</form>"
    // );

    Email.send({
      SecureToken: "aae6f389-297c-4be3-b9f6-f80403a22bcd",
      To: "d.sutton@ignitesearch.com.au",
      From: "d.sutton@ignitesearch.com.au",
      Subject: "This is the subject",
      Body: "And this is the body",
    }).then((message) => alert(message));

    return score;
  }
})();
