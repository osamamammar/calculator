// global variables
let firstOperand = '';
let secondOperand = '';
let currentOperation = null;
let shouldResetScreen = false;
let errorMessageFlag = false;
let readyToOperate = true;

// dom nodes
// nodelist btns
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const otherButtons = document.querySelectorAll('.other');
const allButtons = document.querySelectorAll('.btn');
// single btn
const equalButton = document.querySelector('.equal');
const clearButton = document.querySelector('.clear');
const deleteButton = document.querySelector('.backspace');
const dotButton = document.querySelector('.dot');
const percentageButton = document.querySelector('.percent');
// display screen nodes
const lastOperationScreen = document.getElementById('lastOperationScreen');
const currentOperationScreen = document.getElementById('currentOperationScreen');

// listener for keyboard input
window.addEventListener('keydown', handleKeyboardInput);
// listeners for clicks
equalButton.addEventListener('click', evaluate);
clearButton.addEventListener('click', clear);
deleteButton.addEventListener('click', deleteNumber);
dotButton.addEventListener('click', appendPoint);
percentageButton.addEventListener('click', operatePercentage);

numberButtons.forEach((button) =>
	button.addEventListener('click', () => appendNumber(button.textContent))
);

operatorButtons.forEach((button) =>
	button.addEventListener('click', () => setOperation(button.textContent))
);

allButtons.forEach((button) => {
	button.addEventListener('keydown', removeEnterForAllButtons);
});

// function to disable enter key for all buttons
function removeEnterForAllButtons(e) {
	if (e.keyCode === 13 || e.key === '=' || e.key === 'Enter') {
		e.preventDefault();
	}
}

// function to append numbers
function appendNumber(number) {
	// condition if any number is clicked reset and enable btns are disabled
	if (errorMessageFlag) {
		resetCalcAfterErrorMessage();
		resetScreen();
	}

	// reset to update value when typing
	if (currentOperationScreen.textContent === '0' || shouldResetScreen) resetScreen();
	currentOperationScreen.textContent += number;
}

// function to reset screen
function resetScreen() {
	currentOperationScreen.textContent = '';
	shouldResetScreen = false;
}

// function take operator as parameter and evaluate
function setOperation(operator) {
	// if operator is exist evaluate
	if (currentOperation !== null) evaluate();

	// display first operand typed and operator in lastOperationScreen
	firstOperand = currentOperationScreen.textContent;
	currentOperation = operator;
	lastOperationScreen.textContent = `${firstOperand} ${currentOperation}`;

	// reset to accept another value
	shouldResetScreen = true;
}

// function clear numbers and reset global variables
function clear() {
	// condition if clear is clicked enable btns are disabled
	if (errorMessageFlag) {
		enableButtons();
	}
	// reset global variables
	currentOperationScreen.textContent = '0';
	lastOperationScreen.textContent = '';
	firstOperand = '';
	secondOperand = '';
	currentOperation = null;
	errorMessageFlag = false;
}

// function to append point
function appendPoint() {
	if (shouldResetScreen) resetScreen();
	if (currentOperationScreen.textContent === '') currentOperationScreen.textContent = '0';
	if (currentOperationScreen.textContent.includes('.')) return;
	currentOperationScreen.textContent += '.';
}

// function to delete number or make backspace
function deleteNumber() {
	// condition if errorMessageFlag is true and delete number or backspace is clicked reset and enable btns are disabled else delete and put last value is zero
	if (errorMessageFlag) {
		resetCalcAfterErrorMessage();
	} else {
		currentOperationScreen.textContent = currentOperationScreen.textContent.toString().slice(0, -1);
		if (currentOperationScreen.textContent === '') currentOperationScreen.textContent = '0';
	}
}

// function to reset calc after error message and enable btns
function resetCalcAfterErrorMessage() {
	if (currentOperationScreen.textContent === 'this is so rude') {
		clear();
		enableButtons();
		errorMessageFlag = false;
	}
}

// function to enable btns and change style
function enableButtons() {
	operatorButtons.forEach((btn) => {
		btn.disabled = false;
		btn.style.opacity = 1;
		btn.classList.remove('no-hover');
	});
	otherButtons.forEach((btn) => {
		btn.disabled = false;
		btn.style.opacity = 1;
		btn.classList.remove('no-hover');
	});
}

// function to disable btns and change style
function disableButtons() {
	operatorButtons.forEach((btn) => {
		btn.disabled = true;
		btn.style.opacity = 0.5;
		btn.classList.add('no-hover');
	});
	otherButtons.forEach((btn) => {
		btn.disabled = true;
		btn.style.opacity = 0.5;
		btn.classList.add('no-hover');
	});
}

// function to evaluate numbers is typed or clicked
function evaluate() {
	// call function resetCalcAfterErrorMessage to reset if error is happen
	resetCalcAfterErrorMessage();

	// condition to prevent error when click equal and there is nothing
	if (currentOperation === null || shouldResetScreen) return;

	// condition to check if user divide any number above zero
	if (currentOperation === '÷' && currentOperationScreen.textContent === '0') {
		// if true disable btns and set errorMessageFlag to true and return error message
		disableButtons();
		errorMessageFlag = true;
		return (currentOperationScreen.textContent = 'this is so rude');
	}

	// display first operand, second operand typed and operator in lastOperationScreen
	secondOperand = currentOperationScreen.textContent;

	// calculate result in operate function and make it rounded in round result function after that display it in current operation screen
	currentOperationScreen.textContent = roundResult(
		operate(currentOperation, firstOperand, secondOperand)
	);
	lastOperationScreen.textContent = `${firstOperand} ${currentOperation} ${secondOperand} =`;

	// to make several operations
	// if (readyToOperate) {
	// 	currentOperationScreen.textContent = roundResult(
	// 		operate(currentOperation, firstOperand, secondOperand)
	// 	);
	// }
	currentOperation = null;
}

// function to operate percentage
function operatePercentage() {
	if (currentOperationScreen.textContent === '') currentOperationScreen.textContent = '0';
	currentOperationScreen.textContent = parseFloat(currentOperationScreen.textContent) / 100;
}

// function to round result of operation
function roundResult(number) {
	return Math.round(number * 1000) / 1000;
}

// function to handleKeyboardInput
function handleKeyboardInput(e) {
	if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
	if (e.key === '.') appendPoint();
	if (e.key === '=' || e.key === 'Enter') evaluate();
	if (e.key === 'Backspace') deleteNumber();
	if (e.key === 'Escape') clear();
	if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/')
		setOperation(convertOperator(e.key));
}
// function to convert operators to what is displayed
function convertOperator(keyboardOperator) {
	if (keyboardOperator === '/') return '÷';
	if (keyboardOperator === '*') return 'x';
	if (keyboardOperator === '-') return '−';
	if (keyboardOperator === '+') return '+';
}

// add two numbers
function add(a, b) {
	return a + b;
}

// subtract two numbers
function substract(a, b) {
	return a - b;
}

// multiply two numbers
function multiply(a, b) {
	return a * b;
}

// divide two numbers
function divide(a, b) {
	return a / b;
}

// function to change sign
// function addOrRemoveSign() {
// 	if (currentOperationScreen.textContent === '0') return;
// 	if (currentOperationScreen.textContent === '') currentOperationScreen.textContent = '0';
// 	currentOperationScreen.textContent = currentOperationScreen.textContent * -1;
// }

// function to operate two numbers
function operate(operator, a, b) {
	a = Number(a);
	b = Number(b);
	switch (operator) {
		case '+':
			return add(a, b);
		case '-':
			return substract(a, b);
		case 'x':
			return multiply(a, b);
		case '÷':
			if (b === 0) return null;
			else return divide(a, b);
		default:
			return null;
	}
}
