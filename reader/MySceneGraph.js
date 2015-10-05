
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseGlobalsExample(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};



/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {
	
	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}
	
	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};

};


MySceneGraph.prototype.parseInitials = function(rootElement) {
	var elems = rootElement.getElementsByTagName('INITIALS');
	if (elems == null) {
		return "INITIALS element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'INITIALS' element found.";
	}
	
	//var block = elems[0];

	var frustum = rootElement.getElementsByTagName('frustum');
	if (frustum == null) {
		return "frustum element is missing.";
	}
	this.initials["frustum near"] = this.reader.getFloat(frustum, 'near', false);
	if(this.initials["frustum near"] == null){
		console.log("frustum near attribute is missing");
	}
	this.initials["frustum far"] = this.reader.getFloat(frustum, 'far', false);
	if(this.initials["frustum far"] == null){
		console.log("frustum far attribute is missing");
	}

	var translate = rootElement.getElementsByTagName('translate');
	if (translate == null) {
		return "translate element is missing.";
	}
	this.initials["translate x"] = this.reader.getFloat(translate, 'x', false);
	if(this.initials["translate x"] == null){
		console.log("translate x attribute is missing");
	}
	this.initials["translate y"] = this.reader.getFloat(translate, 'y', false);
	if(this.initials["translate y"] == null){
		console.log("translate y attribute is missing");
	}
	this.initials["translate z"] = this.reader.getFloat(translate, 'z', false);
	if(this.initials["translate z"] == null){
		console.log("translate z attribute is missing");
	}

	var rotations = this.reader.getElementsByTagName('rotation');
	if (rotations,length < 3) {
		return "a rotation element is missing.";
	}
	var rotation3 = rotations[0];
	this.initials["rotation3 axis"]= this.reader.getItem(rotation3, 'axis', ["x", "y", "z"]);
	if(this.initials["rotation3 axis"] == null){
		console.log("rotation axis attribute is missing");
	}
	this.initials["rotation3 angle"] = this.reader.getFloat(rotation3, 'angle', false);
	if(this.initials["rotation3 angle"] == null){
		console.log("rotation angle attribute is missing");
	}
	var rotation2 = rotations[1];
	this.initials["rotation2 axis"]= this.reader.getItem(rotation2, 'axis', ["x", "y", "z"]);
	if(this.initials["rotation2 axis"] == null){
		console.log("rotation axis attribute is missing");
	}
	this.initials["rotation2 angle"] = this.reader.getFloat(rotation2, 'angle', false);
	if(this.initials["rotation2 angle"] == null){
		console.log("rotation angle attribute is missing");
	}
	var rotation1 = rotations[2];
	this.initials["rotation1 axis"]= this.reader.getItem(rotation1, 'axis', ["x", "y", "z"]);
	if(this.initials["rotation1 axis"] == null){
		console.log("rotation axis attribute is missing");
	}
	this.initials["rotation1 angle"] = this.reader.getFloat(rotation1, 'angle', false);
	if(this.initials["rotation1 angle"] == null){
		console.log("rotation angle attribute is missing");
	}

	var scale = this.reader.getElementsByTagName('scale');
	if (scale == null) {
		return "scale element is missing.";
	}
	this.initials["scale sx"] = this.reader.getFloat(scale, 'sx', false);
	if(this.initials["scale sx"] == null){
		console.log("scale sx attribute is missing");
	}
	this.initials["scale sy"] = this.reader.getFloat(scale, 'sy', false);
	if(this.initials["scale sy"] == null){
		console.log("scale sy attribute is missing");
	}
	this.initials["scale sz"] = this.reader.getFloat(scale, 'sz', false);
	if(this.initials["scale sz"] == null){
		console.log("scale sz attribute is missing");
	}

	var reference = this.reader.getElementsByTagName('reference');
	if(reference = null){
		return "reference element is missing.";
	}
	this.initials["reference"] = this.reader.getFloat(reference, 'length', false);
	if(initials["reference"] == null){
		console.log("length element is missing.");
	}
}


MySceneGraph.prototype.parseIllumination = function(rootElement){
	var elems = rootElement.getElementsByTagName('ILLUMINATION');
	if (elems == null) {
		return "ILLUMINATION element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'ILLUMINATION' element found.";
	}

	var ambient = this.reader.getElementsByTagName('ambient');
	if(ambient = null){
		return "ambient element is missing.";
	}
	this.illumination["ambient r"] = this.reader.getFloat(ambient, 'r', false);
	if(this.illumination["ambient r"] == null){
		console.log("ambient r attribute missing.");
	}
	this.illumination["ambient g"] = this.reader.getFloat(ambient, 'g', false);
	if(this.illumination["ambient g"] == null){
		console.log("ambient g attribute missing.");
	}
	this.illumination["ambient b"] = this.reader.getFloat(ambient, 'b', false);
	if(this.illumination["ambient b"] == null){
		console.log("ambient b attribute missing.");
	}
	this.illumination["ambient a"] = this.reader.getFloat(ambient, 'a', false);
	if(this.illumination["ambient a"] == null){
		console.log("ambient a attribute missing.");
	}

	var background = this.reader.getElementsByTagName('background');
	if(background = null){
		return "background element is missing.";
	}
	this.illumination["background r"] = this.reader.getFloat(background, 'r', false);
	if(this.illumination["background r"] == null){
		console.log("background r attribute missing.");
	}
	this.illumination["background g"] = this.reader.getFloat(background, 'g', false);
	if(this.illumination["background g"] == null){
		console.log("background g attribute missing.");
	}
	this.illumination["background b"] = this.reader.getFloat(background, 'b', false);
	if(this.illumination["background b"] == null){
		console.log("background b attribute missing.");
	}
	this.illumination["background a"] = this.reader.getFloat(background, 'a', false);
	if(this.illumination["background a"] == null){
		console.log("background a attribute missing.");
	}
}

MySceneGraph.prototype.parseLights = function(rootElement){
	var elems = rootElement.getElementsByTagName('LIGHTS');
	if (elems == null) {
		return "LIGHTS element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'LIGHTS' element found.";
	}
	

	for(i=0; i< elems.length; i++){ //ciclo para guardar num array de arrays as informações de cada bloco de luzes
		var block = elems[i];
		var light = this.reader.getElementsByTagName('LIGHT');
		this.lights[i]["id"] = this.reader.getString(light, 'id', false);
		if(this.lights[i]["id"] == null){
			console.log("LIGHT id attribute missing");
		}

		var enable = this.reader.getElementsByTagName('enable');
		this.lights[i]["enable value"] = this.reader.getBoolean(enable, 'value',false);
		if(this.lights[i]["enable value"] == null){
			console.log("enable value attribute missing.");
		}
		
		var position = this.reader.getElementsByTagName('position');
		this.lights[i]["position x"] = this.reader.getFloat(position, 'x',false);
		if(this.lights[i]["position x"] == null){
			console.log("position x attribute missing.");
		}
		this.lights[i]["position y"] = this.reader.getFloat(position, 'y',false);
		if(this.lights[i]["position x"] == null){
			console.log("position x attribute missing.");
		}
		this.lights[i]["position z"] = this.reader.getFloat(position, 'z',false);
		if(this.lights[i]["position x"] == null){
			console.log("position x attribute missing.");
		}
		this.lights[i]["position w"] = this.reader.getFloat(position, 'w',false);
		if(this.lights[i]["position x"] == null){
			console.log("position x attribute missing.");
		}

		var ambient = this.reader.getElementsByTagName('ambient');
		this.lights[i]["ambient r"] = this.reader.getFloat(ambient, 'r', false);
		if(this.lights[i]["ambient r"] == null){
			console.log("ambient r attribute missing.");
		}
		this.lights[i]["ambient g"] = this.reader.getFloat(ambient, 'g', false);
		if(this.lights[i]["ambient g"] == null){
			console.log("ambient g attribute missing.");
		}
		this.lights[i]["ambient b"] = this.reader.getFloat(ambient, 'b', false);
		if(this.lights[i]["ambient b"] == null){
			console.log("ambient b attribute missing.");
		}
		this.lights[i]["ambient a"] = this.reader.getFloat(ambient, 'a', false);
		if(this.lights[i]["ambient a"] == null){
			console.log("ambient a attribute missing.");
		}
	
		var diffuse = this.reader.getElementsByTagName('diffuse');
		this.lights[i]["diffuse r"] = this.reader.getFloat(diffuse, 'r', false);
		if(this.lights[i]["diffuse r"] == null){
			console.log("diffuse r attribute missing.");
		}
		this.lights[i]["diffuse g"] = this.reader.getFloat(diffuse, 'g', false);
		if(this.lights[i]["diffuse g"] == null){
			console.log("diffuse g attribute missing.");
		}
		this.lights[i]["diffuse b"] = this.reader.getFloat(diffuse, 'b', false);
		if(this.lights[i]["diffuse b"] == null){
			console.log("diffuse b attribute missing.");
		}
		this.lights[i]["diffuse a"] = this.reader.getFloat(diffuse, 'a', false);
		if(this.lights[i]["diffuse a"] == null){
			console.log("diffuse a attribute missing.");
		}

		var specular = this.reader.getElementsByTagName('specular');
		this.lights[i]["specular r"] = this.reader.getFloat(specular, 'r', false);
		if(this.lights[i]["specular r"] == null){
			console.log("specular r attribute missing.");
		}
		this.lights[i]["specular g"] = this.reader.getFloat(specular, 'g', false);
		if(this.lights[i]["specular g"] == null){
			console.log("specular g attribute missing.");
		}
		this.lights[i]["specular b"] = this.reader.getFloat(specular, 'b', false);
		if(this.lights[i]["specular b"] == null){
			console.log("specular b attribute missing.");
		}
		this.lights[i]["specular a"] = this.reader.getFloat(specular, 'a', false);
		if(this.lights[i]["specular a"] == null){
			console.log("specular a attribute missing.");
		}
	}

}

MySceneGraph.prototype.parseTextures = function(rootElement){
	var elems = rootElement.getElementsByTagName('TEXTURES');
	if (elems == null) {
		return "TEXTURES element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'TEXTURES' element found.";
	}

	for(i=0; i<elems.length; i++){
		var textura = this.reader.getElementsByTagName('TEXTURE');
		this.texturas[i]["id"] = this.reader.getString(textura, 'id',false);
		if(this.texturas["id"] == null){
			console.log("TEXTURA id attribute missing");
		}

		var file = this.reader.getElementsByTagName('file');
		this.texturas[i]["file path"] = this.reader.getString(file, 'path',false);
		if(this.texturas[i]["file path"] == null){
			console.log("file path attribute missing.");
		}

		var amplif_factor = this.reader.getElementsByTagName('amplif_factor');
		this.texturas[i]["amplif_factor s"] = this.reader.getFloat(amplif_factor, 's', false);
		if(this.texturas[i]["amplif_factor s"] == null){
			console.log("amplif_factor s attribute missing.");
		}
		this.texturas[i]["amplif_factor t"] = this.reader.getFloat(amplif_factor, 't', false);
		if(this.texturas[i]["amplif_factor t"] == null){
			console.log("amplif_factor t attribute missing.");
		}
	}
}

MySceneGraph.prototype.parseMaterials = function(rootElement){
	var elems = rootElement.getElementsByTagName('MATERIALS');
	if (elems == null) {
		return "MATERIALS element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'MATERIALS' element found.";
	}

	for(i=0; i<elems.size(); i++){
		var material = this.reader.getElementsByTagName('MATERIALS');
		this.materials[i]["id"] = this.reader.getString(material, 'id', false);
		if(this.materials[i]["id"] == null){
			console.log("MATERIAL id attribute missing.");
		}

		var shininess = this.reader.getElementsByTagName('shininess');
		this.materials[i]["shininess value"] = this.reader.getFloat(shininess, 'value, false');

		var specular = this.reader.getElementsByTagName('specular');
		this.materials[i]["specular r"] = this.reader.getFloat(specular, 'r', false);
		if(this.materials[i]["specular r"] == null){
			console.log("specular r attribute missing.");
		}
		this.materials[i]["specular g"] = this.reader.getFloat(specular, 'g', false);
		if(this.materials[i]["specular g"] == null){
			console.log("specular g attribute missing.");
		}
		this.materials[i]["specular b"] = this.reader.getFloat(specular, 'b', false);
		if(this.materials[i]["specular b"] == null){
			console.log("specular b attribute missing.");
		}
		this.materials[i]["specular a"] = this.reader.getFloat(specular, 'a', false);
		if(this.materials[i]["specular a"] == null){
			console.log("specular a attribute missing.");
		}

		var diffuse = this.reader.getElementsByTagName('diffuse');
		this.materials[i]["diffuse r"] = this.reader.getFloat(diffuse, 'r', false);
		if(this.materials[i]["diffuse r"] == null){
			console.log("diffuse r attribute missing.");
		}
		this.materials[i]["diffuse g"] = this.reader.getFloat(diffuse, 'g', false);
		if(this.materials[i]["diffuse g"] == null){
			console.log("diffuse g attribute missing.");
		}
		this.materials[i]["diffuse b"] = this.reader.getFloat(diffuse, 'b', false);
		if(this.materials[i]["diffuse b"] == null){
			console.log("diffuse b attribute missing.");
		}
		this.materials[i]["diffuse a"] = this.reader.getFloat(diffuse, 'a', false);
		if(this.materials[i]["diffuse a"] == null){
			console.log("diffuse a attribute missing.");
		}

		var ambient = this.reader.getElementsByTagName('ambient');
		this.materials[i]["ambient r"] = this.reader.getFloat(ambient, 'r', false);
		if(this.materials[i]["ambient r"] == null){
			console.log("ambient r attribute missing.");
		}
		this.materials[i]["ambient g"] = this.reader.getFloat(ambient, 'g', false);
		if(this.materials[i]["ambient g"] == null){
			console.log("ambient g attribute missing.");
		}
		this.materials[i]["ambient b"] = this.reader.getFloat(ambient, 'b', false);
		if(this.materials[i]["ambient b"] == null){
			console.log("ambient b attribute missing.");
		}
		this.materials[i]["ambient a"] = this.reader.getFloat(ambient, 'a', false);
		if(this.materials[i]["ambient a"] == null){
			console.log("ambient a attribute missing.");
		}


		var emission = this.reader.getElementsByTagName('emission');
		this.materials[i]["emission r"] = this.reader.getFloat(emission, 'r', false);
		if(this.materials[i]["emission r"] == null){
			console.log("emission r attribute missing.");
		}
		this.materials[i]["emission g"] = this.reader.getFloat(emission, 'g', false);
		if(this.materials[i]["emission g"] == null){
			console.log("emission g attribute missing.");
		}
		this.materials[i]["emission b"] = this.reader.getFloat(emission, 'b', false);
		if(this.materials[i]["emission b"] == null){
			console.log("emission b attribute missing.");
		}
		this.materials[i]["emission a"] = this.reader.getFloat(emission, 'a', false);
		if(this.materials[i]["emission a"] == null){
			console.log("emission a attribute missing.");
		}
	}
}


	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


