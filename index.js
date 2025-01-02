const ANSWER_MAP = {
    "A": 0,
    "B": 1,
    "C": 2,
    "D": 3
};

const KEY_MAP = {
    "1": 0,
    "2": 1,
    "3": 2,
    "4": 3
};

class MeiYu {
    constructor () {
        this.meiyuinfo = null;
        this.options = null;
        this.meiyu = [];
        this.currentItem = null;
    }

    async init (){
        this.meiyuinfo = document.getElementById("meiyuinfo");
        this.meiyuinfo = document.getElementById("meiyuinfo");
        this.options = Array.from(document.getElementsByClassName("option"));

        const response = await fetch("./meiyu.json");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        this.meiyu = await response.json();

        this.bindEvents();
        this.renewItem();
        this.showWelcomeAnswer();
    }

    showWelcomeAnswer () {
        M.toast({html: "（可以用数字键盘作答）"})
    }

    bindEvents () {
        document.addEventListener("keypress", (event) => {
            const optionIndex = KEY_MAP[event.key];
            if (optionIndex !== undefined) {
                this.options[optionIndex].click();
            }
        })
        this.options.forEach((option, index) => {
            option.addEventListener("click", () => {
                this.handleAnswer("ABCD"[index])
            });
        });
    }

    handleAnswer (answer) {
        if (this.currentItem.answer === answer) {
            M.toast({html: "Correct!"});
            this.renewItem();
        } else {
            M.toast({
                html: "Incorrect! Answer: " + this.currentItem["options"][ANSWER_MAP[this.currentItem['answer']]]
            });
        }
    }

    renewItem () {
        const i = Math.floor(Math.random() * this.meiyu.length);
        this.currentItem = this.meiyu[i];
        this.meiyuinfo.innerText = `${i+1}. ` + this.currentItem["question"];
        this.options.forEach((option, index) => {
            option.innerText = "ABCD"[index] + ". " + this.currentItem.options[index];
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const meiYu = new MeiYu();
    meiYu.init().catch(console.error);
})
