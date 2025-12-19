let BASE = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// Updated selectors to match new HTML structure
let drop = document.querySelectorAll(".currency-select");

let msg = document.querySelector(".rate-text");

let btn = document.querySelector(".convert-btn");

// Populate dropdowns with currency options
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

// Add change event listeners to update flags
for(let select of drop){
    select.addEventListener("change", (evt)=>{
        updateflag(evt.target);
    })
}

// Get currency select elements
let fromcurr, tocurr;
for(let s of drop){
    if(s.name=="from"){
        fromcurr = s;
    }else{
        tocurr = s;
    }
}

// Update flag based on selected currency
const updateflag = (target) =>{
    let code = target.value;
    let countryname = countryList[code];
    let newsrc = `https://flagsapi.com/${countryname}/flat/64.png`;
    
    if(target.name=="from"){
        let img = document.querySelector("#frimg img");
        img.src = newsrc;
        // Add fade animation
        img.style.animation = "fadeIn 0.3s ease";
    }
    else if(target.name=="to"){
        let img = document.querySelector("#toimg img");
        img.src = newsrc;
        // Add fade animation
        img.style.animation = "fadeIn 0.3s ease";
    }
}

window.addEventListener("load", ()=>{
    updateexchange();
})

const updateexchange = async ()=>{
    try {
        let amount = document.querySelector("#amount-input");
        let atval = amount.value;
        
        if(atval<1 || atval==""){
            atval = 1;
            amount.value = "1";
        }
        
        // Show loading state
        msg.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        btn.disabled = true;
        btn.style.opacity = "0.7";
        
        console.log(atval);
        console.log(fromcurr.value, tocurr.value);
        
        let url = `${BASE}/${fromcurr.value.toLowerCase()}.json`;
        let response = await fetch(url);
        
        if(!response.ok) {
            throw new Error('Failed to fetch exchange rate');
        }
        
        let result = await response.json();
        let rate = result[fromcurr.value.toLowerCase()][tocurr.value.toLowerCase()];
        let finalamount = (rate * atval).toFixed(2);
        
        // Update with animation
        const rateDisplay = document.querySelector('.rate-display');
        rateDisplay.classList.add('success', 'updated');
        msg.style.animation = "slideIn 0.5s ease";
        msg.innerText = `${atval} ${fromcurr.value} = ${finalamount} ${tocurr.value}`;
        
        // Remove animation classes after animation completes
        setTimeout(() => {
            rateDisplay.classList.remove('success', 'updated');
        }, 800);
        
        // Re-enable button
        btn.disabled = false;
        btn.style.opacity = "1";
        
    } catch(error) {
        console.error('Error:', error);
        msg.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error fetching rate';
        btn.disabled = false;
        btn.style.opacity = "1";
    }
}

btn.addEventListener("click", async (evt)=>{
    evt.preventDefault();
    updateexchange();
})

// Swap button functionality
const swapBtn = document.querySelector("#swap-currencies");
if(swapBtn) {
    swapBtn.addEventListener("click", (evt) => {
        evt.preventDefault();
        
        // Add rotation animation to swap button
        swapBtn.style.transform = "rotate(360deg) scale(1.2)";
        setTimeout(() => {
            swapBtn.style.transform = "";
        }, 300);
        
        // Swap the currency values
        let temp = fromcurr.value;
        fromcurr.value = tocurr.value;
        tocurr.value = temp;
        
        // Update flags with animation
        updateflag(fromcurr);
        updateflag(tocurr);
        
        // Update exchange rate
        setTimeout(() => {
            updateexchange();
        }, 300);
    });
}



