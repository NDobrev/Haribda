class DeckScreen {
    constructor(state) {
        this.state = state;
        this.targeElement = null;
    }

    load(where) {
        this.targeElement = where;
        let state = this.state;
        let board = document.createElement("div");
        board.id = "deck";

        let diceCraft  = document.createElement("div");
        diceCraft.id = "craft";

        let facePicker  = document.createElement("div");
        facePicker.id = "side-picker";

        state.dices.forEach((dice, idx) => {
            let diceItem = document.createElement("div");
            diceItem.classList.add("item");
            diceItem.textContent = "dice" + idx;
            if (state.selectedDiceIdx == idx) {
                diceItem.classList.add("item-selected");
            }
            diceItem.onclick = selectDiceForCrafting.bind(null,state, idx, diceItem, diceCraft);
            board.appendChild(diceItem);
        })

        loadCraftBoard(state).forEach(x=> {
            diceCraft.appendChild(x)
        });


        state.sides.forEach((side, idx) => {
            let sideItem = document.createElement("div");
            sideItem.classList.add("item", side.class);
            sideItem.onclick = addSideToDice.bind(null, state, idx);
            facePicker.appendChild(sideItem);
        })
        this.targeElement.appendChild(board);
        this.targeElement.appendChild(diceCraft);
        this.targeElement.appendChild(facePicker);
    }

    unload() {
        this.targeElement.innerHTML = null;
    }
}


function removeSideFromDice(state, sideIdx) {
    let diceIdx = state.selectedDiceIdx;
    let dice = state.dices[diceIdx];
    let side = dice[sideIdx];
    state.sides.push(side);
    dice[sideIdx] = sideTypes.Empty;
    navigateTo("deck", state);
}

function addSideToDice(state, sideIdx) {
    let diceIdx = state.selectedDiceIdx;
    let side = state.sides[sideIdx];
    let dice = state.dices[diceIdx];
    for (let i = 0; i < dice.length; ++i) {
        if (dice[i] == sideTypes.Empty) {
            state.sides.splice(i, 1);
            dice[i] = side;
            break;
        }
    }
    navigateTo("deck", state);
}

function selectDiceForCrafting(state, diceIdx, dice, craft) {
    state.selectedDiceIdx = diceIdx;
    navigateTo("deck", state);
}

function loadCraftBoard(state) {
     let diceIdx = state.selectedDiceIdx;
     return state.dices[diceIdx].map((side, sideIdx) => {
        let sideItem = document.createElement("div");
        sideItem.classList.add("item", side.class);
        sideItem.textContent = "side " + sideIdx;

        // add remove button
        if (side != sideTypes.Empty) {
            sideItem.onclick = removeSideFromDice.bind(null, state, sideIdx);
        }

        return sideItem;
    });
}
