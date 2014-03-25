game.MenuScreen = me.ScreenObject.extend({
    onResetEvent : function () {
        // Create menus
        this.rootMenu = new game.Menu();
        var signedInMenu = new game.Menu();
        var signUpMenu = new game.Menu();
        var achievementsMenu = new game.Menu();
 
        // Add menu items to root menu
        this.rootMenu.addMenuItem({
            x : 20,
            y : 20,
            image : "button",
           // backImage : "",
            subMenu : signedInMenu
        });
        this.rootMenu.addMenuItem({
            x : 20,
            y : 100,
            image : "button",
           // backImage : "",
            subMenu : signUpMenu
        });
 
        // Add menu items to signedInMenu
        signedInMenu.addMenuItem({
            x : 20,
            y : 20,
            image : "button",
           // backImage : "",
            callback : function () {
                me.state.change(me.state.PLAY);
            }
        });
        signedInMenu.addMenuItem({
            x : 20,
            y : 100,
            image : "button",
           // backImage : "",
            subMenu : achievementsMenu
        });
        signedInMenu.addMenuItem({
            x : 20,
            y : 180,
            image : "button",
            //backImage : "",
            callback : signedInMenu.goBack
        });
 
        // ... Add more menu items
 
        // Add the root menu to the game entity manager
        me.game.world.addChild(this.rootMenu);
    }
});