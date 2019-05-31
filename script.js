var ctx;

var minrockH=350;
var rockH;
var x;
var y;
var dx=2;
var dy=0;
var lr=Math.round(Math.random());
if(lr==1)
    x=410-20;
else
    x=20;
rockH=Math.floor(Math.random()*(530-minrockH)+minrockH);
y=rockH;

function init(){
    var gamescreen = document.getElementById('gamescreen');
    ctx = gamescreen.getContext('2d');
    ctx.transform(1,0,0,-1,0,550);
    setInterval(rockgen,10);
}


function rockgen(){
    ctx.clearRect(0,100,410,450);
    ctx.fillStyle="#396639";
    ctx.fillRect(0,0,410,100);
    ctx.fillStyle="#c5dfe0";
    ctx.fillRect(0,100,410,450);
    var rock = gamescreen.getContext('2d');
    rock.beginPath();
    rock.fillStyle="#751525";
    rock.arc(x,y,20,0,Math.PI*2,true);
    rock.closePath();
    rock.fill();
    dy+=9.8/100;
    if(x<0||x>390)
        dx=-dx;
    if(y<121)
        dy=-dy;
    y-=dy;
    x+=dx;
}