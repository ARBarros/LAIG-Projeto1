function Node(scene, id, material, texture, transforms){
    this.scene = scene;
    this.id = id;
    this.material = material;
    this.texture =texture;
    this.transforms = transforms;
}

Node.prototype.constructor = Node;

Node.prototype.display = function