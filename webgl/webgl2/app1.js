"use strict";

// 矩阵转换

var vertexShaderSource = `#version 300 es
    in vec2 a_position;
    uniform vec2 u_wh;
    uniform vec2 trans;
    uniform vec2 scale;
    uniform float rotation;
    void main() {
        mat4 projectionMat = mat4(
            2.0 / u_wh.x, 0, 0, 0,
            0, -2.0 / u_wh.y, 0, 0,
            0, 0, 1, 0,
            -1, 1, 0, 1
        );
        mat4 translationMat = mat4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            trans.x, trans.y, 0, 1
        );
        mat4 rotationMat = mat4(
            scale.x, 0, 0, 0,
            0, scale.y, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
        float c = cos(rotation);
        float s = sin(rotation);
        mat4 scaleMat = mat4(
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
        gl_Position = projectionMat * translationMat * rotationMat * scaleMat * vec4(a_position.xy, 0, 1);
    }
`

var fragmentShaderSource = `#version 300 es
    precision highp float;
    uniform vec4 u_color;
    out vec4 outColor;
    void main() {
        outColor = u_color;
    }
`

main()

function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }

    // Use our boilerplate utils to compile the shaders and link into a program
    var program = webglUtils.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource]);

    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // look up uniform locations
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_wh");
    var transLocation = gl.getUniformLocation(program, "trans");
    var rotationLocation = gl.getUniformLocation(program, "rotation");
    var scaleLocation = gl.getUniformLocation(program, "scale");

    // Create a buffer
    var positionBuffer = gl.createBuffer();

    // Create a vertex array object (attribute state)
    var vao = gl.createVertexArray();

    // and make it the one we're currently working with
    gl.bindVertexArray(vao);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array([
            0, 0,
            200, 0,
            100, 200,
        ]),
        gl.STATIC_DRAW);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // First let's make some variables
    // to hold the translation,
    var translation = [0, 0];
    var rotationInRadians = 0;
    var scale = [1, 1];
    var color = [Math.random(), Math.random(), Math.random(), 1];

    drawScene();

    // Setup a ui.
    webglLessonsUI.setupSlider("#x", { value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y", { value: translation[1], slide: updatePosition(1), max: gl.canvas.height });
    webglLessonsUI.setupSlider("#angle", { value: rotationInRadians * 180 / Math.PI | 0, slide: updateAngle, max: 360 });
    webglLessonsUI.setupSlider("#scaleX", { value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2 });
    webglLessonsUI.setupSlider("#scaleY", { value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2 });

    function updatePosition(index) {
        return function (event, ui) {
            translation[index] = ui.value;
            drawScene();
        };
    }

    function updateAngle(event, ui) {
        var angleInDegrees = 360 - ui.value;
        rotationInRadians = angleInDegrees * Math.PI / 180;
        drawScene();
    }

    function updateScale(index) {
        return function (event, ui) {
            scale[index] = ui.value;
            drawScene();
        };
    }

    // Draw the scene.
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

        // Set the color.
        gl.uniform4fv(colorLocation, color);
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)
        gl.uniform2fv(scaleLocation, scale)  // 缩放
        gl.uniform2fv(transLocation, translation)    // 平移
        gl.uniform1f(rotationLocation, rotationInRadians)   // 旋转

        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 3;
        gl.drawArrays(primitiveType, offset, count);
    }
}