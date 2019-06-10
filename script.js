const startbtn=document.getElementById('start');
const scoredisp=document.getElementById('scoredisp');
const pausebtn=document.getElementById('pause');

var i;
var j;

var ctx;

var playerscore=0;

var minrockH=350;
var maxStr=10;
var canonpos=20;
var shotbullets=[];
var currentrocks=[];

var rightpress=false;
var leftpress=false;

var newrock;
var shoot;
var drawinterval;
var canon;


function drawbg(){
    ctx.clearRect(0,80,410,450);
    ctx.fillStyle="#396639";
    ctx.fillRect(0,0,410,80);
    ctx.fillStyle="#c5dfe0";
    ctx.fillRect(0,80,410,450);
}

function updatescore(){
    scoredisp.textContent="Score: "+playerscore;
}


class Canon {
    constructor(){
        this.x=0;
        this.y=80;
        this.w=40;
        this.h=20;
        this.dx=0;
    }

    drawcanon(){
        if(rightpress){
            this.x+=4;
        }
        if(leftpress){
            this.x-=4;
        }
        if(this.x>370){
            this.x=370;
        }
        else if(this.x<0){
            this.x=0;
        }
        ctx.fillStyle="#2d2d2d";
        ctx.fillRect(this.x,this.y,this.w,this.h);
        canonpos=this.x+20;
    }

    get cx(){
        return this.x;
    }

    get cy(){
        return this.y;
    }
}


class Rock {
    constructor(){
        this.radius=30;
        if(Math.round(Math.random())==1)
            this.x=380;
        else this.x=30;
        this.rockH=Math.floor(Math.random()*(510-minrockH)+minrockH);
        this.dx=Math.random()+1/100;
        this.dy=0;
        this.y=this.rockH;
        this.strength=Math.floor(Math.random()*10+1);
        currentrocks.push(this);
    }

    drawrock(){
        if(this.strength>0){
            ctx.beginPath();
            ctx.fillStyle="#751525";
            ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
            ctx.closePath();
            ctx.fill();
            ctx.lineWidth=3;
            ctx.strokeStyle="white";
            ctx.stroke();
            ctx.save();
            ctx.transform(1,0,0,-1,0,530);
            ctx.fillStyle="white";
            ctx.font="20px Arial";
            ctx.textAlign="center";
            ctx.fillText(this.strength,this.x,530-this.y);
            ctx.restore();
            if(this.x<30||this.x>380){
                this.dx=-this.dx;
            }
            if(this.y<120){
                this.dy=-this.dy;
                this.y=120;
            }
            if(this.y>this.rockH)
                this.dy=0;
            this.dy+=9.8/200;
            this.y-=this.dy;
            this.x+=this.dx;
        }
        else{
            currentrocks.splice(currentrocks.indexOf(this),1);
        }
    }

    rockhit(){
        this.strength-=1;
    }

    get rx(){
        return this.x;
    }
    
    get ry(){
        return this.y;
    }
}


class Bullet {
    constructor(){
        this.y=120;
        this.dy=5;
        this.x=canonpos;
        this.alive=true;
        shotbullets.push(this);
    }

    movebullet(){
        if(this.alive){
            ctx.beginPath();
            ctx.fillStyle="#6b6b6b";
            ctx.arc(this.x,this.y,4,0,Math.PI*2,false);
            ctx.closePath();
            ctx.fill();
            this.y+=this.dy;
            if(this.y>530){
                this.alive=false;
            }
        }
        else{
            shotbullets.splice(shotbullets.indexOf(this),1);
        }
    }

    bulletused(){
        this.alive=false;
    }

    get bx(){
        return this.x;
    }

    get by(){
        return this.y;
    }

    get isalive(){
        return this.alive;
    }
}


function createbullet(){
    bullets=new Bullet();
}

function createrock(){
    ball=new Rock();
}


function checkcollision(cx,cy,rx,ry){
    var distx = Math.abs(cx - rx-20);
    var disty = Math.abs(cy - ry-10);

    if (distx > 50) { return false; }
    if (disty > 40) { return false; }

    if (distx <= 20) { return true; } 
    if (disty <= 10) { return true; }

    var dx=distx-20;
    var dy=disty-10;
    return (dx*dx+dy*dy<=900);
}


function rockhitcanon(){
    for(i=0;i<currentrocks.length;i++){
        var result = checkcollision(currentrocks[i].rx,currentrocks[i].ry,canon.cx,canon.cy);
        if(result){
            window.alert("Game Over!\n   Score: "+playerscore);
            document.location.reload();
            clearInterval(drawinterval);
            clearInterval(shoot);
            clearInterval(newrock);
        }
    }
}


function bullethitrock(){
    for(i=0;i<shotbullets.length;i++){
        if(shotbullets[i].isalive){
            for(j=0;j<currentrocks.length;j++){
                if(shotbullets[i].bx > currentrocks[j].rx-30 && shotbullets[i].bx < currentrocks[j].rx+30 && shotbullets[i].by > currentrocks[j].ry-30 && shotbullets[i].by < currentrocks[j].ry+30){
                    shotbullets[i].bulletused();
                    currentrocks[j].rockhit();
                    playerscore++;
                    updatescore();
                }
            }
        }
    }
}


function init(){
    startbtn.style.display="none";
    scoredisp.style.display="block";
    pausebtn.style.display="block";
    updatescore();
    var gamescreen = document.getElementById('gamescreen');
    ctx = gamescreen.getContext('2d');
    ctx.transform(1,0,0,-1,0,530);
    canon = new Canon();

    document.onkeydown = function(e) {
        if(e.keyCode == 37 || e.keyCode == 65) leftpress = true;
        if(e.keyCode == 39 || e.keyCode == 68) rightpress = true;
    }
    document.onkeyup = function(e) {
        if(e.keyCode == 37 || e.keyCode == 65) leftpress = false;
        if(e.keyCode == 39 || e.keyCode == 68) rightpress = false;
    }

    for(i=0;i<3;i++){
        createrock();
    }

    newrock = setInterval(createrock,5000);
    shoot = setInterval(createbullet,200);
    drawinterval = setInterval(function(){
        drawbg();
        for(i=0;i<currentrocks.length;i++){
            currentrocks[i].drawrock();
        }
        canon.drawcanon();
        for(i=0;i<shotbullets.length;i++){
            shotbullets[i].movebullet();
        }
        rockhitcanon();
        bullethitrock();
    },10);
}

function pausegame(){
    if(pausebtn.value=="Pause"){
        pausebtn.value="Resume";
        clearInterval(drawinterval);
        clearInterval(newrock);
        clearInterval(shoot);
    }
    else{
        pausebtn.value="Pause";
        newrock = setInterval(createrock,5000);
        shoot = setInterval(createbullet,200);
        drawinterval = setInterval(function(){
            drawbg();
            for(i=0;i<currentrocks.length;i++){
                currentrocks[i].drawrock();
            }
            canon.drawcanon();
            for(i=0;i<shotbullets.length;i++){
                shotbullets[i].movebullet();
            }
            rockhitcanon(canon);
            bullethitrock();
        },10);
    }
}

startbtn.style.display="block";
scoredisp.style.display="none";
pausebtn.style.display="none";

pausebtn.onclick=pausegame;
startbtn.onclick=init;
