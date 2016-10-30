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

    this.a = Math.sqrt((this.x1 - this.x3) * (this.x1 - this.x3) +
                       (this.y1 - this.y3) * (this.y1 - this.y3) +
                       (this.z1 - this.z3) * (this.z1 - this.z3));

    this.b = Math.sqrt((this.x2 - this.x1) * (this.x2 - this.x1) +
                       (this.y2 - this.y1) * (this.y2 - this.y1) +
                       (this.z2 - this.z1) * (this.z2 - this.z1));

    this.c = Math.sqrt((this.x3 - this.x2) * (this.x3 - this.x2) +
                       (this.y3 - this.y2) * (this.y3 - this.y2) +
                       (this.z3 - this.z2) * (this.z3 - this.z2));


    this.cosAlpha = (-this.a*this.a + this.b*this.b + this.c * this.c) / (2 * this.b * this.c);
    this.cosBeta =  ( this.a*this.a - this.b*this.b + this.c * this.c) / (2 * this.a * this.c);
    this.cosGamma = ( this.a*this.a + this.b*this.b - this.c * this.c) / (2 * this.a * this.b);

    this.beta = Math.acos(this.cosBeta);
    this.alpha = Math.acos(this.cosAlpha);
    this.gamma = Math.acos(this.cosGamma);
    this.sum = this.beta + this.alpha + this.gamma;


    this.baseTexCoords = [
      (this.c - this.a * Math.cos(this.beta)), 0.0,
      0.0, 1.0,
      this.c , 1.0
    ];

    this.texCoords = this.baseTexCoords.slice();
        


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

Triangle.prototype.scaleTexCoords = function(ampS, ampT) {
    for (var i = 0; i < this.texCoords.length; i+=2) {
        this.texCoords[i] = this.baseTexCoords[i]/ampS;
        this.texCoords[i+1] = this.baseTexCoords[i+1]/ampT;
    }

    this.updateTexCoordsGLBuffers();
};