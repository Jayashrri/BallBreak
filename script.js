const startbtn=document.getElementById('start');
const scoredisp=document.getElementById('scoredisp');
const pausebtn=document.getElementById('pause');

var i;
var j;

var ctx;

var playerscore=0;
var playerhigh=0;
var bps=5;
var maxstrength=10;
var minstrength=1;
var count=0;

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
    ctx.clearRect(0,50,1200,450);
    ctx.fillStyle="#396639";
    ctx.fillRect(0,0,1200,50);
    ctx.fillStyle="#c5dfe0";
    ctx.fillRect(0,50,1200,450);
}

function updatescore(){
    scoredisp.textContent="Score: "+playerscore+"                                   Player High: "+playerhigh;
    count++;
    if(count==5){
        bps++;
        maxstrength++;
        minstrength++;
        count=0;
    }
}


class Canon {
    constructor(){
        this.x=0;
        this.y=50;
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
        if(this.x>1160){
            this.x=1160;
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
    constructor(str,rhm,rh,rx,r,n,rhd){
        this.radius=r;
        this.x=rx;
        this.rockH=rhm;
        this.dx=Math.random()+1/100;
        this.dy=rhd;
        this.y=rh;
        this.os=str;
        this.strength=str;
        this.life=n;
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
            ctx.transform(1,0,0,-1,0,500);
            ctx.fillStyle="white";
            ctx.font="20px Arial";
            ctx.textAlign="center";
            ctx.fillText(this.strength,this.x,500-this.y);
            ctx.restore();
            if(this.x<this.radius||this.x>1200-this.radius){
                this.dx=-this.dx;
            }
            if(this.y<50+this.radius){
                this.dy=-this.dy;
                this.y=50+this.radius;
            }
            if(this.y>this.rockH)
                this.dy=0;
            this.dy+=9.8/200;
            this.y-=this.dy;
            this.x+=this.dx;
        }
        else{
            let ns=Math.floor(this.os/2);
            if(ns!=0&&this.life==1){
                ball=new Rock(ns,this.rockH,this.y,this.x-10,16,0,-this.dy);
                ball=new Rock(ns,this.rockH,this.y,this.x+10,16,0,-this.dy);
            }
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

    get r(){
        return this.radius;
    }
}


class Bullet {
    constructor(){
        this.y=70;
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
            if(this.y>500){
                this.alive=false;
            }
        }
        else{
            shotbullets.splice(shotbullets.indexOf(this),1);
        }
    }

    bulletused(){
        shotbullets.splice(shotbullets.indexOf(this),1);
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
    let str=Math.floor(Math.random()*(maxstrength-minstrength)+minstrength);
    let rh=Math.floor(Math.random()*(490-minrockH)+minrockH);
    let rx;
    if(Math.round(Math.random())==1)
        rx=1170;
    else rx=30;
    ball=new Rock(str,rh,rh,rx,30,1,0);
}


function checkcollision(cx,cy,rx,ry,r){
    var distx = Math.abs(cx - (rx+20));
    var disty = Math.abs(cy - (ry+10));

    if (distx > 20 + r) { return false; }
    if (disty > 10 + r) { return false; }

    if (distx <= 20) { return true; } 
    if (disty <= 10) { return true; }

    var dx=distx-20;
    var dy=disty-10;
    return (dx*dx+dy*dy<=r*r);
}


function rockhitcanon(){
    for(i=0;i<currentrocks.length;i++){
        var result = checkcollision(currentrocks[i].rx,currentrocks[i].ry,canon.cx,canon.cy,currentrocks[i].r);
        if(result){
            window.alert("Game Over!\n   Score: "+playerscore);
            if(playerscore>playerhigh){
                localStorage.setItem('playerhigh',playerscore);
            }
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
                if(shotbullets[i].bx > currentrocks[j].rx-currentrocks[j].r && shotbullets[i].bx < currentrocks[j].rx+currentrocks[j].r && shotbullets[i].by > currentrocks[j].ry-currentrocks[j].r && shotbullets[i].by < currentrocks[j].ry+currentrocks[j].r){
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
    ctx.transform(1,0,0,-1,0,500);
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

    newrock = setInterval(createrock,8000);
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
        newrock = setInterval(createrock,8000);
        shoot = setInterval(createbullet,1000/bps);
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

if(localStorage.getItem('playerhigh')){
    playerhigh=localStorage.getItem('playerhigh');
}

startbtn.style.display="block";
scoredisp.style.display="none";
pausebtn.style.display="none";

pausebtn.onclick=pausegame;
startbtn.onclick=init;
