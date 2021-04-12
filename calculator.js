

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

function calculateTotalAmountWithSuperRanta(){
    var currentSuperRantaAmount = getCurrentSuperRanta();

    return currentSuperRantaAmount * 2;
}

function calculateLeverageAmountForTargetLeverage() {
    var currentAmountWithSuperRanta = calculateTotalAmountWithSuperRanta();
    var targetLeverage = getTargetLeverage();
    var targetLeverageFactor = targetLeverage / 100;

    var leverageAmount = 0;
    var lastLeveragableAmount = currentAmountWithSuperRanta;

    var loopCounter = 0;
    while (lastLeveragableAmount > 1) {
        var newLeverage = lastLeveragableAmount * targetLeverageFactor;
        leverageAmount += newLeverage;
        lastLeveragableAmount = newLeverage;
        loopCounter++;

        if (loopCounter > 1000) {
            console.log("Loop counter max hit, abort loop");
            break;
        }
    }

    return Math.round(leverageAmount);
}

function printToLabel(id, value, text) {
    document.getElementById(id).innerHTML = text + ": " + value;
}

function calculateLeverage() {
    var targetLeverageAmount = calculateLeverageAmountForTargetLeverage();
    printToLabel("targetLeverageAmountLabel", targetLeverageAmount, "Total belåning SEK");

    var currentLeverageAmount = getCurrentLeverageAmountValue();
    var amountToInvest = targetLeverageAmount - currentLeverageAmount;
    printToLabel("amountToInvestLabel", amountToInvest, "Belopp att justera belåning med");

    var currentTotalAmount = getCurrentTotalAmount();
    var newTotalAmount = amountToInvest + currentTotalAmount;
    printToLabel("newTotalAmountLabel", newTotalAmount, "Nytt totalbelopp");

    var currentTotalAmountSuperRanta = calculateTotalAmountWithSuperRanta();
    printToLabel("currentTotalAmountSuperRantaLabel", currentTotalAmountSuperRanta, "Nuvarande totalbelopp med superränta");
    
    var newTotalAmountSuperRanta = currentTotalAmountSuperRanta + amountToInvest;
    var newTotalAmountSecondBestInterest  = newTotalAmountSuperRanta / 2;
    var newTotalAmountBestInterest  = newTotalAmountSuperRanta / 5;

    printToLabel("bestInterestLevelLabel", newTotalAmountBestInterest, "Nytt tak 0% ränta");
    printToLabel("secondBestLevelLabel", newTotalAmountSecondBestInterest, "Nytt tak 1,24% ränta");
    printToLabel("superRantaLevelLabel", newTotalAmountSuperRanta, "Nytt tak 2,21% ränta");

    return false;
}