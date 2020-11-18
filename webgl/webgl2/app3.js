"use strict";

var vertexShaderSource = `#version 300 es
    in vec2 a_position;
    in vec2 a_texCoord;

    uniform vec2 u_resolution;
    uniform vec2 trans;
    uniform vec2 scale;
    uniform float rotation;

    uniform float u_flipY;

    out vec2 v_texCoord;

    void main() {
        mat4 projectionMat = mat4(
            2.0 / u_resolution.x, 0, 0, 0,
            0, -2.0 / u_resolution.y, 0, 0,
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
        // gl_Position = projectionMat * translationMat * rotationMat * scaleMat * vec4(a_position, 0, 1);

        vec2 zeroToOne = a_position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, u_flipY), 0, 1);

        // pass the texCoord to the fragment shader
        // The GPU will interpolate this value between points.
        v_texCoord = a_texCoord;
    }
`;

var fragmentShaderSource = `#version 300 es
    precision highp float;

    uniform sampler2D u_image;

    uniform float u_kernel[9];
    uniform float u_kernelWeight;

    in vec2 v_texCoord;

    out vec4 outColor;

    void main() {
        vec2 onePixel = vec2(1) / vec2(textureSize(u_image, 0));

        vec4 colorSum =
            texture(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
            texture(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
            texture(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
            texture(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
            texture(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
            texture(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
            texture(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
            texture(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
            texture(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;
        outColor = vec4((colorSum / u_kernelWeight).rgb, 1);
    }
`;

function main() {
    var image = new Image();
    image.src = "./src/leaves.jpg";  // MUST BE SAME DOMAIN!!!
    image.onload = function () {
        render(image);
    };
}

function render(image) {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }

    // setup GLSL program
    var program = webglUtils.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource]);

    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");    // 顶点坐标
    var texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");    // 纹理坐标

    // 查找 uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var imageLocation = gl.getUniformLocation(program, "u_image");
    var kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
    var kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");
    var flipYLocation = gl.getUniformLocation(program, "u_flipY"); // 反转
    var transLocation = gl.getUniformLocation(program, "trans");
    var scaleLocation = gl.getUniformLocation(program, "scale");
    var rotationLocation = gl.getUniformLocation(program, "rotation");

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    /* 顶点坐标缓冲区 */
    var positionBuffer = gl.createBuffer();
    gl.enableVertexAttribArray(positionAttributeLocation);  // 启用属性
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);         // 制定缓冲区
    setRectangle(gl, 0, 0, image.width, image.height);
    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    /* 提供矩阵的纹理坐标 */
    gl.enableVertexAttribArray(texCoordAttributeLocation);  // 启用纹理坐标属性
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0,
    ]), gl.STATIC_DRAW);
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(texCoordAttributeLocation, size, type, normalize, stride, offset);

    function createAndSetupTexture(gl) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set up texture so we can render any size image and so we are
        // working with pixels.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        return texture;
    }

    /* 创建一个纹理, 并将图像放入其中 */
    var originalImageTexture = createAndSetupTexture(gl);
    var mipLevel = 0;               // the largest mip
    var internalFormat = gl.RGBA;   // format we want in the texture
    var srcFormat = gl.RGBA;        // format of data we are supplying
    var srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
    gl.texImage2D(gl.TEXTURE_2D, mipLevel, internalFormat, srcFormat, srcType, image);

    /* 创建两个纹理, 并将其附加到两个帧缓冲区 */
    var textures = [];
    var framebuffers = [];
    for (var ii = 0; ii < 2; ++ii) {
        var texture = createAndSetupTexture(gl);
        textures.push(texture);
        // 纹理与图像大小一致
        var mipLevel = 0;               // the largest mip
        var internalFormat = gl.RGBA;   // format we want in the texture
        var border = 0;                 // must be 0
        var srcFormat = gl.RGBA;        // format of data we are supplying
        var srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
        var data = null;                // 创建空纹理
        gl.texImage2D(gl.TEXTURE_2D, mipLevel, internalFormat, image.width, image.height, border, srcFormat, srcType, data);
        // 创建帧缓冲区
        var fbo = gl.createFramebuffer();
        framebuffers.push(fbo);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        // 将纹理附加到帧缓冲中
        var attachmentPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, mipLevel);
    }

    // Define several convolution kernels
    var kernels = {
        normal: [
            0, 0, 0,
            0, 1, 0,
            0, 0, 0,
        ],
        gaussianBlur: [
            0.045, 0.122, 0.045,
            0.122, 0.332, 0.122,
            0.045, 0.122, 0.045,
        ],
        gaussianBlur2: [
            1, 2, 1,
            2, 4, 2,
            1, 2, 1,
        ],
        gaussianBlur3: [
            0, 1, 0,
            1, 1, 1,
            0, 1, 0,
        ],
        unsharpen: [
            -1, -1, -1,
            -1, 9, -1,
            -1, -1, -1,
        ],
        sharpness: [
            0, -1, 0,
            -1, 5, -1,
            0, -1, 0,
        ],
        sharpen: [
            -1, -1, -1,
            -1, 16, -1,
            -1, -1, -1,
        ],
        edgeDetect: [
            -0.125, -0.125, -0.125,
            -0.125, 1, -0.125,
            -0.125, -0.125, -0.125,
        ],
        edgeDetect2: [
            -1, -1, -1,
            -1, 8, -1,
            -1, -1, -1,
        ],
        edgeDetect3: [
            -5, 0, 0,
            0, 0, 0,
            0, 0, 5,
        ],
        edgeDetect4: [
            -1, -1, -1,
            0, 0, 0,
            1, 1, 1,
        ],
        edgeDetect5: [
            -1, -1, -1,
            2, 2, 2,
            -1, -1, -1,
        ],
        edgeDetect6: [
            -5, -5, -5,
            -5, 39, -5,
            -5, -5, -5,
        ],
        sobelHorizontal: [
            1, 2, 1,
            0, 0, 0,
            -1, -2, -1,
        ],
        sobelVertical: [
            1, 0, -1,
            2, 0, -2,
            1, 0, -1,
        ],
        previtHorizontal: [
            1, 1, 1,
            0, 0, 0,
            -1, -1, -1,
        ],
        previtVertical: [
            1, 0, -1,
            1, 0, -1,
            1, 0, -1,
        ],
        boxBlur: [
            0.111, 0.111, 0.111,
            0.111, 0.111, 0.111,
            0.111, 0.111, 0.111,
        ],
        triangleBlur: [
            0.0625, 0.125, 0.0625,
            0.125, 0.25, 0.125,
            0.0625, 0.125, 0.0625,
        ],
        emboss: [
            -2, -1, 0,
            -1, 1, 1,
            0, 1, 2,
        ],
    };

    var effects = [
        { name: "gaussianBlur", },
        { name: "gaussianBlur2", },
        { name: "gaussianBlur3", },
        { name: "sharpness", },
        { name: "sharpness", },
        { name: "sharpness", },
        { name: "sharpen", },
        { name: "sharpen", },
        { name: "sharpen", },
        { name: "unsharpen", },
        { name: "unsharpen", },
        { name: "unsharpen", },
        { name: "emboss", },
        { name: "edgeDetect", },
        { name: "edgeDetect2", },
        { name: "edgeDetect3", },
        { name: "edgeDetect4", },
    ];

    /* 设置ui */
    var ui = document.querySelector("#ui");
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");
    for (var ii = 0; ii < effects.length; ++ii) {
        var effect = effects[ii];
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        var chk = document.createElement("input");
        chk.value = effect.name;
        chk.type = "checkbox";
        if (effect.on) {
            chk.checked = "true";
        }
        chk.onchange = drawEffects;
        td.appendChild(chk);
        td.appendChild(document.createTextNode(effect.name));
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    ui.appendChild(table);
    $("#ui table").tableDnD({ onDrop: drawEffects });

    var translation = [0, 0];
    var rotationInRadians = 0;
    var scale = [1, 1];

    drawEffects();

    function drawEffects() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(program);
        gl.bindVertexArray(vao);

        // start with the original image on unit 0
        gl.activeTexture(gl.TEXTURE0 + 0);
        gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);

        // Tell the shader to get the texture from texture unit 0
        gl.uniform1i(imageLocation, 0);

        // don't y flip images while drawing to the textures
        gl.uniform1f(flipYLocation, 1);

        // loop through each effect we want to apply.
        var count = 0;
        for (var ii = 0; ii < tbody.rows.length; ++ii) {
            var checkbox = tbody.rows[ii].firstChild.firstChild;
            if (checkbox.checked) {
                // Setup to draw into one of the framebuffers.
                setFramebuffer(framebuffers[count % 2], image.width, image.height);

                drawWithKernel(checkbox.value);

                // for the next draw, use the texture we just rendered to.
                gl.bindTexture(gl.TEXTURE_2D, textures[count % 2]);

                // increment count so we use the other texture next time.
                ++count;
            }
        }

        // finally draw the result to the canvas.
        gl.uniform1f(flipYLocation, -1);  // need to y flip for canvas

        setFramebuffer(null, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        drawWithKernel("normal");
    }

    function computeKernelWeight(kernel) {
        var weight = kernel.reduce(function (prev, curr) {
            return prev + curr;
        });
        console.log(kernel, weight)
        return weight <= 0 ? 1 : weight;
    }

    function setFramebuffer(fbo, width, height) {
        // make this the framebuffer we are rendering to.
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

        // Tell the shader the resolution of the framebuffer.
        gl.uniform2f(resolutionLocation, width, height);

        gl.uniform2fv(scaleLocation, scale)  // 缩放
        gl.uniform2fv(transLocation, translation)    // 平移
        gl.uniform1f(rotationLocation, rotationInRadians)   // 旋转

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, width, height);
    }

    function drawWithKernel(name) {
        // set the kernel and it's weight
        gl.uniform1fv(kernelLocation, kernels[name]);
        console.log(name)
        gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[name]));

        // Draw the rectangle.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }
}

function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.STATIC_DRAW);
}

$(function () {
    main();
});
