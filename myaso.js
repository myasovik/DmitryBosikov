var MYASO = {}






//Artificial Intelligence************************************************************************************************************
function Myason(input, output){
	this.ninput = input;
	this.noutput = output;
	this.codeActionWaight_memory = {};
}//Init size of input and output buffers; Init ai memory(like person memory).

Myason.prototype.run = function(signal){
	var s="";
	for(var i=0;i<this.ninput;i++){
		s+=signal[i]+"_";
	}//convert signal to key
	this.key = s;
	if(this.codeActionWaight_memory[s]!=null){
		var v=this.codeActionWaight_memory[s][0] , j=0;
		for(var i=1;i<this.noutput;i++){
			if(this.codeActionWaight_memory[s][i]>v){
				j = i;
				v = this.codeActionWaight_memory[s][i];
			}
		}
		this.out = j;
	}//if there are some memory for current state, use it.
	else{
		this.out = Math.round(Math.random()*(this.noutput-1));
		this.codeActionWaight_memory[s]=[];
		for(var i=0;i<this.ninput;i++){
			this.codeActionWaight_memory[s][i]=0;
		}
	}//if there are no memories, do random action.
}

Myason.prototype.forget = function(){
	for(key in this.codeActionWaight_memory){
		for(var i =0;i<this.noutput;i++){
			if(this.codeActionWaight_memory[key]!=null){
				if(this.codeActionWaight_memory[key][i]>0)
					this.codeActionWaight_memory[key][i]--;
				else if(this.codeActionWaight_memory[key][i]<0)
					this.codeActionWaight_memory[key][i]++;
				else{
					this.codeActionWaight_memory[key]==null;
					delete this.codeActionWaight_memory[key];
				}
			}
		}
	}
}//slowly forget not used memories.

Myason.prototype.learn = function(fitnes){
	if(this.codeActionWaight_memory[this.key]==null)
		this.codeActionWaight_memory[this.key]=[];
	this.codeActionWaight_memory[this.key][this.out]+=fitnes;
}//Remember what just happens.

//WebGL************************************************************************************************************
MYASO.Model = function(id,type){
	this.id = id;
	switch(type){
		default:
		this.vsize = 3;
		this.vnum = 18;
		this.strips = [ {"s":0,"n":10},{"s":10,"n":4},{"s":14,"n":4} ];
		this.v = [
		// Front face
		  -1.0,  1.0,  1.0,
		  -1.0, -1.0,  1.0,
		   1.0,  1.0,  1.0,
		   1.0, -1.0,  1.0,
		// Right face
		   1.0,  1.0, -1.0,
		   1.0, -1.0, -1.0,
		// Back face
		  -1.0,  1.0, -1.0,
		  -1.0, -1.0, -1.0,			  
		// Left face
			-1.0,  1.0,  1.0,
			-1.0, -1.0,  1.0,
		//Head
			-1.0,  1.0,  1.0,
			-1.0,  1.0,  -1.0,
			 1.0,  1.0,  1.0,
			 1.0,  1.0,  -1.0,
		//foot
			-1.0,  -1.0,   1.0,
			-1.0,  -1.0,  -1.0,
			 1.0,  -1.0,   1.0,
			 1.0,  -1.0,  -1.0,
		];			
		break;
	}
	this.color = [1.0,1.0,1.0,1.0];
	this.xTranslate = 0;
	this.yTranslate = 0;
	this.zTranslate = 0;
	this.xRotation = 0;
	this.yRotation = 0;
	this.zRotation = 0;
	this.xScale = 1.0;
	this.yScale = 1.0;
	this.zScale = 1.0;
			
}//Model of a 3d square;

MYASO.Model.prototype.setTranslate = function(x,y,z){
	this.xTranslate = x;
	this.yTranslate = y;
	this.zTranslate = z;
}

MYASO.Model.prototype.setRotate = function(x,y,z){
	this.xRotation = x;
	this.yRotation = y;
	this.zRotation = z;
}

MYASO.Model.prototype.setScale = function(x,y,z){
	this.xScale = x;
	this.yScale = y;
	this.zScale = z;
}

MYASO.Model.prototype.setColor = function(color){
	this.color[0] = (color & 0xFF0000) >> 16;
	this.color[1] = (color & 0x00FF00) >> 8;
	this.color[2] = (color & 0x0000FF);
	
	this.color[0] = (this.color[0] * 1.0 / 255 );
	this.color[1] = (this.color[1] * 1.0 / 255 );
	this.color[2] = (this.color[2] * 1.0 / 255 );
	
	this.color[3] = 1.0;
}

MYASO.Group = function(){
	this.gl = null;
	this.models = [];
	this.groups = [];
	this.xCenter = 0;
	this.yCenter = 0;
	this.zCenter = 0;
	this.xTranslate = 0;
	this.yTranslate = 0;
	this.zTranslate = 0;
	this.xRotation = 0;
	this.yRotation = 0;
	this.zRotation = 0;
	this.xScale = 1;
	this.yScale = 1;
	this.zScale = 1;
}//Group join models together

MYASO.Group.prototype.addModel = function(model){
	this.models.push(model);
}

MYASO.Group.prototype.setTranslate = function(x,y,z){
	this.xTranslate = x;
	this.yTranslate = y;
	this.zTranslate = z;
}

MYASO.Group.prototype.setRotate = function(x,y,z){
	this.xRotation = x;
	this.yRotation = y;
	this.zRotation = z;
}

MYASO.Group.prototype.setScale = function(x,y,z){
	this.xScale = x;
	this.yScale = y;
	this.zScale = z;
}

MYASO.Group.prototype.draw = function(){
var mvMatrix = mat4.create();

	for(var m =0;m<this.models.length;m++){
		mat4.identity(mvMatrix);

		mat4.translate(mvMatrix, [this.xTranslate, this.yTranslate, this.zTranslate]);
		mat4.scale(mvMatrix, [this.xScale,this.yScale,this.zScale]);
		mat4.rotate(mvMatrix, MYASO.degToRad(this.xRotation), [1, 0, 0]);
		mat4.rotate(mvMatrix, MYASO.degToRad(this.yRotation), [0, 1, 0]);
		mat4.rotate(mvMatrix, MYASO.degToRad(this.zRotation), [0, 0, 1]);
		
		
		mat4.translate(mvMatrix, [this.models[m].xTranslate, this.models[m].yTranslate, this.models[m].zTranslate]);
		mat4.scale(mvMatrix, [this.models[m].xScale,this.models[m].yScale,this.models[m].zScale]);
		mat4.rotate(mvMatrix, MYASO.degToRad(this.models[m].xRotation), [1, 0, 0]);
		mat4.rotate(mvMatrix, MYASO.degToRad(this.models[m].yRotation), [0, 1, 0]);
		mat4.rotate(mvMatrix, MYASO.degToRad(this.models[m].zRotation), [0, 0, 1]);
		
		this.gl.setUniform("uColor","4f",this.models[m].color[0],this.models[m].color[1],this.models[m].color[2],this.models[m].color[3])// !!!
		
		this.gl.setMatrix("umTransform",mvMatrix);//?
		this.gl.bindBufferAttribute("squareVertexPosition","aVertexPosition");//?

		for(var i=0;i<this.models[m].strips.length;i++){
			this.gl.drawTriangleStrip(this.models[m].strips[i].s,this.models[m].strips[i].n);
		}
	}
}

MYASO.Camera = function(fov,near,far){
	this.fieldofview = fov;
	this.near = near;
	this.far = far;
}

/*
	Init 
	1. Init WebGl -> MGWebGL;
	2. Init Shader -> initVertexShader, initFragmentShader;
	3. Init Shader Program -> initShaderProgram;
	4. Init Attributes -> initAttribute
	5. Init Matrices -> initMatrix
	6. Init Buffers with vertices and color -> initBuffer
	
*/

MYASO.WebGL = function(){
	try {		
		var canvas = document.createElement("canvas");
		canvas.style.position = "absolute";
		canvas.style.left = "0";
		canvas.style.top = "0";
		canvas.style.zIndex = "-2";
		this.context = canvas.getContext("webgl");
		this.gl = this.context;
		
		canvas.style.width = window.innerWidth+"px";
		canvas.style.height = window.innerHeight+"px";
		canvas.width = 1000;
		canvas.height = 1000;
		
		this.context.viewport(0, 0, this.context.drawingBufferWidth, this.context.drawingBufferHeight);
		this.canvas = canvas;
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.enable(this.context.DEPTH_TEST);
		document.body.appendChild(canvas);
	} catch (e) {
		alert("Could not initialise WebGL, sorry :-(");
	}
	this.buffers = {};
	this.attributes = {};
	this.matrices = {};
	this.textures = {};
	this.matrixStack = [];
	this.uniforms = {};
	this.groups = [];
}//Init WebGL on a canvas. Save width and hight of the canvas. Init buffers object.

MYASO.WebGL.prototype.addGroup = function(group){
	this.groups.push(group);
	group.gl = this;
}

MYASO.WebGL.prototype.resetGroups = function(){
	this.groups = [];
}

MYASO.WebGL.prototype.addCamera = function(camera){
	var pMatrix = mat4.create();
	mat4.perspective(camera.fieldofview, this.canvas.width / this.canvas.height, camera.near, camera.far, pMatrix);
	//mWebGL.setMatrix("umCamera",pMatrix);
	this.setMatrix("umCamera",pMatrix);	
}

MYASO.WebGL.prototype.initVertexShader = function(code){
var gl = this.context;
var shader;		
	shader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(shader, code);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	else{
		this.vertexShader = shader;
	}
}//Attach vertex shader code to WebGL and compile it.
	
MYASO.WebGL.prototype.initFragmentShader = function(code){
var gl = this.context;
var shader;
	shader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(shader,code);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	else{
		this.fragmentShader = shader;
	}
}//Attach fragment shader code to WebGL and compile it.

MYASO.WebGL.prototype.initShaderProgram = function(){
var shaderProgram;
var gl = this.context;		
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, this.vertexShader);
	gl.attachShader(shaderProgram, this.fragmentShader);
	gl.linkProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}
	else{
		gl.useProgram(shaderProgram);
	}
	this.shaderProgram = shaderProgram;
	
	this.initUniform("uColor");//add color
	
	this.initMatrix("umCamera");//add camera
	//this.initMatrix("umTransform");//add transform
	//mWebGL.initUniform("uColor");// !!!! Color
	this.initUniform("uColor");
	
	this.initAttribute("aVertexPosition");
	
	return shaderProgram;
}//Link shader program and start it

MYASO.WebGL.prototype.initAttribute = function(name){
var attribute;
var gl = this.context;
var shaderProgram = this.shaderProgram;
	attribute = gl.getAttribLocation(shaderProgram, name);
	gl.enableVertexAttribArray(attribute);
	this.attributes[name] = attribute;
	return attribute;
}//Add attribute to shader

MYASO.WebGL.prototype.initBuffer = function(name, size, number, data){
var gl = this.context;
var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	buffer.itemSize = size;
	buffer.numItems = number;
	this.buffers[name] = buffer;
	return buffer;
}//Add vertex buffer to shader program

MYASO.WebGL.prototype.initMatrix = function(name){
var shaderProgram = this.shaderProgram;
var gl = this.context;
var matrix = gl.getUniformLocation(shaderProgram,name);
	this.matrices[name] = matrix;
	return matrix;
}//Add matrix pointer to shader program

MYASO.WebGL.prototype.initUniform = function(name){
var shaderProgram = this.shaderProgram;
var gl = this.context;
var uniform = gl.getUniformLocation(shaderProgram, name);
	this.uniforms[name] = uniform;
}

MYASO.WebGL.prototype.initTexture = function(name){
var gl = this.context;	
var texture = gl.createTexture();
var img = document.getElementById(name);
	texture.image = img;
	gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);//gl.LINEAR gl.NEAREST
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	this.textures[name] = texture;
}//Init texture

/*
	Set Data
	1. Set matrices data -> setMatrix
	2. Set buffers data -> bindBufferAttribute
*/
MYASO.WebGL.prototype.setUniform = function(name,format,x,y,z,w){
var gl = this.context;
var uniform = this.uniforms[name];
	switch(format){
		case "4i":
			gl.uniform4i(uniform,x,y,z,w);break;
		case "4f":
			gl.uniform4f(uniform,x,y,z,w);break;
		case "3f":
			gl.uniform3f(uniform,x,y,z);break;
		break;
		default: alert("WF");
	}
}

MYASO.WebGL.prototype.setMatrix = function(name,data){
var gl = this.context;
var shaderProgram = this.shaderProgram;
var matrix = this.matrices[name];
	gl.uniformMatrix4fv(matrix, false, data);
}//Send matrix data to shader

MYASO.WebGL.prototype.bindBufferAttribute = function(bufferName, attributeName){
var gl = this.context;
var buffer = this.buffers[bufferName];
var attribute = this.attributes[attributeName]
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.vertexAttribPointer(attribute, buffer.itemSize, gl.FLOAT, false, 0, 0);
}//Configure attribute to look into buffer

MYASO.WebGL.prototype.bindTexture = function(name){
var gl = this.context;
var uniform = this.uniforms[name];
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.textures[name]);
    gl.uniform1i(uniform, 0);
}

/*
	Drawing
	1. clear scene -> clearDraw
	2. draw triangle strip -> drawTriangleStrip
*/

MYASO.WebGL.prototype.clearDraw = function(){
var gl = this.context;
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}//Prepare for drawing

MYASO.WebGL.prototype.drawTriangleStrip = function(from,to){
var gl = this.context;
	gl.drawArrays(gl.TRIANGLE_STRIP, from, to);
}//Draw buffer

MYASO.WebGL.prototype.drawTriangleFan = function(from,to){
var gl = this.context;
	gl.drawArrays(gl.GL_TRIANGLE_FAN,from,to);
}

MYASO.WebGL.prototype.draw = function(){
var gl = this.gl;
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);	
	//myWebgl.bindBufferAttribute("cubeVertexTextureCoord","aTextureCoord");
	//myWebgl.bindTexture("texture1")
	
	for(var g = 0;g<this.groups.length;g++){
		this.groups[g].draw();
	}	
}

/*
	Support
	1. convert degrees to radians -> degToRad
	2. push and pop matrix -> push, pop
*/

MYASO.degToRad = function(degrees) {
	return degrees * Math.PI / 180;
}//Convert Degrees to radians

MYASO.WebGL.prototype.push = function(mvMatrix) {
var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	this.matrixStack.push(copy);
}//push matrix to stack

MYASO.WebGL.prototype.pop = function() {
	if (this.matrixStack.length == 0) {
		alert("Invalid popMatrix!");
	}
	return this.matrixStack.pop();
}//get matrix from stack

//Engine**************************************************************************************************************
MYASO.Engine = {}

;(function(){	
	function myasoStartLoop(tFrame){
		/* Request page refresh and save it id, to stop it in future*/
		MYASO.Engine.stopMain = window.requestAnimationFrame(myasoStartLoop);
		
		/* Calculate time when rendering must happen */
		var nextRender = MYASO.Engine.lastRender + MYASO.Engine.tickLength;
		
		/* Check is it a time for rendering */		
		if (tFrame > nextRender) {
			/* Time offset for next rendering if pc did not keep up with a rate */
			var timeSinceTick = tFrame - MYASO.Engine.lastRender;
			var numTicks = Math.floor( timeSinceTick / MYASO.Engine.tickLength );
			
			/* Update render to know when we need to draw next time */
			MYASO.Engine.lastRender += numTicks * MYASO.Engine.tickLength;
			
			/* render */
			doRender();
		}
		
		/* Input */
		
		/* Physics */
		doPhysic();
		
		/* Keep track the time points */
		MYASO.Engine.lastTick = tFrame;		
	}
	
	function doRender(){
		for(var i=0;i<MYASO.Engine.renders.length;i++){
			MYASO.Engine.renders[i].draw();
		}
		//console.log("Do render");
	}
	function doPhysic(){
		//console.log("Do physic");
	}
	
	/* Init MYASO.Engine main loop. lastTick is a time point, lastRender store value from requestAnimation frame, tickLength is how often happen rendering */
	MYASO.Engine.lastTick = performance.now();
	MYASO.Engine.lastRender= MYASO.Engine.lastTick;	
	MYASO.Engine.tickLength = 50;
	MYASO.Engine.renders = [];
	MYASO.Engine.addRenders = function(m){
		MYASO.Engine.renders.push(m);
	}
	
	/* Start main loop with passing time point */
	myasoStartLoop(performance.now());	
})();