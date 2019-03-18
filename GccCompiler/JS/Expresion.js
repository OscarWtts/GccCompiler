const NodoCuadruplo = require('./NodoCuadruplo.js');
const Nodo = require('./Nodo.js');
const Auxiliar = require('./Auxiliar.js');
const {Error, ObtenerVariable} = require('./clases2.js');

var errores = [];
var valNulo = -123456; 
var listaActual = null;
var StackSym = null;
var validarLlamada = false;

function inicializarErrores(){
    errores = [];
}

function obtenerErrores(){
    return errores;
}

function enviarListaActual(lista,Stack){
    listaActual = lista;
    StackSym = Stack;
}

function evaluarExp(nodo){
    
    var valNulo = -123456; 
    /*if(nodo.getHijos().length == 4)
    {
        switch(nodo.getHijos()[0].FindTokenAndGetText())
        {
            case con_decnum:
            {
                var temporal = llamada_getnum(nodo.getHijos()[1],nodo.getHijos()[2],nodo.getHijos()[3]);
                return new NodoCuadruplo(temporal + ' (temporal)','','','',"entero");
            }
        }
    }*/
    if(nodo.getHijos().length == 3)
    {
        /*if(nodo.getHijos()[0].FindTokenAndGetText() == con_innum)
        {
            var EtiquetaRetornar = llamada_inNum(nodo.getHijos()[1],nodo.getHijos()[2]);
            return new NodoCuadruplo(EtiquetaRetornar + ' (temporal)','','','',"entero");
        }*/
        var operador = nodo.getHijos()[1].getEtiqueta(); 
        var izq = null; 
        var der = null;

        switch(operador)
        {
            //Operaciones aritméticas.
            case '+': return evaluarMas(evaluarExp(nodo.getHijos()[0]),evaluarExp(nodo.getHijos()[2]));
            case '-': return evaluarMenos(evaluarExp(nodo.getHijos()[0]),evaluarExp(nodo.getHijos()[2]));
            case '*': return evaluarPor(evaluarExp(nodo.getHijos()[0]),evaluarExp(nodo.getHijos()[2]));
            case '/': return evaluarDiv(evaluarExp(nodo.getHijos()[0]),evaluarExp(nodo.getHijos()[2]));
            case '%': return evaluarMod(evaluarExp(nodo.getHijos()[0]),evaluarExp(nodo.getHijos()[2]));
            case '^': return evaluarPot(evaluarExp(nodo.getHijos()[0]),evaluarExp(nodo.getHijos()[2]));

             //Operacuibes Relacionales.
            case '==':  return evaluarIgual(evaluarExp(nodo.getHijos()[0]),evaluarExp(nodo.getHijos()[2]));
            case '!=':  return evaluarDiferente(evaluarExp(nodo.getHijos()[0]),evaluarExp(nodo.getHijos()[2]));
            case '<':   return evaluarMenor(evaluarExp(nodo.getHijos()[0]),evaluarExp(nodo.getHijos()[2]));
            case '>':   return evaluarMayor(evaluarExp(nodo.getHijos()[0]),evaluarExp(nodo.getHijos()[2]));
            case '<=':  return evaluarMenorIgual(evaluarExp(nodo.getHijos()[0]),evaluarExp(nodo.getHijos()[2]));
            case '>=':  return evaluarMayorIgual(evaluarExp(nodo.getHijos()[0]),evaluarExp(nodo.getHijos()[2]));

            //Operaciones Lógicas.
            case '&&':  return evaluarAnd(evaluarExp(nodo.getHijos()[0]),evaluarExp(nodo.getHijos()[2]));
            case '||':  return evaluarOr(evaluarExp(nodo.getHijos()[0]),evaluarExp(nodo.getHijos()[2]));
            case '??':  return evaluarXor(evaluarExp(nodo.getHijos()[0]),evaluarExp(nodo.getHijos()[2]));
        }
    }

    if(nodo.getHijos().length == 2)
    {
        
        var tipo = nodo.getHijos()[0].getEtiqueta();
        switch(tipo){
            //Expresiones logica
            case '-':
                var aux = new Nodo("numero","-1");
                var exp = new Nodo("exp",null);
                exp.addHijos(aux);
                return evaluarPor(evaluarExp(nodo.getHijos()[1]),evaluarExp(exp));
            case '!': 
                return evaluarNot(evaluarExp(nodo.getHijos()[1]));
            //Sin la funcion es invocada desde los atributos de un objeto
            case 'id':
                var nodoFuncion = nodo;

                var obtenerVar = new ObtenerVariable(nodoFuncion,[]);
                var [Valor,valorTipo] = retornarValor2(obtenerVar);

                
                var temporal = '';
                
                if(valorTipo == "(cadena)"){
                    temporal = Valor;
                } 
                else if(valorTipo == "(entero)" || valorTipo == "(bool)" || valorTipo == "(caracter)" || valorTipo == "(decimal)"){
                    temporal = Valor + ' (temporal)'; 
                } 
                else{
                    temporal = Valor + ' (temporal)';
                } 
                return new NodoCuadruplo(temporal,'','','',valorTipo);
            /*case con_decbool:
                {
                    var temporal = llamada_getbool(nodo.getHijos()[1]);
                    return new NodoCuadruplo(temporal + ' (temporal)','','','',"(bool)");
                }
            case con_declength:
                {
                    var Parametros = nodo.getHijos()[1];
                    if(Parametros.getHijos().length == 1)
                    {
                        var LargoCadena = llamada_lengthCadena(Parametros.getHijos()[0]);
                        return new NodoCuadruplo(LargoCadena + ' (temporal)','','','',"entero");
                    }
                    else
                    {
                        var LargoDimension = llamada_lengthArreglo(Parametros);
                        return new NodoCuadruplo(LargoDimension + ' (temporal)','','','',"entero");
                    }
                }
            default:
                if(nodo.getHijos()[0].Token == 'DEC_IDS')
                {
                    var ptnDimension = nodo.getHijos()[1];
                    if(ptnDimension.getHijos().length > 0)
                    {
                        var nodoId = nodo.getHijos()[0];
                        var ListaIndices = [];
                        for(var i = 0; i < ptnDimension.getHijos().length; i++)
                        {
                            var [Valor,valorTipo] = GenerarExpresion(ptnDimension.getHijos()[i]);
                            if(valorTipo == "entero"){
                                ListaIndices.push(Valor);
                            }
                        }
                        
                        var [Valor,valorTipo] = new ObtenerVariable(nodoId,ListaIndices).RetornarValor();
                        var temporal = '';
                        if(valorTipo == "cadena") temporal = Valor;
                        else if(valorTipo == "entero" || valorTipo == "(bool)") temporal = Valor + ' (temporal)';
                        return new NodoCuadruplo(temporal,'','','',valorTipo);
                    }
                    else
                    {
                        //Si viene un ID 
                        var nodoId = nodo.getHijos()[0];
                        var [Valor,valorTipo] = new ObtenerVariable(nodoId,[]).RetornarValor();
                        var temporal = '';
                        
                        if(valorTipo == "cadena") temporal = Valor;
                        else if(valorTipo == "entero" || valorTipo == "(bool)") temporal = Valor + ' (temporal)';
                        else temporal = Valor + ' (temporal)';
                        
                        return new NodoCuadruplo(temporal,'','','',valorTipo);
                    }
                }*/
        }
    }

    if(nodo.getHijos().length == 1)
    {
        var termino = nodo.getHijos()[0].getEtiqueta();
            
        switch(termino.toLowerCase()){
            case "exp":     return evaluarExp(nodo.getHijos()[0]);
            case "fun_cast": 
                
                var tipo_casteo = nodo.getHijos()[0].getHijos()[0].getEtiqueta();
                if(tipo_casteo == 'a_cadena'){
                    return evaluarExp(nodo.getHijos()[0].getHijos()[0]);
                    
                }
            case "fun_obtener_dir":
          
                var nodoId = nodo.getHijos()[0].getHijos()[0];

                var obtenerVar = new ObtenerVariable(nodoId,[]);
                var [Valor,valorTipo,ubicacionPuntero] = retornarValor3(obtenerVar);

                var temporal = '';
                
                if(valorTipo == "(cadena)"){
                    temporal = Valor;
                } 
                else if(valorTipo == "(entero)" || valorTipo == "(bool)" || valorTipo == "(caracter)" || valorTipo == "(decimal)"){
                    temporal = Valor + ' (temporal)'; 
                } 
                else{
                    temporal = Valor + ' (temporal)';
                } 
                //revisar porque viene un array
                return new NodoCuadruplo(temporal,'','','',valorTipo,ubicacionPuntero);
            
            case "fun_reservar_mem":
                
                var valorRet = '';
                var expGenerada = evaluarExp(nodo.getHijos()[0].getHijos()[0]);
                if(expGenerada.valorTipo == "(entero)"){

                    if(Auxiliar.obtenerTipo(expGenerada.cadena) == "(entero)")
                    {
                        valorRet = Auxiliar.obtenerToken(expGenerada.cadena);
                    }
                    else if(Auxiliar.obtenerTipo(expGenerada.cadena) == '(temporal)')
                    {
                        Auxiliar.agregarCuadruplo(expGenerada.sentencia);
                        valorRet = Auxiliar.obtenerToken(expGenerada.cadena);
                    }
                    var temp = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo(temp + ' = H;    //Pos inicio memoria reservada');
                    Auxiliar.agregarCuadruplo('H = H + '+ valorRet + '; //reservamos espacio memoria \n');
                    return new NodoCuadruplo(temp +' (temporal)','','','',expGenerada.valorTipo);
                }else{
                    var error = new Error(0,'Semántico','Para valor para reservar memoria debe ser entero.');
                    errores.push(error);
                    return new NodoCuadruplo('0','','','',"(null)");
                }
            case "fun_consultar_mem":
            debugger;
                var nombreEstrcutura = nodo.getHijos()[0].getHijos()[0].getValor();
                var existe = false;
                var tamanio = 0;
                for(var o =0; o<listaActual.ListaObjetos[0].listContenido.length;o++){
                    if(nombreEstrcutura == listaActual.ListaObjetos[0].listContenido[o].nombreSimbolo)
                    {
                        if(listaActual.ListaObjetos[0].listContenido[o].tipo == '(estructura)'){
                            tamanio = listaActual.ListaObjetos[0].listContenido[o].ListaObjetos.length;
                            return new NodoCuadruplo(tamanio +' (entero)','','','','(entero)');
                        }
                    }
                }

                if(!existe){
                    for(var k = 0; k<StackSym.length; k++){
                        if(StackSym[k].nombreSimbolo == nombreEstrcutura){
                            if(StackSym[k].tipo == '(estructura)'){
                                tamanio = StackSym[k].ListaObjetos.length;
                                return new NodoCuadruplo(tamanio +' (entero)','','','','(entero)');
                            }
                            else if(StackSym[k].isClase){
                                tamanio = StackSym[k].ListaObjetos[0].listContenido.length;
                                return new NodoCuadruplo(tamanio +' (entero)','','','','(entero)');
                            }
                        }
                    }
                }
                return new NodoCuadruplo(0 +' (null)','','','','(null)');
            case "id":   
                debugger;
                var nodoId = nodo.getHijos()[0];

                var obtenerVar = new ObtenerVariable(nodoId,[]);
                var [Valor,valorTipo] = retornarValor(obtenerVar);

                var temporal = '';
                
                if(valorTipo == "(cadena)"){
                    temporal = Valor;
                } 
                else if(valorTipo == "(entero)" || valorTipo == "(bool)" || valorTipo == "(caracter)" || valorTipo == "(decimal)"){
                    temporal = Valor + ' (temporal)'; 
                } 
                else{
                    temporal = Valor + ' (temporal)';
                } 
                //revisar porque viene un array
                return new NodoCuadruplo(temporal,'','','',valorTipo);
            case "funcion":
                
                var nodoFuncion = nodo.getHijos()[0];

                var obtenerVar = new ObtenerVariable(nodoFuncion,[]);
                var [Valor,valorTipo] = retornarValor2(obtenerVar);

                var temporal = '';
                
                if(valorTipo == "(cadena)"){
                    temporal = Valor;
                } 
                else if(valorTipo == "(entero)" || valorTipo == "(bool)" || valorTipo == "(caracter)" || valorTipo == "(decimal)"){
                    temporal = Valor + ' (temporal)'; 
                } 
                else{
                    temporal = Valor + ' (temporal)';
                } 
                return new NodoCuadruplo(temporal,'','','',valorTipo);
            case "arreglo": 
                var nodoArreglo = nodo.getHijos()[0];
                var ptnDimension = nodoArreglo.getHijos()[1];
                if(ptnDimension.getHijos().length > 0)
                {
                    var ptnId = nodoArreglo;
                    var ListaIndices = [];
                    for(var i = 0; i < ptnDimension.getHijos().length; i++)
                    {
                        var [Valor,valorTipo] = generarExpresion(ptnDimension.getHijos()[i]);
                        if(valorTipo == "(entero)"){
                            ListaIndices.push(Valor);
                        }
                    }
                    var obtenerVar = new ObtenerVariable(ptnId,ListaIndices);
                    var [Valor,valorTipo] = retornarValor(obtenerVar);

                    if(valorTipo == "(cadena)"){
                        temporal = Valor;
                    } 
                    else if(valorTipo == "(entero)" || valorTipo == "(bool)" || valorTipo == "(caracter)" || valorTipo == "(decimal)"){
                        temporal = Valor + ' (temporal)'; 
                    } 
                    else{
                        temporal = Valor + ' (temporal)';
                    } 

                    return new NodoCuadruplo(temporal,'','','',valorTipo);
                }

            case "objeto" : 
            
                var nodoObjeto = nodo.getHijos()[0];

                var obtenerVar = new ObtenerVariable(nodoObjeto,[]);
                var [Valor,valorTipo] = retornarValor(obtenerVar);

                if(valorTipo == "(cadena)"){
                    temporal = Valor;
                } 
                else if(valorTipo == "(entero)" || valorTipo == "(bool)" || valorTipo == "(caracter)" || valorTipo == "(decimal)"){
                    temporal = Valor + ' (temporal)'; 
                } 
                else{
                    temporal = Valor + ' (temporal)';
                } 

                return new NodoCuadruplo(temporal,'','','',valorTipo);
                

            case "true":    return  new NodoCuadruplo('1' + ' (bool)','','','',"(bool)");
            case "false":   return  new NodoCuadruplo('0' + ' (bool)','','','',"(bool)");
            case "null":    return  new NodoCuadruplo(valNulo,'','','',"(null)");
            case "numero":  var valor = nodo.getHijos()[0].getValor();
                            if(valor.includes("."))
                                return new NodoCuadruplo(valor + ' (decimal)','','','','(decimal)');
                            else
                                return new NodoCuadruplo(valor + ' (entero)','','','','(entero)');
            case "instancia": return  new NodoCuadruplo(valNulo,'','','',"(null)");
            case "char_cad": 
                var cadena = nodo.getHijos()[0].getValor().replace(/\"/g,"").replace(/\'/g,"");
                return  new NodoCuadruplo(cadena.charCodeAt(0) + ' (caracter)','','','',"(caracter)");
            case "string_cad":
                var cadena = nodo.getHijos()[0].getValor().replace(/\"/g,"").replace(/\'/g,"");
                var posicion = 0;
                var temporal = '';
                var escape = false;
                Auxiliar.agregarCuadruplo('//****************************************');
                Auxiliar.agregarCuadruplo('//puntero h posicion actual:' + Auxiliar.getPunteroH());
                Auxiliar.agregarCuadruplo('//Inicio de cadena: \"' + cadena + '\"' );

                for(var i = 0; i < cadena.length; i++){
                    
                    if(cadena[i] == '\\' && !escape)
                    {
                        escape = true;
                        posicion = i;
                    }
                    else if(escape)
                    {
                        var TipoCaracterEspecial = cadena[i];
                        temporal = Auxiliar.getTemp();
                        Auxiliar.agregarCuadruplo(temporal + ' = H + ' + i + ';');
                        switch(TipoCaracterEspecial)
                        {
                            case 'n': Auxiliar.agregarCuadruplo('heap[' + temporal + '] = ' + 10 + '; //Codigo ascii de caracter \\n ');
                                break;
                            case '\\': Auxiliar.agregarCuadruplo('heap[' + temporal + '] = ' + 92 + '; //Codigo ascii de caracter \ ');
                                break;
                            case 't': Auxiliar.agregarCuadruplo('heap[' + temporal + '] = ' + 9 + '; //Codigo ascii de caracter \\t ');
                                break;
                        }
                        posicion = i;
                        escape = false;
                    }
                    else
                    {
                        temporal = Auxiliar.getTemp();
                        Auxiliar.agregarCuadruplo(temporal + ' = H + ' + i + ';');
                        Auxiliar.agregarCuadruplo('heap[' + temporal + '] = ' + cadena.charCodeAt(i) + '; //Codigo ascii de caracter ' + cadena.charAt(i) + '');
                        posicion = i;
                    }
                }


                temporal = Auxiliar.getTemp(); posicion++;
                Auxiliar.agregarCuadruplo(temporal + ' = H + ' + posicion + ';');
                Auxiliar.agregarCuadruplo('heap[' + temporal + '] = 0; //Fin de la cadena \n');
                temporal = Auxiliar.getTemp(); posicion++; 
                Auxiliar.agregarCuadruplo(temporal + ' = H; //Posicion del inicio de la cadena "' + cadena + '"'); 
                Auxiliar.agregarCuadruplo('H = H + ' + posicion + ';');
                Auxiliar.aumPunteroH_en(posicion);
                Auxiliar.agregarCuadruplo('//***************************************\n');
                    
                return  new NodoCuadruplo(temporal,'','','',"(cadena)");
        }   
    }
}

function retornarValor(variable){
    debugger;
    var aux = variable.nodoId.getEtiqueta();
    var nombre = '';
    
    if(aux == 'id'){
        nombre = variable.nodoId.getValor();
    }   
    else{
        nombre = variable.nodoId.getHijos()[0].getValor();
    }
    
    var [Existe,Valor,valorTipo] = obtenerValGeneral(variable.nodoId,variable.Dimensiones,nombre);
        console.log('existe: ' + Existe);
    if(!Existe)
    {
        var error = new Error(0,'Semántico','El simbolo ' + variable.nodoId.getValor() + ' no existe.');
        errores.push(error);
    }
    return [Valor,valorTipo];
}

function retornarValor2(variable){
    
    var [Existe,Valor,valorTipo] = obtenerValGeneral2(variable.nodoId,variable.Dimensiones,variable.nodoId.getHijos()[0].getValor());
        console.log('existe: ' + Existe);
    if(!Existe)
    {
        var error = new Error(0,'Semántico','El metodo ' + variable.nodoId.getHijos()[0].getValor() + ' no existe.');
        errores.push(error);
    }
    return [Valor,valorTipo];
}

function retornarValor3(variable){
    var aux = variable.nodoId.getEtiqueta();
    var nombre = '';
    
    if(aux == 'id'){
        nombre = variable.nodoId.getValor();
    }   
    else{
        nombre = variable.nodoId.getHijos()[0].getValor();
    }
    
    var [Existe,Valor,valorTipo,ubicacionPuntero] = obtenerValGeneral3(variable.nodoId,variable.Dimensiones,nombre);
        console.log('existe: ' + Existe);
    if(!Existe)
    {
        var error = new Error(0,'Semántico','El simbolo ' + variable.nodoId.getValor() + ' no existe.');
        errores.push(error);
    }
    return [Valor,valorTipo,ubicacionPuntero];
}

function obtenerValGeneral(nodoId,Dimensiones,strNombreVariableInicial){
    
    var Existe = false;
    var Valor = valNulo;
    var valorTipo = '';

    console.log('revisando ----------');
    console.log(listaActual.ListaObjetos[0].listContenido);
    for(var i = listaActual.ListaObjetos.length - 1; i >= 0; i--)
    {
        console.log(listaActual.ListaObjetos[i].Ambito);
        if(listaActual.ListaObjetos[i].Ambito == "metodo" || listaActual.ListaObjetos[i].Ambito == "funcion")
        {
            if(listaActual.ListaObjetos[i].existeSimbolo(strNombreVariableInicial))
            {
                [Existe,Valor,valorTipo] = listaActual.ListaObjetos[i].obtenerValGeneralSym(nodoId,Dimensiones,listaActual.ListaObjetos[i].listContenido,0,false,StackSym,listaActual);
                break;
            }
            console.log('no lo encontro en el metodo');
            [Existe,Valor,valorTipo] = listaActual.ListaObjetos[0].obtenerValGeneralSym(nodoId,Dimensiones,listaActual.ListaObjetos[0].listContenido,0,true,StackSym,listaActual);
            break;
        }
        else
        {
            if(listaActual.ListaObjetos[i].existeSimbolo(strNombreVariableInicial))
            {
                [Existe,Valor,valorTipo] = listaActual.ListaObjetos[i].obtenerValGeneralSym(nodoId,Dimensiones,listaActual.ListaObjetos[i].listContenido,0,false,StackSym,listaActual);
                break;
            }
        }
    }
    
    return [Existe,Valor,valorTipo];
}

function obtenerValGeneral2(nodoFuncion,Dimensiones,strNombreVariableInicial){
    
    var Existe = false;
    var Valor = valNulo;
    var valorTipo = '';
    var isThis = "";
    var lis;
    var nodo; 
    var cont;

    var ptnParametros = nodoFuncion.getHijos()[1];
        var ListaParametros = [];

    var cant = ptnParametros.getHijos().length;
    for(h = 0; h < cant; h++){
        var [Valor2,TipoValor2] = generarExpresion(ptnParametros.getHijos()[h]);
        ListaParametros.push([Valor2,TipoValor2]);
    }
    
    
    console.log('revisando ----------');
    console.log(listaActual.ListaObjetos);
    for(var i = listaActual.ListaObjetos.length - 1; i >= 0; i--)
    {
        if(listaActual.ListaObjetos[i].Ambito == "metodo" || listaActual.ListaObjetos[i].Ambito == "funcion")
        {
            if(listaActual.ListaObjetos[i].existeSimbolo(strNombreVariableInicial))
            {
                [Existe,lis,nodo,cont,isThis] = listaActual.ListaObjetos[i].obtenerValGeneralSym2(nodoFuncion,Dimensiones,listaActual.ListaObjetos[i].listContenido,0,false,ListaParametros);
                if(!Existe){
                    return [Existe,Valor,valorTipo];
                }
                [Valor,valorTipo] = InvocarFuncion(lis,nodo,cont,isThis);
                break;
            }
            console.log('no lo encontro en el metodo');
            console.log(listaActual.ListaObjetos[0]);
            [Existe,lis,nodo,cont,isThis] = listaActual.ListaObjetos[0].obtenerValGeneralSym2(nodoFuncion,Dimensiones,listaActual.ListaObjetos[0].listContenido,0,true,ListaParametros);
            if(!Existe){
                return [Existe,Valor,valorTipo];
            }
            [Valor,valorTipo] = InvocarFuncion(lis,nodo,cont,isThis);
            break;
        }
        else
        {
            if(listaActual.ListaObjetos[i].existeSimbolo(strNombreVariableInicial))
            {
                [Existe,lis,nodo,cont,isThis] = listaActual.ListaObjetos[i].obtenerValGeneralSym2(nodoFuncion,Dimensiones,listaActual.ListaObjetos[i].listContenido,0,false,ListaParametros);
                if(!Existe){
                    return [Existe,Valor,valorTipo];
                }
                [Valor,valorTipo] = InvocarFuncion(lis,nodo,cont,isThis);
                break;
            }
        }
    }
    
    return [Existe,Valor,valorTipo];
}

function obtenerValGeneral3(nodoId,Dimensiones,strNombreVariableInicial){
    
    var Existe = false;
    var Valor = valNulo;
    var valorTipo = '';

    console.log('revisando ----------');
    console.log(listaActual.ListaObjetos[0].listContenido);
    for(var i = listaActual.ListaObjetos.length - 1; i >= 0; i--)
    {
        console.log(listaActual.ListaObjetos[i].Ambito);
        if(listaActual.ListaObjetos[i].Ambito == "metodo" || listaActual.ListaObjetos[i].Ambito == "funcion")
        {
            if(listaActual.ListaObjetos[i].existeSimbolo(strNombreVariableInicial))
            {
                [Existe,Valor,valorTipo,ubicacionPuntero] = listaActual.ListaObjetos[i].obtenerValGeneralSym3(nodoId,Dimensiones,listaActual.ListaObjetos[i].listContenido,0,false,StackSym,listaActual);
                break;
            }
            console.log('no lo encontro en el metodo');
            [Existe,Valor,valorTipo,ubicacionPuntero] = listaActual.ListaObjetos[0].obtenerValGeneralSym3(nodoId,Dimensiones,listaActual.ListaObjetos[0].listContenido,0,true,StackSym,listaActual);
            break;
        }
        else
        {
            if(listaActual.ListaObjetos[i].existeSimbolo(strNombreVariableInicial))
            {
                [Existe,Valor,valorTipo,ubicacionPuntero] = listaActual.ListaObjetos[i].obtenerValGeneralSym3(nodoId,Dimensiones,listaActual.ListaObjetos[i].listContenido,0,false,StackSym,listaActual);
                break;
            }
        }
    }
    
    return [Existe,Valor,valorTipo,ubicacionPuntero];
}

function InvocarFuncion(Lista,nodoFuncion,i,isThis){
    
    var strTipoRetorno = Lista[i].tipo;
    var strNombreMetodo = "call " + Lista[i].nombreClase.toLowerCase() + "@" + Lista[i].nombreSimbolo;
    var Tamanio = Lista[i].Posicion;
    var ValorRetorno = valNulo;

    var ListaParametros = [];
    var ptnParametros = nodoFuncion.getHijos()[1];
    
    try
    {
        for(var j = 0; j < ptnParametros.getHijos().length; j++){
            var [Valor,valorTipo] = generarExpresion(ptnParametros.getHijos()[j]);
            ListaParametros.push([Valor,valorTipo]);

            strNombreMetodo += "@" + valorTipo.replace("(","").replace(")","");
        }

        
        var CambioAmbito = obtenerPosicion2(false) + 2;

        var posThis = Auxiliar.getTemp();
        var valThis = Auxiliar.getTemp();
        var posRelativaThis = Auxiliar.getTemp();
        var posRelativaReturn = Auxiliar.getTemp();

        Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
        Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This \n');
    
        Auxiliar.agregarCuadruplo('S = S + ' + CambioAmbito + ';');

        Auxiliar.agregarCuadruplo(posRelativaThis + ' = S + 0;      //Pos del this en nuevo ambito');

        if(isThis != ""){
            valThis = isThis;
        }

        Auxiliar.agregarCuadruplo('stack[' + posRelativaThis + '] = ' + valThis + ';    //Guardamos el this. \n');

        for(var j = 0; j < ptnParametros.getHijos().length; j++){
            if(ListaParametros[j][1] == "(cadena)")
            {
                var temporal = Auxiliar.getTemp();
                var temporal2 = Auxiliar.getTemp();

               /* Auxiliar.agregarCuadruplo(temporal + ' = S + ' + (j + 2).toString() + ';  ');
                Auxiliar.agregarCuadruplo('stack[' + temporal + '] = H;');
                Auxiliar.agregarCuadruplo('H = H + 1;\n');*/
                Auxiliar.agregarCuadruplo(temporal2 + ' = S + ' + (j + 2).toString() + ';  ');
                temporal = Auxiliar.getTemp(); 
               // Auxiliar.agregarCuadruplo(temporal  + ' = stack[' + temporal2 + ']; //Asignando parametro. ');
                Auxiliar.agregarCuadruplo('stack[' + temporal2 + '] = ' + ListaParametros[j][0] + '; //Asignando parametro. \n');
            }
            else
            {
                var temporal = Auxiliar.getTemp();
                Auxiliar.agregarCuadruplo(temporal + ' = S + ' + (j + 2).toString() + ';  ');
                Auxiliar.agregarCuadruplo('stack[' + temporal + '] = ' + ListaParametros[j][0] + '; //Asignando parametro. \n');
            }
        }
            
        //AgregarSimbolo(strNombreMetodo,strTipoRetorno,'Global','Función',0);
        
        if(strTipoRetorno == "(cadena)"){
            Auxiliar.agregarCuadruplo(strNombreMetodo + '();');
            ValorRetorno = Auxiliar.getTemp();
            Auxiliar.agregarCuadruplo(posRelativaReturn + ' = S + 1;      //Pos del return en nuevo ambito');
            Auxiliar.agregarCuadruplo(ValorRetorno + ' = stack['+ posRelativaReturn +']; //Retornando valor. ');
            Auxiliar.agregarCuadruplo('S = S - ' + CambioAmbito + ';\n');        
        }
        else if(strTipoRetorno == '(vacio)'){
            if(validarLlamada){
                Auxiliar.agregarCuadruplo(strNombreMetodo + '();');
                ValorRetorno = Auxiliar.getTemp();
                Auxiliar.agregarCuadruplo(posRelativaReturn + ' = S + 1;      //Pos del return en nuevo ambito');
                Auxiliar.agregarCuadruplo(ValorRetorno + ' = stack['+ posRelativaReturn +']; //Retornando valor. ');
                Auxiliar.agregarCuadruplo('S = S - ' + CambioAmbito + ';\n');
                validarLlamada = false;
            }
            else{
                Auxiliar.agregarCuadruplo(strNombreMetodo + '();');
                ValorRetorno = Auxiliar.getTemp();
                Auxiliar.agregarCuadruplo(posRelativaReturn + ' = S + 1;      //Pos del return en nuevo ambito');
                Auxiliar.agregarCuadruplo(ValorRetorno + ' = stack['+ posRelativaReturn +']; //Retornando valor. ');
                Auxiliar.agregarCuadruplo('S = S - ' + CambioAmbito + ';\n');
            }
        }
        else{
            Auxiliar.agregarCuadruplo(strNombreMetodo + '();');
            ValorRetorno = Auxiliar.getTemp();
            Auxiliar.agregarCuadruplo(posRelativaReturn + ' = S + 1;      //Pos del return en nuevo ambito');
            Auxiliar.agregarCuadruplo(ValorRetorno + ' = stack['+ posRelativaReturn +']; //Retornando valor. ');
            Auxiliar.agregarCuadruplo('S = S - ' + CambioAmbito + ';\n');
            
        }
    }
    catch(err)
    {
        console.log(err);
    }
    return [ValorRetorno,strTipoRetorno];
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------
//ARITMETICAS***

//SUMA
function evaluarMas(izq,der){
    debugger;
    var nodo = new NodoCuadruplo('','','','',''); 
    var temp = ''; 
    var sentencia = '';
    
    
    if(izq.valorTipo == "(cadena)" && der.valorTipo == "(cadena)"){
        //-----------------------------
        var temp_izq = izq.cadena; 
        var temp_der = der.cadena; 
        var temp_actual = ''; 
        var etiqueta1 = ''; 
        var etiqueta2 = ''; 
        var temp_retorno = '';

        temp_actual = Auxiliar.getTemp(); 
        temp_retorno = temp_actual; 
        Auxiliar.agregarCuadruplo(temp_actual + ' = H;    //Inicio de cadena concatenada');
        temp_actual = Auxiliar.getTemp(); 
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_izq + ';    //Inicio de la primera cadena.\n');
        etiqueta1 = Auxiliar.getEtq(); 
        etiqueta2 = Auxiliar.getEtq(); 
        var temporal2 = Auxiliar.getTemp();

        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo('heap[H] = ' + temporal2 + ';');
        Auxiliar.agregarCuadruplo('H = H + 1;');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        //------------------------------
        temp_actual = Auxiliar.getTemp(); Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_der + ';    //Inicio de la segunda cadena \n');
        etiqueta1 = Auxiliar.getEtq(); 
        etiqueta2 = Auxiliar.getEtq(); 
        temporal2 = Auxiliar.getTemp();

        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo('heap[H] = ' + temporal2 + ';');
        Auxiliar.agregarCuadruplo('H = H + 1;');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        Auxiliar.agregarCuadruplo("heap[H] = 0;    //fin de la cadena concatenada");
        Auxiliar.agregarCuadruplo('H = H + 1;\n');
        
        nodo = new NodoCuadruplo(temp_retorno,'','',sentencia,"(cadena)");
    }
    else if(izq.valorTipo == "(cadena)" && der.valorTipo == "(bool)"){
        //-------------------------------
        var cadenaBool = '';
        var posicion = 0; 
        var aux_temp = '';

        if(Auxiliar.obtenerToken(der.cadena) == '1') 
            cadenaBool = "true";
        else 
            cadenaBool = "false";

        for(var i = 0; i < cadenaBool.length; i++){
            aux_temp = Auxiliar.getTemp();
            Auxiliar.agregarCuadruplo(aux_temp + ' = H + ' + i + ';');
            Auxiliar.agregarCuadruplo('heap[' + aux_temp + '] = ' + cadenaBool.charCodeAt(i) + '; //Codigo ascii de caracter ' + cadenaBool.charAt(i) + '');
            posicion = i;
        }

        aux_temp = Auxiliar.getTemp(); 
        posicion++;
        Auxiliar.agregarCuadruplo(aux_temp + ' = H + ' + posicion + ';');
        Auxiliar.agregarCuadruplo('heap[' + aux_temp + '] = 0; //Fin de la cadena \n');
        aux_temp = Auxiliar.getTemp(); 
        posicion++; 
        Auxiliar.agregarCuadruplo(aux_temp + ' = H; //Posicion del inicio de la cadena ' + cadenaBool + ''); 
        Auxiliar.agregarCuadruplo('H = H + ' + posicion + ';\n');
        //--------------------------------
        var temp_izq = izq.cadena;
        var temp_der = aux_temp;
        var temp_actual = '';
        var etiqueta1 = '';
        var etiqueta2 = '', temp_retorno = '';

        temp_actual = Auxiliar.getTemp(); 
        temp_retorno = temp_actual; 

        Auxiliar.agregarCuadruplo(temp_actual + ' = H;    //Posicion donde incia cadena concatenada');
        temp_actual = Auxiliar.getTemp(); 
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_izq + ';\n');
        etiqueta1 = Auxiliar.getEtq(); 
        etiqueta2 = Auxiliar.getEtq(); 
        var temporal2 = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo('heap[H] = ' + temporal2 + ';');
        Auxiliar.agregarCuadruplo('H = H + 1;');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        //------------------------------
        temp_actual = Auxiliar.getTemp(); 
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_der + ';\n');
        etiqueta1 = Auxiliar.getEtq(); etiqueta2 = Auxiliar.getEtq(); temporal2 = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo('heap[H] = ' + temporal2 + ';');
        Auxiliar.agregarCuadruplo('H = H + 1;');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        Auxiliar.agregarCuadruplo("heap[H] = 0;    //finaliza la cadena concatenada");
        Auxiliar.agregarCuadruplo('H = H + 1;\n');
        
        nodo = new NodoCuadruplo(temp_retorno,'','',sentencia,"(cadena)");
    }
    else if(izq.valorTipo == "(bool)" && der.valorTipo == "(cadena)"){
        //-------------------------------
        var cadenaBool = '';
        var posicion = 0;
        var aux_temp = '';

        if(Auxiliar.obtenerToken(izq.cadena) == '1') 
            cadenaBool = "true";
        else 
            cadenaBool = "false";
        
        for(var i = 0; i < cadenaBool.length; i++){
            aux_temp = Auxiliar.getTemp();
            Auxiliar.agregarCuadruplo(aux_temp + ' = H + ' + i + ';');
            Auxiliar.agregarCuadruplo('heap[' + aux_temp + '] = ' + cadenaBool.charCodeAt(i) + '; //Codigo ascii de caracter ' + cadenaBool.charAt(i) + '');
            posicion = i;
        }
        aux_temp = Auxiliar.getTemp(); 
        posicion++;
        Auxiliar.agregarCuadruplo(aux_temp + ' = H + ' + posicion + ';');
        Auxiliar.agregarCuadruplo('heap[' + aux_temp + '] = 0; //Fin de la cadena \n');
        aux_temp = Auxiliar.getTemp(); posicion++; 
        Auxiliar.agregarCuadruplo(aux_temp + ' = H; //Posicion del inicio de la cadena ' + cadenaBool + ''); 
        Auxiliar.agregarCuadruplo('H = H + ' + posicion + ';\n');
        //--------------------------------
        var temp_izq = aux_temp;
        var temp_der = (der.cadena);
        var temp_actual = '';
        var etiqueta1 = '';
        var etiqueta2 = '';
        var temp_retorno = '';

        temp_actual = Auxiliar.getTemp(); 
        temp_retorno = temp_actual; 

        Auxiliar.agregarCuadruplo(temp_actual + ' = H;    //Posicion donde inicia cadena concatenada');
        temp_actual = Auxiliar.getTemp(); 
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_izq + ';\n');
        etiqueta1 = Auxiliar.getEtq(); 
        etiqueta2 = Auxiliar.getEtq(); 
        var temporal2 = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo('heap[H] = ' + temporal2 + ';');
        Auxiliar.agregarCuadruplo('H = H + 1;');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        //------------------------------
        temp_actual = Auxiliar.getTemp(); 
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_der + ';\n');
        etiqueta1 = Auxiliar.getEtq(); 
        etiqueta2 = Auxiliar.getEtq(); 
        temporal2 = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo('heap[H] = ' + temporal2 + ';\n');
        Auxiliar.agregarCuadruplo('H = H + 1;');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        Auxiliar.agregarCuadruplo("heap[H] = 0;");
        Auxiliar.agregarCuadruplo('H = H + 1;\n');
        
        nodo = new NodoCuadruplo(temp_retorno,'','',sentencia,"(cadena)");
    }
    else if(izq.valorTipo == "(cadena)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(cadena)" && der.valorTipo == "(decimal)" ){
        
        temp = Auxiliar.getTemp();
        sentencia += izq.sentencia;
        sentencia += der.sentencia;

        Auxiliar.agregarCuadruplo(sentencia);
        var CambioAmbito = obtenerPosicion2(false) + 2;
        var temporal = Auxiliar.getTemp();
        var relat = Auxiliar.getTemp();

        Auxiliar.agregarCuadruplo('S = S + ' + CambioAmbito + ';');
        Auxiliar.agregarCuadruplo(temporal + ' = S + 1;');
        Auxiliar.agregarCuadruplo('stack[' + temporal + '] = ' + izq.cadena + ';');
        temporal = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temporal + ' = S + 2;');
        Auxiliar.agregarCuadruplo('stack[' + temporal + '] = ' + Auxiliar.obtenerToken(der.cadena) + ';');
        temporal = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temporal + ' = S + 3;');
        Auxiliar.agregarCuadruplo('stack[' + temporal + '] = 1;');
        Auxiliar.agregarCuadruplo('$$_numToStr();');
        Auxiliar.agregarCuadruplo(relat + ' = S + 0;');
        Auxiliar.agregarCuadruplo(temp + ' = stack['+relat+']; //Retorno valor. ');
        Auxiliar.agregarCuadruplo('S = S - ' + CambioAmbito + ';\n');
        
        nodo = new NodoCuadruplo(temp,'','',sentencia,"(cadena)");
    }
    else if(izq.valorTipo == "(entero)" && der.valorTipo == "(cadena)"
            || izq.valorTipo == "(decimal)" && der.valorTipo == "(cadena)" ){
        
        temp = Auxiliar.getTemp();
        sentencia += izq.sentencia;
        sentencia += der.sentencia;

        Auxiliar.agregarCuadruplo(sentencia);
        var CambioAmbito = obtenerPosicion2(false) + 2;
        var temporal = Auxiliar.getTemp();
        var relat = Auxiliar.getTemp();

        Auxiliar.agregarCuadruplo('S = S + ' + CambioAmbito + ';');
        Auxiliar.agregarCuadruplo(temporal + ' = S + 1;');
        Auxiliar.agregarCuadruplo('stack[' + temporal + '] = ' + Auxiliar.obtenerToken(izq.cadena) + ';');
        temporal = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temporal + ' = S + 2;');
        Auxiliar.agregarCuadruplo('stack[' + temporal + '] = ' + der.cadena + ';');
        temporal = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temporal + ' = S + 3;');
        Auxiliar.agregarCuadruplo('stack[' + temporal + '] = 0;');
        Auxiliar.agregarCuadruplo('$$_numToStr();');
        Auxiliar.agregarCuadruplo(relat + ' = S + 0;');
        Auxiliar.agregarCuadruplo(temp + ' = stack['+relat+']; //Retorno valor. ');
        Auxiliar.agregarCuadruplo('S = S - ' + CambioAmbito + ';\n');
        
        nodo = new NodoCuadruplo(temp,'','',sentencia,"(cadena)");
    }
    else if(izq.valorTipo == "(entero)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(entero)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(bool)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(entero)" && der.valorTipo == "(bool)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(bool)"){
        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = ' + Auxiliar.obtenerToken(izq.cadena) + ' + ' + Auxiliar.obtenerToken(der.cadena) + ';\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(entero)");
    }

    else if(izq.valorTipo == "(decimal)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(caracter)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(bool)"
            ||izq.valorTipo == "(bool)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(entero)" ){
        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = ' + Auxiliar.obtenerToken(izq.cadena) + ' + ' + Auxiliar.obtenerToken(der.cadena) + ';\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(decimal)");
    }
    else{
        var error = new Error(0,'Semántico','No se puede sumar el tipo: ' + Auxiliar.obtenerTipo(izq.cadena) + ' con el tipo: ' + Auxiliar.obtenerTipo(der.cadena));
        errores.push(error);

        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = 0; //Error con los casteos implicitos de la suma.\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(entero)");
    }
    return nodo;
}

function evaluarMenos(izq,der){
    var nodo = new NodoCuadruplo('','','','',''); 
    var temp = ''; 
    var sentencia = '';
    
    if(izq.valorTipo == "(entero)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(entero)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(bool)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(entero)" && der.valorTipo == "(bool)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(bool)"){
        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = ' + Auxiliar.obtenerToken(izq.cadena) + ' - ' + Auxiliar.obtenerToken(der.cadena) + ';\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(entero)");
    }

    else if(izq.valorTipo == "(decimal)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(caracter)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(bool)"
            ||izq.valorTipo == "(bool)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(entero)" ){
        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = ' + Auxiliar.obtenerToken(izq.cadena) + ' - ' + Auxiliar.obtenerToken(der.cadena) + ';\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(decimal)");
    }
    else{
        var error = new Error(0,'Semántico','No se puede restar el tipo: ' + Auxiliar.obtenerTipo(izq.cadena) + ' con el tipo: ' + Auxiliar.obtenerTipo(der.cadena));
        errores.push(error);

        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = 0; //Error con los casteos implicitos de la resta.\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(entero)");
    }
    return nodo;
}

//Multiplicacion
function evaluarPor(izq,der){
    var nodo = new NodoCuadruplo('','','','',''); 
    var temp = ''; 
    var sentencia = '';
    
    if(izq.valorTipo == "(entero)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(entero)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(bool)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(entero)" && der.valorTipo == "(bool)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(bool)"){
        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = ' + Auxiliar.obtenerToken(izq.cadena) + ' * ' + Auxiliar.obtenerToken(der.cadena) + ';\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(entero)");
    }

    else if(izq.valorTipo == "(decimal)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(caracter)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(bool)"
            ||izq.valorTipo == "(bool)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(entero)" ){
        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = ' + Auxiliar.obtenerToken(izq.cadena) + ' * ' + Auxiliar.obtenerToken(der.cadena) + ';\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(decimal)");
    }
    else{
        var error = new Error(0,'Semántico','No se puede multiplicar el tipo: ' + Auxiliar.obtenerTipo(izq.cadena) + ' con el tipo: ' + Auxiliar.obtenerTipo(der.cadena));
        errores.push(error);

        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = 0; //Error con los casteos implicitos de la multiplicacion.\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(entero)");
    }
    return nodo;
}

function evaluarDiv(izq,der){
    var nodo = new NodoCuadruplo('','','','',''); 
    var temp = ''; 
    var sentencia = '';
    
    if(izq.valorTipo == "(entero)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(entero)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(bool)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(entero)" && der.valorTipo == "(bool)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(bool)"){
        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = ' + Auxiliar.obtenerToken(izq.cadena) + ' / ' + Auxiliar.obtenerToken(der.cadena) + ';\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(decimal)");
    }

    else if(izq.valorTipo == "(decimal)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(caracter)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(bool)"
            ||izq.valorTipo == "(bool)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(entero)" ){
        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = ' + Auxiliar.obtenerToken(izq.cadena) + ' / ' + Auxiliar.obtenerToken(der.cadena) + ';\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(decimal)");
    }
    else{
        var error = new Error(0,'Semántico','No se puede dividir el tipo: ' + Auxiliar.obtenerTipo(izq.cadena) + ' con el tipo: ' + Auxiliar.obtenerTipo(der.cadena));
        errores.push(error);

        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = 0; //Error con los casteos implicitos de la división.\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(entero)");
    }
    return nodo;
}

//Modular
function evaluarMod(izq,der){
    var nodo = new NodoCuadruplo('','','','',''); 
    var temp = ''; 
    var sentencia = '';
    
    if(izq.valorTipo == "(entero)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(entero)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(bool)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(entero)" && der.valorTipo == "(bool)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(bool)"){
        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = ' + Auxiliar.obtenerToken(izq.cadena) + ' % ' + Auxiliar.obtenerToken(der.cadena) + ';\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(decimal)");
    }

    else if(izq.valorTipo == "(decimal)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(caracter)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(bool)"
            ||izq.valorTipo == "(bool)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(entero)" ){
        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = ' + Auxiliar.obtenerToken(izq.cadena) + ' % ' + Auxiliar.obtenerToken(der.cadena) + ';\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(decimal)");
    }
    else{
        var error = new Error(0,'Semántico','No se puede dividir el tipo: ' + Auxiliar.obtenerTipo(izq.cadena) + ' con el tipo: ' + Auxiliar.obtenerTipo(der.cadena));
        errores.push(error);

        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = 0; //Error con los casteos implicitos de la división.\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(entero)");
    }
    return nodo;
 }

//Potencia
function evaluarPot(izq,der){
    var nodo = new NodoCuadruplo('','','','',''); 
    var temp = ''; 
    var sentencia = '';
    
    if(izq.valorTipo == "(entero)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(entero)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(caracter)" && der.valorTipo == "(bool)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(caracter)"
            || izq.valorTipo == "(entero)" && der.valorTipo == "(bool)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(entero)"
            || izq.valorTipo == "(bool)" && der.valorTipo == "(bool)"){
        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = ' + Auxiliar.obtenerToken(izq.cadena) + ' ^ ' + Auxiliar.obtenerToken(der.cadena) + ';\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(entero)");
    }

    else if(izq.valorTipo == "(decimal)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(caracter)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(bool)"
            ||izq.valorTipo == "(bool)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(entero)" ){
        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = ' + Auxiliar.obtenerToken(izq.cadena) + ' ^ ' + Auxiliar.obtenerToken(der.cadena) + ';\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(decimal)");
    }
    else{
        var error = new Error(0,'Semántico','No se puede elevar el tipo: ' + Auxiliar.obtenerTipo(izq.cadena) + ' con el tipo: ' + Auxiliar.obtenerTipo(der.cadena));
        errores.push(error);

        temp = Auxiliar.getTemp(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        sentencia += temp + ' = 0; //Error con los casteos implicitos de la potencia.\n';
        nodo = new NodoCuadruplo(temp + ' (temporal)','','',sentencia,"(entero)");
    }
    return nodo;
}

//-----------------------------------------------------------------------------------------------------------------------------------------
//Relacionales ***

function evaluarIgual(izq,der){
    var nodo = new NodoCuadruplo('','','','',''); 
    var e_v = '';
    var e_f = '';
    var sentencia = '';
    
    if(izq.valorTipo == "(cadena)" && der.valorTipo == "(cadena)"){
       
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq();
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        
        var temp_izq = izq.cadena; 
        var temp_der = der.cadena; 
        var temp_actual = ''; 
        var etiqueta1 = ''; 
        var etiqueta2 = ''; 

        var temp_comp1 = '';
        var temp_comp2 = '';

        temp_comp1 = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temp_comp1 + ' = 0;   //inicializar sumatoria de cadena 1');

        temp_actual = Auxiliar.getTemp(); 
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_izq + ';    //Inicio de la primera cadena.\n');
        etiqueta1 = Auxiliar.getEtq(); 
        etiqueta2 = Auxiliar.getEtq(); 
        var temporal2 = Auxiliar.getTemp();

        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo(temp_comp1 + ' = ' + temp_comp1 + ' + ' + temporal2 + ';');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        //------------------------------

        temp_comp2 = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temp_comp2 + ' = 0;   //inicializar sumatoria de cadena 2');

        temp_actual = Auxiliar.getTemp(); 
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_der + ';    //Inicio de la segunda cadena \n');
        etiqueta1 = Auxiliar.getEtq(); 
        etiqueta2 = Auxiliar.getEtq(); 
        temporal2 = Auxiliar.getTemp();

        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo(temp_comp2 + ' = ' + temp_comp2 + ' + ' + temporal2 + ';');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        
        sentencia += 'if(' + temp_comp1 + ' == ' + temp_comp2 + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        nodo = new NodoCuadruplo('',e_v + ': ',e_f + ': ',sentencia,"(bool)");
    }
    else if(izq.valorTipo == "(entero)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(caracter)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(caracter)"){
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;

        sentencia += 'if(' + Auxiliar.obtenerToken(izq.cadena) + ' == ' + Auxiliar.obtenerToken(der.cadena) + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        nodo = new NodoCuadruplo('',e_v + ': ',e_f + ': ',sentencia,"(bool)");
    }
    else if(izq.valorTipo == valNulo && der.valorTipo == valNulo ||
           Auxiliar.obtenerTipo(izq.cadena) == "(temporal)" && der.valorTipo == valNulo ||
           izq.valorTipo == valNulo && Auxiliar.obtenerTipo(der.cadena) == "(temporal)"){
        
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; sentencia += der.sentencia; 
        
        var temp1 = Auxiliar.getTemp();
        var temp2 = Auxiliar.getTemp(); 
        var pizq = ''
        var pder = '';
        
        if(Auxiliar.obtenerTipo(izq.cadena) == "(temporal)"){
            pizq = Auxiliar.obtenerToken(izq.cadena); 
            pder = der.cadena; 
        } 
        else if(Auxiliar.obtenerTipo(der.cadena) == "(temporal)") { 
            pizq = izq.cadena; 
            pder = Auxiliar.obtenerToken(der.cadena); 
        }
        else { 
            pizq = izq.cadena; 
            pder = der.cadena; 
        }
        
        sentencia += temp1 + ' = ' + pizq + ';\n'; 
        sentencia += temp2 + ' = ' + pder + ';\n';
        sentencia += 'if(' + temp1 + ' == ' + temp2 + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        
        nodo = new NodoCuadruplo('',e_v+ ': ',e_f+ ': ',sentencia,"(bool)");
    }
    else{
        errores.push(new Error(0,'Semántico','No se puede igual el tipo: ' + Auxiliar.obtenerTipo(izq.cadena) + 
                                    ' con el tipo: ' + Auxiliar.obtenerTipo(der.cadena) + ''));
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia; 
        sentencia += 'if(1 == 0) goto ' + e_v + '; //Error en tipo de datos \ngoto ' + e_f + ';\n';

        nodo = new NodoCuadruplo('',e_v+ ': ',e_f+ ': ',sentencia,"(bool)");
    }
    
    return nodo;
}


function evaluarDiferente(izq,der){
    var nodo = new NodoCuadruplo('','','','',''); 
    var e_v = '';
    var e_f = '';
    var sentencia = '';
    
    if(izq.valorTipo == "(cadena)" && der.valorTipo == "(cadena)"){
       
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq();
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        
        var temp_izq = izq.cadena; 
        var temp_der = der.cadena; 
        var temp_actual = ''; 
        var etiqueta1 = ''; 
        var etiqueta2 = ''; 

        var temp_comp1 = '';
        var temp_comp2 = '';

        temp_comp1 = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temp_comp1 + ' = 0;   //inicializar sumatoria de cadena 1');

        temp_actual = Auxiliar.getTemp(); 
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_izq + ';    //Inicio de la primera cadena.\n');
        etiqueta1 = Auxiliar.getEtq(); 
        etiqueta2 = Auxiliar.getEtq(); 
        var temporal2 = Auxiliar.getTemp();

        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo(temp_comp1 + ' = ' + temp_comp1 + ' + ' + temporal2 + ';');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        //------------------------------

        temp_comp2 = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temp_comp2 + ' = 0;   //inicializar sumatoria de cadena 2');

        temp_actual = Auxiliar.getTemp(); 
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_der + ';    //Inicio de la segunda cadena \n');
        etiqueta1 = Auxiliar.getEtq(); 
        etiqueta2 = Auxiliar.getEtq(); 
        temporal2 = Auxiliar.getTemp();

        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo(temp_comp2 + ' = ' + temp_comp2 + ' + ' + temporal2 + ';');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        
        sentencia += 'if(' + temp_comp1 + ' != ' + temp_comp2 + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        nodo = new NodoCuadruplo('',e_v + ': ',e_f + ': ',sentencia,"(bool)");
    }
    else if(izq.valorTipo == "(entero)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(caracter)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(caracter)"){
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;

        sentencia += 'if(' + Auxiliar.obtenerToken(izq.cadena) + ' != ' + Auxiliar.obtenerToken(der.cadena) + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        nodo = new NodoCuadruplo('',e_v + ': ',e_f + ': ',sentencia,"(bool)");
    }
    else if(izq.valorTipo == valNulo && der.valorTipo == valNulo ||
           Auxiliar.obtenerTipo(izq.cadena) == "(temporal)" && der.valorTipo == valNulo ||
           izq.valorTipo == valNulo && Auxiliar.obtenerTipo(der.cadena) == "(temporal)"){
        
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; sentencia += der.sentencia; 
        
        var temp1 = Auxiliar.getTemp();
        var temp2 = Auxiliar.getTemp(); 
        var pizq = ''
        var pder = '';
        
        if(Auxiliar.obtenerTipo(izq.cadena) == "(temporal)"){
            pizq = Auxiliar.obtenerToken(izq.cadena); 
            pder = der.cadena; 
        } 
        else if(Auxiliar.obtenerTipo(der.cadena) == "(temporal)") { 
            pizq = izq.cadena; 
            pder = Auxiliar.obtenerToken(der.cadena); 
        }
        else { 
            pizq = izq.cadena; 
            pder = der.cadena; 
        }
        
        sentencia += temp1 + ' = ' + pizq + ';\n'; 
        sentencia += temp2 + ' = ' + pder + ';\n';
        sentencia += 'if(' + temp1 + ' != ' + temp2 + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        
        nodo = new NodoCuadruplo('',e_v+ ': ',e_f+ ': ',sentencia,"(bool)");
    }
    else{
        errores.push(new Error(0,'Semántico','No se puede igual el tipo: ' + Auxiliar.obtenerTipo(izq.cadena) + 
                                    ' con el tipo: ' + Auxiliar.obtenerTipo(der.cadena) + ''));
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia; 
        sentencia += 'if(1 == 0) goto ' + e_v + '; //Error en tipo de datos \ngoto ' + e_f + ';\n';

        nodo = new NodoCuadruplo('',e_v+ ': ',e_f+ ': ',sentencia,"(bool)");
    }
    
    return nodo;
}

function evaluarMayorIgual(izq,der){
    var nodo = new NodoCuadruplo('','','','',''); 
    var e_v = '';
    var e_f = '';
    var sentencia = '';
    
    if(izq.valorTipo == "(cadena)" && der.valorTipo == "(cadena)"){
       
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq();
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        
        var temp_izq = izq.cadena; 
        var temp_der = der.cadena; 
        var temp_actual = ''; 
        var etiqueta1 = ''; 
        var etiqueta2 = ''; 

        var temp_comp1 = '';
        var temp_comp2 = '';

        temp_comp1 = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temp_comp1 + ' = 0;   //inicializar sumatoria de cadena 1');

        temp_actual = Auxiliar.getTemp(); 
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_izq + ';    //Inicio de la primera cadena.\n');
        etiqueta1 = Auxiliar.getEtq(); 
        etiqueta2 = Auxiliar.getEtq(); 
        var temporal2 = Auxiliar.getTemp();

        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo(temp_comp1 + ' = ' + temp_comp1 + ' + ' + temporal2 + ';');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        //------------------------------

        temp_comp2 = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temp_comp2 + ' = 0;   //inicializar sumatoria de cadena 2');

        temp_actual = Auxiliar.getTemp(); 
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_der + ';    //Inicio de la segunda cadena \n');
        etiqueta1 = Auxiliar.getEtq(); 
        etiqueta2 = Auxiliar.getEtq(); 
        temporal2 = Auxiliar.getTemp();

        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo(temp_comp2 + ' = ' + temp_comp2 + ' + ' + temporal2 + ';');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        
        sentencia += 'if(' + temp_comp1 + ' >= ' + temp_comp2 + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        nodo = new NodoCuadruplo('',e_v + ': ',e_f + ': ',sentencia,"(bool)");
    }
    else if(izq.valorTipo == "(entero)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(caracter)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(caracter)"){
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;

        sentencia += 'if(' + Auxiliar.obtenerToken(izq.cadena) + ' >= ' + Auxiliar.obtenerToken(der.cadena) + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        nodo = new NodoCuadruplo('',e_v + ': ',e_f + ': ',sentencia,"(bool)");
    }
    else if(izq.valorTipo == valNulo && der.valorTipo == valNulo ||
           Auxiliar.obtenerTipo(izq.cadena) == "(temporal)" && der.valorTipo == valNulo ||
           izq.valorTipo == valNulo && Auxiliar.obtenerTipo(der.cadena) == "(temporal)"){
        
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; sentencia += der.sentencia; 
        
        var temp1 = Auxiliar.getTemp();
        var temp2 = Auxiliar.getTemp(); 
        var pizq = ''
        var pder = '';
        
        if(Auxiliar.obtenerTipo(izq.cadena) == "(temporal)"){
            pizq = Auxiliar.obtenerToken(izq.cadena); 
            pder = der.cadena; 
        } 
        else if(Auxiliar.obtenerTipo(der.cadena) == "(temporal)") { 
            pizq = izq.cadena; 
            pder = Auxiliar.obtenerToken(der.cadena); 
        }
        else { 
            pizq = izq.cadena; 
            pder = der.cadena; 
        }
        
        sentencia += temp1 + ' = ' + pizq + ';\n'; 
        sentencia += temp2 + ' = ' + pder + ';\n';
        sentencia += 'if(' + temp1 + ' >= ' + temp2 + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        
        nodo = new NodoCuadruplo('',e_v+ ': ',e_f+ ': ',sentencia,"(bool)");
    }
    else{
        errores.push(new Error(0,'Semántico','No se puede igual el tipo: ' + Auxiliar.obtenerTipo(izq.cadena) + 
                                    ' con el tipo: ' + Auxiliar.obtenerTipo(der.cadena) + ''));
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia; 
        sentencia += 'if(1 == 0) goto ' + e_v + '; //Error en tipo de datos \ngoto ' + e_f + ';\n';

        nodo = new NodoCuadruplo('',e_v+ ': ',e_f+ ': ',sentencia,"(bool)");
    }
    
    return nodo;
}

function evaluarMenorIgual(izq,der){
    var nodo = new NodoCuadruplo('','','','',''); 
    var e_v = '';
    var e_f = '';
    var sentencia = '';
    
    if(izq.valorTipo == "(cadena)" && der.valorTipo == "(cadena)"){
       
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq();
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        
        var temp_izq = izq.cadena; 
        var temp_der = der.cadena; 
        var temp_actual = ''; 
        var etiqueta1 = ''; 
        var etiqueta2 = ''; 

        var temp_comp1 = '';
        var temp_comp2 = '';

        temp_comp1 = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temp_comp1 + ' = 0;   //inicializar sumatoria de cadena 1');

        temp_actual = Auxiliar.getTemp(); 
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_izq + ';    //Inicio de la primera cadena.\n');
        etiqueta1 = Auxiliar.getEtq(); 
        etiqueta2 = Auxiliar.getEtq(); 
        var temporal2 = Auxiliar.getTemp();

        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo(temp_comp1 + ' = ' + temp_comp1 + ' + ' + temporal2 + ';');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        //------------------------------

        temp_comp2 = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temp_comp2 + ' = 0;   //inicializar sumatoria de cadena 2');

        temp_actual = Auxiliar.getTemp(); 
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_der + ';    //Inicio de la segunda cadena \n');
        etiqueta1 = Auxiliar.getEtq(); 
        etiqueta2 = Auxiliar.getEtq(); 
        temporal2 = Auxiliar.getTemp();

        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo(temp_comp2 + ' = ' + temp_comp2 + ' + ' + temporal2 + ';');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        
        sentencia += 'if(' + temp_comp1 + ' <= ' + temp_comp2 + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        nodo = new NodoCuadruplo('',e_v + ': ',e_f + ': ',sentencia,"(bool)");
    }
    else if(izq.valorTipo == "(entero)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(caracter)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(caracter)"){
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;

        sentencia += 'if(' + Auxiliar.obtenerToken(izq.cadena) + ' <= ' + Auxiliar.obtenerToken(der.cadena) + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        nodo = new NodoCuadruplo('',e_v + ': ',e_f + ': ',sentencia,"(bool)");
    }
    else if(izq.valorTipo == valNulo && der.valorTipo == valNulo ||
           Auxiliar.obtenerTipo(izq.cadena) == "(temporal)" && der.valorTipo == valNulo ||
           izq.valorTipo == valNulo && Auxiliar.obtenerTipo(der.cadena) == "(temporal)"){
        
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; sentencia += der.sentencia; 
        
        var temp1 = Auxiliar.getTemp();
        var temp2 = Auxiliar.getTemp(); 
        var pizq = ''
        var pder = '';
        
        if(Auxiliar.obtenerTipo(izq.cadena) == "(temporal)"){
            pizq = Auxiliar.obtenerToken(izq.cadena); 
            pder = der.cadena; 
        } 
        else if(Auxiliar.obtenerTipo(der.cadena) == "(temporal)") { 
            pizq = izq.cadena; 
            pder = Auxiliar.obtenerToken(der.cadena); 
        }
        else { 
            pizq = izq.cadena; 
            pder = der.cadena; 
        }
        
        sentencia += temp1 + ' = ' + pizq + ';\n'; 
        sentencia += temp2 + ' = ' + pder + ';\n';
        sentencia += 'if(' + temp1 + ' <= ' + temp2 + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        
        nodo = new NodoCuadruplo('',e_v+ ': ',e_f+ ': ',sentencia,"(bool)");
    }
    else{
        errores.push(new Error(0,'Semántico','No se puede igual el tipo: ' + Auxiliar.obtenerTipo(izq.cadena) + 
                                    ' con el tipo: ' + Auxiliar.obtenerTipo(der.cadena) + ''));
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia; 
        sentencia += 'if(1 == 0) goto ' + e_v + '; //Error en tipo de datos \ngoto ' + e_f + ';\n';

        nodo = new NodoCuadruplo('',e_v+ ': ',e_f+ ': ',sentencia,"(bool)");
    }
    
    return nodo;
}

function evaluarMayor(izq,der){
    var nodo = new NodoCuadruplo('','','','',''); 
    var e_v = '';
    var e_f = '';
    var sentencia = '';
    
    if(izq.valorTipo == "(cadena)" && der.valorTipo == "(cadena)"){
       
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq();
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        
        var temp_izq = izq.cadena; 
        var temp_der = der.cadena; 
        var temp_actual = ''; 
        var etiqueta1 = ''; 
        var etiqueta2 = ''; 

        var temp_comp1 = '';
        var temp_comp2 = '';

        temp_comp1 = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temp_comp1 + ' = 0;   //inicializar sumatoria de cadena 1');

        temp_actual = Auxiliar.getTemp(); 
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_izq + ';    //Inicio de la primera cadena.\n');
        etiqueta1 = Auxiliar.getEtq(); 
        etiqueta2 = Auxiliar.getEtq(); 
        var temporal2 = Auxiliar.getTemp();

        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo(temp_comp1 + ' = ' + temp_comp1 + ' + ' + temporal2 + ';');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        //------------------------------

        temp_comp2 = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temp_comp2 + ' = 0;   //inicializar sumatoria de cadena 2');

        temp_actual = Auxiliar.getTemp(); 
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_der + ';    //Inicio de la segunda cadena \n');
        etiqueta1 = Auxiliar.getEtq(); 
        etiqueta2 = Auxiliar.getEtq(); 
        temporal2 = Auxiliar.getTemp();

        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo(temp_comp2 + ' = ' + temp_comp2 + ' + ' + temporal2 + ';');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        
        sentencia += 'if(' + temp_comp1 + ' > ' + temp_comp2 + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        nodo = new NodoCuadruplo('',e_v + ': ',e_f + ': ',sentencia,"(bool)");
    }
    else if(izq.valorTipo == "(entero)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(caracter)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(caracter)"){
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;

        sentencia += 'if(' + Auxiliar.obtenerToken(izq.cadena) + ' > ' + Auxiliar.obtenerToken(der.cadena) + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        nodo = new NodoCuadruplo('',e_v + ': ',e_f + ': ',sentencia,"(bool)");
    }
    else if(izq.valorTipo == valNulo && der.valorTipo == valNulo ||
           Auxiliar.obtenerTipo(izq.cadena) == "(temporal)" && der.valorTipo == valNulo ||
           izq.valorTipo == valNulo && Auxiliar.obtenerTipo(der.cadena) == "(temporal)"){
        
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; sentencia += der.sentencia; 
        
        var temp1 = Auxiliar.getTemp();
        var temp2 = Auxiliar.getTemp(); 
        var pizq = ''
        var pder = '';
        
        if(Auxiliar.obtenerTipo(izq.cadena) == "(temporal)"){
            pizq = Auxiliar.obtenerToken(izq.cadena); 
            pder = der.cadena; 
        } 
        else if(Auxiliar.obtenerTipo(der.cadena) == "(temporal)") { 
            pizq = izq.cadena; 
            pder = Auxiliar.obtenerToken(der.cadena); 
        }
        else { 
            pizq = izq.cadena; 
            pder = der.cadena; 
        }
        
        sentencia += temp1 + ' = ' + pizq + ';\n'; 
        sentencia += temp2 + ' = ' + pder + ';\n';
        sentencia += 'if(' + temp1 + ' > ' + temp2 + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        
        nodo = new NodoCuadruplo('',e_v+ ': ',e_f+ ': ',sentencia,"(bool)");
    }
    else{
        errores.push(new Error(0,'Semántico','No se puede igual el tipo: ' + Auxiliar.obtenerTipo(izq.cadena) + 
                                    ' con el tipo: ' + Auxiliar.obtenerTipo(der.cadena) + ''));
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia; 
        sentencia += 'if(1 == 0) goto ' + e_v + '; //Error en tipo de datos \ngoto ' + e_f + ';\n';

        nodo = new NodoCuadruplo('',e_v+ ': ',e_f+ ': ',sentencia,"(bool)");
    }
    
    return nodo;
}

function evaluarMenor(izq,der){
    var nodo = new NodoCuadruplo('','','','',''); 
    var e_v = '';
    var e_f = '';
    var sentencia = '';
    
    if(izq.valorTipo == "(cadena)" && der.valorTipo == "(cadena)"){
       
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq();
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;
        
        var temp_izq = izq.cadena; 
        var temp_der = der.cadena; 
        var temp_actual = ''; 
        var etiqueta1 = ''; 
        var etiqueta2 = ''; 

        var temp_comp1 = '';
        var temp_comp2 = '';

        temp_comp1 = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temp_comp1 + ' = 0;   //inicializar sumatoria de cadena 1');

        temp_actual = Auxiliar.getTemp(); 
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_izq + ';    //Inicio de la primera cadena.\n');
        etiqueta1 = Auxiliar.getEtq(); 
        etiqueta2 = Auxiliar.getEtq(); 
        var temporal2 = Auxiliar.getTemp();

        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo(temp_comp1 + ' = ' + temp_comp1 + ' + ' + temporal2 + ';');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        //------------------------------

        temp_comp2 = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temp_comp2 + ' = 0;   //inicializar sumatoria de cadena 2');

        temp_actual = Auxiliar.getTemp(); 
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_der + ';    //Inicio de la segunda cadena \n');
        etiqueta1 = Auxiliar.getEtq(); 
        etiqueta2 = Auxiliar.getEtq(); 
        temporal2 = Auxiliar.getTemp();

        Auxiliar.agregarCuadruplo(etiqueta1 + ':');
        Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temp_actual + '];')
        Auxiliar.agregarCuadruplo('if(' + temporal2 + ' == 0) goto ' + etiqueta2 + ';');
        Auxiliar.agregarCuadruplo(temp_comp2 + ' = ' + temp_comp2 + ' + ' + temporal2 + ';');
        Auxiliar.agregarCuadruplo(temp_actual + ' = ' + temp_actual + ' + 1;');
        Auxiliar.agregarCuadruplo('goto ' + etiqueta1 + ';\n');
        Auxiliar.agregarCuadruplo(etiqueta2 + ':');
        
        sentencia += 'if(' + temp_comp1 + ' < ' + temp_comp2 + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        nodo = new NodoCuadruplo('',e_v + ': ',e_f + ': ',sentencia,"(bool)");
    }
    else if(izq.valorTipo == "(entero)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(decimal)"
            ||izq.valorTipo == "(decimal)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(entero)" && der.valorTipo == "(caracter)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(entero)"
            ||izq.valorTipo == "(caracter)" && der.valorTipo == "(caracter)"){
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia;

        sentencia += 'if(' + Auxiliar.obtenerToken(izq.cadena) + ' < ' + Auxiliar.obtenerToken(der.cadena) + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        nodo = new NodoCuadruplo('',e_v + ': ',e_f + ': ',sentencia,"(bool)");
    }
    else if(izq.valorTipo == valNulo && der.valorTipo == valNulo ||
           Auxiliar.obtenerTipo(izq.cadena) == "(temporal)" && der.valorTipo == valNulo ||
           izq.valorTipo == valNulo && Auxiliar.obtenerTipo(der.cadena) == "(temporal)"){
        
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; sentencia += der.sentencia; 
        
        var temp1 = Auxiliar.getTemp();
        var temp2 = Auxiliar.getTemp(); 
        var pizq = ''
        var pder = '';
        
        if(Auxiliar.obtenerTipo(izq.cadena) == "(temporal)"){
            pizq = Auxiliar.obtenerToken(izq.cadena); 
            pder = der.cadena; 
        } 
        else if(Auxiliar.obtenerTipo(der.cadena) == "(temporal)") { 
            pizq = izq.cadena; 
            pder = Auxiliar.obtenerToken(der.cadena); 
        }
        else { 
            pizq = izq.cadena; 
            pder = der.cadena; 
        }
        
        sentencia += temp1 + ' = ' + pizq + ';\n'; 
        sentencia += temp2 + ' = ' + pder + ';\n';
        sentencia += 'if(' + temp1 + ' < ' + temp2 + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n';
        
        nodo = new NodoCuadruplo('',e_v+ ': ',e_f+ ': ',sentencia,"(bool)");
    }
    else{
        errores.push(new Error(0,'Semántico','No se puede igual el tipo: ' + Auxiliar.obtenerTipo(izq.cadena) + 
                                    ' con el tipo: ' + Auxiliar.obtenerTipo(der.cadena) + ''));
        e_v = Auxiliar.getEtq(); 
        e_f = Auxiliar.getEtq(); 
        sentencia += izq.sentencia; 
        sentencia += der.sentencia; 
        sentencia += 'if(1 == 0) goto ' + e_v + '; //Error en tipo de datos \ngoto ' + e_f + ';\n';

        nodo = new NodoCuadruplo('',e_v+ ': ',e_f+ ': ',sentencia,"(bool)");
    }
    
    return nodo;
}

//-----------------------------------------------------------------------------------------------------------------------------------------
//Lógicas ***

function evaluarAnd_iz(izq){
    var e_v = '', e_f = '';
    console.log('Entre and izquierdo');
    if(Auxiliar.obtenerTipo(izq.cadena) == "(bool)"){
        var et_v = Auxiliar.getEtq();
        var et_f = Auxiliar.getEtq();
        var sentencia = 'if(1 == '+ Auxiliar.obtenerToken(izq.cadena) +') goto ' + et_v + ';\ngoto ' + et_f + ';\n';
        Auxiliar.agregarCuadruplo(sentencia); 
        izq.et_v = et_v + ': '; 
        izq.et_f = et_f + ': ';
        e_v = izq.et_v;
        Auxiliar.agregarCuadruplo(e_v);
    }
    else{
        Auxiliar.agregarCuadruplo(izq.sentencia);
        e_v = izq.et_v;
        Auxiliar.agregarCuadruplo(e_v);
    }
}

function evaluarAnd(izq,der){
    evaluarAnd_iz(izq);
    var nodo = new NodoCuadruplo('','','','',''), e_v = '', e_f = '';
    
    if(Auxiliar.obtenerTipo(der.cadena) == "(bool)"){
        var et_v = Auxiliar.getEtq();
        var et_f = Auxiliar.getEtq();
        var sentencia = 'if(1 == '+ Auxiliar.obtenerToken(der.cadena) +') goto ' + et_v + ';\ngoto ' + et_f + ';\n';
        Auxiliar.agregarCuadruplo(sentencia); 
        der.et_v = et_v + ': '; 
        der.et_f = et_f + ': ';
        e_f = izq.et_f + der.et_f; 
        e_v = der.et_v;
    }
    else{
        Auxiliar.agregarCuadruplo(der.sentencia);
        e_f = izq.et_f + der.et_f; 
        e_v = der.et_v;
    }
    
    nodo = new NodoCuadruplo('',e_v,e_f,'',"(bool)");
    
    return nodo;
}

function evaluarOr_iz(izq){
    var e_v = '';
    var e_f = '';
    
    if(Auxiliar.obtenerTipo(izq.cadena) == "(bool)"){
        var et_v = Auxiliar.getEtq();
        var et_f = Auxiliar.getEtq();
        var sentencia = 'if(1 == '+ Auxiliar.obtenerToken(izq.cadena) +') goto ' + et_v + ';\ngoto ' + et_f + ';\n';
        Auxiliar.agregarCuadruplo(sentencia); 
        izq.et_v = et_v + ': '; 
        izq.et_f = et_f + ': ';
        e_f = izq.et_f;
        Auxiliar.agregarCuadruplo(e_f);
    }
    else{
        Auxiliar.agregarCuadruplo(izq.sentencia);
        e_f = izq.et_f;
        Auxiliar.agregarCuadruplo(e_f);
    }
}

function evaluarOr(izq,der){
    evaluarOr_iz(izq);

    var nodo = new NodoCuadruplo('','','','','');
    var e_v = '';
    var e_f = '';
    
    if(Auxiliar.obtenerTipo(der.cadena) == "(bool)"){
        var et_v = Auxiliar.getEtq();
        var et_f = Auxiliar.getEtq();
        var sentencia = 'if(1 == '+ Auxiliar.obtenerToken(der.cadena) +') goto ' + et_v + ';\ngoto ' + et_f + ';\n';
        Auxiliar.agregarCuadruplo(sentencia); 
        der.et_v = et_v + ': '; 
        der.et_f =  et_f + ': ';
        e_v = izq.et_v + der.et_v; 
        e_f = der.et_f;
    }
    else{
        Auxiliar.agregarCuadruplo(der.sentencia);
        e_v = izq.et_v + der.et_v; 
        e_f = der.et_f;
    }
    
    nodo = new NodoCuadruplo('',e_v,e_f,'',"(bool)");
    
    return nodo;
}

function evaluarNot(der){
    var nodo = new NodoCuadruplo('','','','','');
    var e_v = '';
    var e_f = '';
    
    if(Auxiliar.obtenerTipo(der.cadena) == "(bool)"){
        var et_v = Auxiliar.getEtq();
        var et_f = Auxiliar.getEtq();
        var sentencia = 'if(1 == ' + Auxiliar.obtenerToken(der.cadena) +') goto ' + et_v + ';\ngoto ' + et_f + ';\n';
        Auxiliar.agregarCuadruplo(sentencia); 
        e_f = et_f + ': '; 
        e_v = et_v + ': ';
    }
    else{
        Auxiliar.agregarCuadruplo(der.sentencia);
        e_v = der.et_v; 
        e_f = der.et_f;
    }
    
    nodo = new NodoCuadruplo('',e_f,e_v,'',"(bool)");    
    return nodo;
}

function evaluarXor(izq,der){
    var nodo = new NodoCuadruplo('','','','','');
    var e_v = '';
    var e_f = '';
   
    if(Auxiliar.obtenerTipo(izq.cadena) == "(bool)" && Auxiliar.obtenerTipo(der.cadena) == "(bool)"){
        var et_v = Auxiliar.getEtq();
        var et_f = Auxiliar.getEtq();
        var sentencia = 'if(' + Auxiliar.obtenerToken(izq.cadena) + ' == '+ Auxiliar.obtenerToken(der.cadena) +') goto ' + et_v + ';\ngoto ' + et_f + ';\n';
        Auxiliar.agregarCuadruplo(sentencia);
        Auxiliar.agregarCuadruplo(et_v + ':\n'); 
        var EtTemporal = Auxiliar.getEtq(); 
        var temporal = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temporal + ' = 0;\n'); 
        Auxiliar.agregarCuadruplo('goto ' + EtTemporal + ';\n');
        Auxiliar.agregarCuadruplo(et_f + ':\n');
        Auxiliar.agregarCuadruplo(temporal + ' = 1;\n');
        Auxiliar.agregarCuadruplo(EtTemporal + ':\n');
        
        et_v = Auxiliar.getEtq(); 
        et_f = Auxiliar.getEtq();
        
        sentencia = 'if(' + temporal + ' == 1) goto ' + et_v + ';\ngoto ' + et_f + ';\n';
        Auxiliar.agregarCuadruplo(sentencia); der.et_v = et_v + ': '; der.et_f =  et_f + ': ';
        e_v = der.et_v; 
        e_f = der.et_f;
    }
    else if(Auxiliar.obtenerTipo(der.cadena) == "(bool)"){
        var pivTemporal = Auxiliar.getTemp(); 
        var pivEtiqueta = Auxiliar.getEtq();
        Auxiliar.agregarCuadruplo(izq.sentencia);
        Auxiliar.agregarCuadruplo(izq.et_v+'');
        Auxiliar.agregarCuadruplo(pivTemporal + ' = 1;');
        Auxiliar.agregarCuadruplo('goto ' + pivEtiqueta + ';');
        Auxiliar.agregarCuadruplo(izq.et_f+'');
        Auxiliar.agregarCuadruplo(pivTemporal + ' = 0;');
        Auxiliar.agregarCuadruplo(pivEtiqueta+':');
        //---
        
        var et_v = Auxiliar.getEtq()
        var et_f = Auxiliar.getEtq();
        var sentencia = 'if(' + pivTemporal + ' == '+ Auxiliar.obtenerToken(der.cadena) +') goto ' + et_v + ';\ngoto ' + et_f + ';\n';
        Auxiliar.agregarCuadruplo(sentencia);
        Auxiliar.agregarCuadruplo(et_v + ':'); 
        var EtTemporal = Auxiliar.getEtq(); 
        var temporal = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temporal + ' = 0;'); 
        Auxiliar.agregarCuadruplo('goto ' + EtTemporal + ';');
        Auxiliar.agregarCuadruplo(et_f + ':');
        Auxiliar.agregarCuadruplo(temporal + ' = 1;');
        Auxiliar.agregarCuadruplo(EtTemporal + ':');
        
        et_v = Auxiliar.getEtq(); 
        et_f = Auxiliar.getEtq();
        
        sentencia = 'if(' + temporal + ' == 1) goto ' + et_v + ';\ngoto ' + et_f + ';\n';
        Auxiliar.agregarCuadruplo(sentencia); 
        der.et_v = et_v + ': '; 
        der.et_f =  et_f + ': ';
        e_v = der.et_v; 
        e_f = der.et_f;
    }
    else if(Auxiliar.obtenerTipo(izq.cadena) == "(bool)"){
        var pivTemporal = Auxiliar.getTemp(); 
        var pivEtiqueta = Auxiliar.getEtq();
        Auxiliar.agregarCuadruplo(der.sentencia);
        Auxiliar.agregarCuadruplo(der.et_v+'\n');
        Auxiliar.agregarCuadruplo(pivTemporal + ' = 1;');
        Auxiliar.agregarCuadruplo('goto ' + pivEtiqueta + ';');
        Auxiliar.agregarCuadruplo(der.et_f+'');
        Auxiliar.agregarCuadruplo(pivTemporal + ' = 0;');
        Auxiliar.agregarCuadruplo(pivEtiqueta+':');
        
        //---
        
        var et_v = Auxiliar.getEtq();
        var et_f = Auxiliar.getEtq();
        var sentencia = 'if(' + pivTemporal + ' == '+ Auxiliar.obtenerToken(izq.cadena) +') goto ' + et_v + ';\ngoto ' + et_f + ';\n';
        Auxiliar.agregarCuadruplo(sentencia);
        Auxiliar.agregarCuadruplo(et_v + ':'); 
        var EtTemporal = Auxiliar.getEtq(); 
        var temporal = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temporal + ' = 0;');
        Auxiliar.agregarCuadruplo('goto ' + EtTemporal + ';');
        Auxiliar.agregarCuadruplo(et_f + ':');
        Auxiliar.agregarCuadruplo(temporal + ' = 1;');
        Auxiliar.agregarCuadruplo(EtTemporal + ':');
        
        et_v = Auxiliar.getEtq(); 
        et_f = Auxiliar.getEtq();
        
        sentencia = 'if(' + temporal + ' == 1) goto ' + et_v + ';\ngoto ' + et_f + ';\n';
        Auxiliar.agregarCuadruplo(sentencia); 
        der.et_v = et_v + ': '; 
        der.et_f =  et_f + ': ';
        e_v = der.et_v; 
        e_f = der.et_f;
    }
    else
    {
        var pivTemporal = Auxiliar.getTemp(); 
        var pivEtiqueta = Auxiliar.getEtq();
        Auxiliar.agregarCuadruplo(izq.sentencia);
        Auxiliar.agregarCuadruplo(izq.et_v+'');
        Auxiliar.agregarCuadruplo(pivTemporal + ' = 1;');
        Auxiliar.agregarCuadruplo('goto ' + pivEtiqueta + ';');
        Auxiliar.agregarCuadruplo(izq.et_f+'');
        Auxiliar.agregarCuadruplo(pivTemporal + ' = 0;');
        Auxiliar.agregarCuadruplo(pivEtiqueta+':');
        //----
        var pivTemporal2 = Auxiliar.getTemp(); 
        var pivEtiqueta2 = Auxiliar.getEtq();
        Auxiliar.agregarCuadruplo(der.sentencia);
        Auxiliar.agregarCuadruplo(der.et_v+'');
        Auxiliar.agregarCuadruplo(pivTemporal2 + ' = 1;');
        Auxiliar.agregarCuadruplo('goto ' + pivEtiqueta2 + ';');
        Auxiliar.agregarCuadruplo(der.et_f+'');
        Auxiliar.agregarCuadruplo(pivTemporal2 + ' = 0;');
        Auxiliar.agregarCuadruplo(pivEtiqueta2 +':');
        
        //-----------------
        
        var et_v = Auxiliar.getEtq()
        var et_f = Auxiliar.getEtq();
        var sentencia = 'if(' + pivTemporal + ' == '+ pivTemporal2 +') goto ' + et_v + ';\ngoto ' + et_f + ';\n';
        Auxiliar.agregarCuadruplo(sentencia);
        Auxiliar.agregarCuadruplo(et_v + ':'); 
        var EtTemporal = Auxiliar.getEtq(); 
        var temporal = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temporal + ' = 0;'); 
        Auxiliar.agregarCuadruplo('goto ' + EtTemporal + ';');
        Auxiliar.agregarCuadruplo(et_f + ':');
        Auxiliar.agregarCuadruplo(temporal + ' = 1;');
        Auxiliar.agregarCuadruplo(EtTemporal + ':');
        
        et_v = Auxiliar.getEtq(); 
        et_f = Auxiliar.getEtq();
        
        sentencia = 'if(' + temporal + ' == 1) goto ' + et_v + ';\ngoto ' + et_f + ';\n';
        Auxiliar.agregarCuadruplo(sentencia); 
        der.et_v = et_v + ': '; 
        der.et_f =  et_f + ': ';
        e_v = der.et_v; 
        e_f = der.et_f;
    }
    
    nodo = new NodoCuadruplo('',e_v,e_f,'',"(bool)");
    return nodo;
}

function generarExpresion(nodo){
    var valorRet = '';
    var expGenerada = evaluarExp(nodo);

    if(expGenerada.cadena == valNulo)
        return [valNulo,expGenerada.valorTipo];
    
    if(Auxiliar.obtenerTipo(expGenerada.cadena) == "(bool)"){
        valorRet = Auxiliar.obtenerToken(expGenerada.cadena);
    }
    else if(Auxiliar.obtenerTipo(expGenerada.cadena) == "(entero)")
    {
        valorRet = Auxiliar.obtenerToken(expGenerada.cadena);
    }
    else if(Auxiliar.obtenerTipo(expGenerada.cadena) == "(decimal)")
    {
        valorRet = Auxiliar.obtenerToken(expGenerada.cadena);
    }
    else if(Auxiliar.obtenerTipo(expGenerada.cadena) == "(null)")
    {
        valorRet = valNulo;
    }
    else if(Auxiliar.obtenerTipo(expGenerada.cadena) == "(caracter)")
    {
        valorRet = Auxiliar.obtenerToken(expGenerada.cadena);
    }
    else if(Auxiliar.obtenerTipo(expGenerada.valorTipo) == "(cadena)")
    {
        valorRet = expGenerada.cadena;
    }
    else if(Auxiliar.obtenerTipo(expGenerada.cadena) == '(temporal)')
    {
        Auxiliar.agregarCuadruplo(expGenerada.sentencia);
        valorRet = Auxiliar.obtenerToken(expGenerada.cadena);
    }
    else if(expGenerada.et_v!='' && expGenerada.et_f!='')
    {
        valorRet = Auxiliar.getTemp(); var Salida = Auxiliar.getEtq();
        Auxiliar.agregarCuadruplo(expGenerada.sentencia);
        Auxiliar.agregarCuadruplo(expGenerada.et_v+'');
        Auxiliar.agregarCuadruplo(valorRet + ' = 1;');
        Auxiliar.agregarCuadruplo('goto ' + Salida + ';');
        Auxiliar.agregarCuadruplo(expGenerada.et_f+'');
        Auxiliar.agregarCuadruplo(valorRet + ' = 0;');
        Auxiliar.agregarCuadruplo(Salida + ':\n');
    }
    else
    {
        Auxiliar.agregarCuadruplo(expGenerada.sentencia);
        valorRet = (expGenerada.cadena);
    }
    
    return [valorRet,expGenerada.valorTipo];
}

function obtenerPosicion2(agregar){
    var pos = 0;
    for(var i = listaActual.ListaObjetos.length - 1; i >= 0; i--)
    {
        if(listaActual.ListaObjetos[i].Ambito == "metodo" || listaActual.ListaObjetos[i].Ambito == "funcion")
        {
            if(agregar) listaActual.ListaObjetos[i].tamanio++;
            pos = listaActual.ListaObjetos[i].tamanio;
            break;
        }
    } 
    return pos;
}

function validarLlamada(){
    validarLlamada = true;
}

module.exports = {evaluarExp,inicializarErrores,obtenerErrores,enviarListaActual,obtenerPosicion2,validarLlamada}