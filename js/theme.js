const themeCheckBox = document.getElementById("themeCheckBox");

themeCheckBox.addEventListener("click", (e) => {
    if(e.target.tagName == "INPUT"){
        if(e.target.checked){
            document.body.classList.add("lightBody");
            document.getElementById("calculatorIcon").src = "https://img.icons8.com/fluency-systems-regular/26/454545/calculator.png"; //outerSpace
            document.querySelector(".headingText p").classList.add("lightBlackText");
            document.querySelector(".calculator").classList.add("lightCalculator");
            document.getElementById("input").classList.add("lightInput");
        } else {
            document.body.classList.remove("lightBody");
            document.getElementById("calculatorIcon").src = "https://img.icons8.com/fluency-systems-regular/26/faf8f1/calculator.png"; //floralWhite
            document.querySelector(".headingText p").classList.remove("lightBlackText");
            document.querySelector(".calculator").classList.remove("lightCalculator");
            document.getElementById("input").classList.remove("lightInput");
        }
    }
});