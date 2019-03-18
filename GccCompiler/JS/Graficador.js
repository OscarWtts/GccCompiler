const fs = require('fs');
const Nodo = require('./Nodo.js');

class Graficador{

    Graficar(cadena,cad){
        var nombre = cad;
        var archivo = nombre + ".dot";
        var contenido = "digraph G {\r\n node[shape=doublecircle, style=filled, color=khaki1, fontcolor=black]; \r\n";
        contenido += cadena;
        contenido += "\n}";

        var ruta = "./" + archivo;

        fs.writeFile(ruta,contenido, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
        //EN JAVASCRIPT POR MOTIVOS DE SEGURIDAD NO PUEDE EJCUTAR EL CMD PARA GRAFICAR 
        //ASI QUE LO HAGO MANUALMENTE DESDE MI ESCIRTORIO TENGO UN ARCHIVO.BAR CON EL NOMBRE DEL DOT
    }

    recorrido(raiz,id){//recorrido para graficar el arbol
        return Recorrido(raiz,id);

    }
}

var aux = 1;
function incremento()
{
    return aux++;
}

function Recorrido(raiz,id){
 
            var x;
            var cuerpo="";
            var cant = 0;
            cant = raiz.getHijos().length;
                   
            for(var i =0; i<cant; i++){
                var hijos = raiz.getHijos()[i];
                x = incremento();

                if(hijos.getEtiqueta() === "numero"){
                    cuerpo += "\""+id+"_" + raiz.getEtiqueta() + "\"->\""+x+"_"+hijos.getEtiqueta()+"="+hijos.getValor().toString()+"\"";
                }else{
                    cuerpo += "\""+id+"_" + raiz.getEtiqueta() + "\"->\""+x+"_"+hijos.getEtiqueta()+"\"";
                }
                
                cuerpo += Recorrido(hijos, x);            
            }
        return cuerpo; 
}
module.exports = Graficador;
    