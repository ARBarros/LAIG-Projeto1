


function SceneNode(scene, id, material, texture, transforms){
    this.scene = scene;
    this.id = id;
    this.material = material;
    this.texture =texture;
    this.transforms = transforms;
    this.descendants = [];
    this.matrix = (new Matrix(transforms)).matrix;
}

SceneNode.prototype.constructor = SceneNode;

SceneNode.prototype.display = function(){
    this.scene.pushMatrix();
    this.scene.multMatrix(this.matrix);
    

}

SceneNode.prototype.add_descendant = function(descendant){
    this.descendants.push(descendant);
}