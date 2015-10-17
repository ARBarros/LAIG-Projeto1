


function SceneNode(scene, id, material, texture, transforms){
    this.scene = scene;
    this.id = id;
    this.material = material;
    this.texture =texture;
    this.transforms = transforms;
    this.descendants = [];
    this.matrix = (new Matrix(transforms)).matrix;
    this.primitive = undefined;
}

SceneNode.prototype.constructor = SceneNode;


SceneNode.prototype.add_descendant = function(descendant){
    this.descendants.push(descendant);
}

SceneNode.prototype.set_primitive = function(primitive){
    this.primitive = primitive;
}

SceneNode.prototype.set_texture = function(texture){
    this.texture = texture; 
}