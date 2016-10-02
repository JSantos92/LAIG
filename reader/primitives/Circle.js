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

   // this.vertices.push(0, 0, 0);

    //console.log(this.slices);
    //
    // for (var i=0; i < this.slices-1; i++) {
    //
    //     console.log(this.alpha*i);
    //
    //     console.log(i);
    //
    //     this.vertices.push(Math.cos(this.alpha*i), Math.sin(this.alpha*i),0);
    //
    //     this.indices.push(i,i+1,i+2);
    //
    //
    //
    // }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();

};

