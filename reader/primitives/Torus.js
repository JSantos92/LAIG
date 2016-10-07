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

    this.inner = Number(this.inner);
    this.outter = Number(this.outter);
    this.slices = Number(this.slices);
    this.loops = Number(this.loops);

    // this.inner = 1;
    // this.outter = 3;
    // this.slices = 10;
    // this.loops = 10;

    var ang_0 = (2*Math.PI) / this.slices;
    var ang_1 = (2*Math.PI) / this.loops;
    this.ang = Math.PI/2;


    this.vertices = [];
    this.indices = [];
    this.normals = [];

    var x1,y1,z1,x,y,z;

    for(var j=0; j <= this.loops; j++) {

        for(var i=0; i <= this.slices; i++) {

            x1 = (this.outter + this.inner * Math.cos(ang_0 * i)) * Math.cos(ang_1 * j);
            y1 = (this.outter + this.inner * Math.cos(ang_0 * i)) * Math.sin(ang_1 * j);
            z1 = this.inner * Math.sin(ang_0 * i);

            this.vertices.push(x1, y1, z1);

            this.normals.push(x1 * this.ang);
            this.normals.push(y1 * this.ang);
            this.normals.push(z1 * this.ang);
        }
    }

    for(j=0; j < this.loops; j++) {

        for(i=0; i < this.slices ; i++) {

            x = (this.loops+1) * j + i ;
            y = (1+ this.loops)*(j+1) + i ;
            z = (j*(this.loops +1))+1 + i ;
            this.indices.push(x,y,z);
            this.indices.push(z,y,y+1);

        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};