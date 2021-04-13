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

function formatSEK(value) {
    var roundedValue = Math.round(value);

    return new Intl.NumberFormat('sv-SE', { style: 'decimal', currency: 'SEK' }).format(roundedValue);
}

function formatDecimal(value) {
    var roundedValue = Math.round(value * 100) / 100

    return new Intl.NumberFormat('sv-SE', { style: 'decimal' }).format(roundedValue);
}

function printSekLabel(value, text) {
    var resultContainer = document.getElementById("resultContainer");

    var formatedValue = formatSEK(value);

    resultContainer.innerHTML += text + ": " + formatedValue + "<br/>";
}

function printDecimalLabel(value, text) {
    var resultContainer = document.getElementById("resultContainer");

    var formatedValue = formatDecimal(value);

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

function getCell(content) {
    return "<td>" + content + "</td>";
}

function printNedgangTable(totalBeloppMedSuperRanta, egetKapital, targetLeverage, targetLeverageAmount) {
    var tableHtml = "<table class='table table-striped'>";
    var nedgangList = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 90];
    var targetLeverageFactor = targetLeverage / 100;

    tableHtml += "<thead><tr>";
    tableHtml += getCell("Nedgång %");

    for (var i = 0; i < nedgangList.length; i++) {
        var nedgang = nedgangList[i];
        tableHtml += getCell(nedgang);
    }
    tableHtml += "</tr></thead>";

    tableHtml += "<tbody>";

    tableHtml += "<tr>";
    tableHtml += getCell("Belåningsgrad");

    for (var i = 0; i < nedgangList.length; i++) {
        var nedgang = nedgangList[i];
        var nedgangFactor = 1 - nedgang / 100;
        var beloppEfterNedgang = totalBeloppMedSuperRanta * nedgangFactor;
        var belaningsgradEfterNedgangFactor = targetLeverageAmount / beloppEfterNedgang;
        var belaningsgradEfterNedgangPercent = formatSEK(belaningsgradEfterNedgangFactor * 100);

        tableHtml += getCell(belaningsgradEfterNedgangPercent);
    }
    tableHtml += "</tr>";

    tableHtml += "<tr>";
    tableHtml += getCell("Belopp med superränta");

    for (var i = 0; i < nedgangList.length; i++) {
        var nedgang = nedgangList[i];
        var nedgangFactor = 1 - nedgang / 100;
        var beloppEfterNedgang = totalBeloppMedSuperRanta * nedgangFactor;
        var beloppEfterNedgangFormated = formatSEK(beloppEfterNedgang);

        tableHtml += getCell(beloppEfterNedgangFormated);
    }
    tableHtml += "</tr>";

    tableHtml += "<tr>";
    tableHtml += getCell("Justering för att ha superränta");

    for (var i = 0; i < nedgangList.length; i++) {
        var nedgang = nedgangList[i];
        var nedgangFactor = 1 - nedgang / 100;
        var beloppEfterNedgang = totalBeloppMedSuperRanta * nedgangFactor;
        var beloppNeeded = totalBeloppMedSuperRanta * 0.5;
        var diff = beloppNeeded - beloppEfterNedgang;
        var diffFormated = formatSEK(diff);

        tableHtml += getCell(diffFormated);
    }
    tableHtml += "</tr>";

    
    tableHtml += "<tr>";
    tableHtml += getCell("Justering för att inte va överbelånad");

    for (var i = 0; i < nedgangList.length; i++) {
        var nedgang = nedgangList[i];
        var nedgangFactor = 1 - nedgang / 100;
        var beloppEfterNedgang = totalBeloppMedSuperRanta * nedgangFactor;
        var beloppNeeded = totalBeloppMedSuperRanta * 0.9;
        var diff = beloppNeeded - beloppEfterNedgang;
        var diffFormated = formatSEK(diff);
        
        tableHtml += getCell(diffFormated);
    }
    tableHtml += "</tr>";

    tableHtml += "</tbody></table>";

    var resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML += tableHtml + "<br/>";

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

    var yearlyInterestCostAfterDeduction = yearlyInterestCost * 0.7;

    var dailyInterestCost = yearlyInterestCost / 365;

    var avkastningEgetKapital5 = egetKapital * 0.05;

    var avkastningEgetKapital10 = egetKapital * 0.1;

    var avkastningEgetKapital15 = egetKapital * 0.15;

    var avkastningBelaning5 = targetLeverageAmount * 0.05;

    var avkastningBelaning10 = targetLeverageAmount * 0.1;

    var avkastningBelaning15 = targetLeverageAmount * 0.15;

    var avkastningTotal5 = newTotalAmount * 0.05;

    var avkastningTotal10 = newTotalAmount * 0.1;

    var avkastningTotal15 = newTotalAmount * 0.15;


    printNewResultSection("Nedgång");
    printNedgangTable(newTotalAmountSuperRanta, egetKapital, targetLeveragePercent, targetLeverageAmount);


    printNewResultSection("Översikt");
    printSekLabel(newTotalAmount, "Nytt totalbelopp");
    printSekLabel(newTotalAmountSuperRanta, "Nytt totalbelopp med superräntan");
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
    printSekLabel(0, "Diff");

    printNewResultSection("Kostnader");
    printDecimalLabel(rantaBasedOnTargetLeverage, "Ränta %");
    printSekLabel(yearlyInterestCost, "Räntekostnad per år");
    printSekLabel(yearlyInterestCostAfterDeduction, "Räntekostnad per år efter ränteavdrag");
    printSekLabel(dailyInterestCost, "Räntekostnad per dag");

    printNewResultSection("Avkastning");
    printSekLabel(avkastningBelaning5, "Vid 5% belåning");
    printSekLabel(avkastningEgetKapital5, "Vid 5% utan belåning");
    printSekLabel(avkastningTotal5, "Vid 5% totalt");
    printNewRow();

    printSekLabel(avkastningBelaning10, "Vid 10% belåning");
    printSekLabel(avkastningEgetKapital10, "Vid 10% utan belåning");
    printSekLabel(avkastningTotal10, "Vid 10% totalt");
    printNewRow();

    printSekLabel(avkastningBelaning15, "Vid 15% belåning");
    printSekLabel(avkastningEgetKapital15, "Vid 15% utan belåning");
    printSekLabel(avkastningTotal15, "Vid 15% totalt");

    return false;
}

calculateLeverage();