/**
 * Sphere
 * @param scene
 * @param rad 
 * @param slices 
 * @param stacks
 * @constructor
 */
function Sphere(scene, rad, slices, stacks) {
 	CGFobject.call(this,scene);
	
 	this.rad=rad;
	this.slices=slices;
	this.stacks=slices;

 	this.initBuffers();
 };

Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor = Sphere;


Sphere.prototype.initBuffers = function() {
 	
	


 	this.indices = [];
 	this.vertices = [];
 	this.normals = [];
 	this.texCoords = [];

 	var angle_perimeter = Math.PI*2/this.slices;
	var angle_height = Math.PI/this.stacks;
 	
 	for(var j = 0; j <= this.stacks; j++) {
 		for(var i = 0; i <= this.slices; i++) {
 			var temp = Math.PI-angle_height*i;
			this.vertices.push( Math.sin(temp)*Math.cos(j*angle_perimeter)*this.rad,
					Math.sin(temp)*Math.sin(j*angle_perimeter)*this.rad,	
					Math.cos(temp)*this.rad );
			this.texCoords.push( j/this.slices,
				1 - i/this.stacks );
			this.normals.push( Math.sin(temp) * Math.cos(j*angle_perimeter),
					Math.sin(temp) * Math.sin(j*angle_perimeter),	
					Math.cos(temp) );
			
			
			if(i > 0 && j > 0) {
					var verts = this.vertices.length/3;
					this.indices.push(verts-2, verts-1, verts-this.slices-2);
					this.indices.push(verts-this.slices-2, verts-this.slices-3, verts-2);
			}
 		}
 	}
	
	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };


 Sphere.prototype.setAmplifFactor = function(amplif_s, amplif_t) {}