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
    constructor() {
        this.meiyuinfo = null;
        this.options = null;
        this.meiyu = [];
        this.currentItem = null;
        this.history = [];
        this.pause = false;
        this.correctRate = null;
        this.skip = null;
    }

    async init() {
        this.meiyuinfo = document.getElementById("meiyuinfo");
        this.meiyuinfo = document.getElementById("meiyuinfo");
        this.options = Array.from(document.getElementsByClassName("option"));
        this.correctRate = document.getElementById("correctRate");
        this.skip = document.getElementById("skip");

        const response = await fetch("./meiyu200+.json");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        this.meiyu = await response.json();

        this.bindEvents();
        this.renewItem();
        this.showWelcomeAnswer();
    }

    record(rcd) {
        this.history.push(rcd);
        if (this.history.length > 80) {
            this.history.shift();
        }
        this.correctRate.innerText = `（正确率：${
            (() => {
                const total = this.history.length;
                let right = 0;
                for (let i = 0; i < total; i++) {
                    if (this.history[i][1]) right++;
                }
                return (100 * right / total).toFixed(2) + "%";
            })()
        }）`;
    }

    showWelcomeAnswer() {
        M.toast({html: "（可以用数字键盘作答）"})
    }

    bindEvents() {
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
        this.skip.addEventListener("click", () => {
            this.handleAnswer("skip");
        });
    }

    handleAnswer(answer) {
        if (this.pause) return;

        if (this.currentItem.answer === answer) {
            M.toast({html: "Correct!"});
            this.record([this.currentItem.index, true]);
            this.renewItem();
        } else if (answer==="skip") {
            this.pause = true;
            M.toast({
                html: "Answer: " + this.currentItem["options"][ANSWER_MAP[this.currentItem['answer']]],
                classes: "red"
            });
            this.record([this.currentItem.index, false]);
            setTimeout(() => {
                this.renewItem();
                this.pause = false;
            }, 5000);
        } else {
            this.pause = true;
            M.toast({
                html: "Incorrect! Answer: " + this.currentItem["options"][ANSWER_MAP[this.currentItem['answer']]],
                classes: "red"
            });
            this.record([this.currentItem.index, false]);
            setTimeout(() => {
                this.renewItem();
                this.pause = false;
            }, 5000);
        }
    }

    renewItem() {
        let i;
        do {
            i = Math.floor(Math.random() * this.meiyu.length);
        } while (this.history.some((pair) => pair[0] === i));
        this.currentItem = this.meiyu[i];
        this.currentItem.index = i;
        this.meiyuinfo.innerText = `${i + 1}. ` + this.currentItem["question"];
        this.options.forEach((option, index) => {
            option.innerText = "ABCD"[index] + ". " + this.currentItem.options[index];
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const meiYu = new MeiYu();
    meiYu.init().catch(console.error);
})
