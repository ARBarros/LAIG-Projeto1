/**
 * MyInterface
 * @constructor
 */
function MyInterface() {
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/** 
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	 
	CGFinterface.prototype.init.call(this, application);
	
	this.gui = new dat.GUI();
	
	var lights_menu=this.gui.addFolder("Lights");

	

	lights_menu.add(this.scene, 'light_0').listen();
	lights_menu.add(this.scene, 'light_1').listen();
	lights_menu.add(this.scene, 'light_2').listen();
	lights_menu.add(this.scene, 'light_3').listen();
	lights_menu.add(this.scene, 'light_4').listen();
	lights_menu.add(this.scene, 'light_5').listen();
	lights_menu.add(this.scene, 'light_6').listen();
	lights_menu.add(this.scene, 'light_7').listen();


	return true;
};
