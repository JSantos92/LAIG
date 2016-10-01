function Triangle(scene,args) {
    CGFobject.call(this,scene);

    var res = args.split(" ");

    this.x1 = res[0];
    this.y1 = res[1];
    this.z1 = res[2];
    this.x2 = res[3];
    this.y2 = res[4];
    this.z2 = res[5];
    this.x3 = res[6];
    this.y3 = res[7];
    this.z3 = res[8];

    this.initBuffers();
}

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.initBuffers = function() {

    this.vertices = [
        this.x1,this.y1,this.z1,
        this.x2,this.y2,this.z2,
        this.x3,this.y3,this.z3

    ];

    this.indices = [
        2, 1, 0
    ];

    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};