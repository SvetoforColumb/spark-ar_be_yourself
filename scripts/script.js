// const Diagnostics = require('Diagnostics');
// @ts-ignore
// @ts-ignore
// @ts-ignore
// const Scene = require('Scene');
const Shaders = require('Shaders');
const Materials = require("Materials");
const R = require("Reactive");
// const CameraInfo = require('CameraInfo');
const Textures = require('Textures');
const Time = require('Time');
// const Patches = require('Patches')
const mat = Materials.get("user_mat");
const cameraTexture = Textures.get("cameraTexture0");
const cameraColor = cameraTexture.signal;

// get the texture coordinates in fragment stage
// @ts-ignore
const texcoords = Shaders.fragmentStage(Shaders.vertexAttribute({'variableName': Shaders.VertexAttribute.TEX_COORDS}));

var distortion = 6.201;

// @ts-ignore
var time_p = R.mod(Time.ms, distortion);

var glitch_st_signal = glitchSignal(time_p);

var glitch_color_signal = glitchColor(cameraColor, glitch_st_signal, time_p);
// glitchColor(cameraColor, glitch_signal)

var sampled = Shaders.textureSampler(glitch_color_signal, glitch_st_signal);


// set texture to sampled
// @ts-ignore
const textureSlot = Shaders.DefaultMaterialTextures.DIFFUSE
// @ts-ignore
mat.setTexture(sampled, {textureSlotName: textureSlot});

function hash(p) {
	// @ts-ignore
	return R.mod(R.mul(R.sin(R.dot(p,(R.pack2(12.9898, 78.233)))), 43758.5453), 2);
}
// @ts-ignore
// @ts-ignore
function glitchSignal(time_p) {

    var glitch_value_st = 8.0;


    // Diagnostics.watch("time_p", time_p);
    // @ts-ignore
    var st_y = R.add(texcoords.y, 0.0);
    // @ts-ignore
    var st_x = R.add(texcoords.x, 0.0);
    
    // @ts-ignore
    var t = R.mul(time_p, 5.0);
    
    var up = hash(R.pack2(t, t));
    // @ts-ignore
    var up2 = hash(R.pack2(R.mul(t, 5.0), (R.mul(t, 5.0))));
    // @ts-ignore
    var up3 = hash(R.pack2(R.mul(t, 2.0), (R.mul(t, 2.0))));
    
    var st_x_1 = R.mix(
        st_x, 
        // @ts-ignore
        R.add(st_x, R.mul(R.floor(R.sin(R.mul((R.mul(t, 2.0)), 3.0))), R.mul(R.add(0.01, R.mul(R.mul(up, up), 0.1)), 0.2))), 
        // @ts-ignore
        R.sub(R.smoothStep(up, R.add(up, 0.1), st_y), R.smoothStep(R.add(up, 0.1), R.add(R.add(up, 0.1), 0.05), st_y))
        );
    
    st_x_1 = R.mix(
        st_x_1, 
        // @ts-ignore
        R.add(st_x_1, R.mul(R.floor(R.mul(R.sin(R.mul(t, 2.0)), 3.0)), R.mul((R.add(0.01, R.mul(up2, R.mul(up2, 0.1)))), 0.1))), 
        // @ts-ignore
        R.sub(R.smoothStep(up2, R.add(up2, 0.0), st_y), R.smoothStep(R.add(up2, 0.05), R.add(up2, R.add(0.05, 0.0)), st_y))
        );
    
    st_x_1 = R.mix(
        st_x_1, 
        // @ts-ignore
        R.add(st_x_1, R.mul(R.floor(R.mul(R.sin(R.mul(t, 2.0)), 3.0)), R.mul(R.add(0.01, R.mul(up3, R.mul(up3, 0.1))), 0.1))), 
        // @ts-ignore
        R.sub(R.smoothStep(up3, R.add(up3, 0.0), st_y), R.smoothStep(R.add(up3, 0.01), R.add(up3, R.add(0.01, 0.0)), st_y))
        );
    
    // @ts-ignore
    st_x_1 = R.mix(st_x, st_x_1, glitch_value_st);

    const newUV = R.pack2(
        // @ts-ignore
        st_x_1,
        // @ts-ignore
        st_y
    );   

    return newUV;
}

// @ts-ignore
function glitchColor(color, st_2, time_p){

    var glitch_value_color = 0.5;
   
    // @ts-ignore
    var st_y_1 = R.add(texcoords.y, 0.0);
    // @ts-ignore
    var st_x_1 = R.add(texcoords.x, 0.0);

    //color r = x, g = y, b = z
    var dist = 0.000005;
    // @ts-ignore
    var t = R.mul(time_p, 1.1);
    // @ts-ignore
    var up = R.mul(hash(R.pack2(t, t)), 0.005);

    var color_1 = R.pack3(
        // @ts-ignore
        Shaders.textureSampler(cameraColor, R.pack2(R.sub(st_x_1, R.add(dist, R.mul(R.sin(R.add(R.mul(st_y_1, 10.0), t)), dist))), R.add(st_y_1, dist))).x, 
        // @ts-ignore
        0.0, 
        0.0
        );
    
    color_1 = R.add(color_1, R.pack3(
        // @ts-ignore
        0.0, 
        // @ts-ignore
        Shaders.textureSampler(cameraColor, R.pack2(R.add(st_2.x, R.mul(R.sin(R.add(up, R.mul(t, 999.0))), 0.02)), R.sub(st_2.y, dist))).y, 
        0.0
        ));
    
    color_1 = R.add(color_1, R.pack3(
        // @ts-ignore
        0.0, 
        0.0, 
        // @ts-ignore
        Shaders.textureSampler(cameraColor, R.pack2(st_x_1, R.sub(st_y_1, dist))).z
        ));

    

    // @ts-ignore
    var color_red = color_1.x;
    // @ts-ignore
    var color_green = color_1.y;
    // @ts-ignore
    var color_blue = color_1.z;

    // @ts-ignore
    var new_color = R.mix(color, R.pack4(color_red, color_green, color_blue, 1.0), R.mul(glitch_value_color, hash(R.pack2(time_p, time_p))));

    return new_color;
}