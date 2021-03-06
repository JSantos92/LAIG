function Rectangle(scene,args) {
    CGFobject.call(this,scene);

    var res = args.split(" ");

    this.x1 = res[0];
    this.y1 = res[1];
    this.x2 = res[2];
    this.y2 = res[3];

    this.initBuffers();
}

Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.initBuffers = function() {

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
        0, 2, 3

    ];

    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    this.nonScaledTexCoords = [
        0,1,
        1,1,
        1,0,
        0,0
    ];

    this.texCoords = this.nonScaledTexCoords.slice(0);

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

Rectangle.prototype.scaleTexCoords = function(ampS, ampT) {
	for (var i = 0; i < this.texCoords.length; i += 2) {
		this.texCoords[i] = this.nonScaledTexCoords[i] / ampS;
		this.texCoords[i + 1] = this.nonScaledTexCoords[i+1] / ampT;
	}

	this.updateTexCoordsGLBuffers();
}