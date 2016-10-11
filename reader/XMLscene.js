function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis=new CGFaxis(this);


};

XMLscene.prototype.initIllumination = function () {
    this.gl.clearColor(this.graph.illumination['background']['r'],this.graph.illumination['background']['g'],this.graph.illumination['background']['b'],this.graph.illumination['background']['a']);
    this.setGlobalAmbientLight(this.graph.illumination['ambient']['r'],this.graph.illumination['ambient']['g'],this.graph.illumination['ambient']['b'],this.graph.illumination['ambient']['a']);
    // this.graph.illumination['doublesided']
    // this.graph.illumination['local']
}



XMLscene.prototype.initLights = function () {
    for(var i=0;i<this.graph.omnis.length;i++){
        this.lights[i].setPosition(this.graph.omnis[i]['location']['x'],this.graph.omnis[i]['location']['y'],this.graph.omnis[i]['location']['z'],this.graph.omnis[i]['location']['w']);
        this.lights[i].setAmbient(this.graph.omnis[i]['ambient']['r'],this.graph.omnis[i]['ambient']['g'],this.graph.omnis[i]['ambient']['b'],this.graph.omnis[i]['ambient']['a']);
        this.lights[i].setDiffuse(this.graph.omnis[i]['diffuse']['r'],this.graph.omnis[i]['diffuse']['g'],this.graph.omnis[i]['diffuse']['b'],this.graph.omnis[i]['diffuse']['a']);
        this.lights[i].setSpecular(this.graph.omnis[i]['specular']['r'],this.graph.omnis[i]['specular']['g'],this.graph.omnis[i]['specular']['b'],this.graph.omnis[i]['specular']['a']);
        this.lights[i].update();
        if(this.graph.omnis[i]['enabled']==0){
            this.lights[i].setVisible(true);
            this.lights[i].enable();
        }
    }

    //falta spots
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

//Components
function Component(id){
    this.id = id;
    this.transformationref = null;
    this.transformation = {};
    this.transformation['translate'] = [];
    this.transformation['scale'] = [];
    this.transformation['rotate'] = [];
    this.materials = [];
    this.texture = null;
    this.children = {};
    this.children['componentref'] = [];
    this.children['primitiveref'] = [];
    this.matrix = mta4.create();
}

function Primitive(id){
    this.id = id;
    this.texture = null;
    this.material = null;
    this.matrix = mta4.create();
}

XMLscene.prototype.initComponents = function(){
    for(var i=0;i<this.graph.components.length;i++){
        var component = new Component(this.graph.components[i].['id']);

    }
}


// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.initIllumination();
	this.initLights();
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup


	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	if (this.graph.loadedOk)
	{



//         var triangle = new Triangle(this,'0 0 0 0 1 0 1 1 0');
//         triangle.display();
//         var rectangle = new Rectangle(this,'0 0 1 1');
//         rectangle.display();
//         var circle = new Circle(this,'1 100');
//         circle.display();
//         var cylinder = new Cylinder(this,'1 1 5 6 3');
//         cylinder.display();
//         var sphere = new Sphere(this,'1 6 6');
//         sphere.display();
//         var torus = new Torus(this,'1 3 10 10');
//         torus.display();

	    // Draw axis
        this.axis.display();
		this.lights[0].update();
	}

};

