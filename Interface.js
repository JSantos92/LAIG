function Interface() {
    //calls CGFinterface constructor
    CGFinterface.call(this);
};

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

Interface.prototype.init = function(application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);
    this.gui = new dat.GUI();
};

Interface.prototype.onGraphLoaded = function() {
    var group = this.gui.addFolder('Lights');
    group.open();
    var self = this;

    for (key in this.scene.lightsEnabled) {
        var controller = group.add(this.scene.lightsEnabled, key);
        controller.onChange(function (enable) {
            if (this.property == 'All') {
                self.scene.updateLight(this.property, enable);
            }
            self.scene.updateLight(this.property, enable);
        });
    }

}
Interface.prototype.setScene = function(scene) {
    this.scene = scene;
}








// /**
//  * Created by João on 25/10/2016.
//  */
//
//
// function Interface() {
//     //call CGFinterface constructor
//     this.gui = new dat.GUI();
//     this.omniGroup = this.gui.addFolder("Omni Lights");
//     this.spotGroup = this.gui.addFolder("Spot Lights");
//     //this.lights = this.gui.addFolder("ligths");
//
//     this.viewsGroup = this.gui.addFolder("Views")
//
//     this.omniGroup.open();
//     this.spotGroup.open();
//
//     console.log(this);
//
//     // this.omniGroup.onChange(function(value) {
//     //    console.log(this);
//     // });
//     //
//     // this.spotGroup.onChange(function(value) {
//
//
//     // });
//
//
//     CGFinterface.call(this);
// };
//
// Interface.prototype = Object.create(CGFinterface.prototype);
// Interface.prototype.constructor = Interface;
//
// Interface.prototype.init = function (application) {
//
//     // call CGFinterface init
//     CGFinterface.prototype.init.call(this, application);
//
//     // init GUI. For more information on the methods, check:
//     //  http://workshop.chromeexperiments.com/examples/gui
//
//
//     // add a button:
//     // the first parameter is the object that is being controlled (in this case the scene)
//     // the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
//     // e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); };
//
//     //this.gui.add(this.scene, 'doSomething');
//
//     // add a group of controls (and open/expand by defult)
//
//     // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
//     // e.g. this.option1=true; this.option2=false;
//
//     // add a slider
//     // must be a numeric variable of the scene, initialized in scene.init e.g.
//     // this.speed=3;
//     // min and max values can be specified as parameters
//
//     return true;
// };
//
// var light = function(id,enabled) {
//
//     var a = Boolean(enabled);
//     this[id] = !a;
//
// };
//
// var view = function(id) {
//
//     this[id] = id;
// };
//
//
// Interface.prototype.addLight = function(type,id,enabled) {
//
//
//
//     var text = new light(id,enabled);
//
//     if (type == "omni") {
//         this.omniGroup.add(text,id, 'true');
//     } else if (type == "spot") {
//         this.spotGroup.add(text,id, 'true');
//     } else {
//         console.log("No lights of this type");
//     }
//
// };
//
// Interface.prototype.addView = function(id) {
//
//     var text1 = new view(id);
//
//     this.viewsGroup.add(text1, id);
// };
//
