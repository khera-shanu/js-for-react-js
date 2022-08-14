function attachEventsToPizzaButtons() {
  Array.from(document.querySelectorAll(".pizza button")).map(
    (button, index) => {
      button.onclick = function() {
        const quantity = parseInt(
          document.querySelector(`#pizza_${index}`).value
        );
        localStorage.setItem(index, quantity);
        if(quantity === 0) {
          alert("Select atlease one pizza!");
        }

        // read localStorage
        // get all values and parse to integer and sum them
        const all_values = Object.values(localStorage);
        const total = all_values.map(item => parseInt(item)).reduce(
          (x, y) => x + y, 0
        );
        if(total > 0) {
          document.querySelector("#checkout").style.display = "block";
        }
        else {
          document.querySelector("#checkout").style.display = "none";
        }
      }
    }
  )
}

const setQuantities = () => {
  for(const [index, quantity] of Object.entries(localStorage)) {
    document.querySelector(`#pizza_${index}`).value = quantity;
    if(quantity > 0) {
      document.querySelector("#checkout").style.display = "block"; 
    }
  } 
}

const createPizza = (index, pizza) => {
  document.querySelector("#all_pizzas").innerHTML += `
  <div class="pizza">
    <img src="${pizza.image}" alt="${pizza.name}" />
    <h2>${pizza.name}</h2>
    <p>${pizza.description}</p>
    <p>
      <b>INR. ${pizza.price}</b>
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
  `
}

const addPizzaToPopupUI = (pizza, quantity) => {
  document.querySelector("#checkout_items").innerHTML += `
    <div class="pizza_item">
      <img src="${pizza.image}" alt="${pizza.name}" />
      <div>
        <div>
          <p>${pizza.name}</p>
          <p>Price: INR. ${pizza.price}</p>
          <p>Quantity: ${quantity}</p>
        </div>
        <div>
          <h3>INR ${pizza.price * quantity}</h3>
        </div>
      </div>
    </div>
  `; 
}

const updateTotalPrice = total => {
  document.querySelector("#checkout_total").innerHTML = `<b>${total}</b>`;
}


const createPopupUI = pizzas => {
  document.querySelector("#checkout_popup").style.display = "flex";
  document.querySelector("#checkout_items").innerHTML = "";
  let total = 0;
  for(const [index, quantity] of Object.entries(localStorage)) {
    addPizzaToPopupUI(pizzas[index], quantity);
    total += parseInt(quantity) * pizzas[index].price;
  }
  updateTotalPrice(total);
}

document.querySelector("#checkout_popup_close_container button").onclick = () => {
  document.querySelector("#checkout_popup").style.display = "none"; 
}

window.onload = async function () {
  const resp = await fetch("pizzas.json");
  const pizzas = await resp.json();
  for(const [index, pizza] of pizzas.entries()) {
    createPizza(index, pizza);
  }
  attachEventsToPizzaButtons();
  setQuantities();
  document.querySelector("#checkout button").onclick = () => createPopupUI(pizzas);
}