var myButton = me.GUI_Object.extend(
{	
   init:function(x, y)
   {
      settings = {}
      settings.image = me.loader.getImage("button");
      settings.spritewidth = 1326;
      settings.spriteheight = 995;
      // parent constructor
      this.parent(x, y, settings);
   },
	
   // output something in the console
   // when the object is clicked
   onClick:function(event)
   {
      me.state.change(me.state.PLAY);
      // don't propagate the event
      return true;
   },
   
   draw : function(context) {
   		context.drawImage(settings.image, 0,0);
   }
});
