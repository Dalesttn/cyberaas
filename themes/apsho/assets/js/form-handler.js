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
        $("#question").hide();
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
      "<li style='font-size:18px;'>Please reach out to us to verify if you are fully compliant with the PDPA..</li>" +
      "</ul>";

    //1
    if (arrayEquals(selections, a)) {
      email_text =
        "<h3 style='color:#D92E8A;font-size:25px;'>You are not compliant with the PDPA.</h3>" +
        "<ul>" +
        "<li style='font-size:18px;'><b>High risk</b> of data leakage and breaches as there is no personal data protection for your customers data at all.</li>" +
        "<li style='font-size:18px;'><b>High impact.</b> When a data breach occurs, you will face regulatory action from the PDPC, and suffer financial and reputational damage.</li>" +
        "</ul>";
    }
    //2
    if (arrayEquals(selections, b)) {
      email_text =
        "<h3 style='color:#D92E8A;font-size:25px;'>You are not compliant with the PDPA.</h3>" +
        "<ul>" +
        "<li style='font-size:18px;'><b>High risk</b> of data leakage and breaches as there is no personal data protection for your customers data at all.</li>" +
        "<li style='font-size:18px;'><b>High impact.</b> When a data breach occurs, you will face regulatory action from the PDPC, and suffer financial and reputational damage.</li>" +
        "</ul>";
    }
    //3
    if (arrayEquals(selections, c)) {
      email_text =
        "<h3 style='color:#D92E8A;font-size:25px;'>You are not compliant with the PDPA.</h3>" +
        "<ul>" +
        "<li style='font-size:18px;'><b>Medium Risk.</b> You have your basic cybersecurity hygiene covered, however, PDPA policies and processes are not in place and your staff are not educated in cyber awareness; humans are the weakest link.</li>" +
        "<li style='font-size:18px;'><b>High impact.</b> When a data breach occurs, you will face regulatory action from the PDPC, and suffer financial and reputational damage.</li>" +
        "</ul>";
    }
    //4
    if (arrayEquals(selections, d)) {
      email_text =
        "<h3 style='color:#D92E8A;font-size:25px;'>You are not compliant with the PDPA.</h3>" +
        "<ul>" +
        "<li style='font-size:18px;'><b>Medium Risk.</b> You have your basic cybersecurity hygiene covered, however, PDPA policies and processes are not in place and your staff are not educated in cyber awareness; humans are the weakest link.</li>" +
        "<li style='font-size:18px;'><b>High impact.</b> When a data breach occurs, you will face regulatory action from the PDPC, and suffer financial and reputational damage.</li>" +
        "</ul>";
    }
    //5
    if (arrayEquals(selections, e)) {
      email_text =
        "<h3 style='color:#D92E8A;font-size:25px;'>Your organisation and customers are safe.</h3>" +
        "<ul>" +
        "<li style='font-size:18px;'>Please reach out to us to verify if you are fully compliant with the PDPA..</li>" +
        "</ul>";
    }
    //6
    if (arrayEquals(selections, f)) {
      email_text =
        "<h3 style='color:red;font-size:25px;'>You are not compliant with the PDPA.</h3>" +
        "<ul>" +
        "<li style='font-size:18px;'><b>High risk</b> of a malware attack as there is no data protection at all. You are walking 'naked'. </li>" +
        "<li style='font-size:18px;'><b>High impact.</b>  The average downtime of a malware attack to SME is 7 days, provided if you have data backups. Your organisation is crippled as your day-to-day operations will be affected.</li>" +
        "</ul>";
    }
    //7
    if (arrayEquals(selections, g)) {
      email_text =
        "<h3 style='color:#D92E8A;font-size:25px;'>You are not compliant with the PDPA.</h3>" +
        "<ul>" +
        "<li style='font-size:18px;'><b>High risk</b> of a malware attack as there is no data protection at all. You are walking 'naked'. </li>" +
        "<li style='font-size:18px;'><b>High impact.</b>  The average downtime of a malware attack to SME is 7 days, provided if you have data backups. Your organisation is crippled as your day-to-day operations will be affected.</li>" +
        "</ul>";
    }
    //8
    if (arrayEquals(selections, h)) {
      email_text =
        "<h3 style='color:#D92E8A;font-size:25px;'>You are not compliant with the PDPA.</h3>" +
        "<ul>" +
        "<li style='font-size:18px;'><b>Medium Risk.</b> You have your basic cybersecurity hygiene covered, however, PDPA policies and processes are not in place and your staff are not educated in cyber awareness; humans are the weakest link.</li>" +
        "<li style='font-size:18px;'><b>High impact.</b> When a data breach occurs, you will face regulatory action from the PDPC, and suffer financial and reputational damage.</li>" +
        "</ul>";
    }
    //9
    if (arrayEquals(selections, j)) {
      email_text =
        "<h3 style='color:#D92E8A;font-size:25px;'>You are not compliant with the PDPA.</h3>" +
        "<ul>" +
        "<li style='font-size:18px;'><b>Low risk and low impact.</b> You have your basic cybersecurity hygiene covered, however, your PDPA policies and processes are not in place. </li>" +
        "</ul>";
    }
    //10
    if (arrayEquals(selections, k)) {
      email_text =
        "<h3 style='color:#D92E8A;font-size:25px;'>Your organisation and customers are safe.</h3>" +
        "<ul>" +
        "<li style='font-size:18px;'>Please reach out to us to verify if you are fully compliant with the PDPA..</li>" +
        "</ul>";
    }
    correct += "<h2 style='font-size:18px;'>Answers</h2>";
    for (var i = 0; i < selections.length; i++) {
      correct +=       
        "<div style='font-weight:800;font-size:18px;'>" +
        questions[i].question +
        "<br><span style='font-weight:300;'>Answer: " +
        questions[i].choices[selections[i]] +
        "</span>" +
        "</div>";
    }

    if (arrayEquals(selections, j)) {
      email_text =
        "<h3 style='color:#D92E8A;font-size:25px;'>Your organisation and customers are safe.</h3>" +
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
      "<h1>Thank you for taking the Assessment. Here are your results ...</h1>" +
      "<p style='font-size:19px;'>Assessment made by " +
      name.value +
      " " +
      email.value +
      "</p>" +
      "<h2>Details:</h2>" +
      email_text +
      correct +
      "<br><br>" +
      "<div><a style='font-size:18px;text-decoration:none;background-color: #da2e8a;color: #fff;padding: 10px 20px;border-radius:5px;text-transform: uppercase;' href='"+ baseUrl +"/contact' class='btn btn-sm btn-violate'>" +
      "Free Consult" +
      "</a></div>" +
      "</div>",
    }).then((message) => console.log(message));


  Email.send({
    SecureToken: "5d34dcfd-3bb5-47f0-999a-a72079a49458",
    To: email.value,
    From: "d.sutton@ignitesearch.com.au",
    Subject: "New PDPA Assessment",
    Body:
      "<div id='a3s'>" +
      "<div><img src='https://www.ignitesearch.com.au/wp-content/uploads/2022/12/header.jpg'/></div>" +
      "<h1>Thank you for taking the Assessment. Here are your results ...</h1>" +
      "<p style='font-size:19px;'>Assessment made by " +
      name.value +
      " " +
      email.value +
      "</p>" +
      "<h2>Details:</h2>" +
      email_text +
      correct +
      "<br><br>" +
      "<div><a style='font-size:18px;text-decoration:none;background-color: #da2e8a;color: #fff;padding: 10px 20px;border-radius:5px;text-transform: uppercase;' href='"+ baseUrl +"/contact' class='btn btn-sm btn-violate'>" +
      "Free Consult" +
      "</a></div>" +
      "</div>",
  }).then((message) => console.log(message));

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

function sendContact(e) {
    var getUrl = window.location;
    var baseUrl =
      getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split("/")[1];
    e.preventDefault();

    const name = document.querySelector("#c2name");
    const email = document.querySelector("#c2email");
    const phone = document.querySelector("#c2telephone");
    const cmessage = document.querySelector("#c2message");

    Email.send({
      SecureToken: "5d34dcfd-3bb5-47f0-999a-a72079a49458",
      To: "online@ignitesearch.com.au",
      From: "d.sutton@ignitesearch.com.au",
      Subject: "New Contact Entry",
      Body:
        "<div id='a3s'>" +
        "<div><img src='https://www.ignitesearch.com.au/wp-content/uploads/2022/12/header.jpg'/></div>" +
        "<h1>New Chat with us Entry from the Website</h1>" +
        "<h2>Details:</h2>" +
       "<b>Name:</b> " + name.value +
       "<br><b>Email:</b> " + email.value +
       "<br><b>Phone Number:</b> " + phone.value +
       "<br><b>Message:</b> <br>" + cmessage.value +
        "<br><br>" +
        "</div>",
      }).then((message) => console.log(message));

      $("#thank-you-2").show();
      $("#thank-you-3").show();
      document.getElementById("chat_form").reset();
}

function sendContactServices(e) {


  var getUrl = window.location;
  var baseUrl =
    getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split("/")[1];
  e.preventDefault();

  const name = document.querySelector("#cname");
  const email = document.querySelector("#cemail");
  const phone = document.querySelector("#ctelephone");
  const cmessage = document.querySelector("#cmessage");

  Email.send({
    SecureToken: "f973352e-5cc7-42a2-a752-e709f692356e",
    To: "online@ignitesearch.com.au",
    From: "info@cyberaas.com",
    Subject: "New Contact Entry",
    Body:
      "<div id='a3s'>" +
      "<div><img src='https://www.ignitesearch.com.au/wp-content/uploads/2022/12/header.jpg'/></div>" +
      "<h1>New Contact Entry from the Website</h1>" +
      "<h2>Details:</h2>" +
     "<b>Name:</b> " + name.value +
     "<br><b>Email:</b> " + email.value +
     "<br><b>Phone Number:</b> " + phone.value +
     "<br><b>Message:</b> <br>" + cmessage.value +
      "<br><br>" +
      "</div>",
    }).then((message) => alert(message));

    $("#thank-you-2").show();
    document.getElementById("chat_form_services").reset();
}

function sendContactPage(e) {

  var getUrl = window.location;
  var baseUrl =
    getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split("/")[1];
  e.preventDefault();

  const name = document.querySelector("#coname");
  const email = document.querySelector("#coemail");
  const phone = document.querySelector("#cophone");
  const business_name = document.querySelector("#cobusiness");
  const website = document.querySelector("#cowebsite");
  const cmessage = document.querySelector("#comessage");

  Email.send({
    SecureToken: "5d34dcfd-3bb5-47f0-999a-a72079a49458",
    To: "online@ignitesearch.com.au",
    From: "d.sutton@ignitesearch.com.au",
    Subject: "New Contact Entry from Contact us",
    Body:
      "<div id='a3s'>" +
      "<div><img src='https://www.ignitesearch.com.au/wp-content/uploads/2022/12/header.jpg'/></div>" +
      "<h1>New Contact Entry from the Website</h1>" +
      "<h2>Details:</h2>" +
     "<b>Name:</b> " + name.value +
     "<br><b>Email:</b> " + email.value +
     "<br><b>Phone Number:</b> " + phone.value +
     "<br><b>Business Name:</b> " + business_name.value +
     "<br><b>Website:</b> " + website.value +
     "<br><b>Message:</b> <br>" + cmessage.value +
      "<br><br>" +
      "</div>",
    }).then((message) => console.log(message));

    $("#thank-you-2").show();
    document.getElementById("contact_page").reset();
}

function subscribe(e) {

  var getUrl = window.location;
  var baseUrl =
    getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split("/")[1];
  e.preventDefault();


  const email = document.querySelector("#semail");


  Email.send({
    SecureToken: "5d34dcfd-3bb5-47f0-999a-a72079a49458",
    To: "online@ignitesearch.com.au",
    From: "d.sutton@ignitesearch.com.au",
    Subject: "New email Subscription",
    Body:
      "<div id='a3s'>" +
      "<div><img src='https://www.ignitesearch.com.au/wp-content/uploads/2022/12/header.jpg'/></div>" +
      "<h1>New Email Subscription</h1>" +
      "<h2>Details:</h2>" +
     "<br><b>Email:</b> " + email.value +
      "<br><br>" +
      "</div>",
    }).then((message) => alert(message));

    $("#thank-you-4").show();
    document.getElementById("subscribe_form").reset();
}



const form2 = document.querySelector("#chat_form");
if(form2 != null) {
  form2.addEventListener("submit", sendContact);
}

const form3 = document.querySelector("#chat_form_services");
if (form3 != null) {
  form3.addEventListener("submit", sendContactServices);
}

  const form4 = document.querySelector("#contact_page");
  if (form4 != null) {
   form4.addEventListener("submit", sendContactPage);
  }

const form = document.querySelector("#contact_form");
if (form != null) {
  form.addEventListener("submit", sendMsg);
}

const form5 = document.querySelector("#subscribe_form");
if (form5 != null) {
  form5.addEventListener("submit", subscribe);
}
