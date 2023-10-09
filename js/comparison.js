
var coluna1 = 
{
 //posso colocar aqui para ler os dados em csv do equipamento ligado
}

var coluna2 = 
{
//e com esse ver po equipamento desligado.
}

var obj1 = JSON.stringify(coluna1).replace(/{|}/g,"").split(",");
var obj2 =  JSON.stringify(coluna2).replace(/{|}/g,"").split(",");
var maior = Math.max(obj1.length, obj2.length);

for (var i= 0; i< maior ; i++)
{
    if(obj1.length > obj2.length)
    {
        if(obj1[i] != obj2[i] )
        {
            //pensando em colocar um padramento parecido para ver a diferença entre um objeto esta ligado e outro desligado
            //talvez aqui eu possa plotar o gráfico
            console.log("diferença ...."  + obj1[i].split(":"[0] + "entre os objetos"))
            break;
        }
        }
            else{
                    if(obj2[i] != obj1[i])
                    {
                        //talvez aqui eu possa plotar o gráfico
                        console.log("indice difente: " + obj2[i].split(":")[0] + "entre os objetos");
                        break;
                    }                    
                }
             
        
    }    
