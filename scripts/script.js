function operate(operation, m, n) {
    switch (operation) {
        case '+':
            return m + n;
        case '−':
            return m - n;
        case '×':
            return m * n;
        case '÷':
            return m / n;
    }
}

let infixString = ''
let numberInput = '';
let operatorInput = '';
let operationComplete = false;

function elemIsNumeric(element) {
    return typeof +element === 'number' && isFinite(+element);
}

const opRegEx = /([+−×÷=])/;

function clearVariables() {
    infixString = ''
    numberInput = '';
    operatorInput = '';
    operationComplete = false;
    btnNumber.forEach(button => button.addEventListener('click', getNumInput));
}

function clearDisplay() {
    outputDisplay.textContent = 0;
    inputDisplay.textContent = '';
}

function allClear() {
    clearVariables();
    clearDisplay();
}

function getNumInput(e) {
    if (operationComplete === true) {
        allClear();
    };
    numberInput += e.target.textContent;
    outputDisplay.textContent = numberInput;
    btnOp.forEach(button => button.addEventListener('click', getOpInput));
    btnEquals.addEventListener('click', runOperation);
}

function getOpInput(e) {
    operatorInput = e.target.textContent;
    infixString = infixString + numberInput + operatorInput;
    outputDisplay.textContent = 0;
    numberInput = '';
    inputDisplay.textContent = infixString;
    btnOp.forEach(button => button.removeEventListener('click', getOpInput));
    btnEquals.removeEventListener('click', runOperation);
}

let testArray = ["1", "+", "2", "×", "3", "−", "4"];

function infixToPostfix(array) {
    // Convert to Reverse Polish notation using Shunting-yard algo https://en.wikipedia.org/wiki/Shunting-yard_algorithm
    const outputQueue = [];
    const operatorStack = [];

    var operators = {
        '÷': {
            precedence: 3,
            associativity: "Left",
            operator: '/',
        },
        '×': {
            precedence: 3,
            associativity: "Left",
            operator: '*',
        },
        '+': {
            precedence: 2,
            associativity: "Left",
            operator: '+',
        },
        '−': {
            precedence: 2,
            associativity: "Left",
            operator: '-',
        }
    }

    function operatorShunt(token) {
        let lastInStack = operatorStack[operatorStack.length - 1];

        while (operatorStack.length > 0
            && (operators[lastInStack].precedence > operators[token].precedence ||
                (operators[lastInStack].precedence === operators[token].precedence
                    && operators[token].associativity === 'Left'))) {
            outputQueue.push(operatorStack.pop());
            lastInStack = operatorStack[operatorStack.length - 1];
        }
        operatorStack.push(token);
    }

    while (array.length > 0) {
        element = array.shift();
        if (elemIsNumeric(element)) {
            outputQueue.push(element);
        } else if (opRegEx.test(element)) {
            operatorShunt(element);
        }
    }

    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }

    return outputQueue;
}

function rpnEvaluate(array) {
    // Calculate using Reverse Polish notation, help from https://www.thepolyglotdeveloper.com/2015/04/evaluate-a-reverse-polish-notation-equation-with-javascript/
    const numberStack = [];
    for (let i = 0; i < array.length; i++) {
        let token = array[i];
        if (elemIsNumeric(token)) {
            numberStack.push(+token);
        } else if (opRegEx.test(token)) {
            let num1 = numberStack.pop();
            let num2 = numberStack.pop();
            let result = operate(token, num2, num1);
            numberStack.push(result);
        }
    }
    if (numberStack.length > 1) {
        return NaN;
    } else {
        return numberStack.pop();
    }
}

function runOperation(e) {
    getOpInput(e);
    const splitArray = infixString.split(opRegEx)
        .filter(element => !/^$|=/.test(element));
    const rpnArray = infixToPostfix(splitArray);
    outputDisplay.textContent = rpnEvaluate(rpnArray);
    operationComplete = true;
}

const btnNumber = document.querySelectorAll('button.num');

const btnOp = document.querySelectorAll('button.op.input');
const btnEquals = document.querySelector('button#calc-equals');

const inputDisplay = document.querySelector('p#input');
const outputDisplay = document.querySelector('p#output');

const btnClear = document.querySelector('button#calc-clear');
btnClear.addEventListener('click', allClear);

allClear();