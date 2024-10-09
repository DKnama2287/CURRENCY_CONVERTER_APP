let BASE = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

let drop = document.querySelectorAll(".dropdown select");

let msg = document.querySelector("#convert p");

let btn = document.querySelector("button");

for(let select of drop){
    for(let c in countryList){
        let newopt = document.createElement("option");
        newopt.innerText = c;
        newopt.value = c;
        if(select.name=="from" && c=="USD"){
            newopt.selected="selected";
        }
        if(select.name=="to" && c=="INR"){
            newopt.selected="selected";
        }
        select.append(newopt);
    }
}

for(let select of drop){
    select.addEventListener("change", (evt)=>{
        updateflag(evt.target, select.name);
        console.log(evt.target, select.name);
    })
}

for(let s of drop){
    if(s.name=="from"){
        var fromcurr = s;
    }else{
        var tocurr = s;
    }
}

const updateflag = (target, name) =>{
    let code = target.value;
    let countryname = countryList[code];
    let newsrc = `https://flagsapi.com/${countryname}/flat/64.png`;
    if(name=="from"){
        let img = document.querySelector("#frimg img");
        img.src = newsrc;
    }
    if(name=="to"){
        let img = document.querySelector("#toimg img");
        img.src = newsrc;
    }
}

window.addEventListener("load", ()=>{
    updateexchange();
})

const updateexchange = async ()=>{
    let amount = document.querySelector("#amount input");
    let atval = amount.value;
    if(atval<1 || atval==""){
        atval =1;
        amount.value ="1";
    }
    console.log(atval);
    console.log(fromcurr.value, tocurr.value);
    let url = `${BASE}/${fromcurr.value.toLowerCase()}.json`;
    let response = await fetch(url);
    let result = await response.json();
    // console.log(result.usd.inr);
    let rate = result[fromcurr.value.toLowerCase()][tocurr.value.toLowerCase()];
    let finalamount = rate*atval;
    msg.innerText = `${atval} ${fromcurr.value}  =  ${finalamount} ${tocurr.value}`;
}

btn.addEventListener("click", async (evt)=>{
    evt.preventDefault();
    updateexchange();
})



