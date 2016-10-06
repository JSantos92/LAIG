function Cylinder(scene, args) {
    CGFobject.call(this, scene);

    var res = args.split(" ");

    this.base = res[0];
    this.top = res[1];
    this.height = res[2];
    this.slices = res[3];
    this.stacks = res[4];

    this.initBuffers();
    }

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.initBuffers = function() {
    this.alpha = 2 * Math.PI / this.slices;

    this.vertices = [];
    this.normals = [];
    this.indices = [];

    var base=Number(this.base);
    var top=Number(this.top);
    var nslices=Number(this.slices);
    var nstacks=Number(this.stacks);
    var height=Number(this.height);

    this.vertices.push(0,-(this.height/2) , 0);
    this.normals.push(0,-1,0);

    var dif = Math.abs((base-top)/nstacks);

    //base
    for(var i=0;i<nslices+1 ;i++){
        if(i!=0&&i!=nslices) this.indices.push(0,i,i+1);
        if(i==nslices) this.indices.push(0,i,(i+1)-nslices);
        if(i<nslices) this.vertices.push(Math.cos(this.alpha*i)*base,-(this.height/2), Math.sin(this.alpha*i)*base);
        this.normals.push(0,-1,0);
    }
    console.log(dif);

    //lateral
    for(var j=0;j<nstacks;j++){
        for(var k=0;k<nslices;k++){

            this.vertices.push(Math.cos(this.alpha*k)*(base-((j+1)*dif)),-(height/2)+(height/nstacks)*(j+1),Math.sin(this.alpha*k)*(base-((j+1)*dif)));
            this.normals.push(Math.cos(this.alpha*k)*(base-((j+1)*dif)),0,Math.sin(this.alpha*k)*(base-((j+1)*dif)));
            if(k==nslices-1) this.indices.push(k+1+(j*nslices),k+1+nslices+(j*nslices),(k+2+(j*nslices))-nslices);
            else this.indices.push(k+1+(j*nslices),k+1+nslices+(j*nslices),k+2+(j*nslices));
        }
        for(var l=0;l<nslices;l++){
            if(l==0) this.indices.push((l+1)+(j*nslices),nslices*(l+2)+(j*nslices),nslices+(l+1)+(j*nslices));
            else this.indices.push((l+1)+(j*nslices),nslices+l+(j*nslices),nslices+(l+1+(j*nslices)));
        }
    }
    //topo
    this.vertices.push(0,this.height/2, 0);
    this.normals.push(0,1,0);
    for(var i=0;i<nslices;i++){
        if(i==nslices-1) this.indices.push(nslices*(nstacks+1)-i,nslices*(nstacks+1),nslices*(nstacks+1)+1);
        this.indices.push(nslices*(nstacks+1)-i,nslices*(nstacks+1)-(i+1),nslices*(nstacks+1)+1);
        
    }
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
