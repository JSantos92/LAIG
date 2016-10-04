function Torus(scene, args) {
    CGFobject.call(this, scene);

    var res = args.split(" ");

    this.inner = res[0];
    this.outter = res[1];
    this.slices = res[2];
    this.loops = res[3];

    this.initBuffers();
};

Torus.prototype = Object.create(CGFobject.prototype);
Torus.prototype.constructor = Torus;

Torus.prototype.initBuffers = function() {

    var ang_0 = 2*Math.PI / this.slices;
    var ang_0_ini = 0;
    var ang_1 = 2*Math.PI / this.loops;
    var ang_1_ini = 0;


    this.vertices = [];
    this.indices = [];
    this.normals = [];

    for(var j=0; j < this.slices;j++) {

        for(var i=0; i < this.loops; i++ ) {

            var x1 = (this.outter + this.inner * Math.cos(ang_1_ini) * Math.cos(ang_0_ini));
            var y1 = this.inner * Math.sin(ang_1_ini);
            var z1 = (this.outter + this.inner * Math.cos(ang_1_ini) * Math.sin(ang_0_ini));

            ang_1_ini += ang_1;

            this.vertices.push(x1,y1,z1);
        }

        this.indices.push(0,4,5);
        this.indices.push(5,1,4);

        ang_0_ini += ang_0;

    }

    console.log(this.vertices);

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};