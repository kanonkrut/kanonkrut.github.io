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

function calculateLeverageInSEK() {
    var totalAmount = getCurrentTotalAmount();
    var leverageSek = 0;

    while(true) {

    }

    return leverageSek;
}

function calculateLeverage(){
    alert("HEJ");
}