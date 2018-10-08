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
var maximo = 0;

$(document).ready(function () {
    //recebe o canvas e o contexto
    canvas = document.getElementById("corrida-smn");
    contexto = canvas.getContext('2d');
    //Todas as imagens são sprite deu uso livre disponibilizadas no site https://opengameart.org
    //e os som do Site freeSound, que tambem são de livre uso
    //posição 0 nas imagens - Player
    //posição 1 a 7 imagens- Pedras
    //posição 8 nas imagens-toco de arvore
    //posicão 9- explosão
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
        //letra R
        if (event.which == 82) {
            location.reload();
        }
        //letra M
        if (event.which == 77) {

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


    var Game = setInterval(() => {
        pintaCampo();
        var i = 1;

        pontos += 5;
        desenhaPlacar();
        for (var i = 0; i < inimigo.length; i++) {
            if (inimigo[i].yInit >= 1200) {
                delete inimigo[i].yInit;
            }
            inimigo[i].mover(0, 10, velocidade);
            inimigo[i].desenhar();

            if (CarroPersonagem.batida(inimigo[i]) == true) {
                setInterval(() => {
                
                    if (i == 1) {
                        contexto.drawImage(Imagens[9],
                            0, 0, 90, 90,
                            CarroPersonagem.xInit, CarroPersonagem.yInit, 100, 100);
                    }else if( i < 13){
                        contexto.drawImage(Imagens[9],
                            96 * i, 96 * i, 96 * (i + 1), 96 * (i + 1),
                            CarroPersonagem.xInit, CarroPersonagem.yInit, 100, 100);
                    }
                    i+=1; 

                }, 250)

                var audio = new Audio('./sound/batida-8bits.wav')
                audio.play();
                clearInterval(Game);

                localStorage.setItem('maximo', pontos);
                // setTimeout(() => {
                //     contexto.fillStyle = "#ff9900";
                //     contexto.strokeStyle = "black"
                //     contexto.lineWidth = 5;
                //     contexto.fillRect(90, 100, 590, 470);
                //     contexto.strokeRect(90, 100, 590, 470);


                //     contexto.font = "260px GameOver";
                //     contexto.fillStyle = "red";
                //     contexto.strokeStyle = "black"
                //     contexto.textAlign = "center"
                //     contexto.lineWidth = 3;
                //     contexto.fillText("Game Over", (canvas.width / 2) - 20, canvas.height / 2 - 130);
                //     contexto.strokeText("Game Over", (canvas.width / 2) - 20, canvas.height / 2 - 130);

                //     contexto.save();

                //     contexto.fillStyle = "black";
                //     contexto.font = "130px GameOver"

                //     contexto.fillText(pontosTexto.substring(0, (pontosTexto.length - pontos.toString().length)) + pontos,
                //         (canvas.width / 2) - 20, canvas.height / 2);

                //     contexto.restore();
                //     contexto.lineWidth = 2.5;
                //     contexto.font = "130px GameOver";
                //     contexto.fillText("Pressione a Tecla",
                //         (canvas.width / 2) - 20, canvas.height / 2 + 150);
                //     contexto.strokeText("Pressione a Tecla",
                //         (canvas.width / 2) - 20, canvas.height / 2 + 150);

                //     contexto.fillText("R para Recomeçar",
                //         (canvas.width / 2) - 20, canvas.height / 2 + 220);
                //     contexto.strokeText("R para Recomeçar",
                //         (canvas.width / 2) - 20, canvas.height / 2 + 220);
                // }, 1000);

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

    var Intervalo = setInterval(() => {
        if (velocidade != 15) {
            velocidade += 0.25;

        }
        if (Spawn_Velo != 250) {
            Spawn_Velo -= 50;
        }
        if (velocidade == 15 && Spawn_Velo == 250) {
            clearInterval(Intervalo);
        }
    }, 1000)
})



function pintaCampo() {

    var inicioW;
    var fimW;

    //Pinta o fundo de verde
    contexto.beginPath();
    contexto.fillStyle = "green";
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    //desenha a estrada
    contexto.beginPath();
    contexto.fillStyle = "#802b00";
    inicioW = (canvas.width / 100) * 18;
    fimW = (canvas.width / 100) * 62;
    inicioH = (canvas.height / 100) * 0;

    contexto.fillRect(inicioW, 0, fimW, canvas.height);

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
        //marca a colisão da parte cima cruzando x e y,necessitando dos 2 juntos para identificar uma linha
        var colidiuNoXTopo = inimigo.xInit >= this.xInit && inimigo.xInit <= (this.xInit + this.width - 8);
        var colidiuNoYTopo = inimigo.yInit >= this.yInit && inimigo.yInit <= ((this.yInit - 25) + this.height);
        //o mesmo da parte da parte superior, os quatro juntos fexam um quadrado em torno do jogador
        //que detecta se ouve sobreposição de imagens em qualquer uma das posições
        var colidiuNoXBase = (inimigo.xInit + inimigo.width) >= this.xInit && (inimigo.xInit + inimigo.width) <= (this.xInit + this.width - 8);
        var colidiuNoYBase = (inimigo.yInit + inimigo.height) >= this.yInit && (inimigo.yInit + inimigo.height) <= (this.yInit - 25 + this.height);
        return (colidiuNoXTopo && colidiuNoYTopo) || (colidiuNoXBase && colidiuNoYBase);
        //a redução de pixeis na width do carro do jogador se da pela imagem do carro 
        //ter retrovisores externos,tornando bem mais dificil o jogo que deveria,
        //o contato com o retrovisor não é mais letal
        //
        //a redução na altura se da pela svg do carro ser um pouco maior que o carro em si
    }

    this.mover = (xNovo, yNovo, mapaPos1, mapaPos2) => {
        //tratamento das bordas nas diagonais caso se mova numa borda extrema
        //diagonal esquerda-cima
        if ((((canvas.width / 100) * 19.47) < this.xInit && mapaPos1 == 0)
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
        else if ((((canvas.width / 100) * 19.47) < this.xInit && mapaPos1 == 0)
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
        else if (((canvas.width / 100) * 19.47) < this.xInit && mapaPos1 == 0) {

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

    this.mover = (xNovo, yNovo, velocidade) => {
        this.xInit += xNovo;
        this.yInit += yNovo + velocidade;
    }


}

function Spawn(Imagens) {

    spawn = Math.floor(Math.random() * (((canvas.width / 100) * 75) - ((canvas.width / 100) * 19.47)) +
        ((canvas.width / 100) * 19.47));


    inimigo.push(new obstaculo(spawn, -100, 30, 30,
        Imagens[Math.ceil(Math.random() * (Imagens.length - 2) - 1) + 1],
        velocidade));

    setTimeout(function () { Spawn(Imagens); }, Spawn_Velo);
}

function desenhaPlacar() {


    contexto.beginPath();

    contexto.fillStyle = "black";

    contexto.fillRect(canvas.width - 125, 0, 150, 45);



    contexto.font = "40px Arial";
    contexto.fillStyle = "white";

    pontosTexto = "00000";

    contexto.fillText((pontosTexto.substring(0, (pontosTexto.length - pontos.toString().length)))
        + pontos, canvas.width - 120, 40);
}