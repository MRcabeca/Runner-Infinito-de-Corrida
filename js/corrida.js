var canvas;
var contexto;
var velocidade = 100;
var CarroPersonagem = new movel(0, 0, 0, 0,"black")
var mapa = new Array(0, 0, 0, 0);


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
        .width($(window).width())


    canvas.height = $(window).height();
    canvas.width = $(window).width();

    CarroPersonagem.xInit = (canvas.width / 100) * 46.5;
    CarroPersonagem.yInit = (canvas.height / 100) * 80;
    CarroPersonagem.width = (canvas.width / 100) * 5;
    CarroPersonagem.height = (canvas.height / 100) * 15;


    $(document).keydown(function (event) {
        //37 é a seta para esquerda,38 é a seta para cima, 39 é a seta para direita e 40 seta para baixo
        if (event.which == 37) {
            mapa[0] = 1
        }
        else if (event.which == 38) {
            mapa[1] = 1
        }
        else if (event.which == 39) {
            mapa[2] = 1
        }
        else if (event.which == 40) {
            mapa[3] = 1
        }
    })
        .keyup(function (event) {
            if (event.which == 37) {
                mapa[0] = 0
            }
            else if (event.which == 38) {
                mapa[1] = 0
            }
            else if (event.which == 39) {
                mapa[2] = 0
            }
            else if (event.which == 40) {
                mapa[3] = 0
            }
        })


    setInterval(() => {
        velocidade += 50;
        pintaCampo();
        CarroPersonagem.desenhar();

        //primeiros 4 if servem para leitura de diagonais
        if (mapa[0] && mapa[1]) {
            CarroPersonagem.mover(-(canvas.width / 100) * 1.5, -(canvas.height / 100) * 1.5, 0, 1);
        } else if (mapa[0] && mapa[3]) {
            CarroPersonagem.mover(-(canvas.width / 100) * 1.5, (canvas.height / 100) * 1.5, 0, 3);
        }
        else if (mapa[2] && mapa[1]) {
            CarroPersonagem.mover((canvas.width / 100) * 1.5, -(canvas.height / 100) * 1.5, 2, 1);
        }
        else if (mapa[2] && mapa[3]) {
            CarroPersonagem.mover((canvas.width / 100) * 1.5, (canvas.height / 100) * 1.5, 2, 3);
        }
        //os ultimos 4 if servem para leitura de direções
        else if (mapa[0]) {
            CarroPersonagem.mover(-(canvas.width / 100) * 1.5, 0, 0);
        } else if (mapa[1]) {
            CarroPersonagem.mover(0, -(canvas.height / 100) * 1.5, 1);
        }
        else if (mapa[2]) {
            CarroPersonagem.mover((canvas.width / 100) * 1.5, 0, 2);
        }
        else if (mapa[3] && mapa[3]) {
            CarroPersonagem.mover(0, (canvas.height / 100) * 1.5, 3);
        }
    }, 50)
})


//redimensiona a tela para sempre estar em tela cheia
$(window).on('resize', function () {

    $("#corrida-smn")
        .height($(this).height())
        .width($(this).width());

    canvas.height = $(this).height();
    canvas.width = $(this).width();

    
    CarroPersonagem.width = (canvas.width / 100) * 5;
    CarroPersonagem.height = (canvas.height / 100) * 15;


    pintaCampo();
    CarroPersonagem.desenhar();

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
    inicioW = (canvas.width / 100) * 18.47;
    fimW = (canvas.width / 100) * 61;
    inicioH = (canvas.height / 100) * 0;

    contexto.fillRect(inicioW, 0, fimW, canvas.height);

    //suavisa a divisão da estrada com o mato

}


function movel(xInit, yInit, width, height, color) {
    this.xInit = xInit;
    this.yInit = yInit;
    this.width = width;
    this.height = height;
    this.color = color;

    this.desenhar = () => {
        contexto.beginPath();
        contexto.fillStyle = this.color;

        contexto.fillRect(this.xInit, this.yInit, this.width, this.height);
    }

    this.mover = (xNovo, yNovo, mapaPos1, mapaPos2) => {
        //tratamento das bordas nas diagonais caso se mova numa borda extrema
        //diagonal esquerda-cima
        if ((((canvas.width / 100) * 20) < this.xInit && mapaPos1 == 0)
            && (canvas.height > (this.yInit + CarroPersonagem.height) && mapaPos2 == 3)) {
            this.xInit += xNovo;
            this.yInit += yNovo;
        }
         //diagonal direita-baixo
        else if ((((canvas.width / 100) * 71) > this.xInit && mapaPos1 == 2)
            && (0 < this.yInit && mapaPos2 == 1)) {

            this.xInit += xNovo;
            this.yInit += yNovo;
        }
        //diagonal esquerda-baixo
        else if ((((canvas.width / 100) * 19) < this.xInit && mapaPos1 == 0)
            && (0 < this.yInit && mapaPos2 == 1)) {

            this.xInit += xNovo;
            this.yInit += yNovo;
        }
        //diagonal direita-cima
        else if ((((canvas.width / 100) * 71) > this.xInit && mapaPos1 == 2)
            && (canvas.height > (this.yInit + CarroPersonagem.height) && mapaPos2 == 3)) {

            this.xInit += xNovo;
            this.yInit += yNovo;
        }
        //tratamento das bordas nas linhas retas
        //esquerda
        else if (((canvas.width / 100) * 19) < this.xInit && mapaPos1 == 0) {

            this.xInit += xNovo;
        }
        //direita
        else if (((canvas.width / 100) * 71) > this.xInit && mapaPos1 == 2){

            this.xInit += xNovo;
        }
        //cima
        else if(canvas.height > (this.yInit + CarroPersonagem.height) && mapaPos1 == 3) {

            this.yInit += yNovo;
        }
        //baixo
        else if (0 < this.yInit && mapaPos1 == 1) {

            this.yInit += yNovo;
        }
    }
}
