Para fazer a adição de tasks em massa, adicionar na pasta: "src/tmp" um arquivo: "temp.csv"
com o seguinte formato:

título da task,descrição da task
título 01,descrição 01
título 02,descrição 02
título 03,descrição 03
título 04,descrição 04
título 05,descrição 05

Após isso, execute em outro terminal o comando: "npm run csv-parser", com o servidor já
instalado e inicializado.

OBS: Após o parser concluir sua operação, o arquivo da "src/tmp" será excluído!