const calculator = document.querySelector(".calculator");
const buttons = document.querySelectorAll(".buttons td");
const currentInput = document.getElementById("currentInput");
const previousInput = document.getElementById("previousInput");
const operatorSet = new Set(["+", "-", "×", "÷"]);

for (let button of buttons) {
  button.addEventListener("click", (e) => handleButtonClick(e));
}

const handleButtonClick = (e) => {
  const key = e.target;
  const action = key.dataset.action;
  let keyValue = key.textContent;
  console.log("keyValue", keyValue);

  if (!action) {
    handleInputChange("number", keyValue);
    calculator.dataset.previousKey = "number";
  }
  if (action === "add" || action === "subtract" || action === "multiply" || action === "divide") {
    calculator.dataset.action = action;
    handleInputChange("operator", keyValue);
    calculator.dataset.firstNumber = previousInput.textContent.slice(0, -1);
    calculator.dataset.previousKey = "operator";
  }
  if (action === "decimal") {
    handleInputChange("decimal", ".");
    calculator.dataset.previousKey = "decimal";
  }
  if (action === "reset") {
    handleResetChange();
    calculator.dataset.previousKey = "reset";
  }
  if (action === "result") {
    // if (calculator.dataset.previousKey === "operator") {
    //   return;
    // }
    let firstNumber = calculator.dataset.firstNumber;
    let operator = calculator.dataset.action;
    let secondNumber = currentInput.textContent;
    if (calculator.dataset.previousKey === "result") {
      secondNumber = calculator.dataset.secondNumber;
    }
    let result = getResult(firstNumber, operator, secondNumber);
    result = (result == undefined || result == NaN) ? currentInput.textContent : result;
    handleInputChange("result", result);
    calculator.dataset.firstNumber = result;
    calculator.dataset.secondNumber = secondNumber;
    calculator.dataset.previousKey = "result";
  }
};

const handleInputChange = (keyType, newValue) => {
  let currentValue = currentInput.textContent;
  let previousValue = previousInput.textContent;
  let currentKeyType = keyType;

  console.log("currentKeyType", currentKeyType);

  if (currentValue.includes(".") && keyType === "decimal") {
    debugger;
    return;
  }

  if (currentKeyType === "operator") {
    debugger;
    let lastchar = previousValue.charAt(previousValue.length - 1);
    if (operatorSet.has(lastchar) && currentValue === "0") {
      previousValue = previousValue.slice(0, -1) + newValue;
    } else if (operatorSet.has(lastchar) && currentValue !== "0") {
      let firstNumber = previousValue.slice(0, -1);
      previousValue = getResult(firstNumber, calculator.dataset.action, currentValue) + newValue;
    } else {
      previousValue = currentValue + newValue;
    }
    currentValue = "0";
  } else if (currentKeyType === "result") {
    debugger;
    if (calculator.dataset.previousKey === "result") {
      let actionKey = getActionKey(calculator.dataset.action);
      // let actionIndex = previousValue.lastIndexOf(actionKey);
      // previousValue = calculator.dataset.firstNumber + previousValue.slice(actionIndex);
      previousValue = calculator.dataset.firstNumber + actionKey + calculator.dataset.secondNumber + "="
      currentValue = newValue;
    } else {
      previousValue = previousValue + currentValue + "=";
      currentValue = newValue;
    }
  } else {
    debugger;
    if (currentValue.length >= 16) {
      return;
    } else if (calculator.dataset.previousKey == "result") {
      previousValue = null;
      currentValue = "0";
    } else if (currentValue === "0" && keyType !== "decimal") {
      currentValue = newValue;
    } else {
      currentValue = currentValue + newValue;
    }
  }

  console.log("currentValue", currentValue);
  console.log("previousValue", previousValue);

  previousInput.innerHTML = previousValue;
  currentInput.innerHTML = currentValue;
};

const getResult = (firstNumber, operator, secondNumber) => {
  let first = Number(firstNumber);
  let second = Number(secondNumber);
  if (!Number.isInteger(first) && !Number.isInteger(second)) {
    let result = getFloatResults(firstNumber, operator, secondNumber);
    return result;
  }
  switch (operator) {
    case "add":
      return first + second;
    case "subtract":
      return first - second;
    case "multiply":
      return first * second;
    case "divide":
      return first / second;
  }
};

const getFloatResults = (firstNumber, operator, secondNumber) => {
  let first = Number(firstNumber.split(".").join(""));
  let second = Number(secondNumber.split(".").join(""));
  let firstDecimalLength = firstNumber.split(".").pop().length;
  let secondDecimalLength = secondNumber.split(".").pop().length;
  let tenPower;
  debugger;
  switch (operator) {
    case "add":
      tenPower = firstDecimalLength > secondDecimalLength ? firstDecimalLength : secondDecimalLength;
      return (first + second) / Math.pow(10, tenPower);
    case "subtract":
      tenPower = firstDecimalLength > secondDecimalLength ? firstDecimalLength : secondDecimalLength;
      return (first - second) / Math.pow(10, tenPower);
    case "multiply":
      tenPower = firstDecimalLength + secondDecimalLength;
      return (first * second) / Math.pow(10, tenPower);
    case "divide":
      tenPower = firstDecimalLength - secondDecimalLength;
      return (first / second) / Math.pow(10, tenPower);
  }
}

const handleResetChange = () => {
  previousInput.innerHTML = null;
  currentInput.innerHTML = "0";
  calculator.dataset.firstNumber = "";
  calculator.dataset.secondNumber = "";
  calculator.dataset.action = "";
  calculator.dataset.previousKey = "";
};

const getActionKey = (operator) => {
  switch (operator) {
    case "add":
      return "+";
    case "subtract":
      return "-";
    case "multiply":
      return "×";
    case "divide":
      return "÷";
  }
};