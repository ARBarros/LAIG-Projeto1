
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
		this.lights[i]
	}

}
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


