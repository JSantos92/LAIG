function rectangle(scene,args) {
    CGFobject.call(this,scene);

    var res = args.split(" ");

    this.x1 = res[0];
    this.x2 = res[1];
    this.y1 = res[2];
    this.y2 = res[3];

    this.initBuffers();
}

rectangle.prototype = Object.create(CGFobject.prototype);
rectangle.prototype.constructor = rectangle;

rectangle.prototype.initBuffers = function() {

    /*
     Vertices declarados a partir do canto superior esquerdo em sentido horario
     */

    this.vertices = [
        this.x1, this.y1, 0,
        this.x2, this.y1, 0,
        this.x2, this.y2, 0,
        this.x1, this.y2, 0

    ];



    this.indices = [
        0, 1, 2,
        2, 3, 1

    ];

    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};