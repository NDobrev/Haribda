class DeckScreen {
    constructor(state) {
        this.state = state;
        this.targeElement = null;
        this.seletedDiceIdx = 0;
        this.board = null;
        this.diceCraftDeck = null;
        this.sidePicker = null;
    }

    load(where) {
        this.targeElement = where;
        let state = this.state;
        let board = document.createElement("div");
        board.id = "deck";

        let diceCraftDeck  = document.createElement("div");
        diceCraftDeck.id = "craft";

        let sidePicker  = document.createElement("div");
        sidePicker.id = "side-picker";

        this.board = board;
        this.diceCraftDeck = diceCraftDeck;
        this.sidePicker = sidePicker;

        state.dices.forEach((dice, idx) => {
            let diceItem = document.createElement("div");
            diceItem.classList.add("item");
            diceItem.textContent = "dice" + idx;
            diceItem.onclick = this.selectDiceForCrafting.bind(this, dice, idx);
            board.appendChild(diceItem);
        })

        loadCraftBoard(state).forEach(x=> {
            diceCraftDeck.appendChild(x)
        });

        state.sides.forEach((side, idx) => {
            let sideItem = document.createElement("div");
            sideItem.classList.add("item", side.class);
            sideItem.onclick = () => engine.trigger("add-dice-side", this.seletedDiceIdx);
            sidePicker.appendChild(sideItem);
        })
        this.targeElement.appendChild(board);
        this.targeElement.appendChild(diceCraftDeck);
        this.targeElement.appendChild(sidePicker);



        engine.on("dice-changed", this.updateCraftDeck.bind(this));
        engine.on("sides-in-inventory-changed", this.updateInventory.bind(this));

        this.selectDiceForCrafting(state.dices[this.seletedDiceIdx], this.seletedDiceIdx)
    }

    unload() {
        this.targeElement.innerHTML = null;
        engine.off("dice-changed", () => navigateTo("deck", state));
    }

    selectDiceForCrafting(dice, diceIdx) {
        // update dice selection
        let items = this.board.getElementsByClassName("item");
        items[this.seletedDiceIdx].classList.remove("item-selected");
        items[diceIdx].classList.add("item-selected");

        this.seletedDiceIdx = diceIdx;
        this.updateCraftDeck(dice);
    }

    updateInventory(sides) {
        this.sidePicker.innerHTML = "";
        sides.forEach((side, idx) => {
            let sideItem = document.createElement("div");
            sideItem.classList.add("item", side.class);
            sideItem.onclick = () => engine.trigger("add-dice-side", this.seletedDiceIdx, idx);
            this.sidePicker.appendChild(sideItem);
        })
    }

    updateCraftDeck(dice) {
        let items = this.diceCraftDeck.children;
        let diceIdx = this.seletedDiceIdx;
        for (let sideIdx = 0; sideIdx < dice.length; ++sideIdx) {
            let item = items[sideIdx];
            item.className = ""
            item.classList.add("item", dice[sideIdx].class);
            item.textContent = "side " + sideIdx;
    
            if (dice[sideIdx].id != sideTypes.Empty.id) {
                console.log(dice[sideIdx].id)
                item.onclick = () => engine.trigger("remove-dice-side", diceIdx, sideIdx);
            } else {
                item.onclick = null;
            }
        }
    }
}

function loadCraftBoard(state) {
     let diceIdx = 0;
     return state.dices[diceIdx].map((side, sideIdx) => {
        let sideItem = document.createElement("div");
        return sideItem;
    });
}
