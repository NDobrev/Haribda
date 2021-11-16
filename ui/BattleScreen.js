class BattleScreen {
    constructor(state) {
        this.state = state;
        this.targeElement = null;
    }

    load(where) {
        this.targeElement = where;
        let state = this.state;
        this.targeElement.appendChild(loadBoard(state));
        this.targeElement.appendChild(loadThrowButton(state));
        this.targeElement.appendChild(loadSkills(state));
        this.targeElement.appendChild(loadMonster(state));
        engine.on("roll-stats-update", updateSkills);
        engine.on("dice-face-changed", updateDaces);
        engine.on("enemy-health-changed", updateHealth);


        engine.trigger("enemy-health-changed", state.monster);
    }

    unload() {
        this.targeElement.innerHTML = "";


        engine.off("roll-stats-update", updateSkills);
        engine.off("dice-face-changed", updateDaces);
        engine.off("enemy-health-changed", updateHealth);
    }
}

let faces = [
    [0, 0, 0], // 1
    [180, 0, 0], // 2
    [0, 270, 0], // 3
    [0, 90, 0], // 4
    [270, 0, 0], // 5
    [90, 0, 0], // 6
]

function createDice(diceSides) {
    let create = (...arguments) => {
        let r = document.createElement("div");
        r.classList.add(...arguments);
        return r;
    }

    let cube = create("cube");
    cube.appendChild(create("face", "front", diceSides[0].class));
    cube.appendChild(create("face", "back", diceSides[1].class));
    cube.appendChild(create("face", "right",  diceSides[2].class));
    cube.appendChild(create("face", "left",  diceSides[3].class));
    cube.appendChild(create("face", "top",  diceSides[4].class));
    cube.appendChild(create("face", "bottom",  diceSides[5].class));

    let dice = create("container");
    dice.appendChild(cube);
    return dice;
}


function loadBoard(state) {
    let board = document.createElement("div");
    board.id = "board";
    state.dices.forEach((dice, idx) => {
        let diceEl = createDice(dice);
        let cube = diceEl.querySelector(".cube");
        let faceId = state.currentRoll[idx] || 0;
        let face = faces[faceId];
        cube.style.transform = `rotateX(${face[0]}deg) rotateY(${face[1]}deg) rotateZ(${face[2]}deg)`;
        board.appendChild(diceEl);
    })

    return board;
}

function updateSkills(oldStats, newStats) {
    let skills = document.getElementById("skills");
    if (!skills) return;

    skills.children[0].textContent = "Attack: x" + newStats[sideTypes.SwordWood.id];
    skills.children[1].textContent = "Defence: x" + newStats[sideTypes.ShieldWood.id];
}

function loadSkills() {
    let skills = document.createElement("div");
    skills.id = "skills";
    for (let i = 0; i < 8; ++i) {
        let skill =  document.createElement("div");
        skill.id = "slot" + i;
        skills.appendChild(skill);
    }
    skills.children[0].className = "normal-attack";
    skills.children[0].onclick = () => engine.trigger("use-skill", "normal-attack");
    skills.children[0].textContent = "Attack";
    skills.children[1].className = "shield-block";
    skills.children[1].onclick = () => engine.trigger("use-skill", "shield-block");
    skills.children[1].textContent = "Defence";
    return skills;
}

function loadThrowButton() {
    let btn = document.createElement("div");
    btn.id = "throw-button";
    btn.textContent = "Throw";
    btn.onclick = () => engine.trigger("throw-dices");
    return btn;
}

function loadMonster() {
    let monster = document.createElement("div");
    monster.id = "monster";
    monster.innerHTML = 
    '<div id="health-bar">'
    + `    <div id="monster-health"></div>`
    + `    <div id="monster-bar">`
    + `    </div>`
    + `</div>`
    + `<div id="portrait"> </div>`
    return monster;
}

function updateHealth(enemy) {
    let monsterHealth = document.getElementById("monster-health");
    let monsterHealthBar = document.getElementById("monster-bar");
    monsterHealthBar.style.width = 100 * (enemy.health / enemy.maxHealth) + '%';
    monsterHealth.textContent = `${enemy.health} / ${enemy.maxHealth}`;
}

function defence() {
    console.log("def");
}

function updateDaces(oldfaces, newfaces) {
    let dices = document.getElementsByClassName("cube");
    if (dices.length != newfaces.length) {
        console.error("Faces and dices doesn't match")
        return;
    }
    for (let i = 0; i < dices.length; ++i) {
        let faceId = newfaces[i];
        let face = faces[faceId].map(x => x + 360 * Math.round(Math.random() * 3 + 1));
        dices[i].style.transform = `rotateX(${face[0]}deg) rotateY(${face[1]}deg) rotateZ(${face[2]}deg)`;
        dices[i].style.transition = (1.5 + Math.random() * 1) + 's';
    }
}

