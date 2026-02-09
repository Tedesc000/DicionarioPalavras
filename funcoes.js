/*FLUXO DA PAGINA 
.Usuario digita o texto na area de texto
.Usuário clica no botão "Calcular dados do texto"
.O sistema processa o texto e calcula:
.Número de palavras
.Número de números
.Número de frases
.O sistema exibe os resultados na seção "Dados do Texto"

-Fluxo dicionario
.usuario clica no botão "Selecionar Palavra"
.o sistema torna todo o texto em palavras com links clicaveis
.O usuário clica em uma palavra do texto
.o sistema captura a palavra clicada
.O sistema consulta o significado da palavra em um dicionário online a partir de uma API
.O sistema exibe o significado da palavra selecionada na seção "Resultado do Dicionário"
*/


function calcular() {
    let texto = document.getElementById("texto").value;
    let regex = /\b\d{4}\b|\b\d{1,3}(?:\.\d{3})+(?:,\d+)?\b|\b\d+(?:,\d+)?\b/g;
    //RegEx feito com IA para considerar decimais e anos, coise de mlc isso ai

    let numPalavras = texto.match(/\p{L}+/gu)?.length || 0;
    /* Conta o número de palavras no texto usando match para encontrar palavras (\b[^\d\W]+\b), onde: 
    // \b delimita o início e fim da palavra
    // [^\d\W]+ corresponde a uma sequência de caracteres que não são dígitos (\d) nem caracteres não alfanuméricos (\W), ou seja, apenas letras
    // '+' indica uma ou mais ocorrências
    // 'u' habilita suporte a Unicode para considerar letras acentuadas
    , 'g' para busca global, trim() remove espaços extras no início e fim do texto, se não encontrar nada retorna 0*/
    let numNumeros = (texto.trim().match(regex) || []).length;// Conta o número de números no texto usando match para encontrar dígitos (\d+), 'g' para busca global, se não encontrar nada retorna array vazio

    let frases = texto.trim().match(/[.!?]+/g) || [];
    let numFrases = frases.length;
    // Conta o número de frases encontrando occorrências de '.', '!' ou '?' no texto. O match retorna um array com cada fim de frase ou um array vazio se não houver nenhuma

    document.getElementById("numPalavras").textContent = `Número de palavras: ${numPalavras}`;
    document.getElementById("numNumeros").textContent = `Número de números: ${numNumeros}`;
    document.getElementById("numFrases").textContent = `Número de frases: ${numFrases}`;
    // Atualiza o conteúdo dos elementos HTML com os resultados calculados atraves de template strings

}


function selecionarPalavra() {
    document.getElementById("selecionarPalavra").style.display = "none";
    document.getElementById("voltarBtn").style.display = "block";

    const textarea = document.getElementById("texto"); // Captura o elemento textarea
    const resultado = document.getElementById("resultadoLink"); // Captura a div de saída

    let texto = textarea.value; // Pega somente o texto digitado, permitindo usar tanto como elemento quanto como string para manipulação

    texto = texto.replace(/\p{L}+/gu, palavra => {
        return `<a href="#" onclick="marcarPalavra(this); consultarDicionario('${palavra}')">${palavra}</a>`;
    });
    // Substitui cada palavra por um link clicável usando replace com uma função de callback, onde cada palavra encontrada é envolvida em uma tag <a> com um evento onclick que chama a função marcarPalavra passando o elemento clicado como argumento
    //anteriormente era usado for, mas isso fazia com que o texto fosse processado palavra por palavra, resultando em múltiplas substituições e perda do formato original. Com replace, o texto é processado de uma vez, mantendo a estrutura e formatando apenas as palavras.

    textarea.style.display = "none"; // Esconde o textarea após processar
    resultado.style.display = "block"; // Mostra a div com os links

    resultado.innerHTML = texto; // Insere o texto com links na div
}


function marcarPalavra(elemento) {
    // Limpa o destaque de todas as palavras antes de destacar a nova palavra clicada, usa o forEach para iterar sobre todos os links e resetar o estilo de fundo, sendo cada link o parâmetro 'a' que define seu estilo de fundo para vazio, removendo qualquer destaque anterior
    document.querySelectorAll("#resultadoLink a").forEach(a => {
        if (a.textContent !== elemento.textContent) { // Verifica se o link atual é diferente do clicado, se for diferente, remove o destaque, caso contrário, mantém o destaque para a palavra clicada
            a.style.background = "";
        }
        else {
            a.style.backgroundColor = "rgb(79, 137, 79)"; // Destaca a palavra clicada com fundo
            a.style.borderRadius = "5px";
            a.style.padding = "2px 5px";
        }
    });

    let exibirPalavra = document.getElementById("divPalavraSelecionada"); // Captura o elemento onde será exibida a palavra selecionada
    exibirPalavra.textContent = `${elemento.textContent}`; // Exibe a palavra clicada no elemento de saída


}

function voltarAreaTexto() {
    document.getElementById("selecionarPalavra").style.display = "block";
    document.getElementById("voltarBtn").style.display = "none";
    document.getElementById("resultadoLink").style.display = "none";
    document.getElementById("texto").style.display = "block";
}


//FUNCIONAMENTO DO DICIONARIO DO WIKTIONARY(dicionario online do mesmo grupo da Wikipedia)
/*.O usuario seleciona a palavra 
.O sistema faz requisicao HTTP para o Wikitionay, verificando se a palavra existe no banco
.O sistema pega o conteudo completo da pagina da palavra, filtrando somente o desejado (definicao, origem, etc), que e retornado em formato de wikitext, ou seja, um formato de texto com marcações especificas do Wiktionary
.O sistema exibe o resultado na seção "Resultado do Dicionário"
*/

async function consultarDicionario(palavra) {
    const url = `https://pt.wiktionary.org/w/api.php?action=query&titles=${encodeURIComponent(palavra)}&prop=extracts&format=json&origin=*`;
    // Monta a url para o Wiktionary, enviando a palavra selecionada, solicitando todo o conteudo da pagina e que retorne json
    const resposta = await fetch(url);//espera a resposta do fetch com a url
    const dados = await resposta.json();//converte o JSON recebido em objeto JavaScript

    const paginas = dados.query.pages;//solicita a pagina da palavra
    const paginaID = Object.keys(paginas)[0];//guarda o ID da pagina

    if (paginaID === "-1") {
        //verifica se o ID é igual a -1, significando que a palavra não existe no dicionário
        document.getElementById("textoDicionario").innerHTML = `<p>Palavra "${palavra}" não encontrada no dicionário.</p>`;
        return;
    }

    const conteudo = paginas[paginaID].extract;//extrai o conteudo HTML da pagina da palavra
    const conversor = new DOMParser();
    const documento = conversor.parseFromString(conteudo, "text/html");
    //Faz uma conversao da string retornada para DOM, de forma que os elementos como h2, p e li possam ser capturados como objetos da arvore

    const classe = documento.querySelector("h2").outerHTML;
    const descricao = documento.querySelector("p").outerHTML.trim();
    const significados = documento.querySelector("ol")?.outerHTML;
    //Captura os elementos da pagina da palavra, contendo os dados a serem exibidos no dicionario, utiliza o outerHTML para o elemento HTML vir junto


    console.log(conteudo);
    //Mostra no console todo o conteudo da pagina para futuras alteracoes
    document.getElementById("textoDicionario").innerHTML = classe + descricao + significados;
    //Junta os elementos buscados e os exibe na div do dicionario
}

function fecharPopUp(elemento) {
    document.getElementById(elemento).style.display = "none";
    document.getElementById("telaBlock").style.display = "none";

}

function abrirPopUp(elemento) {
    document.getElementById(elemento).style.display = "flex";
    document.getElementById("telaBlock").style.display = "flex";
}
