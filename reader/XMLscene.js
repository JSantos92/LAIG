function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

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

	this.lights[0].setPosition(4,6, 4, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();

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

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.initIllumination();
	this.lights[0].setVisible(true);
    this.lights[0].enable();

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

        // var triangle = new Triangle(this,'0 0 0 0 1 0 1 1 0');
        // triangle.display();

        // var rectangle = new Rectangle(this,'0 0 1 1');
        // rectangle.display();

        // var circle = new Circle(this,'1 100');
        // circle.display();

          // var cylinder = new Cylinder(this,'1 1 5 6 3');
          // cylinder.display();

        // var sphere = new Sphere(this,'1 6 6');
        // sphere.display();

         var torus = new Torus(this,'1 3 10 10');
         torus.display();

	    // Draw axis
        this.axis.display();
		this.lights[0].update();
	}

};

