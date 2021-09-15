const keyPressed = function (e) {
    const numberValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
    const operationKeyboardButtons = ['*', '/', '+', '-'];

    switch (true) {
        case (e.code === "Backspace"):
            backBtn.click();
            break;
        
        case (e.key === "c"):
            clearBtn.click();
            break;
        
        case (e.key === '=' || e.key === "Enter"):
            resultBtn.click();
            break;
        
        case (numberValues.some((value) => value === e.key)):   // if the key pressed is numerical or is "."
            const numberButton = [...numberButtons].find((button) => button.getAttribute("data-value") === e.key);
            numberButton.click();
            break;
        
        case (operationKeyboardButtons.some((keyValue) => e.key === keyValue)):
            const key = [...operationButtons].find((button) => button.getAttribute("data-operation") === e.key);
            key.click();
            break;
    }  
}

function flashButton(button) {
    button.classList.add("button-active");
    setTimeout(() => { button.classList.remove("button-active") }, 100);
}

const numberButtonClicked = function (e) {
    if (clearBottomLineOnButtonPress) {
        clearBottomLineOnButtonPress = false;
        ScreenBottomLine.textContent = "0";
    }
    flashButton(e.target);
    let value = e.target.getAttribute("data-value");
    if (ScreenBottomLine.textContent.length >= 8) {
        screen.classList.add("error-screen");
        setTimeout(() => {
            screen.classList.remove("error-screen");
        }, 200);
        return;
    }
    if (value === "." && ScreenBottomLine.textContent.includes(".")) {
        return;
    }
    if (ScreenBottomLine.textContent === "0") {
        if (value === "0") {    // to avoid getting 00.25 and 00025633
            return;
        }
        else if (value !== ".") {  // to avoid getting things like 05263 and 0212.36
            ScreenBottomLine.textContent = "";
        }
    }
    ScreenBottomLine.textContent += value;
};



const operationButtonClicked = function (e) {
    const button = e.path.find((element) => {
        if (element.classList.contains("operation-button")) {
            return true;
        }
        else {
            return false;
        }
    });
    flashButton(button);
    switch (button.getAttribute("data-operation")) {
        case 'clear':
            clear();
            break;
        case 'back':
            backSpace();
            break;
        case 'result':
            getResult();
            break;
        case '*':
        case '-':
        case '+':
        case '/':
            if (pendingOperationType !== null) {
                if (performOperation()) {
                    ScreenBottomLine.textContent = result;
                }
                else if (result.toString().includes("error")) {
                    alert("An error occured, you can't divide by 0!");
                    return;
                }
            }

            topValue = +ScreenBottomLine.textContent;
            pendingOperationType = button.getAttribute("data-operation");
            ScreenTopLine.textContent = `${topValue} ${getOperationsPrettySymbol(pendingOperationType)} `;
            clearBottomLineOnButtonPress = true;
            break;
    }
};


function getResult() {
    if (pendingOperationType !== null) {
        if (performOperation()) {
            ScreenBottomLine.textContent = result;
            ScreenTopLine.textContent = `${topValue} ${getOperationsPrettySymbol(pendingOperationType)} ${main} = ${result}`;
            topValue = null;
        }
        else if (result.toString().includes("error")) {
            alert("An error occured, you can't divide by 0!");
            return;
        }
        
    }
}

function performOperation() {
    main = +ScreenBottomLine.textContent;
    switch (pendingOperationType) {
        case '+':
            result = topValue + main;
            break;
        case '-':
            result = topValue - main;
            break;
        case '/':
            if (main !== 0) {
                result = topValue / main;
            }
            else {
                result = "error divide-by-zero";
                return false;
            }
            break;
        case '*':
            result = topValue * main;
            break;
    }
    result = (Math.round(result * 10000) / 10000);
    return true;
}

function getOperationsPrettySymbol(operation) {
    let result;
    switch (operation) {
        case '+':
            result = '+';
            break;
        case '-':
            result = '-';
            break;
        case '*':
            result = '×';
            break;
        case '/':
            result = '÷';
            break;
    }
    return result;
}

function clear() {
    ScreenBottomLine.textContent = '0';
    ScreenTopLine.textContent = '';
    top = result = pendingOperationType = null;
    main = 0;
}

function backSpace() {
    if (ScreenBottomLine.textContent.length === 1) {
        ScreenBottomLine.textContent = "0";
    }
    else {
        ScreenBottomLine.textContent = ScreenBottomLine.textContent.slice(0, -1);
    }
}

let topValue = null;
let main = 0;
let result = null;
let pendingOperationType = null;  //null * - + /
let clearBottomLineOnButtonPress = false;

const screen = document.querySelector("#calc-screen");
const ScreenBottomLine = document.querySelector("#bottom-line");
const ScreenTopLine = document.querySelector("#top-line");


const numberButtons = document.querySelectorAll(".number-button");
numberButtons.forEach((numberButton) => {
    numberButton.addEventListener("click", numberButtonClicked);
});

const operationButtons = document.querySelectorAll(".operation-button");
operationButtons.forEach((operationButton) => {
    operationButton.addEventListener("click", operationButtonClicked);
});

const backBtn = document.querySelector("#back-button");
const clearBtn = document.querySelector("#clear-button");
const resultBtn = document.querySelector("#result-button");

document.documentElement.addEventListener("keydown", keyPressed);