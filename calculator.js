var guldBestInterest = 0;
var guldSecondBestInterest = 1.24;
var guldSuperRantaInterest = 2.21;
var guldOrdinaryInterest = 6.22;

var platinaBestInterest = 0;
var platinaSecondBestInterest = 0.99;
var platinaSuperRantaInterest = 1.99;
var platinaOrdinaryInterest = 5.90;

var limitPlatinaKund = 1000000;


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

function calculateTotalAmountWithSuperRanta() {
    var currentSuperRantaAmount = getCurrentSuperRanta();

    return currentSuperRantaAmount * 2;
}

function calculateLeverageAmountForTargetLeverage(totalAmount) {
    var targetLeverage = getTargetLeverage();
    var targetLeverageFactor = targetLeverage / 100;

    var leverageAmount = 0;
    var lastLeveragableAmount = totalAmount;

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

function printSekLabel(value, text) {
    var resultContainer = document.getElementById("resultContainer");

    var roundedValue = Math.round(value);

    var formatedValue = new Intl.NumberFormat('sv-SE', { style: 'decimal', currency: 'SEK' }).format(roundedValue);

    resultContainer.innerHTML += text + ": " + formatedValue + "<br/>";
}


function printDecimalLabel(value, text) {
    var resultContainer = document.getElementById("resultContainer");

    var roundedValue = Math.round(value * 100) / 100

    var formatedValue = new Intl.NumberFormat('sv-SE', { style: 'decimal' }).format(roundedValue);

    resultContainer.innerHTML += text + ": " + formatedValue + "<br/>";
}

function printNewResultSection(label) {
    var resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML += "<h2>" + label + "</h2>";
}

function printNewRow() {
    var resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML += "<br/>";
}

function getBestInterest(totalAmount) {
    if (totalAmount >= limitPlatinaKund) {
        return platinaBestInterest;
    }

    return guldBestInterest;
}

function getSecondBestInterest(totalAmount) {
    if (totalAmount >= limitPlatinaKund) {
        return platinaSecondBestInterest;
    }

    return guldSecondBestInterest;
}

function getSuperRantaIntereset(totalAmount) {
    if (totalAmount >= limitPlatinaKund) {
        return platinaSuperRantaInterest;
    }

    return guldSuperRantaInterest;
}

function getOrdinarieInterest(totalAmount) {
    if (totalAmount >= limitPlatinaKund) {
        return platinaOrdinaryInterest;
    }

    return guldOrdinaryInterest;
}

function getRantaBasedOnTargetLeverage(targetLeverage) {
    if (targetLeverage <= 10) {
        return getBestInterest();
    }

    if (targetLeverage <= 25) {
        return getSecondBestInterest();
    }

    if (targetLeverage <= 50) {
        return getSuperRantaIntereset();
    }

    return getOrdinarieInterest();
}

function getRantaAsFactor(ranta) {
    return ranta / 100;
}

function calculateLeverage() {
    document.getElementById("resultContainer").innerHTML = "";
    var currentTotalAmountSuperRanta = calculateTotalAmountWithSuperRanta();
    var targetLeveragePercent = getTargetLeverage();
    var totalAmount = getCurrentTotalAmount();
    var targetLeverageAmountIfFullSuperRanta = calculateLeverageAmountForTargetLeverage(totalAmount);
    var targetLeverageAmount = calculateLeverageAmountForTargetLeverage(currentTotalAmountSuperRanta);
    var extraLeverageFullSuperRanta = targetLeverageAmountIfFullSuperRanta - targetLeverageAmount;
    var currentLeverageAmount = getCurrentLeverageAmountValue();
    var amountToInvest = targetLeverageAmount - currentLeverageAmount;
    var currentTotalAmount = getCurrentTotalAmount();
    var newTotalAmount = amountToInvest + currentTotalAmount;
    var newTotalAmountSuperRanta = currentTotalAmountSuperRanta + amountToInvest;
    var newTotalAmountSecondBestInterest = newTotalAmountSuperRanta / 2;
    var newTotalAmountBestInterest = newTotalAmountSuperRanta / 5;
    var currentTotalAmountSecondBestInterest = currentTotalAmountSuperRanta / 2;
    var currentTotalAmountBestInterest = currentTotalAmountSuperRanta / 5;
    var diffNewAndCurrentBestInterest = newTotalAmountBestInterest - currentTotalAmountBestInterest;
    var diffNewAndSecondCurrentBestInterest = newTotalAmountSecondBestInterest - currentTotalAmountSecondBestInterest;
    var diffTotalAmountSuperRanta = newTotalAmountSuperRanta - currentTotalAmountSuperRanta;
    var egetKapital = totalAmount - currentLeverageAmount;
    var newLeverageMultiplier = newTotalAmount / egetKapital;

    var bestInterest = getBestInterest();

    var secondBestInterest = getSecondBestInterest();

    var superRantaIntereset = getSuperRantaIntereset();

    var ordinarieInterest = getOrdinarieInterest();

    var rantaBasedOnTargetLeverage = getRantaBasedOnTargetLeverage(targetLeveragePercent);
    var rantaBasedOnTargetLeverageFactor = getRantaAsFactor(rantaBasedOnTargetLeverage);

    var yearlyInterestCost = targetLeverageAmount * rantaBasedOnTargetLeverageFactor;
    var dailyInterestCost = yearlyInterestCost / 365;

    printNewResultSection("Översikt");

    printSekLabel(newTotalAmount, "Nytt totalbelopp");
    printSekLabel(targetLeverageAmount, "Möjlig total belåning");
    printDecimalLabel(newLeverageMultiplier, "Möjlig hävstång");
    printSekLabel(egetKapital, "Eget kapital");
    printSekLabel(amountToInvest, "Belopp att justera belåning med");

    printNewResultSection("Superräntan");
    printSekLabel(currentTotalAmountSuperRanta, "Nuvarande total med superränta");
    printSekLabel(targetLeverageAmountIfFullSuperRanta, "Total belåning om full superränta");
    printSekLabel(extraLeverageFullSuperRanta, "Extra belåning om full superränta");

    printNewResultSection("Räntenivåer");
    printSekLabel(newTotalAmountBestInterest, "Nytt tak " + bestInterest + "% ränta");
    printSekLabel(currentTotalAmountBestInterest, "Nuvarande tak " + bestInterest + "% ränta");
    printSekLabel(diffNewAndCurrentBestInterest, "Diff");
    printNewRow();

    printSekLabel(newTotalAmountSecondBestInterest, "Nytt tak " + secondBestInterest + "% ränta");
    printSekLabel(currentTotalAmountSecondBestInterest, "Nuvarande tak " + secondBestInterest + "% ränta");
    printSekLabel(diffNewAndSecondCurrentBestInterest, "Diff");
    printNewRow();

    printSekLabel(newTotalAmountSuperRanta, "Nytt tak " + superRantaIntereset + "% ränta");
    printSekLabel(currentTotalAmountSuperRanta, "Nuvarande tak " + superRantaIntereset + "% ränta");
    printSekLabel(diffTotalAmountSuperRanta, "Diff");
    printNewRow();

    printSekLabel(0, "Nytt tak " + ordinarieInterest + "% ränta");
    printSekLabel(0, "Nuvarande tak " + ordinarieInterest + "% ränta");
    printSekLabel(0 , "Diff");
    printNewRow();

    printNewResultSection("Kostnader");
    printDecimalLabel(rantaBasedOnTargetLeverage, "Ränta %");
    printSekLabel(yearlyInterestCost, "Räntekostnad per år");
    printSekLabel(dailyInterestCost, "Räntekostnad per dag");

    return false;
}

calculateLeverage();