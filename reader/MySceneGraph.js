function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

MySceneGraph.prototype.onXMLReady=function() {
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseGlobalsExample(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	var error = this.parseScene(rootElement);
	if (error != null) {
        this.onXMLError(error);
        return;
    }

    var error = this.parseViews(rootElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    var error = this.parseIllumination(rootElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    var error = this.parseLights(rootElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    var error = this.parseTextures(rootElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    var error = this.parseMaterials(rootElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    var error = this.parseTransformations(rootElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    var error = this.parsePrimitives(rootElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

    var error = this.parseComponents(rootElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {

	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");
};

MySceneGraph.prototype.parseScene= function(rootElement) {

	var elems =  rootElement.getElementsByTagName('scene');
	if (elems == null) {
		return "scene element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'scene' element found.";
	}

    var scene = elems[0];
    this.root = this.reader.getString(scene,'root',true);

    this.axis_length = this.reader.getString(scene,'axis_length',true);

    console.log("Scene read from file: {root=" + this.root + ", axis_length=" + this.axis_length + "}");

};

MySceneGraph.prototype.parseViews= function(rootElement) {

	var elems =  rootElement.getElementsByTagName('views');
	if (elems == null) {
		return "views element is missing.";
	}
	if (elems.length != 1) {
		return "either zero or more than one 'views' element found.";
	}
	this.default_view = this.reader.getString(elems[0],'default',true);

    console.log("Views default view = " + this.default_view);

    var views = elems[0].getElementsByTagName("perspective");
    if (views == null) {
        return "view element is missing.";
    }

    this.views = [];

    for (var i = 0; i < views.length ; i++){
        var temp_view = {};
        temp_view['id'] = this.reader.getString(views[i],'id',true);
        temp_view['near'] = this.reader.getFloat(views[i],'near',true);
        temp_view['far'] = this.reader.getFloat(views[i],'far',true);
        temp_view['angle'] = this.reader.getFloat(views[i],'angle',true);

        var from = views[i].getElementsByTagName("from");
        temp_view['from'] = {};
        temp_view['from']['x'] = this.reader.getFloat(from[0],'x',true);
        temp_view['from']['y'] = this.reader.getFloat(from[0],'y',true);
        temp_view['from']['z'] = this.reader.getFloat(from[0],'z',true);

        var to = views[i].getElementsByTagName("to");
        temp_view['to'] = {};
        temp_view['to']['x'] = this.reader.getFloat(to[0],'x',true);
        temp_view['to']['y'] = this.reader.getFloat(to[0],'y',true);
        temp_view['to']['z'] = this.reader.getFloat(to[0],'z',true);

        this.views.push(temp_view);

        console.log("Views id = " + temp_view['id']);
        console.log("Views near = " + temp_view['near']);
        console.log("Views far = " + temp_view['far']);
        console.log("Views angle = " + temp_view['angle']);

        console.log("Views from x = " + temp_view['from']['x']);
        console.log("Views from y = " + temp_view['from']['y']);
        console.log("Views from z = " + temp_view['from']['z']);

        console.log("Views to x = " + temp_view['to']['x']);
        console.log("Views to y = " + temp_view['to']['y']);
        console.log("Views to z = " + temp_view['to']['z']);
    }
};

MySceneGraph.prototype.parseIllumination = function(rootElement) {

    var elems = rootElement.getElementsByTagName('illumination');
    if (elems == null ) {
        return "Illumination element is missing";
    }

    var illumination = elems[0];

    this.illumination = {};
    this.illumination['doublesided'] = this.reader.getFloat(illumination,'doublesided',true);
    this.illumination['local'] = this.reader.getFloat(illumination,'local',true);

    var elems = illumination.getElementsByTagName("ambient");
    if (elems == null ) {
        return "ambient element is missing";
    }
    var ambient = elems[0];

    this.illumination['ambient'] = {};

    this.illumination['ambient']['r'] = this.reader.getFloat(ambient, 'r', true);
    this.illumination['ambient']['g'] = this.reader.getFloat(ambient, 'g', true);
    this.illumination['ambient']['b'] = this.reader.getFloat(ambient, 'b', true);
    this.illumination['ambient']['a'] = this.reader.getFloat(ambient, 'a', true);

    var elems = illumination.getElementsByTagName("background");

    if (elems == null ) {
        return "background element is missing";
    }

    var background = elems[0];

    this.illumination['background'] = {};

    this.illumination['background']['r'] = this.reader.getFloat(background, 'r', true);
    this.illumination['background']['g'] = this.reader.getFloat(background, 'g', true);
    this.illumination['background']['b'] = this.reader.getFloat(background, 'b', true);
    this.illumination['background']['a'] = this.reader.getFloat(background, 'a', true);

    console.log("Illumination doublesided = " + this.illumination['doublesided']);
    console.log("Illumination local = " + this.illumination['local']);

    console.log("Illumination ambient r = " + this.illumination['ambient']['r']);
    console.log("Illumination ambient g = " + this.illumination['ambient']['g']);
    console.log("Illumination ambient b = " + this.illumination['ambient']['b']);
    console.log("Illumination ambient a = " + this.illumination['ambient']['a']);

    console.log("Illumination background r = " + this.illumination['background']['r']);
    console.log("Illumination background g = " + this.illumination['background']['g']);
    console.log("Illumination background b = " + this.illumination['background']['b']);
    console.log("Illumination background a = " + this.illumination['background']['a']);
};

MySceneGraph.prototype.parseLights = function(rootElement) {
    var elems =  rootElement.getElementsByTagName('lights');
    if (elems == null) {
        return "lights element is missing.";
    }

    id_arr = [];

    id_arr = [];
    var spots = elems[0].getElementsByTagName('spot');
    var omnis = elems[0].getElementsByTagName('omni');

    this.omnis = [];
    this.spots = [];

    for(var i=0; i<omnis.length; i++){
        var temp_omni ={};
        temp_omni['id'] = this.reader.getString(omnis[i],'id',true);
        temp_omni['enabled'] = this.reader.getFloat(omnis[i],'enabled',true);

        var found = id_arr.indexOf(temp_omni['id']);
        if (found>-1) return "Repeated light id";
        id_arr.push(temp_omni['id']);

        var location = omnis[i].getElementsByTagName('location');
        var ambient = omnis[i].getElementsByTagName('ambient');
        var diffuse = omnis[i].getElementsByTagName('diffuse');
        var specular = omnis[i].getElementsByTagName('specular');

        temp_omni['location'] = {};
        temp_omni['location']['x'] = this.reader.getFloat(location[0],'x',true);
        temp_omni['location']['y'] = this.reader.getFloat(location[0],'y',true);
        temp_omni['location']['z'] = this.reader.getFloat(location[0],'z',true);
        temp_omni['location']['w'] = this.reader.getFloat(location[0],'w',true);

        temp_omni['ambient'] = {};
        temp_omni['ambient']['r'] = this.reader.getFloat(ambient[0],'r',true);
        temp_omni['ambient']['g'] = this.reader.getFloat(ambient[0],'g',true);
        temp_omni['ambient']['b'] = this.reader.getFloat(ambient[0],'b',true);
        temp_omni['ambient']['a'] = this.reader.getFloat(ambient[0],'a',true);

        temp_omni['diffuse'] = {};
        temp_omni['diffuse']['r'] = this.reader.getFloat(diffuse[0],'r',true);
        temp_omni['diffuse']['g'] = this.reader.getFloat(diffuse[0],'g',true);
        temp_omni['diffuse']['b'] = this.reader.getFloat(diffuse[0],'b',true);
        temp_omni['diffuse']['a'] = this.reader.getFloat(diffuse[0],'a',true);

        temp_omni['specular'] = {};
        temp_omni['specular']['r'] = this.reader.getFloat(specular[0],'r',true);
        temp_omni['specular']['g'] = this.reader.getFloat(specular[0],'g',true);
        temp_omni['specular']['b'] = this.reader.getFloat(specular[0],'b',true);
        temp_omni['specular']['a'] = this.reader.getFloat(specular[0],'a',true);

        this.omnis.push(temp_omni);

        console.log(temp_omni);
    }


    for(var i=0; i<spots.length; i++){
        var temp_spot ={};
        temp_spot['id'] = this.reader.getString(spots[i],'id',true);
        temp_spot['enabled'] = this.reader.getFloat(spots[i],'enabled',true);
        temp_spot['angle'] = this.reader.getFloat(spots[i],'angle',true);
        temp_spot['exponent'] = this.reader.getFloat(spots[i],'exponent',true);

        var found = id_arr.indexOf(temp_spot['id']);
        if (found>-1) return "Repeated light id";
        id_arr.push(temp_spot['id']);

        var target = spots[i].getElementsByTagName('target');
        var location = spots[i].getElementsByTagName('location');
        var ambient = spots[i].getElementsByTagName('ambient');
        var diffuse = spots[i].getElementsByTagName('diffuse');
        var specular = spots[i].getElementsByTagName('specular');

        temp_spot['target'] = {};
        temp_spot['target']['x'] = this.reader.getFloat(target[0],'x',true);
        temp_spot['target']['y'] = this.reader.getFloat(target[0],'y',true);
        temp_spot['target']['z'] = this.reader.getFloat(target[0],'z',true);

        temp_spot['location'] = {};
        temp_spot['location']['x'] = this.reader.getFloat(location[0],'x',true);
        temp_spot['location']['y'] = this.reader.getFloat(location[0],'y',true);
        temp_spot['location']['z'] = this.reader.getFloat(location[0],'z',true);

        temp_spot['ambient'] = {};
        temp_spot['ambient']['r'] = this.reader.getFloat(ambient[0],'r',true);
        temp_spot['ambient']['g'] = this.reader.getFloat(ambient[0],'g',true);
        temp_spot['ambient']['b'] = this.reader.getFloat(ambient[0],'b',true);
        temp_spot['ambient']['a'] = this.reader.getFloat(ambient[0],'a',true);

        temp_spot['diffuse'] = {};
        temp_spot['diffuse']['r'] = this.reader.getFloat(diffuse[0],'r',true);
        temp_spot['diffuse']['g'] = this.reader.getFloat(diffuse[0],'g',true);
        temp_spot['diffuse']['b'] = this.reader.getFloat(diffuse[0],'b',true);
        temp_spot['diffuse']['a'] = this.reader.getFloat(diffuse[0],'a',true);

        temp_spot['specular'] = {};
        temp_spot['specular']['r'] = this.reader.getFloat(specular[0],'r',true);
        temp_spot['specular']['g'] = this.reader.getFloat(specular[0],'g',true);
        temp_spot['specular']['b'] = this.reader.getFloat(specular[0],'b',true);
        temp_spot['specular']['a'] = this.reader.getFloat(specular[0],'a',true);

        this.spots.push(temp_spot);

        console.log(temp_spot);
    }
};

MySceneGraph.prototype.parseTextures = function(rootElement) {
    var elems =  rootElement.getElementsByTagName('textures');
    if (elems == null) {
        return "textures element is missing.";
    }

    id_arr = [];

    this.textures = [];
    var textures = elems[0].getElementsByTagName('texture');

    for(var i=0;i<textures.length;i++){

        var temp_texture = {};
        temp_texture['id'] = this.reader.getString(textures[i],'id',true);

        var found = id_arr.indexOf(temp_texture['id']);
        if (found>-1) return "Repeated texture id";
        id_arr.push(temp_texture['id']);

        temp_texture['file'] = this.reader.getString(textures[i],'file',true);
        temp_texture['length_s'] = this.reader.getString(textures[i],'length_s',true);
        temp_texture['length_t'] = this.reader.getString(textures[i],'length_t',true);
        this.textures.push(temp_texture);

        console.log(temp_texture);
    }
}

MySceneGraph.prototype.parseMaterials = function(rootElement){
    var elems =  rootElement.getElementsByTagName('materials');
    if (elems == null) {
        return "materials element is missing.";
    }

    var id_arr = [];

    var materials = elems[0].getElementsByTagName('material');
    this.materials = [];

    for(var i=0;i<materials.length;i++){
        var material = {};
        material['id'] = this.reader.getString(materials[i],'id',true);

        var found = id_arr.indexOf(material['id']);
        if (found>-1) return "Repeated material id";
        id_arr.push(material['id']);

        var emission = materials[i].getElementsByTagName('emission');
        var ambient = materials[i].getElementsByTagName('ambient');
        var diffuse = materials[i].getElementsByTagName('diffuse');
        var specular = materials[i].getElementsByTagName('specular');
        var shininess = materials[i].getElementsByTagName('shininess');

        material['emission'] = {};
        material['ambient'] = {};
        material['diffuse'] = {};
        material['specular'] = {};
        material['shininess'] = {};

        material['emission']['r'] = this.reader.getFloat(emission[0],'r',true);
        material['emission']['g'] = this.reader.getFloat(emission[0],'g',true);
        material['emission']['b'] = this.reader.getFloat(emission[0],'b',true);
        material['emission']['a'] = this.reader.getFloat(emission[0],'a',true);

        material['ambient']['r'] = this.reader.getFloat(ambient[0],'r',true);
        material['ambient']['g'] = this.reader.getFloat(ambient[0],'g',true);
        material['ambient']['b'] = this.reader.getFloat(ambient[0],'b',true);
        material['ambient']['a'] = this.reader.getFloat(ambient[0],'a',true);

        material['diffuse']['r'] = this.reader.getFloat(diffuse[0],'r',true);
        material['diffuse']['g'] = this.reader.getFloat(diffuse[0],'g',true);
        material['diffuse']['b'] = this.reader.getFloat(diffuse[0],'b',true);
        material['diffuse']['a'] = this.reader.getFloat(diffuse[0],'a',true);

        material['specular']['r'] = this.reader.getFloat(specular[0],'r',true);
        material['specular']['g'] = this.reader.getFloat(specular[0],'g',true);
        material['specular']['b'] = this.reader.getFloat(specular[0],'b',true);
        material['specular']['a'] = this.reader.getFloat(specular[0],'a',true);

        material['shininess']['value'] = this.reader.getFloat(shininess[0],'value',true);

        this.materials.push(material);

        console.log(material);
    }
};

MySceneGraph.prototype.parseTransformations = function(rootElement){
    var elems =  rootElement.getElementsByTagName('transformations');
    if (elems == null) {
        return "transformations element is missing.";
    }

    var id_arr = [];
    var transformations = elems[0].getElementsByTagName('transformation');
    this.transformations = [];

    for(var i=0;i<transformations.length;i++){
        var transformation = {};
        transformation['id'] = this.reader.getString(transformations[i],'id',true);
        var found = id_arr.indexOf(transformation['id']);
        if (found>-1) return "Repeated transformation id";
        id_arr.push(transformation['id']);

        var translate = transformations[i].getElementsByTagName('translate');
        var rotate = transformations[i].getElementsByTagName('rotate');
        var scale = transformations[i].getElementsByTagName('scale');

        transformation['translate'] = {};
        transformation['rotate'] = {};
        transformation['scale'] = {};

        transformation['translate']['x'] = this.reader.getFloat(translate[0],'x',true);
        transformation['translate']['y'] = this.reader.getFloat(translate[0],'y',true);
        transformation['translate']['z'] = this.reader.getFloat(translate[0],'z',true);

        transformation['rotate']['axis'] = this.reader.getFloat(rotate[0],'axis',true);
        transformation['rotate']['angle'] = this.reader.getFloat(rotate[0],'angle',true);

        transformation['scale']['x'] = this.reader.getFloat(scale[0],'x',true);
        transformation['scale']['y'] = this.reader.getFloat(scale[0],'y',true);
        transformation['scale']['z'] = this.reader.getFloat(scale[0],'z',true);

        this.transformations.push(transformation);
        console.log(transformation);
    }
};

MySceneGraph.prototype.parsePrimitives = function(rootElement){
    var elems =  rootElement.getElementsByTagName('primitives');
    if (elems == null) {
        return "primitives element is missing.";
    }

    var id_arr = [];
    var primitives = elems[0].getElementsByTagName('primitive');
    this.primitives = [];

    for(var i=0;i<primitives.length;i++){
        var primitive = {};
        primitive['id'] = this.reader.getString(primitives[i],'id',true);
        var found = id_arr.indexOf(primitive['id']);
        if (found>-1) return "Repeated primitive id";
        id_arr.push(primitive['id']);

        var rectangle = primitives[i].getElementsByTagName('rectangle');
        var triangle = primitives[i].getElementsByTagName('triangle');
        var cylinder = primitives[i].getElementsByTagName('cylinder');
        var sphere = primitives[i].getElementsByTagName('sphere');
        var torus = primitives[i].getElementsByTagName('torus');

        primitive['rectangle'] = {};
        primitive['triangle'] = {};
        primitive['cylinder'] = {};
        primitive['sphere'] = {};
        primitive['torus'] = {};

        primitive['rectangle']['x1'] = this.reader.getFloat(rectangle[0],'x1',true);
        primitive['rectangle']['y1'] = this.reader.getFloat(rectangle[0],'y1',true);
        primitive['rectangle']['x2'] = this.reader.getFloat(rectangle[0],'x2',true);
        primitive['rectangle']['y2'] = this.reader.getFloat(rectangle[0],'y2',true);

        primitive['triangle']['x1'] = this.reader.getFloat(triangle[0],'x1',true);
        primitive['triangle']['y1'] = this.reader.getFloat(triangle[0],'y1',true);
        primitive['triangle']['z1'] = this.reader.getFloat(triangle[0],'z1',true);
        primitive['triangle']['x2'] = this.reader.getFloat(triangle[0],'x2',true);
        primitive['triangle']['y2'] = this.reader.getFloat(triangle[0],'y2',true);
        primitive['triangle']['z2'] = this.reader.getFloat(triangle[0],'z2',true);
        primitive['triangle']['x3'] = this.reader.getFloat(triangle[0],'x3',true);
        primitive['triangle']['y3'] = this.reader.getFloat(triangle[0],'y3',true);
        primitive['triangle']['z3'] = this.reader.getFloat(triangle[0],'z3',true);

        primitive['cylinder']['base'] = this.reader.getFloat(cylinder[0],'base',true);
        primitive['cylinder']['top'] = this.reader.getFloat(cylinder[0],'top',true);
        primitive['cylinder']['height'] = this.reader.getFloat(cylinder[0],'height',true);
        primitive['cylinder']['slices'] = this.reader.getFloat(cylinder[0],'slices',true);
        primitive['cylinder']['stacks'] = this.reader.getFloat(cylinder[0],'stacks',true);

        primitive['sphere']['radius'] = this.reader.getFloat(sphere[0],'radius',true);
        primitive['sphere']['slices'] = this.reader.getFloat(sphere[0],'slices',true);
        primitive['sphere']['stacks'] = this.reader.getFloat(sphere[0],'stacks',true);

        primitive['torus']['inner'] = this.reader.getFloat(torus[0],'inner',true);
        primitive['torus']['outer'] = this.reader.getFloat(torus[0],'outer',true);
        primitive['torus']['slices'] = this.reader.getFloat(torus[0],'slices',true);
        primitive['torus']['loops'] = this.reader.getFloat(torus[0],'loops',true);

        this.primitives.push(primitive);
        console.log(primitive);
    }
};

MySceneGraph.prototype.parseComponents = function(rootElement){
    var elems =  rootElement.getElementsByTagName('components');
    if (elems == null) {
        return "components element is missing.";
    }

    var id_arr = [];
    var components = elems[0].getElementsByTagName('component');
    this.components = [];

    for(var i=0;i<components.length;i++){
        var component = {};
        component['id'] = this.reader.getString(components[i],'id',true);
        var found = id_arr.indexOf(component['id']);
        if (found>-1) return "Repeated component id";
        id_arr.push(component['id']);

        //transformation
        var transformation = components[i].getElementsByTagName('transformation');
        component['transformation'] = {};
        var transformationref = transformation[0].getElementsByTagName('transformationref');
        component['transformation']['transformationref'] = {};
        component['transformation']['transformationref']['id'] = this.reader.getString(transformationref[0],'id',true);
        component['transformation']['translate'] = {};
        component['transformation']['rotate'] = {};
        component['transformation']['scale'] = {};

        var translate = transformation[0].getElementsByTagName('translate');
        var rotate = transformation[0].getElementsByTagName('rotate');
        var scale = transformation[0].getElementsByTagName('scale');

        component['transformation']['translate']['x'] = this.reader.getFloat(translate[0],'x',true);
        component['transformation']['translate']['y'] = this.reader.getFloat(translate[0],'y',true);
        component['transformation']['translate']['z'] = this.reader.getFloat(translate[0],'z',true);
        component['transformation']['rotate']['axis'] = this.reader.getFloat(rotate[0],'axis',true);
        component['transformation']['rotate']['angle'] = this.reader.getFloat(rotate[0],'angle',true);
        component['transformation']['scale']['x'] = this.reader.getFloat(scale[0],'x',true);
        component['transformation']['scale']['y'] = this.reader.getFloat(scale[0],'y',true);
        component['transformation']['scale']['z'] = this.reader.getFloat(scale[0],'z',true);

        //materials
        var materials = components[i].getElementsByTagName('materials');
        if(materials.length==null) return "No materials";
        component['materials'] = [];
        for(var j=0;j<materials.length;j++){
            var material = materials[j].getElementsByTagName('material');
            component['materials'].push(this.reader.getString(material[0],'id',true));
        }

        //texture
        var texture = components[i].getElementsByTagName('texture');
        if(texture.length==null) return "No texture found on component";
        component['texture'] = this.reader.getString(texture[0],'id',true);

        //children
        var children = components[i].getElementsByTagName('children');
        if(children.length==null) return "No children found on component";

        component['children'] = {};
        component['children']['componentref'] = [];
        component['children']['primitiveref'] = [];

        var componentref = children[0].getElementsByTagName('componentref');
        var primitiveref = children[0].getElementsByTagName('primitiveref');

        for(var j=0;j<componentref.length;j++){
            component['children']['componentref'].push(this.reader.getString(componentref[j],'id',true));
        }

        for(var k=0;k<primitiveref.length;k++){
            component['children']['primitiveref'].push(this.reader.getString(primitiveref[k],'id',true));
        }

        this.components.push(component);
        console.log(component);
    }
};

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


