function navigateTo(panel, state) {
    if (gCurrentScreen) {
        gCurrentScreen.unload();
    }
    let main = document.getElementById("main");
    switch(panel) {
        case "battle":
        gCurrentScreen =  new BattleScreen(state);
        break;
        case "deck":
        gCurrentScreen = new DeckScreen(state);
        break;
        case "shop":
        gCurrentScreen = new ShopScreen(state);
        break;
        case "settings":
        console.error(`${panel} can't be loaded`);
        break;
    }
    gCurrentScreen.load(main);
}