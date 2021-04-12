

function getInputValueAsNumber(inputId) {
    var value = document.getElementById(inputId).value;
    return parseInt(value);
}

function getCurrentTotalAmount() {
    return getInputValueAsNumber("currentTotalAmountTbox");
}

function getCurrentSuperRanta() {
    return getInputValueAsNumber("currentSuperRantaTbox");
}

function getCurrentOverLeveraged() {
    return getInputValueAsNumber("currentOverLeveragedTbox");
}

function getTargetLeverage() {
    return getInputValueAsNumber("targetLeverageTbox");
}

function getLeverageValue() {
    return getInputValueAsNumber("leverageValueTbox");
}

function getCurrentLeverageAmountValue() {
    return getInputValueAsNumber("currentLeverageAmountTbox");
}

function calculateLeverageAmountForTargetLeverage() {
    var currentTotalAmount = getCurrentTotalAmount();
    var targetLeverage = getTargetLeverage();
    var targetLeverageFactor = targetLeverage / 100;

    var leverageAmount = 0;
    var lastLeveragableAmount = currentTotalAmount;

    var loopCounter = 0;
    while(lastLeveragableAmount > 1) {
        var newLeverage = lastLeveragableAmount * targetLeverageFactor;
        leverageAmount += newLeverage;
        lastLeveragableAmount = newLeverage;
        loopCounter++;

        if(loopCounter > 1000){
            console.log("Loop counter max hit, abort loop");
            break;
        }
    }

    return Math.round(leverageAmount);
}

function printToLabel(id, value, text) {
    document.getElementById(id).innerHTML = text + ": " + value;
}

function calculateLeverage(){
    var targetLeverageAmount = calculateLeverageAmountForTargetLeverage();
    printToLabel("targetLeverageAmountLabel", targetLeverageAmount, "Total belåning SEK");

    var currentLeverageAmount = getCurrentLeverageAmountValue();
    var amountToInvest = targetLeverageAmount - currentLeverageAmount;
    printToLabel("amountToInvestLabel", amountToInvest, "Belopp att justera belåning med");

    var currentTotalAmount = getCurrentTotalAmount();
    var newTotalAmount = amountToInvest + currentTotalAmount;
    printToLabel("newTotalAmountLabel", newTotalAmount, "Nytt totalbelopp");

    return false;
}