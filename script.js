var minrockH=350;

function init(){
    var gamescreen = document.getElementById('gamescreen');
    var ctx = gamescreen.getContext('2d');
    ctx.transform(1,0,0,-1,0,550);
    ctx.fillStyle="#396639";
    ctx.fillRect(0,0,410,100);
    ctx.fillStyle="#c5dfe0";
    ctx.fillRect(0,100,410,450);
}
