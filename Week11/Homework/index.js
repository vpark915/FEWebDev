document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submit").addEventListener("click", CalculateSavings)
});

function CalculateSavings(event){
    event.preventDefault();
    let livingCost = document.getElementById("requiredCost").value;
    let salary = document.getElementById("salary").value;
    let age = document.getElementById("age").value;

    document.getElementById("401k").innerHTML = "";
    document.getElementById("rothIRA").innerHTML = "";

    let rothVal = 0; 
    let fourOneKVal = 0;
    let savings = salary - livingCost;

    for (let i = age; i < 60; i++){
        if (savings > 6500){
            rothVal += 6500;
        }
        else {
            rothVal += savings; 
        }
        fourOneKVal += savings;
        rothVal = rothVal * 1.07;
        fourOneKVal = fourOneKVal * 1.07;
    } 
    if (salary > 0 && salary < 11600){
        let value = fourOneKVal*0.9
        document.getElementById("401k").innerHTML = `$${value.toFixed(2)}`;
    }
    if (salary > 11600 && salary < 47150){
        let value = fourOneKVal*0.88
        document.getElementById("401k").innerHTML = `$${value.toFixed(2)}`;
    }
    if (salary > 47150 && salary < 100525){
        let value = fourOneKVal*0.78
        document.getElementById("401k").innerHTML = `$${value.toFixed(2)}`;
    }
    if (salary > 100525 && salary < 191950){
        let value = fourOneKVal*0.76
        document.getElementById("401k").innerHTML = `$${value.toFixed(2)}`;
    }
    if (salary > 191950 && salary < 243725){
        let value = fourOneKVal*0.73
        document.getElementById("401k").innerHTML = `$${value.toFixed(2)}`;
    }
    if (salary > 242725 && salary < 609350){
        let value = fourOneKVal*0.68
        document.getElementById("401k").innerHTML = `$${value.toFixed(2)}`;
    }
    if (salary > 609351){
        let value = fourOneKVal*0.63
        document.getElementById("401k").innerHTML = `$${value.toFixed(2)}`;
    }
    document.getElementById("rothIRA").innerHTML = `$${rothVal.toFixed(2)}`;
}