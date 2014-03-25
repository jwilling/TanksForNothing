var myButton = me.GUI_Object.extend(
{	
   init:function(x, y)
   {
      settings = {}
      settings.image = "button";
      settings.spritewidth = 100;
      settings.spriteheight = 50;
      // parent constructor
      this.parent(x, y, settings);
   },
	
   // output something in the console
   // when the object is clicked
   onClick:function(event)
   {
      console.log("clicked!");
      // don't propagate the event
      return false;
   }
});
