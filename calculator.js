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

function getTargetLeverage() {
    return getInputValueAsNumber("targetLeverageTbox");
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

function getFormatOptionsDecimal(value) {
    var formatOptions = {
        style: 'decimal',
    };

    return formatOptions;
}

function roundSEK(value) {
    if (value > 100 || value < -100) {
        return Math.round(value / 100) * 100;
    }

    return Math.round(value);
}

function formatSEK(value) {
    var roundedValue = roundSEK(value);

    var formatOptions = getFormatOptionsDecimal(value);
    formatOptions.currency = 'SEK';

    return new Intl.NumberFormat('sv-SE', formatOptions).format(roundedValue);
}

function formatDecimal(value) {
    var roundedValue = Math.round(value * 100) / 100

    var formatOptions = getFormatOptionsDecimal(value);

    return new Intl.NumberFormat('sv-SE', formatOptions).format(roundedValue);
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

function calculateArligRanta(targetLeverageAmount, rantaBasedOnTargetLeveragePercent) {
    var rantaBasedOnTargetLeverageFactor = getRantaAsFactor(rantaBasedOnTargetLeveragePercent);
    var yearlyInterestCost = targetLeverageAmount * rantaBasedOnTargetLeverageFactor;
    return yearlyInterestCost;
}

function getCell(content, style) {
    var styleHtml = "";
    if (style) {
        styleHtml = " style='" + style + "'";
    }
    return "<td" + styleHtml + ">" + content + "</td>";
}

function getDistanceToBelaningGrad(totalBeloppMedSuperRanta, targetLeverageAmount, nedgangFactor, belaningsGransFactor) {
    var beloppEfterNedgang = totalBeloppMedSuperRanta * nedgangFactor;
    var maxBelaningGrans = beloppEfterNedgang * belaningsGransFactor;
    return targetLeverageAmount - maxBelaningGrans;
}

function getNedgangFactor(nedgang) {
    var nedgangFactor = 1 - nedgang / 100;
    return nedgangFactor;
}

function getNedgangCellStyle(value) {
    if (value < 0) {
        return "color: #ccc;";
    }
    return null;
}

function generateDistanceRowHtml(nedgangList, belaningsgradFactor, totalBeloppMedSuperRanta, targetLeverageAmount) {
    var tableHtml = "<tr>";
    var belaningsgradPercent = belaningsgradFactor * 100;
    tableHtml += getCell("Distans till " + belaningsgradPercent + " %", "white-space: nowrap;");

    for (var i = 0; i < nedgangList.length; i++) {
        var nedgang = nedgangList[i];
        var nedgangFactor = getNedgangFactor(nedgang);
        var distance = getDistanceToBelaningGrad(totalBeloppMedSuperRanta, targetLeverageAmount, nedgangFactor, belaningsgradFactor);
        var distanceFormated = formatSEK(distance);

        var style = getNedgangCellStyle(distance);

        tableHtml += getCell(distanceFormated, style);
    }
    tableHtml += "</tr>";
    return tableHtml;
}

function calculateRantaPaRantaBelopp(targetAntalAr, forvantadAvkastningFactor, investedAmount, leverageAmount, rantaBasedOnTargetLeverage) {
    var avkastningSEK = 0;
    var yearlyInterestCost = calculateArligRanta(leverageAmount, rantaBasedOnTargetLeverage);

    for (var ar = 0; ar < targetAntalAr; ar++) {
        var amountWithRantaPaRanta = investedAmount + avkastningSEK;
        avkastningSEK += amountWithRantaPaRanta * forvantadAvkastningFactor;
        avkastningSEK -= yearlyInterestCost;
    }

    return avkastningSEK;
}

function getBreakEvenNumberOfYears(forvantadAvkastningFactor, leverageAmount, breakEvenAmount, rantaBasedOnTargetLeverage) {
    var avkastningSEK = 0;
    var antalAr = 0;
    var yearlyInterestCost = calculateArligRanta(leverageAmount, rantaBasedOnTargetLeverage);

    while (avkastningSEK < breakEvenAmount) {
        var amountWithRantaPaRanta = leverageAmount + avkastningSEK;
        avkastningSEK += amountWithRantaPaRanta * forvantadAvkastningFactor;
        avkastningSEK -= yearlyInterestCost;

        antalAr++;
        if (antalAr > 10000) {
            alert("break getBreakEvenNumberOfYears, more than 10000 loopcount");
            break;
        }
    }

    return antalAr;
}

function generateBreakEvenRowHtml(
    nedgangList,
    totalBeloppMedSuperRanta,
    targetLeverageAmount,
    rantaBasedOnTargetLeverage,
    maxBelaningsgradFactor,
    forvantadAvkastningFactor) {

    var tableHtml = "<tr>";
    var maxBelaningsgradPercent = maxBelaningsgradFactor * 100;
    var forvantadAvkastningPercent = forvantadAvkastningFactor * 100;
    tableHtml += getCell("??r " + forvantadAvkastningPercent + "% avkast. tills breakeven " + maxBelaningsgradPercent + "% bel??ninggrad");

    for (var i = 0; i < nedgangList.length; i++) {
        var nedgang = nedgangList[i];
        var nedgangFactor = getNedgangFactor(nedgang);
        var distance = getDistanceToBelaningGrad(totalBeloppMedSuperRanta, targetLeverageAmount, nedgangFactor, maxBelaningsgradFactor);
        var antalArTillBreakEven = getBreakEvenNumberOfYears(forvantadAvkastningFactor, targetLeverageAmount, distance, rantaBasedOnTargetLeverage);
        if (antalArTillBreakEven <= 0) {
            antalArTillBreakEven = "";
        }
        tableHtml += getCell(antalArTillBreakEven);
    }
    tableHtml += "</tr>";

    return tableHtml;
}

function printNedgangTable(totalBeloppMedSuperRanta, targetLeverageAmount, rantaBasedOnTargetLeverage) {
    var tableHtml = "<table class='table table-striped'>";
    var nedgangList = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 90];

    tableHtml += "<thead><tr>";
    tableHtml += getCell("Nedg??ng %");

    for (var i = 0; i < nedgangList.length; i++) {
        var nedgang = nedgangList[i];
        tableHtml += getCell(nedgang);
    }
    tableHtml += "</tr></thead>";

    tableHtml += "<tbody>";

    tableHtml += "<tr>";
    tableHtml += getCell("Bel??ningsgrad");

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
    tableHtml += getCell("Belopp superr??nta", "white-space: nowrap;");

    for (var i = 0; i < nedgangList.length; i++) {
        var nedgang = nedgangList[i];
        var nedgangFactor = getNedgangFactor(nedgang);
        var beloppEfterNedgang = totalBeloppMedSuperRanta * nedgangFactor;
        var beloppEfterNedgangFormated = formatSEK(beloppEfterNedgang);

        tableHtml += getCell(beloppEfterNedgangFormated);
    }
    tableHtml += "</tr>";

    tableHtml += generateDistanceRowHtml(nedgangList, 0.1, totalBeloppMedSuperRanta, targetLeverageAmount);
    tableHtml += generateDistanceRowHtml(nedgangList, 0.25, totalBeloppMedSuperRanta, targetLeverageAmount);
    tableHtml += generateDistanceRowHtml(nedgangList, 0.5, totalBeloppMedSuperRanta, targetLeverageAmount);
    tableHtml += generateDistanceRowHtml(nedgangList, 0.6, totalBeloppMedSuperRanta, targetLeverageAmount);
    tableHtml += generateDistanceRowHtml(nedgangList, 0.7, totalBeloppMedSuperRanta, targetLeverageAmount);
    tableHtml += generateDistanceRowHtml(nedgangList, 0.8, totalBeloppMedSuperRanta, targetLeverageAmount);
    tableHtml += generateDistanceRowHtml(nedgangList, 0.9, totalBeloppMedSuperRanta, targetLeverageAmount);

    tableHtml += generateBreakEvenRowHtml(nedgangList, totalBeloppMedSuperRanta, targetLeverageAmount, rantaBasedOnTargetLeverage, 0.5, 0.05);
    tableHtml += generateBreakEvenRowHtml(nedgangList, totalBeloppMedSuperRanta, targetLeverageAmount, rantaBasedOnTargetLeverage, 0.5, 0.08);
    tableHtml += generateBreakEvenRowHtml(nedgangList, totalBeloppMedSuperRanta, targetLeverageAmount, rantaBasedOnTargetLeverage, 0.5, 0.1);
    tableHtml += generateBreakEvenRowHtml(nedgangList, totalBeloppMedSuperRanta, targetLeverageAmount, rantaBasedOnTargetLeverage, 0.5, 0.15);

    tableHtml += generateBreakEvenRowHtml(nedgangList, totalBeloppMedSuperRanta, targetLeverageAmount, rantaBasedOnTargetLeverage, 0.9, 0.05);
    tableHtml += generateBreakEvenRowHtml(nedgangList, totalBeloppMedSuperRanta, targetLeverageAmount, rantaBasedOnTargetLeverage, 0.9, 0.08);
    tableHtml += generateBreakEvenRowHtml(nedgangList, totalBeloppMedSuperRanta, targetLeverageAmount, rantaBasedOnTargetLeverage, 0.9, 0.1);
    tableHtml += generateBreakEvenRowHtml(nedgangList, totalBeloppMedSuperRanta, targetLeverageAmount, rantaBasedOnTargetLeverage, 0.9, 0.15);

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

    var yearlyInterestCost = calculateArligRanta(targetLeverageAmount, rantaBasedOnTargetLeverage);

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

    var rantaPaRanta5YearLeverage = calculateRantaPaRantaBelopp(5, 0.1, targetLeverageAmount, targetLeverageAmount, rantaBasedOnTargetLeverage);

    var rantaPaRanta10YearLeverage = calculateRantaPaRantaBelopp(10, 0.1, targetLeverageAmount, targetLeverageAmount, rantaBasedOnTargetLeverage);

    var rantaPaRanta20YearLeverage = calculateRantaPaRantaBelopp(20, 0.1, targetLeverageAmount, targetLeverageAmount, rantaBasedOnTargetLeverage);

    var rantaPaRanta30YearLeverage = calculateRantaPaRantaBelopp(30, 0.1, targetLeverageAmount, targetLeverageAmount, rantaBasedOnTargetLeverage);

    var rantaPaRanta5YearTotal = calculateRantaPaRantaBelopp(5, 0.1, newTotalAmount, targetLeverageAmount, rantaBasedOnTargetLeverage);

    var rantaPaRanta10YearTotal = calculateRantaPaRantaBelopp(10, 0.1, newTotalAmount, targetLeverageAmount, rantaBasedOnTargetLeverage);

    var rantaPaRanta20YearTotal = calculateRantaPaRantaBelopp(20, 0.1, newTotalAmount, targetLeverageAmount, rantaBasedOnTargetLeverage);

    var rantaPaRanta30YearTotal = calculateRantaPaRantaBelopp(30, 0.1, newTotalAmount, targetLeverageAmount, rantaBasedOnTargetLeverage);

    printNewResultSection("??versikt");
    printSekLabel(newTotalAmount, "Nytt totalbelopp");
    printSekLabel(newTotalAmountSuperRanta, "Nytt totalbelopp med superr??ntan");
    printSekLabel(targetLeverageAmount, "M??jlig total bel??ning");
    printDecimalLabel(newLeverageMultiplier, "M??jlig h??vst??ng");
    printSekLabel(egetKapital, "Eget kapital");
    printSekLabel(amountToInvest, "Belopp att justera bel??ning med");

    printNewResultSection("Superr??ntan");
    printSekLabel(currentTotalAmountSuperRanta, "Nuvarande total med superr??nta");
    printSekLabel(targetLeverageAmountIfFullSuperRanta, "Total bel??ning om full superr??nta");
    printSekLabel(extraLeverageFullSuperRanta, "Extra bel??ning om full superr??nta");

    printNewResultSection("R??nteniv??er");
    printSekLabel(newTotalAmountBestInterest, "Nytt tak " + bestInterest + "% r??nta");
    printSekLabel(currentTotalAmountBestInterest, "Nuvarande tak " + bestInterest + "% r??nta");
    printSekLabel(diffNewAndCurrentBestInterest, "Diff");
    printNewRow();

    printSekLabel(newTotalAmountSecondBestInterest, "Nytt tak " + secondBestInterest + "% r??nta");
    printSekLabel(currentTotalAmountSecondBestInterest, "Nuvarande tak " + secondBestInterest + "% r??nta");
    printSekLabel(diffNewAndSecondCurrentBestInterest, "Diff");
    printNewRow();

    printSekLabel(newTotalAmountSuperRanta, "Nytt tak " + superRantaIntereset + "% r??nta");
    printSekLabel(currentTotalAmountSuperRanta, "Nuvarande tak " + superRantaIntereset + "% r??nta");
    printSekLabel(diffTotalAmountSuperRanta, "Diff");
    printNewRow();

    printNewResultSection("Kostnader");
    printDecimalLabel(rantaBasedOnTargetLeverage, "R??nta %");
    printSekLabel(yearlyInterestCost, "R??ntekostnad per ??r");
    printSekLabel(yearlyInterestCostAfterDeduction, "R??ntekostnad per ??r efter r??nteavdrag");
    printSekLabel(dailyInterestCost, "R??ntekostnad per dag");

    printNewResultSection("Avkastning");
    printSekLabel(avkastningBelaning5, "Vid 5% bel??ning");
    printSekLabel(avkastningEgetKapital5, "Vid 5% utan bel??ning");
    printSekLabel(avkastningTotal5, "Vid 5% totalt");
    printNewRow();

    printSekLabel(avkastningBelaning10, "Vid 10% bel??ning");
    printSekLabel(avkastningEgetKapital10, "Vid 10% utan bel??ning");
    printSekLabel(avkastningTotal10, "Vid 10% totalt");
    printNewRow();

    printSekLabel(avkastningBelaning15, "Vid 15% bel??ning");
    printSekLabel(avkastningEgetKapital15, "Vid 15% utan bel??ning");
    printSekLabel(avkastningTotal15, "Vid 15% totalt");
    printNewRow();
    
    printSekLabel(rantaPaRanta5YearLeverage, "Avkastning 5 ??r med 10% bel??ningbelopp");
    printSekLabel(rantaPaRanta10YearLeverage, "Avkastning 10 ??r med 10% bel??ningbelopp");
    printSekLabel(rantaPaRanta20YearLeverage, "Avkastning 20 ??r med 10% bel??ningbelopp");
    printSekLabel(rantaPaRanta30YearLeverage, "Avkastning 30 ??r med 10% bel??ningbelopp");
    printNewRow();

    printSekLabel(rantaPaRanta5YearTotal, "Avkastning 5 ??r med 10% totalbelopp");
    printSekLabel(rantaPaRanta10YearTotal, "Avkastning 10 ??r med 10% totalbelopp");
    printSekLabel(rantaPaRanta20YearTotal, "Avkastning 20 ??r med 10% totalbelopp");
    printSekLabel(rantaPaRanta30YearTotal, "Avkastning 30 ??r med 10% totalbelopp");

    printNewResultSection("Simuleringar nedg??ng");
    printNedgangTable(newTotalAmountSuperRanta, targetLeverageAmount, rantaBasedOnTargetLeverage);

    return false;
}