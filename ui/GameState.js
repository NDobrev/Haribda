
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

let faces = [
    [0, 0, 0], // 1
    [180, 0, 0], // 2
    [0, 270, 0], // 3
    [0, 90, 0], // 4
    [270, 0, 0], // 5
    [90, 0, 0], // 6
]


let gCurrentScreen = 0;
let gameState = {
    player: {
        health: 100,
        money: 1000,
    },
    monster: {
        health: 25,
        maxHealth: 25,
    },
    currentRoll: numbers(Object.keys(sideTypes).length).map(x => 0),
    dices: [
        attackDice,
        defenceDice,
        defaultDice,
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
    selectedDiceIdx: 0,
    rollStats: [],
}