const startbtn=document.getElementById('start');

var i;
var j;

var ctx;

var minrockH=350;
var maxStr=10;
var canonpos=20;
var shotbullets=[];
var currentrocks=[];

var rightpress=false;
var leftpress=false;


function drawbg(){
    ctx.clearRect(0,100,410,450);
    ctx.fillStyle="#396639";
    ctx.fillRect(0,0,410,100);
    ctx.fillStyle="#c5dfe0";
    ctx.fillRect(0,100,410,450);
}


class Canon {
    constructor(){
        this.x=0;
        this.y=100;
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
}


class Rock {
    constructor(){
        this.radius=20;
        if(Math.round(Math.random())==1)
            this.x=390;
        else this.x=20;
        this.rockH=Math.floor(Math.random()*(530-minrockH)+minrockH);
        this.dx=Math.random();
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
            ctx.save();
            ctx.transform(1,0,0,-1,0,550);
            ctx.fillStyle="white";
            ctx.font="20px Arial";
            ctx.textAlign="center";
            ctx.fillText(this.strength,this.x,550-this.y);
            ctx.restore();
            if(this.x<20||this.x>390){
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
            if(this.y>550){
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


function bullethitrock(){
    for(i=0;i<shotbullets.length;i++){
        if(shotbullets[i].isalive){
            for(j=0;j<currentrocks.length;j++){
                if(shotbullets[i].bx > currentrocks[j].rx-20 && shotbullets[i].bx < currentrocks[j].rx+20 && shotbullets[i].by > currentrocks[j].ry-20 && shotbullets[i].by < currentrocks[j].ry+20){
                    shotbullets[i].bulletused();
                    currentrocks[j].rockhit();
                }
            }
        }
    }
}


function init(){
    startbtn.style.display="none";
    var gamescreen = document.getElementById('gamescreen');
    ctx = gamescreen.getContext('2d');
    ctx.transform(1,0,0,-1,0,550);
    let canon = new Canon();

    document.onkeydown = function(e) {
        if(e.keyCode == 37) leftpress = true;
        if(e.keyCode == 39) rightpress = true;
    }
    document.onkeyup = function(e) {
        if(e.keyCode == 37) leftpress = false;
        if(e.keyCode == 39) rightpress = false;
    }

    for(i=0;i<3;i++){
        ball=new Rock();
    }

    setInterval(function(){
        drawbg();
        for(i=0;i<currentrocks.length;i++){
            currentrocks[i].drawrock();
        }
        canon.drawcanon();
        for(i=0;i<shotbullets.length;i++){
            shotbullets[i].movebullet();
        }
        bullethitrock();
    },10);
    setInterval(createbullet,100);
}

startbtn.style.display="block";
startbtn.onclick=init;
