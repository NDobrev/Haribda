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
        engine.on("roll-stats-update", updateSkills.bind(null, this.state));
    }

    unload() {
        this.targeElement.innerHTML = "";
    }
}

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

function updateSkills(state) {
    let skills = document.getElementById("skills");
    if (!skills) return;

    skills.innerHTML = "";

    for (let i = 0; i < 8; ++i) {
        let skill =  document.createElement("div");
        skill.id = "slot" + i;
        skills.appendChild(skill);
    }
    skills.children[0].className = "normal-attack";
    skills.children[0].onclick = attack.bind(null, state);
    skills.children[0].textContent = "Attack: x" + state.rollStats[sideTypes.SwordWood.id];
    skills.children[1].className = "shield-block";
    skills.children[1].onclick = defence;
    skills.children[1].textContent = "Defence: x" + state.rollStats[sideTypes.ShieldWood.id];
}

function loadSkills(state) {
    let skills = document.createElement("div");
    skills.id = "skills";
    for (let i = 0; i < 8; ++i) {
        let skill =  document.createElement("div");
        skill.id = "slot" + i;
        skills.appendChild(skill);
    }
    skills.children[0].className = "normal-attack";
    skills.children[0].onclick = attack.bind(null, state);
    skills.children[0].textContent = "Attack";
    skills.children[1].className = "shield-block";
    skills.children[1].onclick = defence;
    skills.children[1].textContent = "Defence";
    return skills;
}

function loadThrowButton(state) {
    let btn = document.createElement("div");
    btn.id = "throw-button";
    btn.textContent = "Throw";
    btn.onclick = throwDices.bind(null, state);
    return btn;
}

function loadMonster(state) {
    let monster = document.createElement("div");
    monster.id = "monster";
    monster.innerHTML = 
    '<div id="health-bar">'
    + `    <div id="monster-health">${state.monster.health} / ${state.monster.maxHealth}</div>`
    + `    <div id="monster-bar">`
    + `    </div>`
    + `</div>`
    + `<div id="portrait"> </div>`
    return monster;
}



function attack(state) {
    state.monster.health -= state.rollStats[sideTypes.SwordWood.id];
    
    state.monster.health = Math.max(0, state.monster.health);

    let monsterHealth = document.getElementById("monster-health");
    let monsterHealthBar = document.getElementById("monster-bar");
    monsterHealthBar.style.width = 100 * (state.monster.health / state.monster.maxHealth) + '%';
    monsterHealth.textContent = `${state.monster.health} / ${state.monster.maxHealth}`;
    if (state.monster.health == 0) {
        console.log("Monster is dead");
        setTimeout(function() {
            state.monster.maxHealth = Math.floor(state.monster.maxHealth * 1.2);
            state.monster.health = state.monster.maxHealth;
            monsterHealthBar.style.width = 100 * (state.monster.health / state.monster.maxHealth) + '%';
            monsterHealth.textContent = `${state.monster.health} / ${state.monster.maxHealth}`;
        }, 1000);
    }
}

function defence(state) {
    console.log("def");
}

function calcRollStats(state) {
    let result = numbers(Object.keys(sideTypes).length).map(x => 0);
    for (let i = 0; i < state.currentRoll.length; ++i) {
        let rolledSideId = state.currentRoll[i];
        let rolledSide = state.dices[i][rolledSideId];
        result[rolledSide.id]++;
    }
    return result;
}

function throwDices(state) {
    let dices = document.getElementsByClassName("cube");
    state.currentRoll = [];
    for (let dice of dices) {
        let faceId = Math.floor(Math.random() * faces.length);
        let face = faces[faceId].map(x => x + 360 * Math.round(Math.random() * 3 + 1));
        dice.style.transform = `rotateX(${face[0]}deg) rotateY(${face[1]}deg) rotateZ(${face[2]}deg)`;
        dice.style.transition = 0.5 + Math.random() * 4 + 's';
        state.currentRoll.push(faceId);
    }
    engine.trigger("throw", state);

    state.rollStats = calcRollStats(state);
    engine.trigger("roll-stats-update");
}

