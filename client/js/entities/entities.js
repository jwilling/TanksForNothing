/*------------------- 
a player entity
-------------------------------- */
game.PlayerEntity = me.ObjectEntity.extend({
 
    /* -----
 
    constructor
 
    ------ */
 
    init: function(x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);
 
        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity(2, 2);
        
        // adjust the bounding box
    	this.updateColRect(8, 48, -1, 0);
        
        this.gravity = 0;
       
    },
 
    /* -----
 
    update the player pos
 
    ------ */
    update: function() {
 		var newAngle = this.angle;
        if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            //this.flipX(true);
            newAngle = Number.prototype.degToRad(-90);
            // update the entity velocity
            this.vel.x -= this.accel.x * me.timer.tick;
        } 
        else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            //this.flipX(false);
            newAngle = Number.prototype.degToRad(90);
            this.vel.x += this.accel.x * me.timer.tick;
        }
        else if (me.input.isKeyPressed('down')) {
            // unflip the sprite
            //this.flipY(true);
            newAngle = Number.prototype.degToRad(180);
            // update the entity velocity
            this.vel.y += this.accel.y * me.timer.tick;
        } 
        else if (me.input.isKeyPressed('up')) {
            // unflip the sprite
            //this.flipY(false);
            newAngle = Number.prototype.degToRad(0);
            // update the entity velocity
            this.vel.y -= this.accel.y * me.timer.tick;
        }  
        else {
            this.vel.x = 0;
            this.vel.y = 0;
        }
        
        /*if (me.input.isKeyPressed('jump')) {
            // make sure we are not already jumping or falling
            if (!this.jumping && !this.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.vel.y = -this.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.jumping = true;
            }
 
        }*/
 
        // check & update player movement
        this.renderable.angle = newAngle;
        this.updateMovement();
 
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
         
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    }
    
   
 
});
/*----------------
 a Turret entity
------------------------ */
game.TurretEntity = me.ObjectEntity.extend({
	
	init: function(x, y, settings){
		this.parent(x, y, settings);
		// set the default horizontal & vertical speed (accel vector)
       this.setVelocity(2, 2);
        
        // adjust the bounding box
    	this.updateColRect(8, 48, -1, 0);
        
        this.gravity = 0;
        this.friction = 0.1;
        this.trackAngle = 0;
	},
	
	 update: function() {
 		var newAngle = this.angle;
 		var i = this.trackAngle;
       if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            //this.flipX(true);
            //newAngle = Number.prototype.degToRad(-90);
            // update the entity velocity
            this.vel.x -= this.accel.x * me.timer.tick;
        } 
        else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
           // this.flipX(false);
            //newAngle = Number.prototype.degToRad(90);
            // update the entity velocity
            this.vel.x += this.accel.x * me.timer.tick;
        }
        else if (me.input.isKeyPressed('down')) {
            // unflip the sprite
            //this.flipY(true);
            //newAngle = Number.prototype.degToRad(180);
            // update the entity velocity
            this.vel.y += this.accel.y * me.timer.tick;
        } 
        else if (me.input.isKeyPressed('up')) {
            // unflip the sprite
            //this.flipY(false);
            //newAngle = Number.prototype.degToRad(0);
            // update the entity velocity           
            this.vel.y -= this.accel.y * me.timer.tick;
        }
     	else {
            this.vel.x = 0;
            this.vel.y = 0;
        }
        
        
        if(me.input.isKeyPressed('rotateCountClock')){
        	i -= 2;
        	newAngle = Number.prototype.degToRad(i);
        	/*this.vel.x -= this.accel.x * me.timer.tick;
			this.vel.x += this.accel.x * me.timer.tick;
			this.vel.y += this.accel.y * me.timer.tick;
			this.vel.y -= this.accel.y * me.timer.tick;*/
        }
        else if(me.input.isKeyPressed('rotateClock')){
        	i += 2;
        	newAngle = Number.prototype.degToRad(i);
        	/*this.vel.x -= this.accel.x * me.timer.tick;
			this.vel.x += this.accel.x * me.timer.tick;
			this.vel.y += this.accel.y * me.timer.tick;
			this.vel.y -= this.accel.y * me.timer.tick;*/
        }
        else{
        	newAngle = Number.prototype.degToRad(this.trackAngle);
        }

       /* if(me.input.isKeyPressed('space')) {
        	var shot = me.entityPool.newInstanceOf('bullet', this.pos.x, this.pos.y, {
        		image: 'bulletTest',
        		spritewidth: 24,
        		spriteheight: 24
        	});
        	
        	me.game.add(shot, 4);
        	me.game.sort();
        }
        /*if (me.input.isKeyPressed('jump')) {
            // make sure we are not already jumping or falling
            if (!this.jumping && !this.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.vel.y = -this.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.jumping = true;
            }
 
        }*/
 
        // check & update player movement
        this.trackAngle = i;
        this.renderable.angle = newAngle;
        this.updateMovement();
 
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
         
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    },
    
});


/*----------------
 a Bullet entity
------------------------ */
game.BulletEntity = me.ObjectEntity.extend({
  
  
    init: function(x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);
        this.gravity = 0;
        this.collidable = true;
        
        this.shotAngle = settings.angle;
        this.renderable.angle = this.shotAngle;
        this.maxVelocity = 5;
        
        /*var localX = (settings.target.x - x);
    	var localY = (settings.target.y - y);
        var localTargetVector = new me.Vector2d(localX, localY);
        localTargetVector.normalize();
        localTargetVector.scale(new me.Vector2d(this.maxVelocity, this.maxVelocity))
        
        this.setVelocity(localTargetVector.x, localTargetVector.y);*/
       this.setVelocity(5,5);
   },
   
   update: function() {
   	this.vel.x += this.accel.x * me.timer.tick;
    this.vel.y += this.accel.y * me.timer.tick;
    this.computeVelocity(this.vel);
    this.updateMovement();
    var bullet = this;
    if (this.vel.x == 0 || this.vel.y == 0) {
    	me.game.remove(bullet);
    }
    
    var res = me.game.collide(this);
    if (res && res.obj.id != bullet.id && !res.onj.invincible) {
    	me.game.remove(bullet);
    }
    
    else if (res && res.obj.type === game.COLLIDE_OBJECT) {
    	me.game.remove(bullet);
    }
 	
   }
 
  
        
  
   
});