$(document).ready(function () {
    cardapio.eventos.init();
})    

var cardapio = {};

var MEU_CARRINHO =[];

var VALOR_CARRINHO = 0;

var VALOR_ENTREGA = 5;

var MEU_ENDERECO = null;

var CELULAR_EMPRESA = '5511993758533'

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBotaoReserva();
        cardapio.metodos.carregarBotaoLigar();
        cardapio.metodos.carregarBotaoWhatssApp();
    }
}

cardapio.metodos = {

    // Obtem a lista de itens dos produtos
    obterItensCardapio: (categoria = 'chevron', vermais = false) => {

        var filtro = MENU[categoria];
        console.log(filtro);

        if(!vermais){

            $("#itensProduto").html('');
            $("#btnVermais").removeClass('hidden');
            
        }

        $.each(filtro, (i, e) => {

            let temp = cardapio.templates.item.replace(/\${img}/g,e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, e.id)
            
            // botão ver mais clicado
            if(vermais && i >= 4 && i < 30) {
                $("#itensProduto").append(temp)
            }

            // paginaçao inicial (4 itens)

            if(!vermais && i < 4){
                $("#itensProduto").append(temp)
            }

        })  

         // Remore ativos
        $(".container-menu a").removeClass('active');

         // Seta o menu para ativo
        $("#menu-" + categoria).addClass('active');

    },

    // clique no botão de ver mais
    vermais:() => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVermais").addClass('hidden');

    },

    // diminuir a quantidade de itens de produtos
    diminuirQuantidade:(id) =>{

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if(qntdAtual >0){

            $("#qntd-" + id).text(qntdAtual - 1)

        }

    },

    // aumentar a quantidade de itens de produtos
    aumentarQuantidade:(id) =>{

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)
    },

    //adicionar o produtos ao carrinho
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if(qntdAtual >0){

            // obter a categoria ativa

            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            // obtem a lista de itens

            let filtro = MENU[categoria];

            // obtem o item
            let item = $.grep(filtro,(e,i) => { return e.id == id});

            if(item.length > 0){

                // validar se ja existe o item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });
                
                // caso o já exista o item no carrinho, só altera a quantidade
                if(existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;

                }
                // caso ainda não exista o item no carrinho, adicionar ele
                else{
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }
                

                cardapio.metodos.mensagem('Item adicionado ao carrinho','green');

                $("#qntd-" + id).text(0)

                cardapio.metodos.atualizarBadgeTotal();
            }

        }

    },
    
    // atualiza o badge de totais dos botões "Meu Carrinho"
    atualizarBadgeTotal:() =>{

        var total =0;

        $.each(MEU_CARRINHO, (i, e) =>{
            total +=e.qntd
        })

        if(total > 0){
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }
        else{
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);
    },

    // chamando a tela(modal) do carrinho
    abrirCarrinho:(abrir) =>{
        if(abrir){
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho();
        }
        else{
            $("#modalCarrinho").addClass('hidden')
        }
    },
    // altera os textos e exibe os botões das etapas
    carregarEtapa: (etapa) =>{

        if(etapa == 1){
            $("#lblTituloEtapa").text('Seu Carrinho:');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');
        }
        if(etapa == 2){

            $("#lblTituloEtapa").text('Endereço de Entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');

        }
        if(etapa == 3){
            $("#lblTituloEtapa").text('Resumo do Pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }

    },

    // botão de voltar etapa
    voltarEtapa:() =>{

        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa-1);

    },

    // Carrega a lista de itens do carrinho
    carregarCarrinho:() =>{
        cardapio.metodos.carregarEtapa(1);

        if(MEU_CARRINHO.length > 0){

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) =>{

                let temp = cardapio.templates.itensCarrinho.replace(/\${img}/g,e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinho").append(temp);

                // ultimo item
                if((i+1) == MEU_CARRINHO.length){
                    cardapio.metodos.carregarValores();
                }

            })
        }
        else{
            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu carrinho está vazio.</p>');
            cardapio.metodos.carregarValores();
        }


    },

    // diminuir a quantidade de itens do carrinho
    diminuirQuantidadeCarrinho:(id) =>{

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if(qntdAtual > 1){

            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual -1);

        }
        else{
            
            cardapio.metodos.removerItenCarrinho(id)

        }

    },

    // aumentar a quantidade de itens do carrinho
    aumentarQuantidadeCarrinho:(id) =>{

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        $("#qntd-carrinho-" + id).text(qntdAtual + 1)
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1)

        // atualiza o botao carrinho com a quantidade total 
        cardapio.metodos.atualizarBadgeTotal();

    },

    // botão remover o item do carrinho
    removerItenCarrinho: (id) =>{

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id });
        cardapio.metodos.carregarCarrinho();

        cardapio.metodos.atualizarBadgeTotal();

    },

    // atualiza o carrinho com a quantidade atual
    atualizarCarrinho:(id, qntd) =>{

        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        // atualiza o botao carrinho com a quantidade total
        cardapio.metodos.atualizarBadgeTotal();

        // atualiza os valores totais do carrinho
        cardapio.metodos.carregarValores();

    },

    // carrega os valores de subTotal, entrega e total
    carregarValores:()=>{

        VALOR_CARRINHO = 0;

        $("#lblSubtotal").text('R$ 0,00');
        $("#lblvalorEntrega").text('+ R$ 0,00');
        $("#lblvalorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e)=> {

            VALOR_CARRINHO += parseFloat(e.price*e.qntd);    

            if((i + 1) == MEU_CARRINHO.length) {

                $("#lblSubtotal").text(`${VALOR_CARRINHO.toFixed(2).replace('.',',')}`);
                $("#lblvalorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.',',')}`);
                $("#lblvalorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.',',')}`);

            }

        })

    },

    // carregar a etapa endereço
    carregarEndereço: () =>{

        if(MEU_CARRINHO.length <= 0 ){
            cardapio.metodos.mensagem('Ops, Seu Carrinho ainda está Vazio!!')
            return;
        }

        cardapio.metodos.carregarEtapa(2);
    },

    buscarCep: () =>{

        // cria a variavel com o valor do cep
        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

        // verifica se o cep possui valor informado
        if(cep != ""){

            // expressão regular para validar o cep
            var validacep = /^[0-9]{8}$/;

            if(validacep.test(cep)){

                $.getJSON("https://viacep.com.br/ws/" + cep + "/json//?callback=?", function (dados){

                if(!("erro" in dados)){

                    // atualizar os campos com os valores retornados
                    $("#txtNome").val(dados.nome);
                    $("#txtEndereco").val(dados.logradouro);
                    $("#txtBairro").val(dados.bairro);                   
                    $("#txtCidade").val(dados.localidade);
                    $("#ddlUf").val(dados.uf);

                    $("#txtNumero").focus();
                }
                else{
                    cardapio.metodos.mensagem('Que pena, CEP não encontrado!!. Preencha as informações manualmente')
                    $("#txtEndereco").focus();
                }
                })

            }else{
                cardapio.metodos.mensagem('Ops, o formato do CEP inválido!!')
                $("#txtCEP").focus();
            }
        }

        else{
            cardapio.metodos.mensagem('Informe o CEP, Por favor')
            $("#txtCEP").focus();

        }
    },

    // validação antes de proceguir para etapa 3
    resumoPedido:()=>{

        let cep =$("#txtCEP").val().trim();
        let endereco =$("#txtEndereco").val().trim();
        let bairro =$("#txtBairro").val().trim();
        let cidade =$("#txtCidade").val().trim();
        let uf =$("#ddlUf").val().trim();
        let numero =$("#txtNumero").val().trim();
        let complemento =$("#txtComplemento").val().trim();

        if(cep.length <=0){
            cardapio.metodos.mensagem('Ops, Informe o cep Por Favor.')
            $("#txtCEP").focus();
            return;
        }

        if(endereco.length <=0){
            cardapio.metodos.mensagem('Ops, Informe o Endereço Por Favor.')
            $("#txtEndereco").focus();
            return;
        }

        if(bairro.length <=0){
            cardapio.metodos.mensagem('Ops, Informe o Bairro Por Favor.')
            $("#txtBairro").focus();
            return;
        }

        if(cidade.length <=0){
            cardapio.metodos.mensagem('Ops, Informe a Cidade Por Favor.')
            $("#txtCidade").focus();
            return;
        }

        if(uf.length == -1){
            cardapio.metodos.mensagem('Ops, Informe a UF Por Favor.')
            $("#ddlUf").focus();
            return;
        }

        if(numero.length <=0 ){
            cardapio.metodos.mensagem('Ops, Informe o Número Por Favor.')
            $("#txtNumero").focus();
            return;
        }

        MEU_ENDERECO = {

            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento:complemento,

        }

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();

    },

    // carrega ultima etapa do resumo do pedido
    carregarResumo: () =>{

        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) =>{

            let temp = cardapio.templates.itemResumo.replace(/\${img}/g,e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${qntd}/g, e.qntd)

            $("#listaItensResumo").append(temp);
        })

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`)
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf}/ ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`);
   
        cardapio.metodos.finalizarPedido();
    
    },

    // atualiza o link do botão do whatsApp
    finalizarPedido:()=>{

        if(MEU_CARRINHO.length >0 && MEU_ENDERECO !=null){

            var texto = "Ola! gostaria de fazer um pedido";
            texto +=`\n*Itens do pedido:*\n\n\${itens}`;
            texto +=`\n*Endereço de entrega:*`;
            texto +=`\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
            texto +=`\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf}/ ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`
            texto +=`\n\n*Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.',',')}*`;

            var itens = '';

            $.each(MEU_CARRINHO, (i, e) =>{

                itens +=`*${e.qntd}x* ${e.name} .......... R$ ${e.price.toFixed(2).replace('.',',')} \n`

                if((i+1) == MEU_CARRINHO.length){

                    texto = texto.replace(/\${itens}/g,itens);

                    console.log(texto)

                    // converte a url

                    let encode = encodeURI(texto);
                    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

                    $("#btnEtapaResumo").attr('href', URL);
                }

            

            })
        }

    },

    // carrega o link do botão reserva
    carregarBotaoReserva:() =>{
        var texto = "Olá! Gostaria de reservar uma hora com você!"

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnReserva").attr('href', URL);

    },

    //carrega o link do wattsapp
    carregarBotaoWhatssApp:() =>{

        var texto = "Olá! tudo bem? gostaria de mais detalhes sobre seus produtos!... Podemos conversar?"

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnChamaWhatsApp").attr('href', URL);

    },

    //carrega o link do wattsapp barra de baixo
    carregarBotaoWhatssApp2:() =>{

        var texto = "Olá! tudo bem? gostaria de mais detalhes sobre seu trabalho!... Podemos conversar?"

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnChamaWhatsApp2").attr('href', URL);

    },

    carregarBotaoWhatssApp3:() =>{

        var texto = "Olá! tudo bem? gostaria de mais detalhes sobre seu trabalho!..."

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnChamaWhatsApp3").attr('href', URL);

    },

    //carrega o botao ligar
    carregarBotaoLigar:()=>{
        $("#btnLigar").attr('href', `tel:${CELULAR_EMPRESA}`);
    },

    // abre o depoimento
    abrirDepoimento:(depoimento)=>{

        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');

        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');

        $("#depoimento-" + depoimento).removeClass('hidden');
        $("#btnDepoimento-" + depoimento).addClass('active'); 

    },

    // Mensagens ao usuario 
    mensagem:(texto, cor = 'red', tempo = 3500) => {

        let id= Math.floor(Date.now() *Math.random()).toString();

        let msg = `<div id="msg-${id}" class = " animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {

            $('#msg-' + id).removeClass('fadeInDown');
            $('#msg-' + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            },800);

        }, tempo)

    }

}

cardapio.templates = {

    item:`
        <div class="col-12 col-lg-3 col-md-3 col-sm6 mb-3 animated fadeInUp">
            <div class="card card-item" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}"/>
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${name}</b>
                </p>
                <p class="price-produto text-center">
                    <b>R$\${price}</b>
                </p>
                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                </div>
                
            </div>
        </div>
    `,

    itensCarrinho:`
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}"/>
            </div>
            
            <div class="dados-produto">
                <p class="title-produto"><b>\${name}</b></p>
                <p class="price-produto"><b>R$ \${price}</b></p>
            </div>

            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItenCarrinho('\${id}')"><i class="fa fa-times"></i></span>
            </div>
        </div>
    
    `,

    itemResumo:`

        <div class="col-12 item-carrinho resumo">
            <div class="img-produto-resumo">
                <img src="\${img}"/>
            </div>
            <div class="dados-produto">
                <p class="title-produto-resumo">
                    <b>\${name}</b>
                </p>
                <p class="price-produto-resumo">
                    <b>R$ \${price}</b>
                </p>
            </div>
            <p class="quantidade-produto-resumo">
                x<b>\${qntd}</b>
            </p>
        </div>
    `
}