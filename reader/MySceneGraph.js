
function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	this.initials = [];
	this.illumination = [];
	this.lights = [];
	this.textures = [];
	this.materials = [];
	this.leaves = [];
	this.nodes = [];
	this.graph_nodes = [];
	this.primitives = [];
	this.root_node;
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
	//var error = this.parseGlobalsExample(rootElement);
	var error=this.parse(rootElement);
	this.createNodes();


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

MySceneGraph.prototype.parse = function(rootElement){
	this.parseInitials(rootElement);
	this.parseIllumination(rootElement);
	this.parseLights(rootElement);
	this.parseTextures(rootElement);
	this.parseMaterials(rootElement);
	this.parseLeaves(rootElement);
	this.parseNodes(rootElement);
}


MySceneGraph.prototype.parseInitials = function(rootElement) {
	var elems = rootElement.getElementsByTagName('INITIALS');
	if (elems == null) {
		return "INITIALS element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'INITIALS' element found.";
	}
	
	//var block = elems[0];
	

	var frustum = elems[0].getElementsByTagName('frustum');
	if (frustum == null) {
		return "frustum element is missing.";
	}
	this.reader.getFloat(frustum[0], "near", false);
	this.initials["frustum near"] = this.reader.getFloat(frustum[0], 'near', false);
	
	if(this.initials["frustum near"] == null){
		console.log("frustum near attribute is missing");
	}
	this.initials["frustum far"] = this.reader.getFloat(frustum[0], 'far', false);
	if(this.initials["frustum far"] == null){
		console.log("frustum far attribute is missing");
	}

	var translation = elems[0].getElementsByTagName('translation');
	if (translation == null) {
		return "translation element is missing.";
	}
	this.initials["translation x"] = this.reader.getFloat(translation[0], 'x', false);
	if(this.initials["translation x"] == null){
		console.log("translation x attribute is missing");
	}
	this.initials["translation y"] = this.reader.getFloat(translation[0], 'y', false);
	if(this.initials["translation y"] == null){
		console.log("translation y attribute is missing");
	}
	this.initials["translation z"] = this.reader.getFloat(translation[0], 'z', false);
	if(this.initials["translation z"] == null){
		console.log("translation z attribute is missing");
	}

	var rotations = elems[0].getElementsByTagName('rotation');
	if (rotations.length < 3) {
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

	var scale = elems[0].getElementsByTagName('scale');
	if (scale == null) {
		return "scale element is missing.";
	}
	this.initials["scale sx"] = this.reader.getFloat(scale[0], 'sx', false);
	if(this.initials["scale sx"] == null){
		console.log("scale sx attribute is missing");
	}
	this.initials["scale sy"] = this.reader.getFloat(scale[0], 'sy', false);
	if(this.initials["scale sy"] == null){
		console.log("scale sy attribute is missing");
	}
	this.initials["scale sz"] = this.reader.getFloat(scale[0], 'sz', false);
	if(this.initials["scale sz"] == null){
		console.log("scale sz attribute is missing");
	}

	var reference = elems[0].getElementsByTagName('reference');
	if(reference == null){
		return "reference element is missing.";
	}
	this.initials["reference"] = this.reader.getFloat(reference[0], 'length', false);
	if(this.initials["reference"] == null){
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

	

	var ambient = elems[0].getElementsByTagName('ambient');
	if(ambient == null){
		return "ambient element is missing.";
	}
	this.illumination["ambient_r"] = this.reader.getFloat(ambient[0], 'r', false);
	if(this.illumination["ambient_r"] == null){
		console.log("ambient r attribute missing.");
	}
	this.illumination["ambient_g"] = this.reader.getFloat(ambient[0], 'g', false);
	if(this.illumination["ambient_g"] == null){
		console.log("ambient g attribute missing.");
	}
	this.illumination["ambient_b"] = this.reader.getFloat(ambient[0], 'b', false);
	if(this.illumination["ambient_b"] == null){
		console.log("ambient b attribute missing.");
	}
	this.illumination["ambient_a"] = this.reader.getFloat(ambient[0], 'a', false);
	if(this.illumination["ambient_a"] == null){
		console.log("ambient a attribute missing.");
	}

	this.background = [];
	
	var back =  elems[0].getElementsByTagName('background');

	if(back == null){
		return "background element is missing.";
	}
	this.background[0] = this.reader.getFloat(back[0], 'r', false);
	if(this.background[0] == null){
		console.log("background r attribute missing.");
	}
	this.background[1] = this.reader.getFloat(back[0], 'g', false);
	if(this.background[1] == null){
		console.log("background g attribute missing.");
	}
	this.background[2] = this.reader.getFloat(back[0], 'b', false);
	if(this.background[2] == null){
		console.log("background b attribute missing.");
	}
	this.background[3] = this.reader.getFloat(back[0], 'a', false);
	if(this.background[3] == null){
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
	
	var block = elems[0];
	var light_block = block.getElementsByTagName('LIGHT');
	
	for(i=0; i< light_block.length; i++){

		var light = []; 
		
		light["id"] = this.reader.getString(light_block[i], 'id', false);
		if(light["id"] == null){
			console.log("LIGHT id attribute missing");
		}

		var enable = light_block[i].getElementsByTagName('enable');
		light["enable_value"] = this.reader.getBoolean(enable[0], 'value',false);
		if(light["enable_value"] == null){
			console.log("enable value attribute missing.");
		}

		
		
		var position = light_block[i].getElementsByTagName('position');
		light["position_x"] = this.reader.getFloat(position[0], 'x',false);
		if(light["position_x"] == null){
			console.log("position x attribute missing.");
		}
		light["position_y"] = this.reader.getFloat(position[0], 'y',false);
		if(light["position_y"] == null){
			console.log("position y attribute missing.");
		}
		light["position_z"] = this.reader.getFloat(position[0], 'z',false);
		if(light["position_z"] == null){
			console.log("position z attribute missing.");
		}
		light["position_w"] = this.reader.getFloat(position[0], 'w',false);
		if(light["position_w"] == null){
			console.log("position w attribute missing.");
		}

		var ambient = light_block[i].getElementsByTagName('ambient');
		light["ambient_r"] = this.reader.getFloat(ambient[0], 'r', false);
		if(light["ambient_r"] == null){
			console.log("ambient r attribute missing.");
		}
		light["ambient_g"] = this.reader.getFloat(ambient[0], 'g', false);
		if(light["ambient_g"]== null){
			console.log("ambient g attribute missing.");
		}
		light["ambient_b"] = this.reader.getFloat(ambient[0], 'b', false);
		if(light["ambient_b"] == null){
			console.log("ambient b attribute missing.");
		}
		light["ambient_a"] = this.reader.getFloat(ambient[0], 'a', false);
		if(light["ambient_a"] == null){
			console.log("ambient a attribute missing.");
		}
	
		var diffuse = light_block[i].getElementsByTagName('diffuse');
		light["diffuse_r"] = this.reader.getFloat(diffuse[0], 'r', false);
		if(light["diffuse_r"] == null){
			console.log("diffuse r attribute missing.");
		}
		light["diffuse_g"] = this.reader.getFloat(diffuse[0], 'g', false);
		if(light["diffuse_g"] == null){
			console.log("diffuse g attribute missing.");
		}
		light["diffuse_b"] = this.reader.getFloat(diffuse[0], 'b', false);
		if(light["diffuse_b"] == null){
			console.log("diffuse b attribute missing.");
		}
		light["diffuse_a"] = this.reader.getFloat(diffuse[0], 'a', false);
		if(light["diffuse_a"] == null){
			console.log("diffuse a attribute missing.");
		}

		
		var specular =light_block[i].getElementsByTagName('specular');
		light["specular_r"] = this.reader.getFloat(specular[0], 'r', false);
		if(light["specular_r"] == null){
			console.log("specular r attribute missing.");
		}
		light["specular_g"] = this.reader.getFloat(specular[0], 'g', false);
		if(light["specular_g"] == null){
			console.log("specular g attribute missing.");
		}
		light["specular_b"] = this.reader.getFloat(specular[0], 'b', false);
		if(light["specular_b"] == null){
			console.log("specular b attribute missing.");
		}
		light["specular_a"] = this.reader.getFloat(specular[0], 'a', false);
		if(light["specular_a"] == null){
			console.log("specular a attribute missing.");
		}

		this.lights.push(light);
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

	
	var textura = elems[0].getElementsByTagName('TEXTURE');

	for(i=0; i<textura.length; i++){
		
		var id = this.reader.getString(textura[i], 'id',false);
		if(id == null){
			console.log("TEXTURA id attribute missing");
		}

		var file = textura[i].getElementsByTagName('file');
		var file_path = this.reader.getString(file[0], 'path',false);
		if(file_path == null){
			console.log("file path attribute missing.");
		}

		var amplif_factor = textura[i].getElementsByTagName('amplif_factor');
		var amplif_factor_s = this.reader.getFloat(amplif_factor[0], 's', false);
		if(amplif_factor_s == null){
			console.log("amplif_factor s attribute missing.");
		}
		var amplif_factor_t = this.reader.getFloat(amplif_factor[0], 't', false);
		if(amplif_factor_t == null){
			console.log("amplif_factor t attribute missing.");
		}

		this.texture_obj = new CGFtexture(this.scene, file_path);
		this.textures[id] = this.texture_obj;
	}
}

MySceneGraph.prototype.parseMaterials = function(rootElement){
	var elems = rootElement.getElementsByTagName('MATERIALS');
	if (elems == null) {
		return "MATERIALS element is missing.";
	}
	var material = elems[0].getElementsByTagName('MATERIAL');

	
	console.log(material.length);

	for(i=0; i<material.length; i++){
		
		var id = this.reader.getString(material[i], 'id', false);
		if(id == null){
			console.log("MATERIAL id attribute missing.");
		}

		var shininess = material[i].getElementsByTagName('shininess');
		var shininess_value = this.reader.getFloat(shininess[0], 'value', false);

		var specular = material[i].getElementsByTagName('specular');
		var specular_r = this.reader.getFloat(specular[0], 'r', false);
		if(specular_r == null){
			console.log("specular r attribute missing.");
		}
		var specular_g = this.reader.getFloat(specular[0], 'g', false);
		if(specular_g == null){
			console.log("specular g attribute missing.");
		}
		var specular_b = this.reader.getFloat(specular[0], 'b', false);
		if(specular_b == null){
			console.log("specular b attribute missing.");
		}
		var specular_a = this.reader.getFloat(specular[0], 'a', false);
		if(specular_a == null){
			console.log("specular a attribute missing.");
		}

		var diffuse = material[i].getElementsByTagName('diffuse');
		var diffuse_r = this.reader.getFloat(diffuse[0], 'r', false);
		if(diffuse_r == null){
			console.log("diffuse r attribute missing.");
		}
		var diffuse_g = this.reader.getFloat(diffuse[0], 'g', false);
		if(diffuse_g == null){
			console.log("diffuse g attribute missing.");
		}
		var diffuse_b = this.reader.getFloat(diffuse[0], 'b', false);
		if(diffuse_b == null){
			console.log("diffuse b attribute missing.");
		}
		var diffuse_a = this.reader.getFloat(diffuse[0], 'a', false);
		if(diffuse_a == null){
			console.log("diffuse a attribute missing.");
		}

		var ambient = material[i].getElementsByTagName('ambient');
		var ambient_r = this.reader.getFloat(ambient[0], 'r', false);
		if(ambient_r == null){
			console.log("ambient r attribute missing.");
		}
		var ambient_g = this.reader.getFloat(ambient[0], 'g', false);
		if(ambient_g == null){
			console.log("ambient g attribute missing.");
		}
		var ambient_b = this.reader.getFloat(ambient[0], 'b', false);
		if(ambient_b == null){
			console.log("ambient b attribute missing.");
		}
		var ambient_a = this.reader.getFloat(ambient[0], 'a', false);
		if(ambient_a == null){
			console.log("ambient a attribute missing.");
		}


		var emission = material[i].getElementsByTagName('emission');
		var emission_r = this.reader.getFloat(emission[0], 'r', false);
		if(emission_r == null){
			console.log("emission r attribute missing.");
		}
		var emission_g = this.reader.getFloat(emission[0], 'g', false);
		if(emission_g == null){
			console.log("emission g attribute missing.");
		}
		var emission_b = this.reader.getFloat(emission[0], 'b', false);
		if(emission_b == null){
			console.log("emission b attribute missing.");
		}
		var emission_a = this.reader.getFloat(emission[0], 'a', false);
		if(emission_a == null){
			console.log("emission a attribute missing.");
		}

		this.material_obj = new CGFappearance(this.scene);
		this.material_obj.setAmbient(ambient_r, ambient_g, ambient_b, ambient_a);
		this.material_obj.setDiffuse(diffuse_r, diffuse_g, diffuse_b, diffuse_a);
		this.material_obj.setSpecular(specular_r, specular_g, specular_b, specular_a);
		this.material_obj.setShininess(shininess_value);
		this.material_obj.setEmission(emission_r, emission_g, emission_b, emission_a);

		this.materials[id] = this.material_obj;
	}

}

MySceneGraph.prototype.parseLeaves = function(rootElement){
	var elems = rootElement.getElementsByTagName('LEAVES');
	if (elems == null) {
		return "LEAVES element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'LEAVES' element found.";
	}
	var leaf  = elems[0].getElementsByTagName('LEAF');

	

	for(var i =0; i<leaf.length; i++){
		var id = this.reader.getString(leaf[i], 'id', false);
		if(id == null){
			return console.log("LEAF id attribute missing.");
		}
		var type = this.reader.getString(leaf[i], 'type', false);
		if(id == null){
			return console.log("LEAF type attribute missing.");
		}




		var args=this.reader.getString(leaf[i], 'args', false);
		args=args.split(' ');

		switch(type){
			case "rectangle":
				var top_left_x = args[0];
				var top_left_y = args[1];
				var bot_right_x = args[2];
				var bot_right_y = args[3];
				this.primitives[id] = new Rectangle(this.scene, top_left_x, top_left_y, bot_right_x, bot_right_y);

				break;

			case "cylinder" :
				var height = args[0];
				var bot_radius = args[1];
				var top_radius = args[2];
				var secs_along_height = args[3];
				var parts_per_section = args[4];
				this.primitives[id] = new Cylinder(this.scene, height, bot_radius, top_radius, secs_along_height, parts_per_section);
				break;

			case "sphere":
				var radius = args[0];
				var parts_along_radius = args[1];
				var parts_per_section = args[2];
				this.primitives[id] = new Sphere(this.scene, radius, parts_along_radius, parts_per_section);
				break;

			case "triangle":
				var v1x = args[0];
				var v1y = args[1];
				var v1z = args[2];

				var v2x = args[3];
				var v2y = args[4];
				var v2z = args[5];

				var v3x = args[6];
				var v3y = args[7];
				var v3z = args[8];

				this.primitives[id] = new Triangle(this.scene, v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z);
				

				break;
		}
				
				new_node = [];
				new_node["material"] = "null";
				new_node["texture"] = "null";
				new_node["transfomations"] = [];
				new_node["descendants"] = [];
			

				this.nodes[id] = new_node;

	}
}

MySceneGraph.prototype.parseNodes = function(rootElement){
	var elems = rootElement.getElementsByTagName('NODES');
	if (elems == null) {
		return "LEAVES element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'LEAVES' element found.";
	}

	
	var root = elems[0].getElementsByTagName('ROOT');
	
	this.root_node = this.reader.getString(root[0], 'id', false);
	
	var node = elems[0].getElementsByTagName('NODE');
	for(var i=0; i<node.length; i++){

		var node_id = this.reader.getString(node[i], 'id', false);
		
		var material = node[i].getElementsByTagName('MATERIAL');
		var material_id = this.reader.getString(material[0], 'id', false);

		var texture = node[i].getElementsByTagName('TEXTURE');
		var texture_id = this.reader.getString(texture[0], 'id', false);

		var transforms = [];
		var trans_list = node[i].childNodes;

		for(var j=0; j< trans_list.length; j++){
			var transform =[];
			var type = trans_list[j].nodeName;
			
			
			switch(type){
				case 'TRANSLATION':
					transform["type"] = type;
					transform["translation_x"] = this.reader.getFloat(trans_list[j], 'x', false);
					transform["translation_y"] = this.reader.getFloat(trans_list[j], 'y', false);
					transform["translation_z"] = this.reader.getFloat(trans_list[j], 'z', false);
					transforms.push(transform);
					break;
				case 'ROTATION':
					transform["type"] = type;
					transform["axis"] = this.reader.getItem(trans_list[j], 'axis', ["x", "y", "z"]);
					transform["angle"] = this.reader.getFloat(trans_list[j], 'angle', false);
					transforms.push(transform);
					break;
				case 'SCALE':
					transform["type"] = type;
					transform["scale_x"] = this.reader.getFloat(trans_list[j], 'sx', false);
					transform["scale_y"] = this.reader.getFloat(trans_list[j], 'sy', false);
					transform["scale_z"] = this.reader.getFloat(trans_list[j], 'sz', false);
					transforms.push(transform);
					break;
			}


			

			
		
		}

			descendants=[];

			var descendant= node[i].getElementsByTagName('DESCENDANTS');

			var desc = descendant[0].getElementsByTagName('DESCENDANT');


			for(var j=0; j < desc.length; j++){
				var desc_id = this.reader.getString(desc[j], 'id', false);
				descendants.push(desc_id);
			}


			new_node = [];
			new_node["material"] = material_id;
			new_node["texture"] = texture_id;
			new_node["transfomations"] = transforms;
			new_node["descendants"] = descendants;

			

			this.nodes[node_id] = new_node;

	}
}

MySceneGraph.prototype.createNodes = function(){
	for(var i in this.nodes){
		var node = this.nodes[i];
		if(node["texture"] != "null" && node["texture"] != "clear"){
			this.graph_nodes[i] = new SceneNode(this.scene, i , this.materials[node["material"]], this.textures[node["texture"]], node["transfomations"]);
		}else if(node["texture"] == "null"){
			this.graph_nodes[i] = new SceneNode(this.scene, i , this.materials[node["material"]], "null", node["transfomations"]);
		}else if(node["texture"] == "clear"){
			this.graph_nodes[i] = new SceneNode(this.scene, i , this.materials[node["material"]], "clear", node["transfomations"]);
		}
	}

	for(var i in this.nodes){
		for(var j in this.nodes[i]["descendants"]){
			if(this.graph_nodes[this.nodes[i]["descendants"][j]] != undefined)
			this.graph_nodes[i].add_descendant(this.graph_nodes[this.nodes[i]["descendants"][j]]);
		}
		if(isEmpty(this.graph_nodes[i].descendants)){
			console.log("primitive set");
			this.graph_nodes[i].set_primitive(this.primitives[i]);
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


function isEmpty(map) {
   for(var key in map) {
      if (map.hasOwnProperty(key)) {
         return false;
      }
   }
   return true;
}