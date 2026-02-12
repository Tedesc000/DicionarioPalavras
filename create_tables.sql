use dicionario_db

create table if not exists palavras(
	id int auto_increment primary key,-- banco gera o valor de id automaticamente
	palavra varchar(100) not null unique,-- obriga a coluna a sempre ter valor e evita registro de palavras iguais
	significado text not null,
	data_cadastro timestamp default CURRENT_TIMESTAMP()-- quando a palavra foi salva com datahora atual
);