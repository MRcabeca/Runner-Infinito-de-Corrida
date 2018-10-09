$(document).ready(function(){
    setInterval(()=>{
        $("#numeros").text(anotaPlacar(pontos));
    },)


    $("#ajuda").click(function(){
        Pausar("button");
    })

    
})


function gravarPontos(pontos,historico){
    historico.push(pontos)

    historico = historico.sort((a,b)=>b - a)

    var ranking =$("#ranking li");

    historico = historico.slice(0,5)

    for(const i in historico){
        ranking[i].innerText = anotaPlacar(historico[i])
    }

    return historico
}

