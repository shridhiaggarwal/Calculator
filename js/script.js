const calculator = document.querySelector(".calculator");
const buttons = document.querySelectorAll(".buttons td");
const currentInput = document.getElementById("currentInput");
const previousInput = document.getElementById("previousInput");
const operatorSet = new Set(["+", "-", "×", "÷"]);
const keyType = {
  NUMBER: "number",
  OPERATOR: "operator",
  DECIMAL: "decimal",
  RESET: "reset",
  RESULT: "result",
}

// handle keyboard events
document.addEventListener('keydown', (event) => {
  const keyValue = event.key;
  const currentKeyType = getKeyType(keyValue);
  handleButtonClick(keyValue, currentKeyType);
}, false);

// handle mouse events
for (let button of buttons) {
  button.addEventListener("click", (e) => {
    const key = e.target;
    const action = key.dataset.action;
    const currentKeyType = getKeyType(action);
    const keyValue = key.textContent;
    handleButtonClick(keyValue, currentKeyType);
  });
}

// handle events based on currentKeyType
const handleButtonClick = (keyValue, currentKeyType) => {
  if (currentKeyType === keyType.NUMBER) {
    handleInputChange(currentKeyType, keyValue);
    calculator.dataset.previousKey = keyType.NUMBER;
  }
  if (currentKeyType === keyType.OPERATOR) {
    calculator.dataset.action = getOperatorSign(keyValue);
    handleInputChange(currentKeyType, calculator.dataset.action);
    calculator.dataset.firstNumber = previousInput.textContent.slice(0, -1);
    calculator.dataset.previousKey = keyType.OPERATOR;
  }
  if (currentKeyType === keyType.DECIMAL) {
    handleInputChange(currentKeyType, ".");
    calculator.dataset.previousKey = keyType.DECIMAL;
  }
  if (currentKeyType === keyType.RESET) {
    handleResetChange();
    calculator.dataset.previousKey = keyType.RESET;
  }
  if (currentKeyType === keyType.RESULT) {
    let firstNumber = calculator.dataset.firstNumber;
    let operator = calculator.dataset.action;
    let secondNumber = calculator.dataset.previousKey === keyType.RESULT ? calculator.dataset.secondNumber : currentInput.textContent;
    let result = getResult(firstNumber, operator, secondNumber);
    handleInputChange(currentKeyType, result);
    calculator.dataset.firstNumber = result;
    calculator.dataset.secondNumber = secondNumber;
    calculator.dataset.previousKey = keyType.RESULT;
  }
};

// handle display changes - current and previous input
const handleInputChange = (currentKeyType, newValue) => {
  let currentValue = currentInput.textContent;
  let previousValue = previousInput.textContent;

  if (currentKeyType === keyType.OPERATOR) {
    let lastchar = previousValue.charAt(previousValue.length - 1);
    if (operatorSet.has(lastchar) && currentValue === "0") {
      previousValue = calculator.dataset.firstNumber + newValue;
    } else if (operatorSet.has(lastchar) && currentValue !== "0") {
      previousValue = getResult(calculator.dataset.firstNumber, calculator.dataset.action, currentValue) + newValue;
    } else {
      previousValue = currentValue + newValue;
    }
    currentValue = "0";
  } else if (currentKeyType === keyType.RESULT) {
    if (newValue == undefined || newValue == NaN) {
      previousValue = currentValue + "=";
      currentValue = currentValue;
    } else if (calculator.dataset.previousKey === keyType.RESULT) {
      previousValue = calculator.dataset.firstNumber + calculator.dataset.action + calculator.dataset.secondNumber + "="
      currentValue = newValue;
    } else {
      previousValue = previousValue + currentValue + "=";
      currentValue = newValue;
    }
  } else if (currentKeyType === keyType.DECIMAL) {
    if (currentValue.includes(".")) {
      return;
    } else if (calculator.dataset.previousKey == keyType.RESULT) {
      handleResetChange();
      previousValue = null;
      currentValue = "0" + newValue;
    } else if (calculator.dataset.previousKey == keyType.OPERATOR) {
      currentValue = "0" + newValue;
    } else {
      currentValue = currentValue + newValue;
    }
  } else {
    if (currentValue.length >= 16) {
      return;
    } else if (calculator.dataset.previousKey == keyType.RESULT) {
      handleResetChange();
      previousValue = null;
      currentValue = newValue;
    } else if (currentValue === "0") {
      currentValue = newValue;
    } else {
      currentValue = currentValue + newValue;
    }
  }

  previousInput.innerHTML = previousValue;
  currentInput.innerHTML = currentValue;
};

// calculate result
const getResult = (firstNumber, operator, secondNumber) => {
  let first = Number(firstNumber);
  let second = Number(secondNumber);
  if (!Number.isInteger(first) && !Number.isInteger(second)) {
    let result = getFloatResults(firstNumber, operator, secondNumber);
    return result;
  }
  switch (operator) {
    case "+":
      return first + second;
    case "-":
      return first - second;
    case "×":
      return first * second;
    case "÷":
      return first / second;
  }
};

// calculate float result
const getFloatResults = (firstNumber, operator, secondNumber) => {
  let first = Number(firstNumber.split(".").join(""));
  let second = Number(secondNumber.split(".").join(""));
  let firstDecimalLength = firstNumber.split(".").pop().length;
  let secondDecimalLength = secondNumber.split(".").pop().length;
  let tenPower;
  switch (operator) {
    case "+":
      tenPower = firstDecimalLength > secondDecimalLength ? firstDecimalLength : secondDecimalLength;
      return (first + second) / Math.pow(10, tenPower);
    case "-":
      tenPower = firstDecimalLength > secondDecimalLength ? firstDecimalLength : secondDecimalLength;
      return (first - second) / Math.pow(10, tenPower);
    case "×":
      tenPower = firstDecimalLength + secondDecimalLength;
      return (first * second) / Math.pow(10, tenPower);
    case "÷":
      tenPower = firstDecimalLength - secondDecimalLength;
      return (first / second) / Math.pow(10, tenPower);
  }
}

// handle reset calculator
const handleResetChange = () => {
  previousInput.innerHTML = null;
  currentInput.innerHTML = "0";
  calculator.dataset.firstNumber = "";
  calculator.dataset.secondNumber = "";
  calculator.dataset.action = "";
  calculator.dataset.previousKey = "";
};

const getOperatorSign = (operator) => {
  switch (operator) {
    case "+":
      return "+";
    case "-":
      return "-";
    case "×":
    case "*":
      return "×";
    case "÷":
    case "/":
      return "÷";
  }
};

const getKeyType = (action) => {
  if (action === "number" || action.match(/[0-9]/g)) {
    return keyType.NUMBER;
  }
  if (action === "add" || action === "subtract" || action === "multiply" || action === "divide" || action === "+" || action === "-" || action === "*" || action === "/") {
    return keyType.OPERATOR;
  }
  if (action === "decimal" || action === ".") {
    return keyType.DECIMAL;
  }
  if (action === "reset" || action === "C" || action === "c") {
    return keyType.RESET;
  }
  if (action === "result" || action === "Enter" || action === "=") {
    return keyType.RESULT
  }
}