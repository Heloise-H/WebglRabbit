//Ò»Ð©È«¾Ö±äÁ¿
//canvas »­²¼
var canvas;
//render äÖÈ¾µÄÄÇ¸ö¶«Î÷
var gl;
var program;

//µã¼¯
var points=[];
var pointsindex=[];//µãµÄË÷ÒýÊý×é
var normal=[];//´æ·Å·¨ÏòÁ¿µÄÊý×é
//textureµã
var pointstexturevt=[];

var vTexCoord;

var lightx=-50;
var lighty=80;
var lightz=-20;
//再来一组光照数据好了啦
var lightx2=0;
var lighty2=80;
var lightz2=0;

//一个放在中心的环境光
var lightAmbient = vec4(1, 0, 0, 1.0 );
var lightDiffuse = vec4( 1, 0, 0, 1.0 );
var lightSpecular = vec4(1, 1, 0.0, 1.0 );

var lightAmbient2 = vec4(1, 1, 1, 1.0 );
var lightDiffuse2 = vec4( 1, 1, 1, 1.0 );
var lightSpecular2 = vec4(0, 0, 0, 1.0 );


var materialAmbient;
var materialDiffuse;
var materialSpecular;
var materialShininess;

var Projection=[];
var ModelView=[];
var Conversition=[];

var normalLoc;
var normalMatrix;

var modelViewMatrix;
var projectionMatrix;
var conversitionMatrix1;
var conversitionMatrix2;
var conversitionMatrix3;
var conversitionlight;
var conversitionstraw;
var conversitionstraw1;
var conversitionstraw2;
var conversitionstraw3;
var conversitionstraw4;

var conversitionstawup1;
var conversitionstawup2;
var conversitionstawup3;
var conversitionstawup4;

var conversitionstawdown1;
var conversitionstawdown2;
var conversitionstawdown3;
var conversitionstawdown4;

var rabbitcount=0;
var bovecount=0;


var eye;
var eyeradius=3;
var eyetheta=0;
var eyephi=0;
var eyex=0;
var eyey=0;
var eyez=0;
var dr = 5.0 * Math.PI/180.0;
var at;
var up;

//ÊÓ¾°ÌåÐèÒªµÄÊý¾Ý
var near=0.1;//½ü¾àÀë
var far=-10.0;//Ô¶¾àÀë
var fovy = 45.0;  
var aspect;       
//ÑÕÉ«Öµ
const black = vec4(0.0, 0.0, 0.0, 1.0);
const red = vec4(1.0, 0.0, 0.0, 1.0);
const yellow =vec4(1.0,0.9,0.0,1.0);
const green=vec4(0,1,0,1);
const blue=vec4(0,0,1,1);
const grey=vec4(0.3,0.3,0.3,1);
const magenta = vec4( 1.0, 0.0, 1.0, 1.0 );

onload=function init(){
    //³õÊ¼»¯»­²¼
    canvas=document.getElementById("gl-canvas");
    //³õÊ¼»¯gl
    gl=WebGLUtils.setupWebGL(canvas);
    if(!gl){
        alert("Webgl isn't available!");
    }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    aspect = canvas.width/canvas.height
    gl.clearColor(1,1,1,1);
    gl.enable(gl.DEPTH_TEST);

    loadrabbit();
    loadgrass();
    loaddove();
    loadstraw();
    loadlight(0,0,0);

    //°ó¶¨ÆäËûÔªËØ
    program=initShaders(gl,"vertex-shader","fragment-shader");
    gl.useProgram(program);
    //Êý¾Ý»º³åÇø
    var vBuffer=gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER,vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    var vPosition=gl.getAttribLocation(program,"vPosition");
    gl.vertexAttribPointer(vPosition,4,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vPosition);

    //·¨ÏòÁ¿»º³åÇø
    var nBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(normal),gl.STATIC_DRAW);
    var vNormal=gl.getAttribLocation(program,"vNormal");
    gl.vertexAttribPointer(vNormal,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vNormal);

    //ÎÆÀí
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointstexturevt), gl.STATIC_DRAW );
    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    //Ë÷Òý»º³åÇø
    var indexBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(pointsindex), gl.STATIC_DRAW);

    Projection=gl.getUniformLocation(program,"Projection");
    ModelView=gl.getUniformLocation(program,"ModelView");
    Conversition=gl.getUniformLocation(program,"Conversition");

    //初始化矩阵阵们
    conversitionMatrix1=mat4( 1.0,  0.0,  0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0 );

    conversitionMatrix2=mat4( 1.0,  0.0,  0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0 );

    conversitionlight=mat4( 1.0,  0.0,  0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0 );

    conversitionstrawdown=mat4( 1.0,  0.0,  0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0 );

    conversitionstawup=mat4( 1.0,  0.0,  0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0 );

    conversitionstraw=conversitionMatrix1;
    conversitionstraw1=conversitionMatrix1;
    conversitionstraw2=mult(conversitionMatrix1,translate(0.04,0,0));
    conversitionstraw3=mult(conversitionMatrix1,translate(0,0,0.04));
    conversitionstraw4=mult(conversitionMatrix1,translate(0.04,0,0.04));

    conversitionstawup1=mat4();
    conversitionstawup2=mat4();
    conversitionstawup3=mat4();
    conversitionstawup4=mat4();

    conversitionMatrix1=mult(conversitionMatrix1,scalem(0.01,0.01,0.01));
    conversitionMatrix1=mult(conversitionMatrix1,translate(-100,-100,-100));
    conversitionMatrix3=mult(conversitionMatrix1,scalem(2,2,2));
    conversitionMatrix3=mult(conversitionMatrix3,translate(0,20,-50));

    conversitionlight=mult(conversitionlight,translate(-1.3,0,0));

    document.getElementById("buttonlightx").onclick=function(){
        lightx+=10;
        conversitionlight = mult(conversitionlight, translate(1,0,0));
    };
    document.getElementById("buttonlighty").onclick=function(){
        lighty+=10;
        conversitionlight = mult(conversitionlight, translate(0,1,0));
    };
    document.getElementById("buttonlightz").onclick=function(){
        conversitionlight = mult(conversitionlight, translate(0,0,1));
        lightz+=10;
    };
    document.getElementById("buttonlightxf").onclick=function(){
        conversitionlight = mult(conversitionlight, translate(-1,0,0));
        lightx-=10;
    };
    document.getElementById("buttonlightyf").onclick=function(){
        conversitionlight = mult(conversitionlight, translate(0,-1,0));
        lighty-=10;
    };
    document.getElementById("buttonlightzf").onclick=function(){
        conversitionlight = mult(conversitionlight, translate(0,0,-1));
        lightz-=10;
    };
    function normalvector(a1,a2,a3,b1,b2,b3){
		//a¡Áb=(a2b3-a3b2,a3b1-a1b3,a1b2-a2b1)=n
		var result=[];
		var x1=a2*b3-a3*b2;
		var x2=a3*b1-a1*b3;
		var x3=a1*b2-a2*b1;
		var mo=Math.sqrt(x1*x1+x2*x2+x3*x3);
		result.push(x1/(mo*25));
		result.push(x2/(mo*25));
		result.push(x3/(mo*25));
		return result;
    }
    document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==65){ //°´A
            //eyex-=0.1;         
            var normalv=normalvector(eyeradius*Math.sin(eyephi)*Math.cos(eyetheta),
            	                     eyeradius*Math.sin(eyetheta),
            	                     eyeradius*Math.cos(eyephi)*Math.cos(eyetheta),
            	                     Math.sin(eyetheta)*Math.cos(-Math.PI/2-eyephi),
            	                     Math.cos(eyetheta),
            	                     Math.sin(eyetheta)*Math.sin(-Math.PI/2-eyephi));
            eyex+=normalv[0];
            eyey+=normalv[1];
            eyez+=normalv[2];
        }
        if(e && e.keyCode==68){ //°´D
            //eyex+=0.1;
            var normalv=normalvector(eyeradius*Math.sin(eyephi)*Math.cos(eyetheta),
            	                     eyeradius*Math.sin(eyetheta),
            	                     eyeradius*Math.cos(eyephi)*Math.cos(eyetheta),
            	                     Math.sin(eyetheta)*Math.cos(-Math.PI/2-eyephi),
            	                     Math.cos(eyetheta),
            	                     Math.sin(eyetheta)*Math.sin(-Math.PI/2-eyephi));
            eyex-=normalv[0];
            eyey-=normalv[1];
            eyez-=normalv[2];
        }           
        if(e && e.keyCode==87){ //°´W
        	var x1=eyeradius*Math.sin(eyephi)*Math.cos(eyetheta);
            var x2=eyeradius*Math.sin(eyetheta);
            var x3=eyeradius*Math.cos(eyephi)*Math.cos(eyetheta);
            var mo=Math.sqrt(x1*x1+x2*x2+x3*x3);
            eyex-=x1/(mo*25);
            eyey-=x2/(mo*25);
            eyez-=x3/(mo*25);
        }
        if(e && e.keyCode==83){ //°´S
        	var x1=eyeradius*Math.sin(eyephi)*Math.cos(eyetheta);
            var x2=eyeradius*Math.sin(eyetheta);
            var x3=eyeradius*Math.cos(eyephi)*Math.cos(eyetheta);
            var mo=Math.sqrt(x1*x1+x2*x2+x3*x3);
            eyex+=x1/(mo*25);
            eyey+=x2/(mo*25);
            eyez+=x3/(mo*25);
        }
    }; 

        //¶¨ÒåcanvasÄÚÊó±êÍÏ×§ÊÂ¼þ
         var drag = false;//ÊÇ·ñ´¦ÓÚÍÏ×§×´Ì¬
         var old_x, old_y;//°´ÏÂÊ±Êó±êµÄÎ»ÖÃ
         var dX = 0, dY = 0;
            
         var mouseDown = function(e) {
            drag = true;
            old_x = e.pageX, old_y = e.pageY;
            e.preventDefault();//²»ÒªÖ´ÐÐÄ¬ÈÏ¶¯×÷
            return false;
         };
         
         var mouseUp = function(e){
            drag = false;
         };
         
         var mouseMove = function(e) {
            if (!drag) return false;
            dX = (e.pageX-old_x)*2*Math.PI/canvas.width,
            dY = (e.pageY-old_y)*2*Math.PI/canvas.height;
            eyephi-= dX;
            eyetheta+=dY;
            old_x = e.pageX, old_y = e.pageY;
            e.preventDefault();
         };
         
         canvas.addEventListener("mousedown", mouseDown, false);//×¢²áÊó±ê°´ÏÂÊÂ¼þ
         canvas.addEventListener("mouseup", mouseUp, false);//×¢²áÊó±êËÉ¿ªÊÂ¼þ
         canvas.addEventListener("mouseout", mouseUp, false);//×¢²áÊó±ê³öcanvasÊÂ¼þ
         canvas.addEventListener("mousemove", mouseMove, false);//×¢²áÊó±êÒÆ¶¯ÊÂ¼þ


    var image0 = document.getElementById("texImage");
    configureTexture0(image0);
    var image1 = document.getElementById("texImage1");
    configureTexture1(image1);
    var image2 = document.getElementById("texImage2");
    configureTexture2(image2);
    var image3 = document.getElementById("texImage3");
    configureTexture3(image3);
    render();
};

//-----------------------------------------------------------------------------------

function configureTexture0( image ) {
    texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
}

//-------------------------------------------------------------------------------------

function configureTexture1(image) {
    texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 1);
}

//--------------------------------------------------------------------------------------

function configureTexture2(image) {
    texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE2);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 2);
}

//----------------------------------------------------------------------------------------

function configureTexture3(image) {
    texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE3);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture3"), 3);
}

//----------------------------------------------------------------------------------------

function configureTexture4(image) {
    texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE4);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture4"), 4);
}

//----------------------------------------------------------------------------------------

function render(){
   
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    eye = vec3(eyex+eyeradius*Math.sin(eyephi)*Math.cos(eyetheta), 
               eyey+eyeradius*Math.sin(eyetheta),
               eyez+eyeradius*Math.cos(eyephi)*Math.cos(eyetheta));
    //up  = vec3(upx,upy,upz);
    up = vec3( Math.sin(eyetheta)*Math.cos(-Math.PI/2-eyephi),
    		   Math.cos(eyetheta),
    		   Math.sin(eyetheta)*Math.sin(-Math.PI/2-eyephi) );
    at  = vec3(eyex,eyey,eyez);

    //¶¨ÒåÊÓ¾°ÌåºÍÊÓµã
    modelViewMatrix = lookAt( eye, at, up );

    projectionMatrix = perspective(fovy, aspect, near, far);

    normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];

    gl.uniformMatrix4fv( ModelView, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( Projection, false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalLoc,false,flatten(normalMatrix));
  
  //光源移动
    if(rabbitcount<300){
        conversitionlight=mult(conversitionlight,translate(0.003,0.003,0));
        lightx+=0.3;
        lighty+=0.3;
    }if(rabbitcount>=300 && rabbitcount<700){
        conversitionlight=mult(conversitionlight,translate(0.002,0,0));
        lightx+=0.2;
    }if(rabbitcount>=700 && rabbitcount<1100){
        conversitionlight=mult(conversitionlight,translate(0.003,-0.003,0));
        lightx+=0.3;
        lighty-=0.3;
    }if(rabbitcount>1100){
        conversitionlight=mat4();
    }
    
    var lightPosition=vec4(lightx,lighty,lightz,0.0);
    gl.uniform4fv( gl.getUniformLocation(program,
        "lightPosition"),flatten(lightPosition) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "lightambient"),flatten(lightAmbient) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "lightdiffuse"),flatten(lightDiffuse) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "lightspecular"),flatten(lightSpecular) );
    var lightPosition2=vec4(lightx2,lighty2,lightz2,0.0);
    gl.uniform4fv( gl.getUniformLocation(program,
        "lightPosition2"),flatten(lightPosition2) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "lightambient2"),flatten(lightAmbient2) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "lightdiffuse2"),flatten(lightDiffuse2) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "lightspecular2"),flatten(lightSpecular2) );


    //动作区
    if(rabbitcount<155){
        conversitionMatrix1=mult(conversitionMatrix1,translate(1,0,0.5));
        rabbitcount++;
    }
    if(rabbitcount>154 && rabbitcount<205){
        conversitionMatrix1=mult(conversitionMatrix1,translate(0,0.3,0.6));
        rabbitcount++;
    }
    if(rabbitcount>204 && rabbitcount<255){
        conversitionMatrix1=mult(conversitionMatrix1,translate(0,-0.3,0.6));
        rabbitcount++;
    }
    if(rabbitcount>254 && rabbitcount<285){
        //转个身跑
        conversitionMatrix1=mult(conversitionMatrix1,translate(0.6,-1,0));
        conversitionMatrix1=mult(conversitionMatrix1,rotate(-3.0,0,1,0));
        conversitionMatrix1=mult(conversitionMatrix1,translate(-0.6,1,0));
        rabbitcount++;
    }
    if(rabbitcount>284 && rabbitcount<385){
        conversitionMatrix1=mult(conversitionMatrix1,translate(0,0,1));
        rabbitcount++;
    }
    if(rabbitcount>384 && rabbitcount<425){
        conversitionMatrix1=mult(conversitionMatrix1,translate(0.6,-1,0));
        conversitionMatrix1=mult(conversitionMatrix1,rotate(-3.0,0,1,0));
        conversitionMatrix1=mult(conversitionMatrix1,translate(-0.6,1,0));
        rabbitcount++;
    }
    if(rabbitcount>424 && rabbitcount<635){
        conversitionMatrix1=mult(conversitionMatrix1,translate(0,0,1));
        rabbitcount++;
    }
    if(rabbitcount>634 && rabbitcount<687){
        conversitionMatrix1=mult(conversitionMatrix1,translate(0.6,-1,0));
        conversitionMatrix1=mult(conversitionMatrix1,rotate(-3.0,0,1,0));
        conversitionMatrix1=mult(conversitionMatrix1,translate(-0.6,1,0));
        rabbitcount++;
    }
    if(rabbitcount>686 && rabbitcount<805){
        conversitionMatrix1=mult(conversitionMatrix1,translate(0,0,1));
        rabbitcount++;
    }
    if(rabbitcount==805){
        conversitionMatrix1=mult(conversitionMatrix1,translate(0,0,1));
        strawdown1(63.0); 
        strawdown2(63.0);
        strawdown3(63.0);
        strawdown4(63.0);
        rabbitcount++;
    }
    if(rabbitcount>805 && rabbitcount<845){
        conversitionMatrix1=mult(conversitionMatrix1,translate(0,0,1));
        rabbitcount++;
    }
    if(rabbitcount>835 && rabbitcount<885){
        conversitionMatrix3=mult(conversitionMatrix3,translate(1,0,1));
        rabbitcount++;
    }
    if(rabbitcount>884 && rabbitcount<912){
        conversitionMatrix3=mult(conversitionMatrix3,translate(1,-0.5,1));
        rabbitcount++;
    }
    if(rabbitcount>911 && rabbitcount <1100){
        conversitionMatrix1=mult(conversitionMatrix1,translate(0.8,0.5,1));
        conversitionMatrix3=mult(conversitionMatrix3,translate(0.4,0.2,0.4));
        rabbitcount++;
    }
    //草随风摇曳,这风抽的跟疯了似的
    var tempcount=rabbitcount%60;

    if(tempcount == 1 && rabbitcount<805){
        strawdown1(20.0); 
        strawdown2(20.0);
        strawdown3(20.0);
        strawdown4(20.0);
    }
    if(tempcount == 30 && rabbitcount<805){
        strawdown1(10); 
        strawdown2(30.0);
        strawdown3(10.0);
        strawdown4(30.0);
    }

    //绘制区

    material1();
    gl.uniformMatrix4fv( Conversition,false,flatten(conversitionMatrix1));
    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 0);
    gl.drawElements(gl.TRIANGLES,1764, gl.UNSIGNED_SHORT, 0);


    material3();
    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 1);
    gl.uniformMatrix4fv( Conversition,false,flatten(conversitionMatrix2));
    gl.drawElements(gl.TRIANGLES,18*3, gl.UNSIGNED_SHORT, 1764*2);

    if(rabbitcount>835){
    material1();
    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 2);
    gl.uniformMatrix4fv( Conversition,false,flatten(conversitionMatrix3));
    gl.drawElements(gl.TRIANGLES,33916*3, gl.UNSIGNED_SHORT, 1818*2);  
    }

    material2();
    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 6);
    
    gl.uniformMatrix4fv( Conversition,false,flatten(conversitionstrawdown1));
    gl.drawElements(gl.TRIANGLES,36, gl.UNSIGNED_SHORT, 103566*2);
    if(tempcount>=0 && tempcount <15){
        strawup1(45.0);
    }if(tempcount>=15 && tempcount <30){
        strawup1(15);
    }if(tempcount>=30 && tempcount <45){
        strawup1(45);
    }else{
        strawup1(15);
    }  
    
    gl.drawElements(gl.TRIANGLES,12, gl.UNSIGNED_SHORT, 103602*2);

    gl.uniformMatrix4fv( Conversition,false,flatten(conversitionstrawdown2));
    gl.drawElements(gl.TRIANGLES,36, gl.UNSIGNED_SHORT, 103566*2);
      if(tempcount>=0 && tempcount <15){
        strawup2(45.0);
    }if(tempcount>=15 && tempcount <30){
        strawup2(15);
    }if(tempcount>=30 && tempcount <45){
        strawup2(45);
    }else{
        strawup2(15);
    }  
    gl.drawElements(gl.TRIANGLES,12, gl.UNSIGNED_SHORT, 103602*2);

    gl.uniformMatrix4fv( Conversition,false,flatten(conversitionstrawdown3));
    gl.drawElements(gl.TRIANGLES,36, gl.UNSIGNED_SHORT, 103566*2);
     if(tempcount>=0 && tempcount <15){
        strawup3(45.0);
    }if(tempcount>=15 && tempcount <30){
        strawup3(15);
    }if(tempcount>=30 && tempcount <45){
        strawup3(45);
    }else{
        strawup3(15);
    }  
    gl.drawElements(gl.TRIANGLES,12, gl.UNSIGNED_SHORT, 103602*2);

    gl.uniformMatrix4fv( Conversition,false,flatten(conversitionstrawdown4));
    gl.drawElements(gl.TRIANGLES,36, gl.UNSIGNED_SHORT, 103566*2);
      if(tempcount>=0 && tempcount <15){
        strawup4(45.0);
    }if(tempcount>=15 && tempcount <30){
        strawup4(15);
    }if(tempcount>=30 && tempcount <45){
        strawup4(45);
    }else{
        strawup4(15);
    }  
    gl.drawElements(gl.TRIANGLES,12, gl.UNSIGNED_SHORT, 103602*2);
   
    material1();
    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 3);
    gl.uniformMatrix4fv( Conversition,false,flatten(conversitionlight));
    gl.drawElements(gl.TRIANGLES,6, gl.UNSIGNED_SHORT, 103614*2); 

    requestAnimFrame(render);
}

//-------------------------------------------------------------------------------------------------------------------------------------

function loadrabbit(){

    var temp1=rabbitv.split(" ");
    for (var i = 0; i <temp1.length-2; i+=3) {
        points.push(vec4(parseFloat(temp1[i]),parseFloat(temp1[i+1]),parseFloat(temp1[i+2]),1));
    }

    var temp3=rabbitvn.split(" ");
    var faxiangliang=[];
    for (var i =0; i<temp3.length-2;i+=3) {
        faxiangliang.push(vec3(parseFloat(temp3[i]),parseFloat(temp3[i+1]),parseFloat(temp3[i+2])));
    }

    var temp4=rabbitvt.split(" ");
    var wenli=[];
    for (var i = 0; i <temp4.length-1; i+=2) {
        wenli.push(vec2(parseFloat(temp4[i]),parseFloat(temp4[i+1])));
    }

    var relation=rabbitf.split(" ");
    var relation2=[];
    var relation3=[];
    for(var i=0; i<relation.length;i++){
        var relation1=relation[i].split("/");
        pointsindex.push(parseInt(relation1[0])-1);
        relation2.push(parseInt(relation1[1])-1);
        relation3.push(parseInt(relation1[2])-1);
    }
    for(var i=0;i<pointsindex.length;i++){
        pointstexturevt[pointsindex[i]]=wenli[relation2[i]];
        normal[pointsindex[i]]=faxiangliang[relation3[i]];
    }

}

//--------------------------------------------------------------------------------------------------------------

function loaddove(){
	var temp1=dovev.split(" ");
    for (var i = 0; i <temp1.length-2; i+=3) {
        points.push(vec4(parseFloat(temp1[i]),parseFloat(temp1[i+1]),parseFloat(temp1[i+2]),1));
    }

    var temp3=dovevn.split(" ");
    var faxiangliang=[];
    for (var i =0; i<temp3.length-2;i+=3) {
        faxiangliang.push(vec3(parseFloat(temp3[i]),parseFloat(temp3[i+1]),parseFloat(temp3[i+2])));
    }

    var temp4=dovevt.split(" ");
    var wenli=[];
    for (var i = 0; i <temp4.length-1; i+=2) {
        wenli.push(vec2(parseFloat(temp4[i]),parseFloat(temp4[i+1])));
    }

    var relation=dovef.split(" ");
    var relation2=[];
    var relation3=[];
    for(var i=0; i<relation.length;i++){
        var relation1=relation[i].split("/");
        pointsindex.push(parseInt(relation1[0])-1+352);
        relation2.push(parseInt(relation1[1])-1);
        relation3.push(parseInt(relation1[2])-1);
    }
    for(var i=1818;i<pointsindex.length;i++){
        pointstexturevt[pointsindex[i]]=wenli[relation2[i-1818]];
        normal[pointsindex[i]]=faxiangliang[relation3[i-1818]];
    }

}

//----------------------------------------------------------------------------------------------------------------

function loadgrass(){
    var basex=-4;
    var basez=-4;
    var backsize=1;
    var count=0;
    for(var j=0;j<3;j++){
    basez=basez+2;
    basex=-4;
    for(var i=0;i<3;i++){
    basex=basex+2;
    points.push(vec4(basex+backsize,-1,basez+backsize,1));
    points.push(vec4(basex+backsize,-1,basez-backsize,1));
    points.push(vec4(basex-backsize,-1,basez-backsize,1));
    points.push(vec4(basex-backsize,-1,basez+backsize,1));
    pointstexturevt.push(vec2(1,1));
    pointstexturevt.push(vec2(1,0));
    pointstexturevt.push(vec2(0,0));
    pointstexturevt.push(vec2(0,1));
    normal.push(vec3(0,1,0));
    normal.push(vec3(0,1,0));
    normal.push(vec3(0,1,0));
    normal.push(vec3(0,1,0));
    pointsindex.push(316+count*6);
    pointsindex.push(317+count*6);
    pointsindex.push(318+count*6);
    pointsindex.push(316+count*6);
    pointsindex.push(318+count*6);
    pointsindex.push(319+count*6);
    count++;
}
}
}

//-----------------------------------------------------------------------------------------------

function loadstraw(){

//下半部分 103566-103602,上半部分 103602-103614.第一根草
    var centerx=0.5;
    var centerz=0;
    var centery=-1;
    var swidth=0.04;
    var sheight=0.2;

    points.push(vec4(centerx,centery,centerz+swidth,1.0));
    points.push(vec4(centerx,centery+sheight,centerz+swidth,1.0));
    points.push(vec4(centerx+swidth,centery+sheight,centerz+swidth,1.0));
    points.push(vec4(centerx+swidth,centery,centerz+swidth,1.0));
    points.push(vec4(centerx,centery,centerz,1.0));
    points.push(vec4(centerx,centery+sheight,centerz,1.0));
    points.push(vec4(centerx+swidth,centery+sheight,centerz,1.0));
    points.push(vec4(centerx+swidth,centery,centerz,1.0));
    points.push(vec4(centerx+swidth/2,centery+2*sheight,centerz+swidth/2,1));
    pointstexturevt.push(vec2(0,0));
    pointstexturevt.push(vec2(0,0.5));
    pointstexturevt.push(vec2(0.25,0.5));
    pointstexturevt.push(vec2(0.25,0));
    pointstexturevt.push(vec2(0.5,0));
    pointstexturevt.push(vec2(0.5,0.5));
    pointstexturevt.push(vec2(0.75,0.5));
    pointstexturevt.push(vec2(0.75,0));
    pointstexturevt.push(vec2(0.5,1));


    pointsindex.push(17310);
    pointsindex.push(17312);
    pointsindex.push(17311);
    pointsindex.push(17310);
    pointsindex.push(17313);
    pointsindex.push(17312);

    pointsindex.push(17313);
    pointsindex.push(17317);
    pointsindex.push(17316);
    pointsindex.push(17313);
    pointsindex.push(17316);
    pointsindex.push(17312);

    pointsindex.push(17312);
    pointsindex.push(17316);
    pointsindex.push(17315);
    pointsindex.push(17312);
    pointsindex.push(17315);
    pointsindex.push(17311);

    pointsindex.push(17310);
    pointsindex.push(17311);
    pointsindex.push(17315);
    pointsindex.push(17310);
    pointsindex.push(17315);
    pointsindex.push(17314);

    pointsindex.push(17310);
    pointsindex.push(17314);
    pointsindex.push(17317);
    pointsindex.push(17310);
    pointsindex.push(17317);
    pointsindex.push(17313);

    pointsindex.push(17314);
    pointsindex.push(17315);
    pointsindex.push(17316);
    pointsindex.push(17314);
    pointsindex.push(17316);
    pointsindex.push(17317);

    pointsindex.push(17318);
    pointsindex.push(17311);
    pointsindex.push(17312);

    pointsindex.push(17318);
    pointsindex.push(17312);
    pointsindex.push(17316);

    pointsindex.push(17318);
    pointsindex.push(17316);
    pointsindex.push(17315);

    pointsindex.push(17318);
    pointsindex.push(17315);
    pointsindex.push(17311);

    normal.push(vec3(0,0,1));
    normal.push(vec3(0,0,1));
    normal.push(vec3(0,0,1));
    normal.push(vec3(0,0,1));
    normal.push(vec3(0,0,1));
    normal.push(vec3(0,0,1));
    normal.push(vec3(1,0,0));
    normal.push(vec3(1,0,0));
    normal.push(vec3(0,1,0));


}

//-----------------------------------------------------------------------------------------------

function material1(){

    materialAmbient = vec4( 0, 0, 0, 1.0 );
    materialDiffuse = vec4( 0, 0, 0, 1.0 );
    materialSpecular = vec4( 1, 1, 1, 1.0 );
    materialShininess = 10;
      gl.uniform4fv( gl.getUniformLocation(program,
        "materialambient"),flatten(materialAmbient) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "materialdiffuse"),flatten(materialDiffuse) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "materialspecular"),flatten(materialSpecular) );
    gl.uniform1f( gl.getUniformLocation(program,
        "shininess"),materialShininess );
}

//--------------------------------------------------------------------------------------------------

function material2(){
    materialAmbient = vec4( 0, 1, 0, 1.0 );
    materialDiffuse = vec4( 0, 0, 0, 1.0 );
    materialSpecular = vec4( 0, 0, 0, 1.0 );
    materialShininess = 10;
     // uniform vec4 lightambient, lightdiffuse, lightspecular;
     //    uniform vec4 lightambient2, lightdiffuse2, lightspecular2;
     //    uniform vec4 materialambient, materialdiffuse,materialspecular;
    gl.uniform4fv( gl.getUniformLocation(program,
        "materialambient"),flatten(materialAmbient) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "materialdiffuse"),flatten(materialDiffuse) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "materialspecular"),flatten(materialSpecular) );
    gl.uniform1f( gl.getUniformLocation(program,
        "shininess"),materialShininess );
}

//------------------------------------------------------------------------------------------------

function material3(){

    materialAmbient = vec4( 0, 0, 0, 1.0 );
    materialDiffuse = vec4( 0, 0, 0, 1.0 );
    materialSpecular = vec4( 0, 0, 0, 1.0 );
    materialShininess = 10;
      gl.uniform4fv( gl.getUniformLocation(program,
        "materialambient"),flatten(materialAmbient) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "materialdiffuse"),flatten(materialDiffuse) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "materialspecular"),flatten(materialSpecular) );
    gl.uniform1f( gl.getUniformLocation(program,
        "shininess"),materialShininess );
}

//--------------------------------------------------------------------------------

function strawup1(angle){
    var upmatrix=mult(conversitionstrawdown1,translate(0.52,-0.82,0.02));
    upmatrix=mult(upmatrix,rotate(angle,0,0,1));
    upmatrix=mult(upmatrix,rotate(-angle,1,0,0));
    upmatrix=mult(upmatrix,translate(-0.52,0.82,-0.02));
    //conversitionstawup1=upmatrix;
    gl.uniformMatrix4fv(Conversition,false,flatten(upmatrix));
}

//--------------------------------------------------------------------------------

function strawup2(angle){
    var upmatrix=mult(conversitionstrawdown2,translate(0.5,-0.8,0.02));
    upmatrix=mult(upmatrix,rotate(-angle,0,0,1));
    upmatrix=mult(upmatrix,rotate(-angle,1,0,0));
    upmatrix=mult(upmatrix,translate(-0.5,0.8,-0.02));
    gl.uniformMatrix4fv(Conversition,false,flatten(upmatrix));
}

//---------------------------------------------------------------------------------------------

function strawup3(angle){
    var upmatrix=mult(conversitionstrawdown3,translate(0.54,-0.8,0.02));
    upmatrix=mult(upmatrix,rotate(angle,0,0,1));
    upmatrix=mult(upmatrix,rotate(angle,1,0,0));
    upmatrix=mult(upmatrix,translate(-0.54,0.8,-0.02));
    gl.uniformMatrix4fv(Conversition,false,flatten(upmatrix));
}

//-----------------------------------------------------------------------------

function strawup4(angle){
     var upmatrix=mult(conversitionstrawdown4,translate(0.5,-0.8,0.02));
     upmatrix=mult(upmatrix,rotate(-angle,0,0,1));
     upmatrix=mult(upmatrix,rotate(angle,1,0,0));
     upmatrix=mult(upmatrix,translate(-0.5,0.8,-0.02));
     gl.uniformMatrix4fv(Conversition,false,flatten(upmatrix));
 }

 //--------------------------------------------------------------------
 
function strawdown1(angle){
    var downmatrix=mult(conversitionstraw1,translate(0.5,-1,0));
    downmatrix=mult(downmatrix,rotate(angle,0,0,1));
    downmatrix=mult(downmatrix,rotate(-angle,1,0,0));
    downmatrix=mult(downmatrix,translate(-0.5,1,0));
    conversitionstrawdown1=downmatrix;
 }

//----------------------------------------------------------------------------------

function strawdown2(angle){
    var downmatrix=mult(conversitionstraw2,translate(0.5,-1,0));
    downmatrix=mult(downmatrix,rotate(-angle,0,0,1));
    downmatrix=mult(downmatrix,rotate(-angle,1,0,0));
    downmatrix=mult(downmatrix,translate(-0.5,1,0));
    conversitionstrawdown2=downmatrix;
 }

 //------------------------------------------------------------------------------------

function strawdown3(angle){
    var downmatrix=mult(conversitionstraw3,translate(0.5,-1,0));
    downmatrix=mult(downmatrix,rotate(angle,0,0,1));
    downmatrix=mult(downmatrix,rotate(angle,1,0,0));
    downmatrix=mult(downmatrix,translate(-0.5,1,0));
    conversitionstrawdown3=downmatrix;
 }

 //-----------------------------------------------------------------------------------

function strawdown4(angle){
    var downmatrix=mult(conversitionstraw4,translate(0.5,-1,0));
    downmatrix=mult(downmatrix,rotate(-angle,0,0,1));
    downmatrix=mult(downmatrix,rotate(angle,1,0,0));
    downmatrix=mult(downmatrix,translate(-0.5,1,0));
    conversitionstrawdown4=downmatrix;
 }

 function loadlight(lightx,lighty,lightz){
    points.push(vec4(lightx-0.2,lighty-0.2,lightz));
    points.push(vec4(lightx+0.2,lighty-0.2,lightz));
    points.push(vec4(lightx+0.2,lighty+0.2,lightz));
    points.push(vec4(lightx-0.2,lighty+0.2,lightz));
    pointsindex.push(17319);
    pointsindex.push(17320);
    pointsindex.push(17321);
    pointsindex.push(17319);
    pointsindex.push(17321);
    pointsindex.push(17322);
    pointstexturevt.push(vec2(1,0));
    pointstexturevt.push(vec2(1,1));
    pointstexturevt.push(vec2(0,1));
    pointstexturevt.push(vec2(0,0));
    normal.push(vec3(0,0,1));
    normal.push(vec3(0,0,1));
    normal.push(vec3(0,0,1));
    normal.push(vec3(0,0,1));
 }