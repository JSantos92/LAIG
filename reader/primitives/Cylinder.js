function Cylinder(scene, args) {
    CGFobject.call(this,scene);

    var res = args.split(" ");

    this.base = res[0];
    this.top = res[1];
    this.height = res[2];
    this.slices = res[3];
    this.stacks = res[4];
