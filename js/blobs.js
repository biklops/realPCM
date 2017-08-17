/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports) {




/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(3);
	__webpack_require__(4);

	var blobs = function () {
	};

	blobs.prototype = {

	    setup: function (canvas, image) {

	        this.canvas = canvas;
	        var webgl = this.webgl = createGL(this.canvas);
	        this.gl = this.webgl.gl;
	        var gl = this.gl;

	        this.circle = webgl.createProgram('\n  varying vec2 v_texCoord;\n  uniform vec2 size;\n  uniform vec2 pos;\n  uniform float alpha;\n  varying vec2 v_color;\n  float gauss(float v){\n    return (1.0-cos(v*3.14*2.0))*0.5;\n  }\n  void main(){\n    float a=gauss(v_texCoord.x)*gauss(v_texCoord.y);\n    vec4 color=vec4(vec3(0.0),a*alpha);\n    gl_FragColor=vec4(color.rgb,color.a);\n  }\n');

	        var blob = this.blob = webgl.createProgram('\n  varying vec2 v_texCoord;\n  uniform sampler2D texture;\n  uniform sampler2D colorTexture;\n  float range(float v,float low,float high){\n    return low+(v*(high-low));\n  }\n  void main(){\n    vec4 color=texture2D(texture,v_texCoord);\n    color.a=clamp(pow(color.a+0.4,200.0),0.0,1.0);\n    if(color.a<0.2){\n      color.a=0.0;\n    }\n    color.rgb=vec3(\n      1.0,\n      range(v_texCoord.x,0.11,0.84),\n      range(v_texCoord.y,0.91,0.4)\n    );\n    color.rgb=texture2D(colorTexture,v_texCoord).rgb;\n    // color=vec4(v_texCoord,0.0,1.0);\n    gl_FragColor=vec4(color.rgb,color.a);\n  }\n');

	        var fb = this.fb = webgl.createFramebuffer();

	        gl.useProgram(blob);
	        var textureLocation = gl.getUniformLocation(blob, 'texture');
	        gl.uniform1i(textureLocation, 0);

	        this.img = new Image();

	        this.img.addEventListener('load', this.start.bind(this));

	        this.img.src = image;

	        // addEventListener('mousedown', function (event) {
	        //     this.splitBallsOnPoint(event.clientX, event.clientY);
	        // });
	        // document.addEventListener('touchstart', function (event) {
	        //     this.splitBallsOnPoint(event.touches[0].clientX, event.touches[0].clientY);
	        // });

	    },

	    createBall: function () {

	        var canvas = this.canvas;
	        var random = this.random;
	        var weight = this.weight,
	            flipCoin = this.flipCoin;

	        var origin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	        var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	        var balls = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	        var r = Math.pow(random(), 1.5);
	        r = 90 + 200 * r;
	        var speed = {
	            x: random(0.01),
	            y: random(0.3, 1)
	        };
	        var xStart = random(canvas.width);
	        var yStart = canvas.height + r;
	        var impulse = 0;
	        var impulseAngle = 0;
	        var impulseDecay = random(0.85, 0.96);
	        if (origin != null) {
	            xStart = origin.x;
	            impulse = origin.r * random(0.02, 0.12);
	            var impulseAngleStep = Math.PI * 2 / balls.length * i;
	            impulseAngle = impulseAngleStep + random(0.1);
	            yStart = origin.y;
	            r = Math.sqrt(Math.PI * (origin.r * origin.r) / balls.length / Math.PI);
	            r = weight(r, random(0.4));
	        }
	        var xRange = random(100);
	        var xPos = 0;
	        var xDirection = this.flipCoin(1, -1);
	        var ball = void 0;
	        var buffer = this.webgl.rect(0, 0, r * 2, r * 2);
	        var update = function update(delta) {
	            xPos += speed.x * delta * xDirection;
	            xStart += Math.cos(impulseAngle) * impulse;
	            ball.y += Math.sin(impulseAngle) * impulse;
	            impulse *= impulseDecay;
	            ball.x = xStart + Math.sin(xPos) * xRange;
	            ball.y -= speed.y * delta;
	            if (ball.y < 0 - r) {
	                ball.dead = true;
	            }
	            if (ball.dying) {
	                ball.a *= 0.95;
	                if (ball.a <= 0.01) {
	                    ball.a = 0;
	                    ball.dead = true;
	                }
	            }
	        };
	        ball = {
	            x: xStart,
	            y: yStart,
	            r: r,
	            a: 1,
	            update: update,
	            buffer: buffer,
	            dead: false,
	            dying: false
	        };

	        this.balls = balls;
	        return ball;
	    },

	    weight: function (v, p) {
	        return v * (1 - p + p);
	    },

	    random: function () {
	        var v1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	        var v2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	        if (v2 == null) {
	            v2 = v1;
	            v1 = 0;
	        }
	        return v1 + Math.random() * (v2 - v1);
	    },

	    randomInt: function (v1, v2) {
	        return Math.round(this.random(v1, v2));
	    },

	    flipCoin: function () {
	        var case1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	        var case2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	        var r = this.random() > 0.5;
	        if (case1 == null) return r; else return r ? case1 : case2;
	    },

	    chance: function (p, callback) {
	        if (this.random() <= p) {
	            callback();
	        }
	    },

	    dodraw: function (now) {

	        var func = this;

	        var delta = now - this.draw.last;
	        this.draw.last = now;
	        var t = Math.min(this.draw.maxT, delta / this.draw.frame);
	        var gl = func.gl;
	        gl.useProgram(func.circle);
	        func.webgl.useFramebuffer(func.fb.framebuffer);
	        gl.clear(gl.COLOR_BUFFER_BIT);
	        gl.uniform1i(gl.getUniformLocation(func.circle, 'flip'), 0);

	        this.draw.lastSpawn += Math.min(t * this.draw.frame, delta);
	        while (this.draw.lastSpawn > this.draw.spawnInterval.get()) {
	            this.draw.lastSpawn -= this.draw.spawnInterval.get();
	            this.draw.spawnInterval.generate();
	            this.draw.balls.push(func.createBall());
	        }
	        var translateLocation = gl.getUniformLocation(func.circle, 'translate');
	        var sizeLocation = gl.getUniformLocation(func.circle, 'size');

	        this.draw.balls.forEach(function (ball) {
	            ball.update(t);
	            gl.bindBuffer(gl.ARRAY_BUFFER, ball.buffer);
	            var texCoordLocation = gl.getAttribLocation(func.circle, "a_texCoord");
	            gl.enableVertexAttribArray(texCoordLocation);
	            gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
	            gl.uniform2f(translateLocation, ball.x - ball.r, ball.y - ball.r);
	            gl.uniform2f(sizeLocation, ball.r * 2, ball.r * 2);
	            gl.uniform1f(gl.getUniformLocation(func.circle, 'alpha'), ball.a);
	            func.webgl.render(func.circle);
	        });


	        this.draw.balls = this.draw.balls.filter(function (ball) {
	            return !ball.dead;
	        });

	        func.chance(0.0001, function () {
	            func.splitBall(func.draw.balls[func.randomInt(func.draw.balls.length - 1)]);
	        });

	        func.webgl.useFramebuffer(null);
	        gl.useProgram(func.blob);
	        gl.bindBuffer(gl.ARRAY_BUFFER, this.draw.screenBuffer);
	        gl.uniform1i(gl.getUniformLocation(func.blob, 'flip'), 1);
	        translateLocation = gl.getUniformLocation(func.blob, 'translate');
	        sizeLocation = gl.getUniformLocation(func.blob, 'size');
	        gl.uniform2f(translateLocation, 0, 0);
	        gl.uniform2f(sizeLocation, func.canvas.width, func.canvas.height);
	        var texCoordLocation = gl.getAttribLocation(func.circle, "a_texCoord");
	        gl.enableVertexAttribArray(texCoordLocation);
	        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
	        func.webgl.render(func.blob);

	        requestAnimationFrame(this.dodraw.bind(this));

	    },

	    start: function () {
	        var ballsNum = 8;
	        var balls = Array.from(Array(ballsNum)).map(this.createBall.bind(this));
	        var last = 0;
	        var fps = 60;
	        var frame = 1000 / fps,
	            gl = this.gl;
	        this.balls = balls;


	        var texture = gl.createTexture();
	        gl.useProgram(this.blob);
	        gl.activeTexture(gl.TEXTURE1);
	        gl.bindTexture(gl.TEXTURE_2D, texture);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
	        var colorTexture = gl.getUniformLocation(this.blob, 'colorTexture');
	        gl.uniform1i(colorTexture, 1);

	        var lastSpawn = 0;
	        var spawnIntervalRange = [800, 2400];
	        func = this;
	        var spawnInterval = function () {
	            var cur = void 0;
	            var generate = function generate() {
	                cur = func.random(spawnIntervalRange[0], spawnIntervalRange[1]);
	                return cur;
	            };
	            generate();
	            var get = function get() {
	                return cur;
	            };
	            return {generate: generate, get: get};
	        }();
	        var screenBuffer = this.webgl.rect(0, 0, this.canvas.width, this.canvas.height);
	        var maxT = 2;

	        this.draw = {};
	        this.draw.now = 0 ,
	            this.draw.last = last,
	            this.draw.maxT = maxT,
	            this.draw.frame = frame,
	            this.draw.lastSpawn = lastSpawn,
	            this.draw.spawnInterval = spawnInterval,
	            this.draw.balls = balls,
	            this.draw.screenBuffer = screenBuffer;

	        this.dodraw(0);

	    },

	    splitBall: function (ball) {
	        if (!ball.dying && !ball.dead) {
	            var newBalls = Array.from(Array(this.randomInt(2, 7))).map(function () {
	                return ball;
	            }).map(this.createBall(), this);
	            balls = this.balls.concat(newBalls);
	            ball.dying = true;
	        }
	    },

	    splitBallsOnPoint: function (x, y) {
	        this.getBallsOnPoint(x, y).forEach(this.splitBall);
	    },

	    getBallsOnPoint: function (x, y) {
	        return this.balls.filter(function (ball) {
	            var dx = x - ball.x;
	            var dy = y - ball.y;
	            var d = Math.sqrt(dx * dx + dy * dy);
	            return d <= ball.r / 2;
	        });
	    }
	}

	jQuery(ajax.footerTag).append('<canvas id="canvas-footer"></canvas>');

	jQuery('body').not('.work-page').find('.main_color').wrapAll('<div class="body-blobs-wrap"></div>');
	jQuery('.body-blobs-wrap').append('<canvas id="canvas-body"></canvas>');


	var bodyBlobs = new blobs;
	var footerBlobs = new blobs;
	$ = jQuery;

	if (0 < $('#canvas-footer').length) {
	    footerBlobs.setup(document.querySelector('#canvas-footer'), ajax.footerBlobImg);
	}

	if (0 < $('#canvas-body').length) {
	    bodyBlobs.setup(document.querySelector('#canvas-body'), ajax.bodyBlobImg);
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	function createGL(canvas) {
	    var gl = void 0;
	    var vertexShader = '\n  attribute vec2 a_texCoord;\n  varying vec2 v_texCoord;\n  varying vec2 v_color;\n  uniform vec2 translate;\n  uniform vec2 resolution;\n  uniform vec2 size;\n  uniform int flip;\n  void main(){\n    vec2 pos=a_texCoord+translate;\n    pos=(pos/resolution);\n    pos=(pos-0.5)*2.0;\n    if(flip==1){\n      pos.y=-pos.y;\n    }\n    v_texCoord=(a_texCoord/size);\n    // v_texCoord.y=1.0-v_texCoord.y;\n    gl_Position=vec4(pos,0.0,1.0);\n  }\n  ';
	    var fb = void 0;
	    var currentProgram = void 0;
	    var timeLocation = void 0;
	    var resolutionLocation = void 0;
	    // let buffer;
	    var startTime = new Date().getTime();
	    var time = 0;
	    var dpi = 1; //window.devicePixelRatio;

	    var bounds = canvas.getBoundingClientRect();
	    canvas.setAttribute('width', bounds.width * dpi);
	    canvas.setAttribute('height', bounds.height * dpi);

	    if (!init()) return null;

	    function rect(x, y, w, h) {
	        var texCoordBuffer = gl.createBuffer();
	        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x, y, x + w, y, x, y + h, x + w, y, x + w, y + h, x, y + h]), gl.STATIC_DRAW);

	        var texCoordLocation = gl.getAttribLocation(currentProgram, "a_texCoord");
	        gl.enableVertexAttribArray(texCoordLocation);
	        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

	        return texCoordBuffer;
	    }

	    function createFramebuffer() {
	        var framebuffer = gl.createFramebuffer();
	        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	        framebuffer.width = bounds.width * dpi;
	        framebuffer.height = bounds.height * dpi;

	        var texture = gl.createTexture();
	        gl.activeTexture(gl.TEXTURE0);
	        gl.bindTexture(gl.TEXTURE_2D, texture);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, framebuffer.width, framebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
	        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	        return {
	            framebuffer: framebuffer,
	            texture: texture
	        };
	    }

	    function init() {
	        try {
	            gl = canvas.getContext('experimental-webgl', {
	                premultipliedAlpha: true,
	                alpha: true
	            });
	        } catch (error) {
	        }
	        if (!gl) {
	            return null;
	        }
	        gl.enable(gl.BLEND);
	        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

	        return gl;
	    }

	    function createProgram(fragment) {
	        var program = gl.createProgram();

	        var vs = createShader(vertexShader, gl.VERTEX_SHADER);
	        var fs = createShader('#ifdef GL_ES\nprecision highp float;\n#endif\n\n' + fragment, gl.FRAGMENT_SHADER);
	        if (vs == null || fs == null) return null;

	        gl.attachShader(program, vs);
	        gl.attachShader(program, fs);

	        gl.deleteShader(vs);
	        gl.deleteShader(fs);

	        gl.linkProgram(program);

	        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	            console.log("ERROR:\n" + "VALIDATE_STATUS: " + gl.getProgramParameter(program, gl.VALIDATE_STATUS) + "\n" + "ERROR: " + gl.getError() + "\n\n" + "- Vertex Shader -\n" + vertex + "\n\n" + "- Fragment Shader -\n" + fragment);
	            return null;
	        }

	        currentProgram = program;

	        if (program == null) return null;
	        timeLocation = gl.getUniformLocation(program, 't');
	        resolutionLocation = gl.getUniformLocation(program, 'resolution');

	        return program;
	    }

	    function createShader(src, type) {
	        var shader = gl.createShader(type);

	        gl.shaderSource(shader, src);
	        gl.compileShader(shader);

	        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	            console.log((type == gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT") + " SHADER:\n" + gl.getShaderInfoLog(shader));
	            return null;
	        }
	        return shader;
	    }

	    function render() {
	        var program = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

	        if (program == null) {
	            if (!currentProgram) return; else program = currentProgram;
	        }
	        // time=new Date().getTime()-startTime;
	        // gl.clearColor(0,0,0,0);
	        // gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	        // gl.useProgram(program);
	        // gl.uniform1f(timeLocation, time/1000);
	        resolutionLocation = gl.getUniformLocation(program, 'resolution');
	        gl.uniform2f(resolutionLocation, bounds.width * dpi, bounds.height * dpi);

	        // gl.bindBuffer(gl.ARRAY_BUFER, buffer);

	        // gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
	        gl.drawArrays(gl.TRIANGLES, 0, 6);
	        // gl.viewport(0,0,bounds.width*dpi,bounds.height*dpi);
	    }

	    function useFramebuffer(fb) {
	        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
	    }

	    return {
	        gl: gl,
	        render: render,
	        rect: rect,
	        createProgram: createProgram,
	        createFramebuffer: createFramebuffer,
	        useFramebuffer: useFramebuffer
	    };
	}

	exports.default = createGL;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(5)(__webpack_require__(6))

/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(src) {
		if (typeof execScript !== "undefined")
			execScript(src);
		else
			eval.call(null, src);
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = "function createGL(canvas) {\n    var gl = void 0;\n    var vertexShader = '\\n  attribute vec2 a_texCoord;\\n  varying vec2 v_texCoord;\\n  varying vec2 v_color;\\n  uniform vec2 translate;\\n  uniform vec2 resolution;\\n  uniform vec2 size;\\n  uniform int flip;\\n  void main(){\\n    vec2 pos=a_texCoord+translate;\\n    pos=(pos/resolution);\\n    pos=(pos-0.5)*2.0;\\n    if(flip==1){\\n      pos.y=-pos.y;\\n    }\\n    v_texCoord=(a_texCoord/size);\\n    // v_texCoord.y=1.0-v_texCoord.y;\\n    gl_Position=vec4(pos,0.0,1.0);\\n  }\\n  ';\n    var fb = void 0;\n    var currentProgram = void 0;\n    var timeLocation = void 0;\n    var resolutionLocation = void 0;\n    // let buffer;\n    var startTime = new Date().getTime();\n    var time = 0;\n    var dpi = 1; //window.devicePixelRatio;\n\n    var bounds = canvas.getBoundingClientRect();\n    canvas.setAttribute('width', bounds.width * dpi);\n    canvas.setAttribute('height', bounds.height * dpi);\n\n    if (!init()) return null;\n\n    function rect(x, y, w, h) {\n        var texCoordBuffer = gl.createBuffer();\n        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);\n        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x, y, x + w, y, x, y + h, x + w, y, x + w, y + h, x, y + h]), gl.STATIC_DRAW);\n\n        var texCoordLocation = gl.getAttribLocation(currentProgram, \"a_texCoord\");\n        gl.enableVertexAttribArray(texCoordLocation);\n        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);\n\n        return texCoordBuffer;\n    }\n\n    function createFramebuffer() {\n        var framebuffer = gl.createFramebuffer();\n        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);\n        framebuffer.width = bounds.width * dpi;\n        framebuffer.height = bounds.height * dpi;\n\n        var texture = gl.createTexture();\n        gl.activeTexture(gl.TEXTURE0);\n        gl.bindTexture(gl.TEXTURE_2D, texture);\n        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);\n        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);\n        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);\n        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);\n        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);\n        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);\n        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, framebuffer.width, framebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);\n        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);\n        gl.bindFramebuffer(gl.FRAMEBUFFER, null);\n        return {\n            framebuffer: framebuffer,\n            texture: texture\n        };\n    }\n\n    function init() {\n        try {\n            gl = canvas.getContext('experimental-webgl', {\n                premultipliedAlpha: true,\n                alpha: true\n            });\n        } catch (error) {\n        }\n        if (!gl) {\n            return null;\n        }\n        gl.enable(gl.BLEND);\n        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);\n\n        return gl;\n    }\n\n    function createProgram(fragment) {\n        var program = gl.createProgram();\n\n        var vs = createShader(vertexShader, gl.VERTEX_SHADER);\n        var fs = createShader('#ifdef GL_ES\\nprecision highp float;\\n#endif\\n\\n' + fragment, gl.FRAGMENT_SHADER);\n        if (vs == null || fs == null) return null;\n\n        gl.attachShader(program, vs);\n        gl.attachShader(program, fs);\n\n        gl.deleteShader(vs);\n        gl.deleteShader(fs);\n\n        gl.linkProgram(program);\n\n        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {\n            console.log(\"ERROR:\\n\" + \"VALIDATE_STATUS: \" + gl.getProgramParameter(program, gl.VALIDATE_STATUS) + \"\\n\" + \"ERROR: \" + gl.getError() + \"\\n\\n\" + \"- Vertex Shader -\\n\" + vertex + \"\\n\\n\" + \"- Fragment Shader -\\n\" + fragment);\n            return null;\n        }\n\n        currentProgram = program;\n\n        if (program == null) return null;\n        timeLocation = gl.getUniformLocation(program, 't');\n        resolutionLocation = gl.getUniformLocation(program, 'resolution');\n\n        return program;\n    }\n\n    function createShader(src, type) {\n        var shader = gl.createShader(type);\n\n        gl.shaderSource(shader, src);\n        gl.compileShader(shader);\n\n        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {\n            console.log((type == gl.VERTEX_SHADER ? \"VERTEX\" : \"FRAGMENT\") + \" SHADER:\\n\" + gl.getShaderInfoLog(shader));\n            return null;\n        }\n        return shader;\n    }\n\n    function render() {\n        var program = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n\n        if (program == null) {\n            if (!currentProgram) return; else program = currentProgram;\n        }\n        // time=new Date().getTime()-startTime;\n        // gl.clearColor(0,0,0,0);\n        // gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );\n        // gl.useProgram(program);\n        // gl.uniform1f(timeLocation, time/1000);\n        resolutionLocation = gl.getUniformLocation(program, 'resolution');\n        gl.uniform2f(resolutionLocation, bounds.width * dpi, bounds.height * dpi);\n\n        // gl.bindBuffer(gl.ARRAY_BUFER, buffer);\n\n        // gl.bindFramebuffer(gl.FRAMEBUFFER, fb);\n        gl.drawArrays(gl.TRIANGLES, 0, 6);\n        // gl.viewport(0,0,bounds.width*dpi,bounds.height*dpi);\n    }\n\n    function useFramebuffer(fb) {\n        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);\n    }\n\n    return {\n        gl: gl,\n        render: render,\n        rect: rect,\n        createProgram: createProgram,\n        createFramebuffer: createFramebuffer,\n        useFramebuffer: useFramebuffer\n    };\n}"

/***/ }
/******/ ]);
