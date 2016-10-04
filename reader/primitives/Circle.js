function Circle(scene, args) {
    CGFobject.call(this, scene);

    var res = args.split(" ");

    this.base = res[0];
    this.slices = res[1];

    this.initBuffers();

}

Circle.prototype = Object.create(CGFobject.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.initBuffers = function() {

    this.alpha = 2 * Math.PI / this.slices;

    this.vertices = [];
    this.normals = [];
    this.indices = [];

    this.vertices.push(0, 0, 0);
    this.normals.push(0,0,1);

    for(var i=0;i<this.slices+1 ;i++){
        if(i!=0){
            this.indices.push(0,i,i+1);
        }
        this.vertices.push(Math.cos(this.alpha*i), Math.sin(this.alpha*i),0);
        this.normals.push(0,0,1);
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();

};

