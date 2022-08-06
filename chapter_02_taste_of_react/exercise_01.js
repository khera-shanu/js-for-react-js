// On click, we should display the checkout UI.
// Checkout UI should show selected pizza and total cost.
// Checkout UI should show a close button.

document.querySelector("#checkout_popup_close_container button").onclick = function(){
    document.querySelector("#checkout_popup").style.display = "none";
}

function attachEvents(){
    Array.from(document.querySelectorAll(".pizza button")).map(
        (button, index) => {
            button.onclick = function(){
                // if zero pizza show error alert.
                const pizza_quantity = document.querySelector(`#pizza_${index}`).value;
                const pizza_quantity_in_number = parseInt(pizza_quantity);
                if(pizza_quantity_in_number === 0) {
                    alert("Pizza quantity must be greater than zero");
                    // disable checkout button.
                    document.querySelector("#checkout").style.display = "none";
                    localStorage.setItem(index, pizza_quantity);
                }
                // for more than zero pizzas, save quantity in local storage and enable checkout button.
                else {
                    // save pizza quantity for given pizza in local storage.
                    localStorage.setItem(index, pizza_quantity);
                    // enable checkout button.
                    document.querySelector("#checkout").style.display = "block";
                }
            }
        }
    );
}

const setQuantitiesOnLoad = total_items => {
    for(let index = 0; index < total_items; index++) {
        const pizza_quantity = localStorage.getItem(index);
        if(pizza_quantity) {
            document.querySelector(`#pizza_${index}`).value = pizza_quantity;
            if(parseInt(pizza_quantity) > 0) {
                document.querySelector("#checkout").style.display = "block";
            }
        }
    }
}


const createPizza = (index, pizza) => {
    document.querySelector("#all_pizzas").innerHTML += `
    <div class="pizza">
        <img src="${pizza.image}" alt="${pizza.name}" />
        <h2>${pizza.name}</h2>
        <p>${pizza.description}</p>
        <p clas="price" data-price="${pizza.price}">
            <b>INR ${pizza.price}</b>
            <span class="${pizza.type}"></span>
        </p>
        <div>
            <span>Quantity</span>
            <select id="pizza_${index}">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
        </div>
        <button type="button">Add Pizza</button>
    </div>
    `;
}

const addPizzaToCheckoutUI = (pizza, quantity) => {
    document.querySelector("#checkout_items").innerHTML += `
        <div class="pizza_item">
            <img src="${pizza.image}" />
            <div>
                <div>
                    <p>${pizza.name}</p>
                    <p>Price: INR ${pizza.price}</p>
                    <p>Quantity: ${quantity}</p>
                </div>
                <div>
                    <h3>INR ${pizza.price * quantity}</h3>
                </div>
            </div>
        </div>
    `;
}

const updateCheckoutUITotalAmount = total_amount => {
    document.querySelector("#checkout_total").innerHTML = `<h2>Total payment: INR ${total_amount}</h2>`;
}

const createCheckoutUI = pizzas => {
    document.querySelector("#checkout_popup").style.display = "flex";
    document.querySelector("#checkout_items").innerHTML = "";
    let total_amount = 0;
    for(const [index, pizza] of pizzas.entries()){
        const quantity = Number(localStorage.getItem(index));
        if(quantity) {
           total_amount += pizza.price * quantity;
           addPizzaToCheckoutUI(pizza, quantity);
        }
    }
    updateCheckoutUITotalAmount(total_amount);
}

/* on body load, get and set quantity for given pizza if exists in local storage. */
window.onload = async function(){

    const response = await fetch("./pizza.json");
    const pizzas = await response.json();
    for(const [index, pizza] of pizzas.entries()) {
        createPizza(index, pizza);
    }

    setQuantitiesOnLoad(pizzas.length);
    attachEvents();
    document.querySelector("#checkout button").onclick = () => createCheckoutUI(pizzas);
}