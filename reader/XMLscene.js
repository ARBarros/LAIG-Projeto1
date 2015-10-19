
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.light_0 = true;
    this.light_1 = true;
    this.light_2 = true;
    this.light_3 = true;
    this.light_4 = true;
    this.light_5 = true;
    this.light_6 = true;
    this.light_7 = true;
  

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis=new CGFaxis(this);
	this.initial_matrix = mat4.create();
	this.enableTextures(true);
};

XMLscene.prototype.initLights = function () {

	this.setGlobalAmbientLight(this.graph.illumination["ambient_r"], this.graph.illumination["ambient_g"], this.graph.illumination["ambient_b"], this.graph.illumination["ambient_a"]);

    this.shader.bind();
/*
	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
*/
	

	for(var i=0; i< this.graph.lights.length; i++){
		this.lights[i].setPosition(this.graph.lights[i]["position_x"],this.graph.lights[i]["position_y"],this.graph.lights[i]["position_z"],this.graph.lights[i]["position_w"]);
		this.lights[i].setDiffuse(this.graph.lights[i]["diffuse_r"], this.graph.lights[i]["diffuse_g"],this.graph.lights[i]["diffuse_b"],this.graph.lights[i]["diffuse_a"]);
		this.lights[i].setAmbient(this.graph.lights[i]["ambient_r"], this.graph.lights[i]["ambient_g"],this.graph.lights[i]["ambient_b"],this.graph.lights[i]["ambient_a"]);
		this.lights[i].setSpecular(this.graph.lights[i]["specular_r"], this.graph.lights[i]["specular_g"],this.graph.lights[i]["specular_b"],this.graph.lights[i]["specular_a"])
		if(this.graph.lights[i]["enable_value"]){
			this.lights[i].enable();
		}else{
			this.lights[i].disable();
		}
		this.lights[i].setVisible(true);
		this.lights[i].update();

	}

    this.shader.unbind();
};

XMLscene.prototype.Initials = function(){
	this.camera.near = this.graph.initials["frustum near"];
	this.camera.far = this.graph.initials["frustum far"];

	mat4.translate(this.initial_matrix, this.initial_matrix, [this.graph.initials["translation x"],this.graph.initials["translation y"],this.graph.initials["translation z"] ] );

}

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	this.Initials();
	this.initLights();
	this.loadedOK = true;
};


XMLscene.prototype.processGraph = function(nodeId){
	var material = null;
	//console.log("cenas yay",  this.activeTexture, nodeId);
	if(nodeId != null){
		var node = this.graph.graph_nodes[nodeId];
		
		//faz a multiplicação de matrizes
		this.multMatrix(node.matrix);

		//Aplica materiais
		if(node.material != null){
			material = node.material;
		}
		
		var tex = this.activeTexture;
		
		if(material != null){
			material.apply();  //limpa  textura atual
		}

		//Aplica as texturas
		if(node.texture === "clear"){
			if(this.activeTexture !== null){
				this.activeTexture.unbind();
				//console.log("unbind");
			}
		}else if(node.texture !== "null"){
			//console.log("fazendo o real bind" + nodeId);
			node.texture.bind();
		}
		if(node.texture === "null" && tex !== null){
			tex.bind();
		}

		var current_texture = this.activeTexture;
		//console.log(current_texture, this.activeTexture, nodeId);

		//percorre o grafo recursivamente
		for(var i in node.descendants){
			this.pushMatrix();

			this.processGraph(node.descendants[i].id);

			if (this.activeTexture !== null) this.activeTexture.unbind();
			if (current_texture !== null) current_texture.bind();
			 

			this.popMatrix();
		}

		
		
		//display de primitivas se for uma folha
		if(node.primitive != undefined){
			node.primitive.display();
		}

	}
}


XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
    this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.loadedOK)
	{
		
		this.processGraph(this.graph.root_node);

		if(this.light_0){
			this.lights[0].enable();
		}else{
			this.lights[0].disable();
		}
		if(this.light_1){
			this.lights[1].enable();
		}else{
			this.lights[1].disable();
		}
		if(this.light_2){
			this.lights[2].enable();
		}else{
			this.lights[2].disable();
		}
		if(this.light_3){
			this.lights[3].enable();
		}else{
			this.lights[3].disable();
		}
		if(this.light_4){
			this.lights[4].enable();
		}else{
			this.lights[4].disable();
		}
		if(this.light_5){
			this.lights[5].enable();
		}else{
			this.lights[5].disable();
		}
		if(this.light_6){
			this.lights[6].enable();
		}else{
			this.lights[6].disable();
		}
		if(this.light_7){
			this.lights[7].enable();
		}else{
			this.lights[7].disable();
		}

		for (var i = 0; i < this.lights.length; i++)
		{
			this.lights[i].update();
		}


	};	

    this.shader.unbind();
};

