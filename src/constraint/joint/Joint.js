import { JOINT_NULL } from '../../constants';
import { Constraint } from '../Constraint';
import { JointLink } from './JointLink';
import { Vec3 } from '../../math/Vec3';
//import { Mat44 } from '../../math/Mat44';

/**
 * Joints are used to constrain the motion between two rigid bodies.
 * @author saharan
 * @author lo-th
 */

function Joint ( config ){

    Constraint.call( this );

    this.scale = config.scale;
    this.invScale = config.invScale;


    // joint name
    this.name = "";

    // The type of the joint.
    this.type = JOINT_NULL;
    //  The previous joint in the world.
    this.prev = null;
    // The next joint in the world.
    this.next = null;

    this.body1 = config.body1;
    this.body2 = config.body2;

    // The anchor point on the first rigid body in local coordinate system.
    this.localAnchorPoint1 = new Vec3().copy(config.localAnchorPoint1);
    // The anchor point on the second rigid body in local coordinate system.
    this.localAnchorPoint2 = new Vec3().copy(config.localAnchorPoint2);
    // The anchor point on the first rigid body in world coordinate system relative to the body's origin.
    this.relativeAnchorPoint1 = new Vec3();
    // The anchor point on the second rigid body in world coordinate system relative to the body's origin.
    this.relativeAnchorPoint2 = new Vec3();
    //  The anchor point on the first rigid body in world coordinate system.
    this.anchorPoint1 = new Vec3();
    // The anchor point on the second rigid body in world coordinate system.
    this.anchorPoint2 = new Vec3();
    //  Whether allow collision between connected rigid bodies or not.
    this.allowCollision = config.allowCollision;

    this.b1Link = new JointLink( this );
    this.b2Link = new JointLink( this );

    //this.matrix = new Mat44();

};

Joint.prototype = Object.create( Constraint.prototype );
Joint.prototype.constructor = Joint;

// Update all the anchor points.

Joint.prototype.updateAnchorPoints = function () {

    this.relativeAnchorPoint1.mulMat(this.body1.rotation, this.localAnchorPoint1);
    this.relativeAnchorPoint2.mulMat(this.body2.rotation, this.localAnchorPoint2);

    this.anchorPoint1.add(this.relativeAnchorPoint1, this.body1.position);
    this.anchorPoint2.add(this.relativeAnchorPoint2, this.body2.position);

};

// Attach the joint from the bodies.

Joint.prototype.attach = function () {

    this.b1Link.body = this.body2;
    this.b2Link.body = this.body1;
    if(this.body1.jointLink != null) (this.b1Link.next=this.body1.jointLink).prev = this.b1Link;
    else this.b1Link.next = null;
    this.body1.jointLink = this.b1Link;
    this.body1.numJoints++;
    if(this.body2.jointLink != null) (this.b2Link.next=this.body2.jointLink).prev = this.b2Link;
    else this.b2Link.next = null;
    this.body2.jointLink = this.b2Link;
    this.body2.numJoints++;
    
};

// Detach the joint from the bodies.

Joint.prototype.detach = function () {

    var prev = this.b1Link.prev;
    var next = this.b1Link.next;
    if(prev != null) prev.next = next;
    if(next != null) next.prev = prev;
    if(this.body1.jointLink == this.b1Link) this.body1.jointLink = next;
    this.b1Link.prev = null;
    this.b1Link.next = null;
    this.b1Link.body = null;
    this.body1.numJoints--;

    prev = this.b2Link.prev;
    next = this.b2Link.next;
    if(prev != null) prev.next = next;
    if(next != null) next.prev = prev;
    if(this.body2.jointLink==this.b2Link) this.body2.jointLink = next;
    this.b2Link.prev = null;
    this.b2Link.next = null;
    this.b2Link.body = null;
    this.body2.numJoints--;

    this.b1Link.body = null;
    this.b2Link.body = null;

};


// Awake the bodies.

Joint.prototype.awake = function () {

    this.body1.awake();
    this.body2.awake();

};

// calculation function

Joint.prototype.preSolve = function (timeStep,invTimeStep) {
};

Joint.prototype.solve = function () {
};

Joint.prototype.postSolve = function () {
};

// Delete process

Joint.prototype.remove = function () {

    this.dispose();

};

Joint.prototype.dispose = function () {

    this.parent.removeJoint(this);

};


// Three js add

Joint.prototype.getPosition = function () {

    var p1 = new Vec3().scale(this.anchorPoint1, this.scale);
    var p2 = new Vec3().scale(this.anchorPoint2, this.scale);
    return [p1, p2];

};

/*Joint.prototype.getMatrix = function () {

    var m = this.matrix.elements;
    var p1 = this.anchorPoint1;
    var p2 = this.anchorPoint2;
    m[0] = p1.x * this.scale;
    m[1] = p1.y * this.scale;
    m[2] = p1.z * this.scale;
    m[3] = 0;

    m[4] = p2.x * this.scale;
    m[5] = p2.y * this.scale;
    m[6] = p2.z * this.scale;
    m[7] = 0;

    return m;

};*/

export { Joint };