const createPizza = (index, pizza) => {
    document.querySelector("#all_pizzas").innerHTML += `
    <div class="pizza">
        <img src="${pizza.image}" alt="${pizza.name}" />
        <h2>${pizza.name}</h2>
        <p>${pizza.description}</p>
        <p>
            <b>INR ${pizza.price}</b>
            <span class="${pizza.type}"></span>
        </p>
        <div>
            <span>Quantity</span>
            <select>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
        </div>
        <button type="button">Add Pizza</button>
    </div>`;
}

window.onload = async function(){
    const response = await fetch("./pizza.json");
    const pizzas = await response.json();
    for(const [index, pizza] of pizzas.entries()) {
        createPizza(index, pizza);
    }
}