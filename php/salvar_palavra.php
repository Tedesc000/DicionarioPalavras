<?php 
    //importa a conexao do conexao.php
    require_once "conexao.php";

    //verifica se a palavra veio por POST
    if (!isset($_POST['palavra']) || !isset($_POST['significado'])) {
        exit("Nenhuma palavra ou significado recebido");
    }

    //recebe a palavra enviada pelo js
    $palavra = trim($_POST['palavra']);
    $significado = trim($_POST['significado']);

    //consulta da palavra
    $sql = "SELECT id FROM palavras WHERE palavra = ?";
    //consulta ao banco, ? serve para entrar com o valor depois, adicionando seguranca
    $stmt = $conn->prepare($sql);
    //prepara a consulta que sera feita, o -> serve para acessar membros de um objeto, no caso o $conn
    $stmt->bind_param("s", $palavra);
    //liga o ? a palavra, s serve para string
    $stmt->execute();
    //executa a consulta

    $resultado = $stmt->get_result();
    //pega o resultado da consulta, nesse caso a quantidade de linhas que existem


    if ($resultado->num_rows === 0) {
        
        $sqlInsert = "INSERT INTO palavras (palavra, significado) VALUES (?, ?)";
        //usa outro stmt pois é um objeto statement diferente, neste caso de insert, e o que ja foi utilizado ja esta relacionado a outra consulta
        $stmtInsert = $conn->prepare($sqlInsert);
        $stmtInsert->bind_param("ss", $palavra,$significado);
        $stmtInsert->execute();

        echo "Palavra inserida com sucesso";
    }else {
        echo "Palavra ja existe";
    }
?>