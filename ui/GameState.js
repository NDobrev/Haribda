
const sideTypes = {
    Empty: { id: 0, class: "empty-side"},
    SwordWood: { id: 1, class: "sword-wood-side"},
    ShieldWood: { id: 2, class: "shield-wood-side"},
}

const attackDice = [
    sideTypes.SwordWood,
    sideTypes.SwordWood,
    sideTypes.SwordWood,
    sideTypes.SwordWood,
    sideTypes.SwordWood,
    sideTypes.SwordWood,
];

const defenceDice = [
    sideTypes.ShieldWood,
    sideTypes.ShieldWood,
    sideTypes.ShieldWood,
    sideTypes.ShieldWood,
    sideTypes.ShieldWood,
    sideTypes.ShieldWood,
];

const defaultDice = [
    sideTypes.Empty,
    sideTypes.SwordWood,
    sideTypes.SwordWood,
    sideTypes.ShieldWood,
    sideTypes.ShieldWood,
    sideTypes.ShieldWood,
];

const emptyDice = [
    sideTypes.Empty,
    sideTypes.Empty,
    sideTypes.Empty,
    sideTypes.Empty,
    sideTypes.Empty,
    sideTypes.Empty,
];

function createDiceBySides(sides) {
    return {
        sides: [...sides],
        spended: 0,
        value: 100
    }
}

let gCurrentScreen = 0;
localStorage.setItem("gameState", null);
function loadGame() {
    // let gameState = localStorage.getItem("gameState")
    // if (gameState) {
    //     return JSON.parse(gameState);
    // }

    return {
        player: {
            health: 5,
            money: 1000,
        },
        monster: {
            health: 5,
            maxHealth: 5,
            monsterName: "Green goblin"
        },
        currentRoll: numbers(Object.keys(sideTypes).length).map(x => 0),
        dices: [
            createDiceBySides(attackDice),
            createDiceBySides(defenceDice),
            createDiceBySides(defaultDice),
            createDiceBySides(defaultDice),
            createDiceBySides(defaultDice),
            createDiceBySides(defaultDice),
            createDiceBySides(defaultDice),
        ],
    
        sides: [
            sideTypes.SwordWood,
            sideTypes.SwordWood,
            sideTypes.SwordWood,
            sideTypes.SwordWood,
            sideTypes.ShieldWood,
            sideTypes.ShieldWood,
            sideTypes.ShieldWood,
            sideTypes.ShieldWood,
            sideTypes.ShieldWood,
        ],
    
        shop: [
            {
                type: "dice",
                price: 100,
                value: [...emptyDice],
            },
            {
                type: "side",
                price: 10,
                value: sideTypes.SwordWood,
            },
            {
                type: "side",
                price: 10,
                value: sideTypes.SwordWood,
            }
        ],
        skills: [
            {
                name: "Normal attack",
                class: "normal-attack",
                affectedBy: sideTypes.SwordWood,
                execute: attack
            },
            {
                name: "Shield block",
                class: "shield-block",
                affectedBy: sideTypes.ShieldWood,
                execute: (state) => {}
            }
        ],
        rollStats: [],
    }
}


let gameState = loadGame();

setInterval(() => {
    localStorage.setItem("gameState", JSON.stringify(gameState));
}, 1000)

function throwDices(state) {
    if (state.player.throwsLeft == 0) {
        console.log("You are dead");
        return;
    }
    let faceIdxs = numbers(state.dices.length)
    .map(x => {
        return Math.floor(Math.random() * faces.length);
    })
    let old = state.currentRoll;
    state.currentRoll = faceIdxs;
    engine.trigger("dice-face-changed", old, faceIdxs);
    engine.trigger("throw-count-changed", state.player.throwsLeft);
}

function calcDiceStats(state, oldDices, newDices) {
    let result = numbers(Object.keys(sideTypes).length).map(x => 0);
    for (let i = 0; i < state.currentRoll.length; ++i) {
        let rolledSideId = state.currentRoll[i];
        let rolledSide = state.dices[i].sides[rolledSideId];
        result[rolledSide.id]++;
    }
    let old = state.rollStats; 
    state.rollStats = result;
    engine.trigger("roll-stats-update", state);
}

function useSkill(state, skillName) {
    if (state.player.throwsLeft == 0) {
        console.error("Can't performe this action user is dead");
        return;
    }
    if (state.rollStats.length == 0) {
        engine.trigger("no-active-roll");
        return;
    }
    let skill = state.skills.find((x) => x.class = skillName);
    skill.execute(state);
}

function attack(state) {
    if (state.monster.health == 0) {
        return;
    }
    state.monster.health -= state.rollStats[sideTypes.SwordWood.id];
    state.monster.health = Math.max(0, state.monster.health);
    if (state.monster.health == 0) {
        engine.trigger("enemy-is-dead");
    }
    engine.trigger("enemy-health-changed", state.monster);

    state.rollStats[sideTypes.SwordWood.id] = 0;
    engine.trigger("roll-stats-update", state);

    engine.trigger("disable-dices", state, sideTypes.SwordWood.id);

}

function deadEnemy(state) {
    if (state.monster.health > 0) {
        console.error("Enemy is not dead");
    }
    setTimeout(() => {
        state.monster.maxHealth = Math.round(state.monster.maxHealth * 1.5);
        state.monster.health = state.monster.maxHealth;
        engine.trigger("enemy-health-changed", state.monster);
    }, 1000);
}

function removeDiceSide(state, diceIdx, sideIdx) {
    let dice = state.dices[diceIdx];
    let side = dice.sides[sideIdx];
    state.sides.push(side);
    dice.sides[sideIdx] = sideTypes.Empty;
    engine.trigger("dice-changed", dice, diceIdx);
    engine.trigger("sides-in-inventory-changed", state.sides);
}

function addDiceSide(state, diceIdx, sideIdx) {
    let side = state.sides[sideIdx];
    let dice = state.dices.sides[diceIdx];
    for (let i = 0; i < dice.length; ++i) {
        if (dice[i] == sideTypes.Empty) {
            state.sides.splice(sideIdx, 1);
            dice[i] = side;
            break;
        }
    }
    engine.trigger("dice-changed", dice, diceIdx);
    engine.trigger("sides-in-inventory-changed", state.sides);
}

engine.on("throw-dices", throwDices.bind(null, gameState));
engine.on("dice-face-changed", calcDiceStats.bind(null, gameState));
engine.on("use-skill", useSkill.bind(null, gameState));
engine.on("enemy-is-dead", deadEnemy.bind(null, gameState));
engine.on("remove-dice-side", removeDiceSide.bind(null, gameState))
engine.on("add-dice-side", addDiceSide.bind(null, gameState))

