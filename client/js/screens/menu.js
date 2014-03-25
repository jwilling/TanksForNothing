game.MenuItem = me.GUI_Object.extend({
    init : function (settings) {
        this.pos = new me.Vector2d(settings.x, settings.y);
        this.image = me.loader.getImage(settings.image);
        //this.backImage = me.loader.getImage(settings.image);
        this.parentMenu = settings.parentMenu;
        this.subMenu = settings.subMenu;
        this.callback = settings.callback;
 
        this.name = "MenuItem";
    },
 
    onClick : function (e) {
        // Only do stuff when our container is in the world.
        if (!this.parentMenu.ancestor) {
            return;
        }
 
        if (this.subMenu) {
            // Remove my parent menu
            if (this.parentMenu) {
                me.game.world.removeChild(this.parentMenu);
            }
 
            // Add the new submenu
            this.subMenu.parentMenu = this.parentMenu;
            me.game.world.addChild(this.submenu);
        }
 
        if (this.callback) {
            this.callback(this);
        }
    },
 
    draw : function (context) {
        context.drawImage(this.image, this.pos.x, this.pos.y);
    }
});
 
game.Menu = me.ObjectContainer.extend({
    init : function () {
        this.parentMenu = null;
 
        this.name = "Menu";
    },
 
    addMenuItem : function (settings) {
        settings.parentMenu = this;
        this.addChild(new game.MenuItem(settings));
    },
 
    goBack : function () {
        if (this.parentMenu) {
            me.game.world.removeChild(this);
            me.game.world.addChild(this.parentMenu);
        }
    }
});