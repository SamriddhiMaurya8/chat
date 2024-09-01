const welcomeContainer = document.querySelector('.welcome');
const welcomeClose = document.querySelector('.welcome__close');
const input = document.querySelector('.chatbox__message--input');
const sendbtn = document.querySelector('.chatbox__message--send');
const closebtn = document.querySelector('.chatbox__close');
const closedContainer = document.querySelector('.right-bottom');
const openedContainer = document.querySelector('.opened');





const messageChat = document.querySelector('.chatbox__conversation');




const aboutCities = (city) => {
    replies.forEach(item => {
        item.addEventListener('click', () => {
            const repliesContainer = document.querySelector('.botquestion__replies');
            repliesContainer.remove();
            
            
            const userPartElement = document.createElement('div'); 
            userPartElement.innerHTML = userPart;
            const userResponseElement = document.createElement('div'); 
            userResponseElement.innerHTML = userResponse(item.innerHTML);
            
    
            messageChat.append(userPartElement, userResponseElement);
            
            if (item.innerHTML === city) {
                const chatbotReplyElement = document.createElement('div'); 
                chatbotReplyElement.innerHTML = chatbotQuickreply();
                
           
                messageChat.append(chatbotReplyElement);
                
             
                
                replies = document.querySelectorAll('.botquestion__replies--text');
                repliesSamecity(replies, city);
            } else if (item.innerHTML === 'Other') {
                const chatbotReplyElement = document.createElement('div');
                chatbotReplyElement.innerHTML = chatbotQuickreply();
                
           
                messageChat.append(chatbotReplyElement);
                
                replies = document.querySelectorAll('.botquestion__replies--text');
                repliesEvent();
             
            }
        });
    });
};





const quickReplyevent = (res, city) => {
    res.forEach(item => {
        item.addEventListener('click', () => {
            handleQuickReply(item.innerHTML, city);
        });
    });
};



const handleQuickReply = (reply, city) => {
    const repliesContainer = document.querySelector('.botquestion__replies');
    repliesContainer.remove();

  
    const userPartElement = document.createElement('div');
    userPartElement.innerHTML = userPart;
    
    const userResponseElement = document.createElement('div'); 
    userResponseElement.innerHTML = userResponse(reply);
    
    const chatBotCaptionElement = document.createElement('div'); 
    chatBotCaptionElement.innerHTML = chatBotCaption;

    messageChat.append(userPartElement, userResponseElement, chatBotCaptionElement);

    if (reply === 'Yes') {
        showSameCityOptions(city);
    } else if (reply === 'No') {
        endConversation();
    }
};


const showSameCityOptions = (city) => {
    messageChat.innerHTML += chatbotSame(city);
    replies = document.querySelectorAll('.botquestion__replies--text');
    aboutCities(city);
};

const endConversation = () => {
    messageChat.innerHTML += botReplies('Thank You! 😊');
    messageChat.innerHTML += startAgain;
    const startbtn = document.querySelector('.start__btn');
    startbtn.addEventListener('click', resetChat);
};

const chatbotSame = (city) => {
    return `<div class="botquestion">
                <div class="botquestion__text">${city} or Any other City?</div>
                <div class="botquestion__replies">
                    <div class="botquestion__replies--text">${city}</div>
                    <div class="botquestion__replies--text">Other</div>
                </div>
            </div>`;
}

const startAgain = `<div class="start">
                        <button class="start__btn">Start chat again</button>
                    </div>`

let response;
let sendEvent;
let replies;


const chatbotQuickreply = () => {
    return `<div class="botquestion">
                <div class="botquestion__text">What information are you looking for?</div>
                <div class="botquestion__replies">
                    <div class="botquestion__replies--text">🕛Time</div>
                    <div class="botquestion__replies--text">🌡️Temperature</div>
                    <div class="botquestion__replies--text">⛅Weather Status</div>
                    <div class="botquestion__replies--text">🎐Wind Speed</div>
                </div>
            </div>`;
}



const getData = (city) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=c2cffe0e64b21fdafa28bf75b7f06b91`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Invalid city");
            }
            return response.json();
        })
        .then((data) => {
            const appendToChat = (content) => {
                const element = document.createElement('div'); 
                element.innerHTML = content;
                messageChat.append(element);
            };

            switch(response) {
                case '🕛Time':
                    input.value = "";
                    input.disabled = true;
                    fetch(`https://api.api-ninjas.com/v1/timezone?city=${city}`, {
                        headers: { "X-Api-Key": "0wDW2crPRdYXv3QTGZghzw==GDxhZ58rKwF5pDfs" },
                        contentType: "application/json",
                    })
                    .then(response => response.json())
                    .then(data => {
                        const time = new Date().toLocaleString("en-US", {
                            timeZone: data.timezone,
                            timeStyle: "medium",
                            hourCycle: "h24",
                        });
                       
                        appendToChat(botReplies(`${data.timezone} ${time}`));
                        appendToChat(chatbotMoredetails());

                        replies = document.querySelectorAll('.botquestion__replies--text');
                        quickReplyevent(replies, city);
                    });
                    break;
                case '🌡️Temperature':
                    appendToChat(botReplies(`${data.main.temp} °C`));
                    appendToChat(chatbotMoredetails());

                    input.value = "";
                    input.disabled = true;
                    replies = document.querySelectorAll('.botquestion__replies--text');
                    quickReplyevent(replies, city);
                    break;
                case '🎐Wind Speed':
                    appendToChat(botReplies(`${data.wind.speed} meter/sec`));
                    appendToChat(chatbotMoredetails());

                    input.value = "";
                    input.disabled = true;
                    replies = document.querySelectorAll('.botquestion__replies--text');
                    quickReplyevent(replies, city);
                    break;
                case '⛅Weather Status':
                    const status = data.weather[0].description;
                    appendToChat(botReplies(`${status.charAt(0).toUpperCase() + status.slice(1)}`));
                    appendToChat(chatbotMoredetails());

                    input.value = "";
                    input.disabled = true;
                    replies = document.querySelectorAll('.botquestion__replies--text');
                    quickReplyevent(replies, city);
                    break;
                default:
                    appendToChat(botReplies('Invalid response.'));
                    messageChat.scrollTo(0, messageChat.scrollHeight);
            }
        })
        .catch(error => {
            appendToChat(botReplies('Please enter a valid city name! '));
            messageChat.scrollTo(0, messageChat.scrollHeight);
            input.value = "";
            input.focus();
        });
};





const userPart = `<div class="userPart">
                        <div class="userPart__text"></div>
                    </div>`;

const chatBotCaption = `<div class="caption">
                        </div>`;

const userResponse = (res) => {
    return `<div class="userresponse">
                <div class="userresponse__text">${res}</div>
            </div>`
}

const botReplies = (res) => {
    return `<div class="botresponse">
                <div class="botresponse__text">${res}</div>
            </div>`
}



const sendCity = () => {
    let city = input.value;
    if(city!=""){
    messageChat.innerHTML += userPart;
    messageChat.innerHTML += userResponse(city);
    getData(city);
    }
}

sendbtn.addEventListener('click', () => {
    sendCity();
});


    
const repliesSamecity = (replies, city) => {
    replies.forEach(item => {
        item.addEventListener('click', () => {
            response = item.innerHTML;
            const reply = userResponse(item.innerHTML);
            messageChat.innerHTML += userPart;
            messageChat.innerHTML += reply;
            const repliesContainer = document.querySelector('.botquestion__replies');
            repliesContainer.remove();
           
            getData(city);
        })
    })
}

const resetChat = () => {
    while(messageChat.innerHTML)
    messageChat.removeChild(messageChat.firstChild);
    messageChat.innerHTML = chatBotCaption;
    messageChat.innerHTML += botReplies("Hi! I'm Mr. Chatbot , Nice to meet you! 👋");
    messageChat.innerHTML += chatbotQuickreply();
    replies = document.querySelectorAll('.botquestion__replies--text');
    repliesEvent();
}
const repliesEvent = () => {
    replies.forEach(item => {
        item.addEventListener('click', () => {
            response = item.innerHTML;
            const reply = userResponse(item.innerHTML);
            messageChat.innerHTML += userPart;
            messageChat.innerHTML += reply;
    
            messageChat.innerHTML += botReplies('Please enter your city name in the typing area! ');
            input.disabled = false;
            input.focus();
            const repliesContainer = document.querySelector('.botquestion__replies');
            repliesContainer.remove();
           
        })
    })
}
closebtn.addEventListener('click', () => {
    closedContainer.classList.remove('hideBtn');
    openedContainer.classList.remove('openBtn');
    resetChat();
})
welcomeClose.addEventListener('click', () => {
    welcomeContainer.classList.add('welcome-text');
})
const msgBox = document.querySelector('.img__container');

msgBox.addEventListener('click', () => {
    closedContainer.classList.add('hideBtn');
    openedContainer.classList.add('openBtn');
    resetChat();
})


resetChat();


const chatbotMoredetails = () => {
    return `<div class="botquestion">
                <div class="botquestion__text">looking for more information?</div>
                <div class="botquestion__replies">
                    <div class="botquestion__replies--text">Yes</div>
                    <div class="botquestion__replies--text">No</div>
                </div>
            </div>`;
}
