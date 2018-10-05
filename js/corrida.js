var canvas;
var contexto;
var velocidade = 100;
var CarroPersonagem=new movel(300,400,100,100,"black")
$(document).ready(function () {
    //recebe o canvas e o contexto
    canvas = document.getElementById("corrida-smn");
    contexto = canvas.getContext('2d');

    $("#corrida-smn")
        .css({
            "padding": "0px",
            "margin": "0px",
            "border": "none"
        })
        .height($(window).height())
        .width($(window).width());


    canvas.height = $(window).height();
    canvas.width = $(window).width();


    //a pintura de faixa e aroveres são diferentes precisaram de uma mudança mais constante
    setInterval(() => {
        velocidade += 50;
        pintaCampo();
        CarroPersonagem.desenhar();
        CarroPersonagem.mover(10,0);
    }, 50)
})


//redimensiona a tela para sempre estar em tela cheia
$(window).on('resize', function () {

    $("#corrida-smn")
        .height($(this).height())
        .width($(this).width());

    canvas.height = $(this).height();
    canvas.width = $(this).width();


    pintaCampo();

})

function pintaCampo() {

    var inicioW;
    var fimW;
    var inicioH;
    var fimH;

    //Pinta o fundo de azul
    contexto.beginPath();
    contexto.fillStyle = "green";
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    //desenha a estrada
    contexto.beginPath();
    contexto.fillStyle = "#802b00";
    inicioW = (canvas.width / 100) * 20;
    fimW = (canvas.width / 100) * 60;
    inicioH = (canvas.height / 100) * 0;

    contexto.fillRect(inicioW, 0, fimW, canvas.height);

    //suavisa a divisão da estrada com o mato

}


function movel(xInit,yInit,width,height,color){
    this.xInit =xInit;
    this.yInit =yInit;
    this.width =width;
    this.height=height;
    this.color=color;

    this.desenhar =()=>{
        contexto.beginPath();
        contexto.fillStyle = this.color;
    
        contexto.fillRect(this.xInit, this.yInit, this.width, this.height);
    }

    this.mover=(xNovo,yNovo)=>{
        this.xInit +=xNovo;
        this.yInit+=yNovo;

        if(((canvas.width / 100) * 20) > this.xInit){
            this.x = -this.width;
        }
    }
}