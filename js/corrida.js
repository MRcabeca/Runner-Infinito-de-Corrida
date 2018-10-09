//variaveis globais compartilhadas pela funções
var canvas;
var contexto;
var velocidade = 0;
var inimigo = new Array();
var cenario = new Array();
var mapa = new Array(0, 0, 0, 0);
var spawn_Point;
var Spawn_Velo = 1500;
var Imagens = new Array()
var CarroPersonagem = new Player(0, 0, 0, 0);
var pontos = 0;
var Grama = new Image();
var Terra = new Image();
var historico = new Array(0, 0, 0, 0, 0);
var Game;
var paused = false;
var GameOver = false;

$(document).ready(function () {
    //recebe o canvas e o contexto
    canvas = document.getElementById("corrida-smn");
    contexto = canvas.getContext('2d');
    //Todas as imagens são sprite deu uso livre disponibilizadas no site https://opengameart.org
    //e os efeitos do Site freeSound, que tambem são de livre uso


    //posição 0 nas imagens - Player
    //posição 1 a 7 imagens- Pedras
    //posição 8 nas imagens-toco de arvore
    //posicão 9- explosão

    //Musicas do jogo vindo da animação Inital D retiradas do site https://downloads.khinsider.com/
    var personagem = new Image();
    personagem.src = './img/Pickup.svg'
    Imagens.push(personagem)

    for (var i = 0; i < 7; i++) {
        var pedra = new Image();
        pedra.src = './img/Pedras/stone-' + i + '.png'
        Imagens.push(pedra)
    }


    var toco = new Image();
    toco.src = './img/Arvores/toco.png'
    Imagens.push(toco)

    var explosão = new Image();
    explosão.src = './img/Explosion.png'
    Imagens.push(explosão)

    Grama.src = './img/grass.png'

    Terra.src = './img/Ground.png'

    CarroPersonagem.xInit = (canvas.width / 100) * 47;
    CarroPersonagem.yInit = (canvas.height / 100) * 80;
    CarroPersonagem.width = (canvas.width / 100) * 7;
    CarroPersonagem.height = (canvas.height / 100) * 15;

    CarroPersonagem.Imagem = Imagens[0];

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
        //utilitarios

        //letra R-recarregar canvas
        if (event.which == 82) {
            velocidade = 0;
            inimigo = new Array();
            cenario = new Array();
            mapa = new Array(0, 0, 0, 0);
            spawn_Point;
            Spawn_Velo = 1500;
            pontos = 0;


            CarroPersonagem.xInit = (canvas.width / 100) * 47;
            CarroPersonagem.yInit = (canvas.height / 100) * 80;


            clearInterval(Game);
            clearInterval(Intervalo);

            GameOver = false

            Game = Jogar();
            Intervalo = IntervaloTempo();

        }
        //letra P- pausar e despausar
        if (event.which == 80) {

            Pausar("teclado");
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

    Spawn(Imagens);


    Game = Jogar()
    Intervalo = IntervaloTempo();

})



function pintaCampo() {

    var inicioW;

    for (var i = 0; i < 13; i++) {
        //lado esquerdo
        contexto.drawImage(Grama, 0, 50 * i, 50, 50);
        contexto.drawImage(Grama, 50, 50 * i, 50, 50);
        contexto.drawImage(Grama, 100, 50 * i, 50, 50);

        //lado direito
        contexto.drawImage(Grama, (canvas.width / 100) * 81, 50 * i, 50, 50);
        contexto.drawImage(Grama, (canvas.width / 100) * 87, 50 * i, 50, 50);
        contexto.drawImage(Grama, (canvas.width / 100) * 93, 50 * i, 50, 50);
        contexto.drawImage(Grama, (canvas.width / 100) * 98, 50 * i, 50, 50);
    }


    //desenha a estrada
    for (var i = 0; i < 26; i++) {
        for (var j = 0; j < 500; j += 20) {
            contexto.beginPath()
            inicioW = (canvas.width / 100) * 18;
            fimW = (canvas.width / 100) * 63.7;
            inicioH = (canvas.height / 100) * 0;



            contexto.drawImage(Terra,
                0, 0, 25, 40,
                inicioW + (j), 25 * i, 25, 40);
        }
    }

}


function Player(xInit, yInit, width, height, Imagem) {
    this.xInit = xInit;
    this.yInit = yInit;
    this.width = width;
    this.height = height;
    this.Imagem = Imagem;

    this.desenhar = () => {
        this.desenhar = () => {
            contexto.beginPath();


            contexto.drawImage(this.Imagem, this.xInit, this.yInit, this.width, this.height);
        }

    }

    //codigo de colisão usado a partir do site:
    //https://alexandreaquiles.com.br/2016/03/17/criando-um-jogo-em-javascript-4/
    //esse foi o site que eu usei para iniciar meus conhecimentos com canvas, 
    //resto veio da apostilia da casa do código 

    this.batida = (inimigo) => {
        //Define as linhas vertical
        var Vertical = (this.xInit + this.width - 10) > inimigo.xInit &&
            this.xInit < (inimigo.xInit + inimigo.width - 10);

        //Define as linha horizontais
        var Horizontal = (this.yInit + this.height - 10) > inimigo.yInit &&
            this.yInit < (inimigo.yInit + inimigo.height - 10);


        if (Vertical && Horizontal) {
            return true
        }
    }

    this.mover = (xNovo, yNovo, mapaPos1, mapaPos2) => {
        //tratamento das bordas nas diagonais caso se mova numa borda extrema
        //diagonal esquerda-cima
        if ((((canvas.width / 100) * 18) < this.xInit && mapaPos1 == 0)
            && (canvas.height > (this.yInit + CarroPersonagem.height) && mapaPos2 == 3)) {
            this.xInit += xNovo;
            this.yInit += yNovo;
        }
        //diagonal direita-baixo
        else if ((((canvas.width / 100) * 75) > this.xInit && mapaPos1 == 2)
            && (0 < this.yInit && mapaPos2 == 1)) {

            this.xInit += xNovo;
            this.yInit += yNovo;
        }
        //diagonal esquerda-baixo
        else if ((((canvas.width / 100) * 18) < this.xInit && mapaPos1 == 0)
            && (0 < this.yInit && mapaPos2 == 1)) {

            this.xInit += xNovo;
            this.yInit += yNovo;
        }
        //diagonal direita-cima
        else if ((((canvas.width / 100) * 75) > this.xInit && mapaPos1 == 2)
            && (canvas.height > (this.yInit + CarroPersonagem.height) && mapaPos2 == 3)) {

            this.xInit += xNovo;
            this.yInit += yNovo;
        }
        //tratamento das bordas nas linhas retas
        //esquerda
        else if (((canvas.width / 100) * 18) < this.xInit && mapaPos1 == 0) {

            this.xInit += xNovo;
        }
        //direita
        else if (((canvas.width / 100) * 75) > this.xInit && mapaPos1 == 2) {

            this.xInit += xNovo;
        }
        //cima
        else if (canvas.height > (this.yInit + CarroPersonagem.height) && mapaPos1 == 3) {

            this.yInit += yNovo;
        }
        //baixo
        else if (0 < this.yInit && mapaPos1 == 1) {

            this.yInit += yNovo;
        }
    }
}

function cenario(xInit, yInit, width, height, imagem, velocidade) {
    this.xInit = xInit;
    this.yInit = yInit;
    this.width = width;
    this.height = height;
    this.imagem = imagem;
    this.velo = velocidade;
    this.desenhar = () => {
        contexto.beginPath();

        contexto.drawImage(this.imagem, this.xInit, this.yInit, this.width, this.height);
    }

    this.mover = (yNovo, velocidade) => {
        this.yInit += yNovo + velocidade;
    }


}

function obstaculo(xInit, yInit, width, height, Imagens, velocidade) {
    this.xInit = xInit;
    this.yInit = yInit;
    this.width = width;
    this.height = height;
    this.Imagens = Imagens;
    this.velo = velocidade;
    this.desenhar = () => {
        contexto.beginPath();

        contexto.drawImage(this.Imagens, this.xInit, this.yInit, this.width, this.height);
    }

    this.mover = (yNovo, velocidade) => {
        this.yInit += yNovo + velocidade;
    }


}

function Spawn(Imagens) {

    spawn = Math.floor(Math.random() * (((canvas.width / 100) * 75) - ((canvas.width / 100) * 17.8)) +
        ((canvas.width / 100) * 17.8));

    if (!paused) {
        inimigo.push(new obstaculo(spawn, -100, 40, 40,
            Imagens[Math.ceil(Math.random() * (Imagens.length - 2) - 1) + 1],
            -9));
    }

    setTimeout(function () { Spawn(Imagens); }, Spawn_Velo);
}


function anotaPlacar(pontuacao) {

    var pontosTexto = "00000";


    return ((pontosTexto.substring(0, (pontosTexto.length - pontuacao.toString().length)) + pontuacao));
}

function Jogar() {
    return setInterval(() => {

        pintaCampo();

        //atribui  valores ao placar
        pontos += 5;

        //move cada inimigo e verifica colisão
        //também some com inimigos fora da tela para evitar lag
        for (var i = 0; i < inimigo.length; i++) {
            if (inimigo[i].yInit >= 1000) {
                delete inimigo[i].yInit;
            }
            inimigo[i].mover(10, velocidade);
            inimigo[i].desenhar();

            //sequencia de explosão
            if (CarroPersonagem.batida(inimigo[i]) == true) {
                GameOver = true;
                setTimeout(() => {
                    contexto.drawImage(Imagens[9],
                        0, 0, 90, 98,
                        CarroPersonagem.xInit - 65, CarroPersonagem.yInit - 50, 190, 190);

                }, 90)

                setTimeout(() => {
                    pintaCampo();
                    CarroPersonagem.desenhar();

                    contexto.drawImage(Imagens[9],
                        100, 0, 90, 98,
                        CarroPersonagem.xInit - 65, CarroPersonagem.yInit - 50, 190, 190);
                }, 180)

                setTimeout(() => {
                    pintaCampo();
                    CarroPersonagem.desenhar();

                    contexto.drawImage(Imagens[9],
                        200, 0, 90, 98,
                        CarroPersonagem.xInit - 65, CarroPersonagem.yInit - 50, 190, 190);
                }, 270)

                setTimeout(() => {
                    pintaCampo();
                    CarroPersonagem.desenhar();

                    contexto.drawImage(Imagens[9],
                        300, 0, 90, 98,
                        CarroPersonagem.xInit - 65, CarroPersonagem.yInit - 50, 190, 190);

                }, 360)

                setTimeout(() => {
                    pintaCampo();
                    CarroPersonagem.desenhar();

                    contexto.drawImage(Imagens[9],
                        390, 0, 90, 98,
                        CarroPersonagem.xInit - 65, CarroPersonagem.yInit - 50, 190, 190);

                }, 450)

                setTimeout(() => {
                    pintaCampo();

                    contexto.drawImage(Imagens[9],
                        480, 0, 90, 98,
                        CarroPersonagem.xInit - 85, CarroPersonagem.yInit - 50, 190, 190);

                }, 530)

                setTimeout(() => {
                    pintaCampo();
                    contexto.drawImage(Imagens[9],
                        580, 0, 90, 98,
                        CarroPersonagem.xInit - 65, CarroPersonagem.yInit - 50, 190, 190);

                }, 620)

                setTimeout(() => {
                    pintaCampo();

                    contexto.drawImage(Imagens[9],
                        666, 0, 104, 98,
                        CarroPersonagem.xInit - 65, CarroPersonagem.yInit - 50, 190, 190);

                }, 710)

                setTimeout(() => {
                    pintaCampo();

                    contexto.drawImage(Imagens[9],
                        760, 0, 103, 98,
                        CarroPersonagem.xInit - 65, CarroPersonagem.yInit - 50, 190, 190);

                }, 800)

                setTimeout(() => {
                    pintaCampo();

                    contexto.drawImage(Imagens[9],
                        855, 0, 103, 98,
                        CarroPersonagem.xInit - 65, CarroPersonagem.yInit - 50, 190, 190);

                }, 890)

                setTimeout(() => {
                    pintaCampo();

                    contexto.drawImage(Imagens[9],
                        955, 0, 103, 98,
                        CarroPersonagem.xInit - 65, CarroPersonagem.yInit - 50, 190, 190);

                }, 980)

                setTimeout(() => {
                    pintaCampo();

                    contexto.drawImage(Imagens[9],
                        1050, 0, 105, 98,
                        CarroPersonagem.xInit - 65, CarroPersonagem.yInit - 50, 190, 190);

                }, 1070)

                setTimeout(() => {
                    pintaCampo();

                }, 1160)
                //som da explosão
                var audio = new Audio('./sound/batida-8bits.wav')
                audio.play();

                //para interatividade do jogo e animações
                clearInterval(Game);

                historico = gravarPontos(pontos, historico);

                setTimeout(() => {

                    contexto.fillStyle = "#ff9900";
                    contexto.strokeStyle = "black"
                    contexto.lineWidth = 5;
                    contexto.fillRect(90, 100, 590, 470);
                    contexto.strokeRect(90, 100, 590, 470);


                    contexto.font = "260px GameOver";
                    contexto.fillStyle = "red";
                    contexto.strokeStyle = "black"
                    contexto.textAlign = "center"
                    contexto.lineWidth = 3;
                    contexto.fillText("Game Over", (canvas.width / 2) - 20, canvas.height / 2 - 130);
                    contexto.strokeText("Game Over", (canvas.width / 2) - 20, canvas.height / 2 - 130);

                    contexto.save();

                    contexto.font = "130px GameOver"


                    contexto.lineWidth = 2.5;
                    for (const i in historico) {
                        if (historico[i] < pontos) {
                            contexto.fillText("Novo Recorde", (canvas.width / 2) - 20, (canvas.height / 2) - 50)
                            contexto.strokeText("Novo Recorde", (canvas.width / 2) - 20, (canvas.height / 2) - 50)
                            break;
                        }
                    }




                    contexto.fillStyle = "black";

                    contexto.fillText(anotaPlacar(pontos),
                        (canvas.width / 2) - 20, canvas.height / 2 + 30);


                    contexto.restore();

                    contexto.lineWidth = 2.5;


                    contexto.font = "130px GameOver";
                    contexto.fillText("Pressione a Tecla",
                        (canvas.width / 2) - 20, canvas.height / 2 + 150);
                    contexto.strokeText("Pressione a Tecla",
                        (canvas.width / 2) - 20, canvas.height / 2 + 150);

                    contexto.fillText("R para Recomeçar",
                        (canvas.width / 2) - 20, canvas.height / 2 + 220);
                    contexto.strokeText("R para Recomeçar",
                        (canvas.width / 2) - 20, canvas.height / 2 + 220);
                }, 1500);

                //se esse break não acontecer ele desenharia mas um ou mais obstaculos
                break;
            }
        }

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
        //os ultimos 4 if servem para leitura de direções retas
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
}

function IntervaloTempo() {
    return setInterval(() => {
        if (velocidade != 15) {
            velocidade += 0.25;

        }
        if (Spawn_Velo != 250) {
            Spawn_Velo -= 50;
        }
        if (velocidade == 15 && Spawn_Velo == 250) {
            clearInterval(Intervalo);
        }
        console.log(Spawn_Velo + " / " + velocidade)
    }, 1000)
}

function Pausar(tipo){
    if (!paused && GameOver == false) {
        var pause = new Audio();
        pause.src = './sound/smb_pause.wav'
        pause.play();


        clearInterval(Game);
        clearInterval(Intervalo);
        paused = true

        if(tipo == "teclado"){
            contexto.fillStyle = "#ff9900";
            contexto.strokeStyle = "black"
            contexto.lineWidth = 5;
            contexto.fillRect(200, 235, 408, 100);
            contexto.strokeRect(200, 235, 408, 100);

            contexto.font = "260px GameOver";
            contexto.fillStyle = "red";
            contexto.strokeStyle = "black"
            contexto.textAlign = "center"
            contexto.lineWidth = 3;
            
            contexto.fillText("Pausado", (canvas.width / 2), canvas.height / 2);
            contexto.strokeText("Pausado", (canvas.width / 2), canvas.height / 2);


        }else{
            contexto.fillStyle = "#ff9900";
            contexto.strokeStyle = "black"
            contexto.lineWidth = 5;
            contexto.fillRect(100, 40, 590, 550);
            contexto.strokeRect(100, 40, 590, 550);

            contexto.font = "210px GameOver";
            contexto.fillStyle = "red";
            contexto.strokeStyle = "black"
            contexto.textAlign = "center"
            contexto.lineWidth = 5;

            contexto.fillText("Ajuda", (canvas.width / 2)-5, canvas.height / 2 - 200);
            contexto.strokeText("Ajuda", (canvas.width / 2)-5, canvas.height / 2- 200);

            contexto.font = "130px GameOver";
            contexto.lineWidth = 2.5;

            contexto.fillText("A tecla R reinicia o jogo", (canvas.width / 2), canvas.height / 2 -50);
            contexto.strokeText("A tecla R reinicia o jogo", (canvas.width / 2), canvas.height / 2 -50);

            contexto.fillText("A tecla P pausa o jogo", (canvas.width / 2), canvas.height / 2 +25);
            contexto.strokeText("A tecla P pausa o jogo", (canvas.width / 2), canvas.height / 2 +25);

            contexto.fillText("A tecla M para musica", (canvas.width / 2), canvas.height / 2 +100);
            contexto.strokeText("A tecla M para musica", (canvas.width / 2), canvas.height / 2 +100);

            contexto.fillText("A tecla S para os sons", (canvas.width / 2), canvas.height / 2 +175);
            contexto.strokeText("A tecla S para os sons", (canvas.width / 2), canvas.height / 2 +175);





        }

    } else if (paused && GameOver == false) {
        Game = Jogar();
        Intervalo = IntervaloTempo();
        paused = false
    }
}