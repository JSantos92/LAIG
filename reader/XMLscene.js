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
    //Inicializar omnis

    for(var i=0;i<this.graph.omnis.length;i++) {
        this.lights[i].setPosition(this.graph.omnis[i]['location']['x'],this.graph.omnis[i]['location']['y'],this.graph.omnis[i]['location']['z'],this.graph.omnis[i]['location']['w']);
        this.lights[i].setAmbient(this.graph.omnis[i]['ambient']['r'],this.graph.omnis[i]['ambient']['g'],this.graph.omnis[i]['ambient']['b'],this.graph.omnis[i]['ambient']['a']);
        this.lights[i].setDiffuse(this.graph.omnis[i]['diffuse']['r'],this.graph.omnis[i]['diffuse']['g'],this.graph.omnis[i]['diffuse']['b'],this.graph.omnis[i]['diffuse']['a']);
        this.lights[i].setSpecular(this.graph.omnis[i]['specular']['r'],this.graph.omnis[i]['specular']['g'],this.graph.omnis[i]['specular']['b'],this.graph.omnis[i]['specular']['a']);

        if(this.graph.omnis[i]['enabled']==0) {
            this.lights[i].setVisible(true);
            this.lights[i].enable();
        }

        this.lights[i].update();

    }

    console.log(this.graph.omnis.length);
    console.log(this.graph.spots.length);
    console.log(this.lights.length);

    //Inicializar spots

    for(var i=this.graph.omnis.length;i<this.graph.spots.length+this.graph.omnis.length;i++) {

        var j = 0;

        console.log("Valor do i= " + i);
        console.log("Luz1 = " + this.lights[i]);

        this.lights[i].setSpotCutOff(this.graph.spots[j]['angle']);
        this.lights[i].setSpotExponent(this.graph.spots[j]['exponent']);
        // Direction vector = Target - Location
        this.lights[i].setSpotDirection(this.graph.spots[j]['target']['x'] - this.graph.spots[j]['location']['x'], this.graph.spots[j]['target']['y'] - this.graph.spots[j]['location']['y'], this.graph.spots[j]['target']['z'] - this.graph.spots[j]['location']['z']);
        this.lights[i].setPosition(this.graph.spots[j]['location']['x'],this.graph.spots[j]['location']['y'],this.graph.spots[j]['location']['z'],1);
        this.lights[i].setAmbient(this.graph.spots[j]['ambient']['r'],this.graph.spots[j]['ambient']['g'],this.graph.spots[j]['ambient']['b'],this.graph.spots[j]['ambient']['a']);
        this.lights[i].setDiffuse(this.graph.spots[j]['diffuse']['r'],this.graph.spots[j]['diffuse']['g'],this.graph.spots[j]['diffuse']['b'],this.graph.spots[j]['diffuse']['a']);
        this.lights[i].setSpecular(this.graph.spots[j]['specular']['r'],this.graph.spots[j]['specular']['g'],this.graph.spots[j]['specular']['b'],this.graph.spots[j]['specular']['a']);

        if(this.graph.spots[j]['enabled']==0) {
            this.lights[i].setVisible(true);
            this.lights[i].enable();
        }

        this.lights[i].update();
    }

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
    this.matrix = mat4.create();
}

function Primitive(id){
    this.id = id;
    this.texture = null;
    this.material = null;
    this.matrix = mat4.create();
}

XMLscene.prototype.initComponents = function(){
    this.components = [];
    for(var i=0;i<this.graph.components.length;i++){
        var component = new Component(this.graph.components[i]['id']);
        component.transformationref=this.graph.components[i]['transformationref'];
        component.transformation['translate'] = this.graph.components[i]['transformation']['translate'];
        component.transformation['rotate'] = this.graph.components[i]['transformation']['rotate'];
        component.transformation['scale'] = this.graph.components[i]['transformation']['scale'];
        component.materials = this.graph.components[i]['materials'];
        component.texture = this.graph.components[i]['texture'];
        component.children['componentref'] = this.graph.components[i]['children']['componentref'];
        component.children['primitiveref'] = this.graph.components[i]['children']['primitiveref'];
        this.components.push(component);
    }
}

XMLscene.prototype.initPrimitives = function(){
    this.primitives = [];
    for(var i=0;i<this.graph.primitives.length;i++){
        var primitive = new Primitive(this.graph.primitives[i]['id']);
    }
}


// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.initIllumination();
	this.initLights();
	this.initComponents();
	this.initPrimitives();
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
//         var rectangle = new Rectangle(this,'-0.5 -0.5 0.5 0.5');
//         rectangle.display();
//         var circle = new Circle(this,'1 100');
//         circle.display();
         var cylinder = new Cylinder(this,'1 1 5 100 3');
         cylinder.display();
//         var sphere = new Sphere(this,'1 6 6');
//         sphere.display();
//         var torus = new Torus(this,'1 3 10 10');
//         torus.display();

	    // Draw axis
        this.axis.display();
		this.lights[0].update();
	}

};

