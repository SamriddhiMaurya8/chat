"use strict";

var welcomeContainer = document.querySelector(".welcome");
var welcomeClose = document.querySelector(".welcome__close");
var input = document.querySelector(".chatbox__message--input");
var sendbtn = document.querySelector(".chatbox__message--send");
var closebtn = document.querySelector(".chatbox__close");
var closedContainer = document.querySelector(".right-bottom");
var openedContainer = document.querySelector(".opened");
var messageChat = document.querySelector(".chatbox__conversation");

var aboutCities = function aboutCities(city) {
  replies.forEach(function (item) {
    item.addEventListener("click", function () {
      var repliesContainer = document.querySelector(".botquestion__replies");
      repliesContainer.remove();
      var userPartElement = document.createElement("div");
      userPartElement.innerHTML = userPart;
      var userResponseElement = document.createElement("div");
      userResponseElement.innerHTML = userResponse(item.innerHTML);
      messageChat.append(userPartElement, userResponseElement);

      if (item.innerHTML === city) {
        var chatbotReplyElement = document.createElement("div");
        chatbotReplyElement.innerHTML = chatbotQuickreply();
        messageChat.append(chatbotReplyElement);
        replies = document.querySelectorAll(".botquestion__replies--text");
        repliesSamecity(replies, city);
      } else if (item.innerHTML === "Other") {
        var _chatbotReplyElement = document.createElement("div");

        _chatbotReplyElement.innerHTML = chatbotQuickreply();
        messageChat.append(_chatbotReplyElement);
        replies = document.querySelectorAll(".botquestion__replies--text");
        repliesEvent();
      }
    });
  });
};

var quickReplyevent = function quickReplyevent(res, city) {
  res.forEach(function (item) {
    item.addEventListener("click", function () {
      handleQuickReply(item.innerHTML, city);
    });
  });
};

var handleQuickReply = function handleQuickReply(reply, city) {
  var repliesContainer = document.querySelector(".botquestion__replies");
  repliesContainer.remove();
  var userPartElement = document.createElement("div");
  userPartElement.innerHTML = userPart;
  var userResponseElement = document.createElement("div");
  userResponseElement.innerHTML = userResponse(reply);
  var chatBotAnswerssElement = document.createElement("div");
  chatBotAnswerssElement.innerHTML = chatBotAnswerss;
  messageChat.append(userPartElement, userResponseElement, chatBotAnswerssElement);

  if (reply === "Yes") {
    showSameCityOptions(city);
  } else if (reply === "No") {
    endConversation();
  }
};

var showSameCityOptions = function showSameCityOptions(city) {
  messageChat.innerHTML += chatbotSame(city);
  replies = document.querySelectorAll(".botquestion__replies--text");
  aboutCities(city);
};

var endConversation = function endConversation() {
  var thankYouMessage = document.createElement("div");
  thankYouMessage.innerHTML = botReplies("Thank You! 😊");
  var startAgainElement = document.createElement("div");
  startAgainElement.innerHTML = startAgain;
  messageChat.append(thankYouMessage, startAgainElement);
  var startbtn = document.querySelector(".start__btn");
  startbtn.addEventListener("click", resetChat);
};

var chatbotSame = function chatbotSame(city) {
  return "<div class=\"botquestion\">\n                <div class=\"botquestion__text\">".concat(city, " or Any other City?</div>\n                <div class=\"botquestion__replies\">\n                    <div class=\"botquestion__replies--text\">").concat(city, "</div>\n                    <div class=\"botquestion__replies--text\">Other</div>\n                </div>\n            </div>");
};

var startAgain = "<div class=\"start\">\n                        <button class=\"start__btn\">Start chat again</button>\n                    </div>";
var response;
var sendEvent;
var replies;

var chatbotQuickreply = function chatbotQuickreply() {
  return "<div class=\"botquestion\">\n                <div class=\"botquestion__text\">What information are you looking for?</div>\n                <div class=\"botquestion__replies\">\n                <div class=\"botquestion__replies--text\">\uD83C\uDF21\uFE0FTemperature</div>\n                    <div class=\"botquestion__replies--text\">\uD83D\uDD5BTime</div>\n                    <div class=\"botquestion__replies--text\">\uD83C\uDF90Wind Speed</div>\n                    <div class=\"botquestion__replies--text\">\u26C5Weather Status</div>\n                </div>\n            </div>";
};

var getData = function getData(city) {
  fetch("https://api.openweathermap.org/data/2.5/weather?q=".concat(city, "&units=metric&appid=c2cffe0e64b21fdafa28bf75b7f06b91")).then(function (response) {
    if (!response.ok) {
      throw new Error("Invalid city");
    }

    return response.json();
  }).then(function (data) {
    var appendToChat = function appendToChat(content) {
      var element = document.createElement("div");
      element.innerHTML = content;
      messageChat.append(element);
      messageChat.scrollTo(0, messageChat.scrollHeight);
    };

    if (response === "🕛Time") {
      input.value = "";
      input.disabled = true;
      fetch("https://api.api-ninjas.com/v1/timezone?city=".concat(city), {
        headers: {
          "X-Api-Key": "0wDW2crPRdYXv3QTGZghzw==GDxhZ58rKwF5pDfs"
        },
        contentType: "application/json"
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        var time = new Date();
        appendToChat(botReplies("".concat(time)));
        appendToChat(chatbotMoredetails());
        replies = document.querySelectorAll(".botquestion__replies--text");
        quickReplyevent(replies, city);
      });
    } else if (response === "🌡️Temperature") {
      appendToChat(botReplies("".concat(data.main.temp, " \xB0C")));
      appendToChat(chatbotMoredetails());
      input.value = "";
      input.disabled = true;
      replies = document.querySelectorAll(".botquestion__replies--text");
      quickReplyevent(replies, city);
    } else if (response === "🎐Wind Speed") {
      appendToChat(botReplies("".concat(data.wind.speed, " meter/sec")));
      appendToChat(chatbotMoredetails());
      input.value = "";
      input.disabled = true;
      replies = document.querySelectorAll(".botquestion__replies--text");
      quickReplyevent(replies, city);
    } else if (response === "⛅Weather Status") {
      var status = data.weather[0].description;
      appendToChat(botReplies("".concat(status.charAt(0).toUpperCase() + status.slice(1))));
      appendToChat(chatbotMoredetails());
      input.value = "";
      input.disabled = true;
      replies = document.querySelectorAll(".botquestion__replies--text");
      quickReplyevent(replies, city);
    } else {
      appendToChat(botReplies("Invalid response."));
      messageChat.scrollTo(0, messageChat.scrollHeight);
    }
  })["catch"](function (error) {
    var appendToChat = function appendToChat(content) {
      var element = document.createElement("div");
      element.innerHTML = content;
      messageChat.append(element);
    };

    appendToChat(botReplies("Please enter a valid city name!"));
    messageChat.scrollTo(0, messageChat.scrollHeight);
    input.value = "";
    input.focus();
  });
};

var userPart = "<div class=\"userPart\">\n\n                        <div class=\"userPart__text\"></div>\n                    </div>";
var chatBotAnswerss = "<div class=\"answer\">\n                        </div>";

var userResponse = function userResponse(res) {
  return "<div class=\"userresponse\">\n                  <div class=\"userresponse__label\">User</div> \n                <div class=\"userresponse__text\">".concat(res, "</div>\n            </div>");
};

var botReplies = function botReplies(res) {
  return "<div class=\"botresponse\">\n    <div class=\"botresponse__label\">\n    <img src='./Assets/chat-icon.png' />Chatbot</div> \n    <div class=\"botresponse__text\">".concat(res, "</div>\n        </div>");
};

var sendCity = function sendCity() {
  var city = input.value;

  if (city !== "") {
    var userPartElement = document.createElement("div");
    userPartElement.className = "user-part";
    userPartElement.innerHTML = userPart;
    var userResponseElement = document.createElement("div");
    userResponseElement.className = "user-response";
    userResponseElement.innerHTML = userResponse(city);
    messageChat.append(userPartElement, userResponseElement);
    getData(city);
  }
};

sendbtn.addEventListener("click", function () {
  sendCity();
});

var repliesSamecity = function repliesSamecity(replies, city) {
  replies.forEach(function (item) {
    item.addEventListener("click", function () {
      response = item.innerHTML;
      var userPartElement = document.createElement("div");
      userPartElement.innerHTML = userPart;
      var replyElement = document.createElement("div");
      replyElement.innerHTML = userResponse(item.innerHTML);
      messageChat.appendChild(userPartElement);
      messageChat.appendChild(replyElement);
      var repliesContainer = document.querySelector(".botquestion__replies");

      if (repliesContainer) {
        repliesContainer.remove();
      }

      getData(city);
    });
  });
};

var resetChat = function resetChat() {
  while (messageChat.firstChild) {
    messageChat.removeChild(messageChat.firstChild);
  }

  var answerDiv = document.createElement("div");
  answerDiv.innerHTML = chatBotAnswerss;
  messageChat.append(answerDiv);
  var botReplyDiv = document.createElement("div");
  botReplyDiv.innerHTML = botReplies("Hi! I'm Mr. Chatbot 😎, Nice to meet you! 👋");
  messageChat.append(botReplyDiv);
  var quickReplyDiv = document.createElement("div");
  quickReplyDiv.innerHTML = chatbotQuickreply();
  messageChat.append(quickReplyDiv);
  replies = document.querySelectorAll(".botquestion__replies--text");
  repliesEvent();
};

var repliesEvent = function repliesEvent() {
  replies.forEach(function (item) {
    item.addEventListener("click", function () {
      response = item.innerHTML;
      var userPartElement = document.createElement("div");
      userPartElement.className = "user-part";
      userPartElement.innerHTML = userPart;
      var replyElement = document.createElement("div");
      replyElement.className = "user-response";
      replyElement.innerHTML = userResponse(item.innerHTML);
      var botReplyElement = document.createElement("div");
      botReplyElement.className = "bot-reply";
      botReplyElement.innerHTML = botReplies("Please enter your city name in the typing area!");
      messageChat.append(userPartElement, replyElement, botReplyElement);
      input.disabled = false;
      input.focus();
      var repliesContainer = document.querySelector(".botquestion__replies");

      if (repliesContainer) {
        repliesContainer.remove();
      }
    });
  });
};

closebtn.addEventListener("click", function () {
  closedContainer.classList.remove("hideBtn");
  openedContainer.classList.remove("openBtn");
  resetChat();
});
welcomeClose.addEventListener("click", function () {
  // welcomeContainer.classList.add("welcome-text");
  welcomeContainer.style.display = "none";
});
var msgBox = document.querySelector(".img__container");
msgBox.addEventListener("click", function () {
  closedContainer.classList.add("hideBtn");
  openedContainer.classList.add("openBtn");
  resetChat();
});

var chatbotMoredetails = function chatbotMoredetails() {
  return "<div class=\"botquestion\">\n    <div class=\"botquestion__text\">looking for more information?</div>\n    <div class=\"botquestion__replies\">\n    <div class=\"botquestion__replies--text\">Yes</div>\n    <div class=\"botquestion__replies--text\">No</div>\n    </div>\n    </div>";
};

resetChat();