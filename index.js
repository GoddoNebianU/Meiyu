let xhr = new XMLHttpRequest();
xhr.open("GET", "./meiyu.json");
xhr.send();

let meiyu;
xhr.onload = function () {
    meiyu = JSON.parse(xhr.responseText);
}

const states = {
    "NEW": 0,
    "REVEALED": 1,
}

let state, meiyuinfo, nowItem;

function next (ua) {
    if (["A", "B", "C", "D"].includes(ua)) {
        if (ua === nowItem["answer"]) {
            M.toast({html: "Correct!"});
            next();
        } else {
            M.toast({
                html: "Incorrect! Answer: " + nowItem["options"][{
                    "A": 0,
                    "B": 1,
                    "C": 2,
                    "D": 3
                }[nowItem['answer']]]
            });
        }
    } else {
        renewItem();
    }
}

function renewItem () {
    nowItem = meiyu[Math.floor(Math.random() * meiyu.length)];
    meiyuinfo.innerText = nowItem["question"];
    options[0].innerText = nowItem["options"][0].toString();
    options[1].innerText = nowItem["options"][1].toString();
    options[2].innerText = nowItem["options"][2].toString();
    options[3].innerText = nowItem["options"][3].toString();
}

let options;
function init () {
    state = states.NEW;
    meiyuinfo = document.getElementById("meiyuinfo");
    options = $(".option");

    renewItem();
}

window.onload = init;

addEventListener("keypress", function (event) {
    switch (event.key) {
        case "1": options[0].click(); break;
        case "2": options[1].click(); break;
        case "3": options[2].click(); break;
        case "4": options[3].click(); break;
    }
})