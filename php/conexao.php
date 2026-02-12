<?php 
    //Dados do banco (parametros de conexao)
    $host = "localhost";
    $usuario = "root";
    $senha = "";
    $banco = "dicionario_db";

    //cria a conexao
    $conn = new mysqli($host, $usuario, $senha, $banco);

    //teste de erro
    if ($conn->connect_error) {
        die("Erro de conexao" . $conn->connect_error);
    }
?>