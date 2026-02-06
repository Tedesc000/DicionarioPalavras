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
    let regex = /\b(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?\b/g;
    /* Expressão regular para encontrar números no formato brasileiro (ex: 1.000, 2.500, 3.14) e anos
    // /.../g               → delimitadores da expressão regular com flag global
    // \b                     → início do limite da palavra (evita pegar números colados em texto)
    // (?:                    → inicia grupo NÃO capturante principal
    //     \d+                → números inteiros simples (ex: 2024, 15000)
    //
    //     |                  → OU
    //
    //     \d{1,3}            → começa com 1 até 3 dígitos (ex: 1, 12, 999)
    //     (?:                → grupo não capturante para milhar
    //         \.             → ponto literal (separador de milhar)
    //         \d{3}          → exatamente 3 dígitos após o ponto
    //     )+                 → exige pelo menos um grupo ".000" (ex: 1.000, 10.000)
    // )
    // (?:                    → grupo não capturante para parte decimal
    //     ,\d+               → vírgula + números (decimal brasileiro: ,50 ,123)
    // )?                     → torna o decimal opcional
    // \b                     → fim do número (limite de palavra)
    // /g                     → flag global: encontra TODOS os números no texto
    */




    let numPalavras = texto.trim().match(/\b[^\d\W]+\b/gu)?.length || 0;
    /* Conta o número de palavras no texto usando match para encontrar palavras (\b[^\d\W]+\b), onde: 
    // \b delimita o início e fim da palavra
    // [^\d\W]+ corresponde a uma sequência de caracteres que não são dígitos (\d) nem caracteres não alfanuméricos (\W), ou seja, apenas letras
    // '+' indica uma ou mais ocorrências
    // 'u' habilita suporte a Unicode para considerar letras acentuadas
    , 'g' para busca global, trim() remove espaços extras no início e fim do texto, se não encontrar nada retorna 0*/
    let numNumeros = (texto.trim().match(regex) || []).length;// Conta o número de números no texto usando match para encontrar dígitos (\d+), 'g' para busca global, se não encontrar nada retorna array vazio

    let numFrases = (texto.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÀÂÊÔÃÕÇ])/)).length;
    // Conta o número de frases dividindo o texto em pontos finais, exclamações ou interrogações seguidos por um espaço e uma letra maiúscula (considerando acentuação). O split cria um array de frases e .length conta o número de elementos no array

    document.getElementById("numPalavras").textContent = `Número de palavras: ${numPalavras}`;
    document.getElementById("numNumeros").textContent = `Número de números: ${numNumeros}`;
    document.getElementById("numFrases").textContent = `Número de frases: ${numFrases}`;
    // Atualiza o conteúdo dos elementos HTML com os resultados calculados atraves de template strings

}
function selecionarPalavra() {
    const textarea = document.getElementById("texto"); // Captura o elemento textarea
    const resultado = document.getElementById("resultadoLink"); // Captura a div de saída

    let texto = textarea.value; // Pega somente o texto digitado, permitindo usar tanto como elemento quanto como string para manipulação
    let palavras = texto.trim().match(/\b[^\d\W]+\b/gu); // Extrai todas as palavras (ignorando números)

    for (let i = 0; i < palavras.length; i++) { // Percorre cada palavra encontrada
        let palavra = palavras[i]; // Palavra atual do loop
        // Cria um link que chama consultarDicionario e marcarPalavra ao clicar
        let palavraLink = `<a href="#" onclick=" marcarPalavra(this)">${palavra}</a>`;
        // Substitui todas as ocorrências da palavra pelo link
        texto = texto.replace(new RegExp(`\\b${palavra}\\b`, 'g'), palavraLink);
    }
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
        else{
            a.style.backgroundColor = "rgb(29, 61, 29)"; // Destaca a palavra clicada com fundo
        }
    });
}

