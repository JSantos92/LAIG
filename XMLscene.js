function XMLscene(interface) {
    CGFscene.call(this);
    this.interface = interface;
}
var deg2rad = Math.PI /180;

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


	this.nodes = [];
	this.materials = [];
    this.lightsEnabled = [];
    this.allLights = 'All';
	this.enableTextures(true);


};

XMLscene.prototype.initIllumination = function () {
    this.gl.clearColor(this.graph.illumination['background']['r'],this.graph.illumination['background']['g'],this.graph.illumination['background']['b'],this.graph.illumination['background']['a']);
    this.setGlobalAmbientLight(this.graph.illumination['ambient']['r'],this.graph.illumination['ambient']['g'],this.graph.illumination['ambient']['b'],this.graph.illumination['ambient']['a']);

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

        //this.interface.addLight('omni',this.graph.omnis[i].id,this.graph.omnis[i]['enabled']);

        this.lights[i].update();
        this.lightsEnabled[this.lights[i].id] = this.lights[i].enabled;
    }



    //Inicializar spots

    for(var i=this.graph.omnis.length;i<this.graph.spots.length+this.graph.omnis.length;i++) {

        var j = 0;
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

       // this.interface.addLight(this.lights[i],this.lights[i].enable());
       // this.interface.addLight('spot',this.graph.spots[j].id,this.graph.spots[j]['enabled']);
        this.lights[i].update();
        this.lightsEnabled[this.lights[i].id] = this.lights[i].enabled;
    }

    this.lightsEnabled[this.allLights] = false;
    for (i in this.lights) {
        if(this.lights[i].enabled){
            this.lightsEnabled[this.allLights] = true;
            break;
        }
    }

    //loads interface
    if (this.interface != null)
        this.interface.onGraphLoaded();

};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));

    // for(var i=0; i<this.graph.views.length;i++) {
    //
    //     this.interface.addView(this.graph.views[i]['id']);
    // }
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.6, 0.6, 0.8, 1.0);
    this.setDiffuse(0.6, 0.6, 0.8, 1.0);
    this.setSpecular(0.6, 0.6, 0.8, 1.0);
    this.setShininess(5.0);
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

function Transformation(id){
    this.id = id;
    this.translates = [];
    this.rotates = [];
    this.scales = [];
}

XMLscene.prototype.getComponent = function (id) {
	for(var i = 0; i < this.components.length;i++){
		if(this.components[i].id==id){
			return this.components[i];
		}
	}
	return 1;
};

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
    var a = this.getComponent(this.graph.root);
    if(a!=1) this.setNextComponent(a,a.materials,a.texture,a.matrix);
}

XMLscene.prototype.setNextComponent = function(component,materials,texture,matrix){
    for(var i=0;i<this.graph.components.length;i++){
        var old = null;
        if(this.graph.components[i].id==component.id){
            if(this.graph.components[i].materials=="inherit"){
                component.materials=materials;
            }

            if(this.graph.components[i].texture=="inherit"){
                component.texture=texture;
            }



            mat4.identity(component.matrix);

            var n = this.getComponent(this.graph.components[i].id);



            //TRANSLATE
            if(this.graph.components[i].transformation.translate.length!=0){
                mat4.translate(n.matrix,n.matrix,[this.graph.components[i].transformation.translate[0],this.graph.components[i].transformation.translate[1],this.graph.components[i].transformation.translate[2]])
            }

            //SCALE
            if(this.graph.components[i].transformation.scale.length!=0){
                mat4.scale(n.matrix,n.matrix,[this.graph.components[i].transformation.scale[0],this.graph.components[i].transformation.scale[1],this.graph.components[i].transformation.scale[2]])
            }

            //ROTATION
            if(this.graph.components[i].transformation.rotate.length!=0){
                for(var k = 0;k<this.graph.components[i].transformation.rotate.length;k+=2){


                    if(this.graph.components[i].transformation.rotate[k]=='x'){
                        mat4.rotate(n.matrix,n.matrix,deg2rad*this.graph.components[i].transformation.rotate[k+1],[1,0,0]);
                    }
                    else if(this.graph.components[i].transformation.rotate[k]=='y'){
                        mat4.rotate(n.matrix,n.matrix,deg2rad*this.graph.components[i].transformation.rotate[k+1],[0,1,0]);
                    }
                    else if(this.graph.components[i].transformation.rotate[k]=='z'){
                        mat4.rotate(n.matrix,n.matrix,deg2rad*this.graph.components[i].transformation.rotate[k+1],[0,0,1]);
                    }

                }

            }



            var result_matrix = mat4.create();
            var pass_mat = null;
            var pass_tex = null;
            mat4.multiply(result_matrix,matrix,component.matrix);
            for(var j=0;j<component.children.primitiveref.length;j++){

                var primitive = new Primitive(component.children.primitiveref[j]);

                for(var k=0;k<this.textures.length;k++){
                    if(this.textures[k].id==component.texture){
                        primitive.texture = this.textures[k];
                    }
                }

                for(var k=0;k<this.materials.length;k++){
                    if(this.materials[k].id==component.materials[0]){
                        primitive.material = this.materials[k];
                    }
                }
                for(var k=0;k<this.primitives.length;k++){
                    if(this.primitives[k].id==component.children.primitiveref[j]){
                        primitive.primitive = this.primitives[k];
                    }
                }

                mat4.multiply(primitive.matrix,primitive.matrix,result_matrix);

                this.nodes.push(primitive);
                mat4.identity(component.matrix);
            }

            for(var j=0;j<component.children.componentref.length;j++){
                var primitive_child = this.getComponent(component.children.componentref[j]);

//                if(component.materials[0]=="white") debugger;

                this.setNextComponent(primitive_child,component.materials,component.texture,result_matrix);

            }
            continue;
        }
    }
}

XMLscene.prototype.initPrimitives = function () {
    this.primitives = [];
	for(var i = 0; i < this.graph.primitives.length; i++){
	    var prim=this.graph.primitives[i];
		if(this.graph.primitives[i].id=='rectangle'){
		    var args = prim.rectangle.x1+" "+prim.rectangle.y1+" "+prim.rectangle.x2+" "+prim.rectangle.y2;
			var primitive = new Rectangle(this,args);
			primitive.id=this.graph.primitives[i].id;
            this.primitives.push(primitive);
		}
		else if(this.graph.primitives[i].id=='triangle'){
		    var args = prim.triangle.x1+" "+prim.triangle.y1+" "+prim.triangle.z1+" "+prim.triangle.x2+" "+prim.triangle.y2+" "+prim.triangle.z2+" "+prim.triangle.x3+" "+prim.triangle.y3+" "+prim.triangle.z3;
			var primitive = new Triangle(this,args);
			primitive.id=this.graph.primitives[i].id;
            this.primitives.push(primitive);
		}
		else if(this.graph.primitives[i].id=='cylinder'){
		    var args = prim.cylinder.base+" "+prim.cylinder.top+" "+prim.cylinder.height+" "+prim.cylinder.slices+" "+prim.cylinder.stacks;
			var primitive = new Cylinder(this,args);
			primitive.id=this.graph.primitives[i].id;
            this.primitives.push(primitive);
		}
		else if(this.graph.primitives[i].id=='sphere'){
		    var args = prim.sphere.radius+" "+prim.sphere.slices+" "+prim.sphere.stacks;
			var primitive = new Sphere(this,args);
			primitive.id=this.graph.primitives[i].id;
            this.primitives.push(primitive);
		}
		else if(this.graph.primitives[i].id=='torus'){
            var args = prim.torus.inner+" "+prim.torus.outer+" "+prim.torus.slices+" "+prim.torus.loops;
            var primitive = new Torus(this,args);
            primitive.id=this.graph.primitives[i].id;
            this.primitives.push(primitive);
        }
	}

};

XMLscene.prototype.initTransformations = function(){
    this.transformations = [];
    for(var i =0;i<this.graph.transformations.length;i++){
        var transformation = new Transformation(this.graph.transformations[i]['id']);
        transformation.translates.push(this.graph.transformations[i]['translate']);
        transformation.rotates.push(this.graph.transformations[i]['rotate']);
        transformation.scales.push(this.graph.transformations[i]['scale']);
        this.transformations.push(transformation);
    }
}

XMLscene.prototype.initTextures = function(){
    this.textures = [];
    for(var i=0;i<this.graph.textures.length;i++){
        this.textures[i] = new CGFtexture(this,this.graph.textures[i].file);
        this.textures[i].s = this.graph.textures[i].length_s;
        this.textures[i].t = this.graph.textures[i].length_t;
        this.textures[i].id =this.graph.textures[i].id;
        this.textures[i].file =this.graph.textures[i].file;
    }

}

XMLscene.prototype.initMaterials = function(){

    for(var i=0;i<this.graph.materials.length;i++){
        var app = new CGFappearance(this);
        var id = this.graph.materials[i].id;
        var shininess = this.graph.materials[i]["shininess"]["value"];
        var specular = this.graph.materials[i]["specular"];
        var diffuse = this.graph.materials[i]["diffuse"];
        var ambient = this.graph.materials[i]["ambient"];
        var emission = this.graph.materials[i]["emission"];


        app.setShininess(shininess);
        app.setSpecular(specular["r"], specular["g"], specular["b"], specular["a"]);
        app.setDiffuse(diffuse["r"], diffuse["g"], diffuse["b"], diffuse["a"]);
        app.setAmbient(ambient["r"], ambient["g"], ambient["b"], ambient["a"]);
        app.setEmission(emission["r"], emission["g"], emission["b"], emission["a"]);
        app.id=id;


        this.materials.push(app);

    }
}

XMLscene.prototype.updateLight = function(lightId, enable) {
    //Switch only one light
    if(lightId != this.allLights){
        console.log("Changing light " + lightId);
        for (var i = 0; i < this.lights.length; ++i) {
            if (this.lights[i].id == lightId) {
                var light = this.lights[i];
                enable ? light.enable() : light.disable();
                return;
            }
        }
    }else{
        //Switch all lights
        console.log("Changing all lights");
        for (var i = 0; i < this.lights.length; ++i) {
            var light = this.lights[i];
            enable ? light.enable() : light.disable();

        }

    }
}


XMLscene.prototype.updateLights = function(lightId,enable) {
    this.updateOmnis(lightId,enable);
    this.updateSpots(lightId,enable);


};

XMLscene.prototype.updateOmnis = function(lightId,enable) {
    if(lightId != this.allLights) {
        for (var i = 0; i < this.graph.omnis.length; ++i) {
            if (this.lights[i].id == lightId) {
                var light = this.lights[i];
                enable ? light.enable() : light.disable();
                return ;
            }
        }
    }else
    {
        for (var i = 0; i < this.graph.omnis.length; ++i) {
            var light = this.lights[i];
            enable ? light.enable() : light.disable();
        }
    }
};

XMLscene.prototype.updateSpots = function(lightId,enable) {
    if(lightId != this.allLights) {
        for (var i = this.getSpotsBegin() ; i < this.graph.spots.length; ++i) {
            if (this.lights[i].id == lightId) {
                var light = this.lights[i];
                enable ? light.enable() : light.disable();
                return ;
            }
        }
    }else
    {
        for (var i = this.getSpotsBegin() ; i < this.getSpotsEnd(); ++i) {
            var light = this.lights[i];
            enable ? light.enable() : light.disable();
        }
    }
};

XMLscene.prototype.getSpotsBegin = function() {
    return this.graph.omnis.length;
};

XMLscene.prototype.getSpotsEnd = function() {
    return this.graph.omnis.length + this.graph.spots.length;
};
// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.initIllumination();
	this.initLights();

	this.initPrimitives();
	this.initTransformations();
	this.initTextures();
	this.initMaterials();
	this.initComponents();
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

	if (this.graph.loadedOk){
    // Draw axis
        this.axis.display();
        this.lights[0].update();
    //Components


    for (i = 0; i < this.nodes.length; i++) {
        var node = this.nodes[i];

        this.pushMatrix();

        this.multMatrix(node.matrix);
        var a = new CGFappearance(this);
        a.setDiffuse(1,0,0,1);
        if(node.primitive!=null){

            if(node.material!=null){
                node.material.apply();
            }
            else{
                this.setDefaultAppearance();
            }
            if(node.texture!=null){
//                node.primitive.scaleTexCoords(node.texture.s, node.texture.t);
                node.texture.bind();


            }

            node.primitive.display();

            if(node.texture!=null) {
                node.texture.unbind();
            }

        }
         this.popMatrix();
    }



	}

};

