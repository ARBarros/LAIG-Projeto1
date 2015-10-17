function degToRad(ang){
    return (Math.PI*ang)/180;
}

function Matrix(transforms){
   
    this.matrix = mat4.create();
    mat4.identity(this.matrix);

    for(var i=0; i< transforms.length; i++){
        var transform = transforms[i];

       
        var type = transform["type"];
        
        if(type == undefined)
            continue;

        switch(type){
            case 'ROTATION':
                var axis = transform["axis"];

                switch(axis){
                    case 'x': 
                    mat4.rotateX(this.matrix, this.matrix, degToRad(transform["angle"]));
                    break;
                       
                    case 'y': 
                    mat4.rotateY(this.matrix, this.matrix, degToRad(transform["angle"]));
                    break;

                    case 'z': 
                    mat4.rotateZ(this.matrix, this.matrix, degToRad(transform["angle"]));
                    break;
                }
                break;

            case 'TRANSLATION':
                var trans_vector = [transform["translation_x"], transform["translation_y"], transform["translation_z"] ];

                mat4.translate(this.matrix, this.matrix, trans_vector);
                break;
            case 'SCALE':
                var scale_vector = [transform["scale_x"], transform["scale_y"], transform["scale_z"]];
                mat4.scale(this.matrix, this.matrix, scale_vector);
                break;
        }
    }
}

