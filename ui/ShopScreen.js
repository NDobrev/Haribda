class ShopScreen {
    constructor(state) {
        this.state = state;
        this.targeElement = null;
    }

    load(where) {
        this.targeElement = where;
        let shop = document.createElement("div");
        shop.id = "shop";
        let state = this.state;
        state.shop.forEach((item, idx) => {
            let shopItem = document.createElement("div");
            shopItem.classList.add("item");
            if (item.type == "side") {
                shopItem.classList.add(item.value.class);
            }
            else {
                shopItem.textContent = `type: ${item.type} price: ${item.price}`;
            }
            shopItem.onclick = buyItem.bind(null, state, idx);
            shop.appendChild(shopItem);
        })


        let inventory = document.createElement("div");
        inventory.id = "inventory";

        state.dices.forEach((dice, idx) => {
            let inventoryItem = document.createElement("div");
            inventoryItem.classList.add("item");
            inventoryItem.textContent = `dice: ${idx}`;
            inventoryItem.onclick = sellDice.bind(null, state, idx);
            inventory.appendChild(inventoryItem);
        })

        state.sides.forEach((side, idx) => {
            let inventoryItem = document.createElement("div");
            inventoryItem.classList.add("item", side.class);
            inventoryItem.onclick = sellSide.bind(null, state, idx);
            inventory.appendChild(inventoryItem);
        })
        this.targeElement.appendChild(inventory);
        this.targeElement.appendChild(shop);
    }

    unload() {
        this.targeElement.innerHTML = null;
    }
}

function buyItem(state, idx) {
    if (state.player.money > state.shop[idx].price) {
        state.player.money -= state.shop[idx].price;
        let item = state.shop.splice(idx, 1)[0];
        if (item.type == "dice") {
            state.dices.push(item.value);
        } else if (item.type == "side") {
            state.sides.push(item.value);
        }
    }
    navigateTo("shop", state);
}

function sellDice(state, idx) {
    state.player.money += 50;
    let dice = state.dices.splice(idx, 1)[0];
    state.shop.push({
        type: "dice",
        price: 100,
        value: dice
    })
    navigateTo("shop", state);
}

function sellSide(state, idx) {
    state.player.money += 5;
    let side = state.sides.splice(idx, 1)[0];
    state.shop.push({
        type: "side",
        price: 10,
        value: side
    })
    navigateTo("shop", state);
}
