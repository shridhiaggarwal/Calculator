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
    if (calculator.dataset.previousKey === "operator") {
      return;
    }
    let firstNumber = calculator.dataset.firstNumber;
    let operator = calculator.dataset.action;
    let secondNumber = currentInput.textContent;
    if (calculator.dataset.previousKey === "result") {
      secondNumber = calculator.dataset.secondNumber;
      //previousInput.innerHTML = firstNumber + keyValue + secondNumber + "=";
    }
    let result = getResult(firstNumber, operator, secondNumber);
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

  if (currentValue.includes(".") && newValue === ".") {
    debugger;
    return;
  }

  if (currentKeyType === "operator") {
    debugger;
    // previousInput.classList.remove("hideElement");
    let lastchar = previousValue.charAt(previousValue.length - 1);
    if (operatorSet.has(lastchar) && currentValue === "0") {
      previousValue = previousValue.slice(0, -1) + newValue;
    } else if (operatorSet.has(lastchar) && currentValue !== "0") {
      let firstNumber = previousValue.slice(0, -1);
      previousValue = getResult(firstNumber, calculator.dataset.action, currentValue) + newValue;
    } else {
      previousValue = previousValue + currentValue + newValue;
    }
    currentValue = "0";
  } else if (currentKeyType === "result") {
    debugger;
    if (calculator.dataset.previousKey === "result") {
      let actionKey = getActionKey(calculator.dataset.action);
      let actionIndex = previousValue.lastIndexOf(actionKey);
      previousValue = calculator.dataset.firstNumber + previousValue.slice(actionIndex);
      currentValue = newValue;
    } else {
      previousValue = previousValue + currentValue + "=";
      currentValue = newValue !== undefined ? newValue : currentValue;
    }
  } else {
    debugger;
    if (currentValue === "0" && newValue !== ".") {
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

const handleResetChange = () => {
  previousInput.innerHTML = null;
  // previousInput.classList.add("hideElement");
  currentInput.innerHTML = "0";
};

const getActionKey = (operator) => {
  switch (operator) {
    case "add":
      return "+";
    case "subtract":
      return "-";
    case "multiply":
      return "*";
    case "divide":
      return "/";
  }
};