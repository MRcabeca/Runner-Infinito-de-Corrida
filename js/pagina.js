var audio = new Array()
var audioDuracao = new Array();

audio.push(new Audio("./sound/musica/deja vu.mp3"));
audio.push(new Audio("./sound/musica/don't stop the music.mp3"));
audio.push(new Audio("./sound/musica/get me power.mp3"));
audio.push(new Audio("./sound/musica/let's go, come on.mp3"));
audio.push(new Audio("./sound/musica/night fever.mp3"));
audio.push(new Audio("./sound/musica/night of fire.mp3"));
audio.push(new Audio("./sound/musica/rock me to the top.mp3"));
audio.push(new Audio("./sound/musica/saturday night fever.mp3"));
audio.push(new Audio("./sound/musica/speed car.mp3"));

var MusicaAtual = 0;
var VolumeAtual = 1;
var UltimoValor = 100;
var Random = false;
var Loop = false;
var duraSeg = 0;
var duraMin = 0;


$(document).ready(function () {

    //alterar para outra musica quando ela terminar(aleatóroia ou a proximam) 
    //ou recomeçar se estiver para repetir
    for (const i in audio) {
        audio[i].onended = () => {
            RadioSucessao();
        }

        audio[i].addEventListener('loadedmetadata', function () {
            audioDuracao.push(audio[i].duration);
        })
    }

    //tratamento pelo chrome não permitir autoplay
    $(document).click(function () {
        $(document).unbind('click');

        audio[MusicaAtual].play();
    })

    $(document).trigger('click')


    //mudar com clique do mouse
    $("#musicas li").click(function (e) {
        $("#musica" + (MusicaAtual + 1)).removeClass("musicaAtual")


        audio[MusicaAtual].pause();
        audio[MusicaAtual].currentTime = 0;
        MusicaAtual = parseInt($(this).attr('id').substring(6, 7)) - 1

        atualizaPainel(audioDuracao[MusicaAtual],'fim')
        audio[MusicaAtual].play();

        $("#musica" + (MusicaAtual + 1)).addClass("musicaAtual")
        $("#painel h2").text($("#musica" + (MusicaAtual + 1)).text())

    })

    setInterval(()=>{
        atualizaPainel(audio[MusicaAtual].currentTime,'atual');
            if($("#timer").focus() ==){ 
                $("#timer").val(audio[MusicaAtual].currentTime);
            }
            $("#timer").attr('max',audioDuracao[MusicaAtual])
    },1000)


    //pausar e continuar
    $("#Play").click(function () {
        if ($("#Play img").attr('src') == "img/Radio/baseline-play_arrow-24px.svg") {
            $("#Play img").attr('src', "img/Radio/baseline-pause-24px.svg")
            audio[MusicaAtual].play();
        } else {
            $("#Play img").attr('src', "img/Radio/baseline-play_arrow-24px.svg")
            audio[MusicaAtual].pause();
        }
    })
    //mutar e desmutar
    $("#Som").click(function () {
        if ($("#Som img").attr('src') == "img/Radio/baseline-volume_off-24px.svg") {
            audio[MusicaAtual].volume = VolumeAtual;
            $("#Som img").attr('src', "img/Radio/baseline-volume_up-24px.svg")
        } else {
            $("#Som img").attr('src', "img/Radio/baseline-volume_off-24px.svg")
            VolumeAtual = audio[MusicaAtual].volume
            audio[MusicaAtual].volume = 0;
        }
    })
    //por ou tirar seleção aleatória
    $("#Aleatoria").click(function () {
        if ($("#Aleatoria").hasClass("selecionado") == false) {
            $("#Aleatoria").addClass("selecionado")
            Random = true
            if (Loop) {
                $("#Repetir").trigger('click')
            }
        } else {
            $("#Aleatoria").removeClass("selecionado")
            Random = false
        }
    })
    //por para repetir musica atual ou remover repetição
    $("#Repetir").click(function () {
        if ($("#Repetir").hasClass("selecionado") == false) {
            $("#Repetir").addClass("selecionado")
            Loop = true

            //não faz sentido loop se for para repetir a musica
            if (Random) {
                $("#Aleatoria").trigger('click')
            }
        } else {
            $("#Repetir").removeClass("selecionado")
            Loop = false
        }
    })

    //avançar para próxima musica

    $("#Proxima").click(function () {
        if (Loop) {
            Loop = false;
            RadioSucessao();
            Loop = true;
        } else {
            RadioSucessao();
        }

    })

    //ir para a musica anterior

    $("#Anterior").click(function () {
        RadioAntecessao();
    })

    //slider de volume
    $("#slide").on('input', function () {
        $("#slide").trigger("blur")


        //tratamento quando tiver mutado o som por meio do volume e for desmutar pelo volume
        if (UltimoValor == 0 && $("#slide").val() != 0 &&
            $("#Som img").attr('src') == "img/Radio/baseline-volume_off-24px.svg") {
            $("#Som").trigger('click');
        }


        //tratamento para considerar o mute
        VolumeAtual = $("#slide").val() / 100;
        if ($("#Som img").attr('src') != "img/Radio/baseline-volume_off-24px.svg") {

            //muta se necessario e muda o volume
            if ($("#slide").val() == 0) {
                $("#Som img").attr('src', "img/Radio/baseline-volume_off-24px.svg")
            }
            audio[MusicaAtual].volume = VolumeAtual;
        }
        UltimoValor = $("#slide").val();
    })

    ////timer da musica
    $("#timer").on('change', function () {
            audio[MusicaAtual].currentTime = $("#timer").val() ;
            $("#timer").trigger("blur")
    })

    



    $("#Stop").click(function () {

    })


    setInterval(() => {
        $("#numeros").text(anotaPlacar(pontos));
    })


    $("#ajuda").click(function () {
        Pausar("button");
    })

})


function gravarPontos(pontos, historico) {
    historico.push(pontos)

    historico = historico.sort((a, b) => b - a)

    var ranking = $("#ranking li");

    historico = historico.slice(0, 5)

    for (const i in historico) {
        ranking[i].innerText = anotaPlacar(historico[i])
    }

    return historico
}

function RadioSucessao() {
    $("#musica" + (MusicaAtual + 1)).removeClass("musicaAtual")
    if (Loop) {
        audio[MusicaAtual].pause();
        audio[MusicaAtual].currentTime = 0;
        audio[MusicaAtual].play();
    }
    else if (Random) {
        var aux;
        do {
            aux = Math.floor(Math.random() * 9)
        } while (MusicaAtual == aux && aux != 9);

        audio[MusicaAtual].pause();
        audio[MusicaAtual].currentTime = 0;
        MusicaAtual = aux;
        audio[MusicaAtual].play();

    }
    else if (MusicaAtual == audio.length - 1) {
        audio[MusicaAtual].pause();
        audio[MusicaAtual].currentTime = 0;
        MusicaAtual = 0
        audio[MusicaAtual].play();
    } else {
        audio[MusicaAtual].pause();
        audio[MusicaAtual].currentTime = 0;
        MusicaAtual += 1;
        audio[MusicaAtual].play();
    }
    
    atualizaPainel(audioDuracao[MusicaAtual],'fim')
    $("#musica" + (MusicaAtual + 1)).addClass("musicaAtual")

}

function RadioAntecessao() {
    $("#musica" + (MusicaAtual + 1)).removeClass("musicaAtual")
    if (Random) {
        var aux;
        do {
            aux = Math.floor(Math.random() * 9)
        } while (MusicaAtual == aux && aux != 9);

        audio[MusicaAtual].pause();
        audio[MusicaAtual].currentTime = 0;
        MusicaAtual = aux;
        audio[MusicaAtual].play();

    }
    else if (MusicaAtual == 0) {
        audio[MusicaAtual].pause();
        audio[MusicaAtual].currentTime = 0;
        MusicaAtual = audio.length - 1
        audio[MusicaAtual].play();
    } else {
        audio[MusicaAtual].pause();
        audio[MusicaAtual].currentTime = 0;
        MusicaAtual -= 1;
        audio[MusicaAtual].play();
    }
    
    atualizaPainel(audioDuracao[MusicaAtual],'fim')
    $("#musica" + (MusicaAtual + 1)).addClass("musicaAtual")
}

function atualizaPainel(Numeros,id) {
    var m = duracao('m', Numeros)
    var s = duracao('s', Numeros)
    var formatseg = "00"
    var seg = formatseg.substring(0, (2 - s.toString().length))
    $("#"+id).text((m + ":" + seg + s));
}

function duracao(tempo, numero) {
    if (tempo == 's') {
        var M = Math.floor(numero / 60);
        var S = Math.floor(numero - M * 60);
        return S
    }
    if (tempo == 'm') {
        var M = Math.floor(numero / 60);
        return M
    }
}