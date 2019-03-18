var ValorNulo = -123456;
const Auxiliar = require('./Auxiliar.js');
const Expresion = require('./Expresion.js');

class Error{

    constructor(posicion, tipo, descripcion){
        this.posicion = posicion;
        this.tipo = tipo;
        this.descripcion = descripcion;
    }
}

class Variable{
    constructor(tipo,valor,nombreVar,objeto,valTipo,pos,isPuntero,ubicacionPuntero){
        this.tipo = tipo;
        this.valor = valor;
        this.nombreVar = nombreVar;
        this.objeto = objeto;
        this.valTipo = valTipo;
        this.pos = pos;
        this.isPuntero = isPuntero;
        this.ubicacionPuntero = ubicacionPuntero;
    }
}

class ObtenerVariable{
    constructor(nodoId,Dimensiones){
        this.nodoId = nodoId;
        this.Dimensiones = Dimensiones;
    }
}

class Arreglo{
    constructor(visibilidad,tipo,nombre,cantidadTotal,elementosIzq,elementosDer,pos){
        this.visibilidad = visibilidad;
        this.tipo = tipo;
        this.nombre = nombre;
        this.cantidadTotal = cantidadTotal;
        this.elementosIzq = elementosIzq;
        this.elementosDer = elementosDer;
        this.pos = pos;
    }
}

class Funcion{
    constructor(visibilidad,tipoMetodo,nombreMetodo,parametros,cuerpo){
        this.visibilidad = visibilidad;
        this.tipoFuncion = tipoMetodo;
        this.nombreFuncion = nombreMetodo;
        this.paramsFuncion = parametros;
        this.cuerpoFuncion = cuerpo;
    }
}

class Contenido{
    constructor(nombreSimbolo,tipo,Referenciable,ValorSimbolo,IsVar,Retorno,ListParametros,IsFuncion,Dimensiones,Elementos,isArray,ListaObjetos,isObjeto,Posicion,clase,construct,principal,nombreClase,isPuntero,ubicacionPuntero,isEstruct,isInicializado,hereda){
        this.nombreSimbolo = nombreSimbolo;
        this.tipo = tipo;
        this.Referenciable = Referenciable;
        this.ValorSimbolo = ValorSimbolo;
        this.IsVar = IsVar;
        this.Retorno = Retorno;
        this.ListParametros = ListParametros;
        this.IsFuncion = IsFuncion;
        this.Dimensiones = Dimensiones;
        this.Elementos = Elementos;
        this.isArray = isArray;
        this.ListaObjetos = ListaObjetos;
        this.isObjeto = isObjeto;
        this.Posicion = Posicion;
        this.isClase = clase;
        this.isConstructor = construct;
        this.isPrincipal = principal;
        this.nombreClase = nombreClase;
        this.isPuntero = isPuntero;
        //false local, true global
        this.ubicacionPuntero = ubicacionPuntero;
        this.isEstruct = isEstruct;
        this.isInicializado = isInicializado;
        this.nombreHereda = hereda;
    }
}

class Simbolos{
    constructor(Ambito,idLoop,ptnSentencia,EtqInicio,EtqFinal,tamanio,listContenido){
        this.Ambito = Ambito;
        this.idLoop = idLoop;
        this.ptnSentencia = ptnSentencia;
        this.EtqInicio = EtqInicio;
        this.EtqFinal = EtqFinal;
        this.tamanio = tamanio;
        this.listContenido = listContenido;
    }

    ObtenerMetodo(strNombre,strTipo,ListaParametros){
        
        var Existe = false, NombreMetodo = '', Tamanio = 0, NombreClase = '';
        
        console.log('****************************************************************************');
        console.log(this.listContenido);

        for(var i = 0; i < this.listContenido.length; i++)
        {
            if(this.listContenido[i].nombreSimbolo == strNombre  && this.listContenido[i].tipo == strTipo)
            {
                if(this.listContenido[i].ListParametros.length == ListaParametros.length)
                {
                    for(var j = 0;  j < ListaParametros.length; j++)
                    {
                        if(ListaParametros[j][1] == this.listContenido[i].ListParametros[j].tipo || ListaParametros[j][1] == 'array') {
                            Existe = true;
                        }
                        else{
                            Existe = false; break;
                        }
                    }
                    if(ListaParametros.length == 0) Existe = true;
                    if(Existe){
                        NombreMetodo = this.listContenido[i].nombreSimbolo; 
                        Tamanio = this.listContenido[i].Posicion;
                        NombreClase = this.listContenido[i].nombreClase;
                        break;
                    }
                }
            }
        }
        
        return [Existe,NombreMetodo,Tamanio, NombreClase];
    }

    ObtenerReferencias(strNombre,strTipo,ListaParametros){
        var Referencias = [];
        var Existe = false;
        
        for(var i = 0; i < this.listContenido.length; i++)
        {
            if(this.listContenido[i].nombreSimbolo == strNombre  && this.listContenido[i].tipo == strTipo)
            {
                if(this.listContenido[i].ListParametros.length == ListaParametros.length)
                {
                    for(var j = 0;  j < ListaParametros.length; j++)
                    {
                        if(ListaParametros[j][1] == this.listContenido[i].ListParametros[j].tipo) {
                            Existe = true;
                        }
                        else{
                            Existe = false; break;
                        }
                    }
                    if(ListaParametros.length == 0) Existe = true;
                    if(Existe && ListaParametros.length > 0)
                    {
                        for(var j = 0;  j < ListaParametros.length; j++)
                        {
                            Referencias.push(this.listContenido[i].ListParametros[j].Referenciable);
                        }
                        break;
                    }
                }
            }
        }
        
        return Referencias;
    }

    existeStruct(nombreEstructura){
        var Existe = false;
        
        for(var i = 0; i < this.listContenido.length; i++)
        {
            if(this.listContenido[i].nombreSimbolo == nombreEstructura && this.listContenido[i].isObjeto)
            {
                Existe = true;
                break;
            }
        }
        
        return Existe;
    }

    existeSimbolo(nombre){
        var existe = false;
        
        for(var i = 0; i < this.listContenido.length; i++)
        {
            if(this.listContenido[i].nombreSimbolo == nombre && this.listContenido[i].IsVar)
            {
                existe = true;
                break;
            }
        }
        
        return existe;
    }   

    existeFuncion(nombreFun,tipoFun,paramFun){
        var Existe = false;
        for(var i = 0; i < this.listContenido.length; i++){
            
            if(this.listContenido[i].nombreSimbolo == nombreFun){
                var cant1 = this.listContenido[i].ListParametros.length;
                var cant2 = paramFun.length;

                if(cant1 == cant2){
                    if(cant1 > 0){
                        for(var j = 0; j < paramFun.length; j++){
                            if(paramFun[j].tipo == this.listContenido[i].ListParametros[j].tipo){
                                Existe = true;
                            }
                            else{
                                Existe = false; break;
                            }
                        }
                        if(Existe){ break; }
                    }
                    else{
                        Existe = true;
                    }
                }
            }
        }
        return Existe;
    }

    obtenerValGeneralSym(nodoId,Dimensiones,Lista,Contador,IsGlobal,StackSym,listaActual){
        debugger;
        var Existe = false;
        var Valor = ValorNulo;
        var TipoValor = '';

        var tipo_val = nodoId.getEtiqueta();
         
        if(tipo_val == 'id' || tipo_val == 'arreglo'){
            if(tipo_val == 'arreglo'){
                nodoId = nodoId.getHijos()[0];
            }    
            for(var i = 0; i < Lista.length; i++)
            {
                var strNombreVariable = nodoId.getValor();

                console.log(Lista[i].nombreSimbolo + ' = ' + strNombreVariable);
                console.log(Lista[i].IsVar);
                console.log(nodoId.getHijos().length + ' = ' + Contador);
                console.log(IsGlobal);
            
                //Entra acá si queremos obtener el valor de un atributo.
                if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar && IsGlobal)
                {
                    if(Lista[i].isArray && Dimensiones.length > 0)
                    {
                        var resultado = MapeoLexicografico(Lista[i].Dimensiones,Dimensiones);

                        var posThis = Auxiliar.getTemp();
                        var valThis = Auxiliar.getTemp();
                        var posRelativaThis = Auxiliar.getTemp();
                        var posActual = Auxiliar.getTemp();   
                        var valorObtenido = Auxiliar.getTemp();  
                        
                        Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                        Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                        Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 
                        //Obtenemos posicion inicial del arreglo
                        Auxiliar.agregarCuadruplo(posActual + ' = heap['+posRelativaThis+'];     //inicio de arreglo \n');
                        Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + Lista[i].Dimensiones.length + ';   //le sumamos el numero de dimensiones');
                        Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + 2;  //le sumamos los dos espacios iniciales');
                        Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + resultado + ';  //le sumamos el mapeo lexicografico');
                        Auxiliar.agregarCuadruplo(valorObtenido + ' = heap[' + posActual + '];');
                        Existe = true; Valor = valorObtenido; TipoValor = Lista[i].tipo; 
                        return [Existe,Valor,TipoValor];
                    }
                    
                    var posThis = Auxiliar.getTemp();
                    var valThis = Auxiliar.getTemp();
                    var posRelativaThis = Auxiliar.getTemp();
                    var temporal = Auxiliar.getTemp();

                    Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                    Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                    Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 
                    Auxiliar.agregarCuadruplo(temporal + ' = heap[' + posRelativaThis + ']; //Obtienendo el contenido de la variable ' + Lista[i].nombreSimbolo + '\n');

                    Existe = true; Valor = temporal; TipoValor = Lista[i].tipo;
                }

                //Queremos obtener el valor de una varaible local.
                else if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar)
                {
                    if(Lista[i].isArray)
                    { 
                        //Entramos si queremos obtener todo el arreglo como tal (referencia)
                        if(Dimensiones.length == 0)
                        {
                            var temporal1 = Auxiliar.getTemp();
                            var temporal2 = Auxiliar.getTemp();
                            Auxiliar.agregarCuadruplo(temporal1 + ' = S + ' + Lista[i].Posicion + ';\n');
                            Auxiliar.agregarCuadruplo(temporal2 + ' = stack[' + temporal1 + '];\n');
                            Existe = true; Valor = temporal2; TipoValor = 'array';
                            return [Existe,Valor,TipoValor];
                        }
                        else
                        {
                            //Queremos obtener una posicion especifica del arreglo. 

                            var resultado = MapeoLexicografico(Lista[i].Dimensiones,Dimensiones);
                            var posActual = Auxiliar.getTemp();     
                            var temporal1 = Auxiliar.getTemp();
                            var valorObtenido = Auxiliar.getTemp(); 

                            Auxiliar.agregarCuadruplo(temporal1 + ' = S + ' + Lista[i].Posicion + ';');
                            //Obtenemos posicion inicial del arreglo
                            Auxiliar.agregarCuadruplo(posActual + ' = stack['+temporal1+'];     //inicio de arreglo \n');
                            Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + Lista[i].Dimensiones.length + ';   //le sumamos el numero de dimensiones');
                            Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + 2;  //le sumamos los dos espacios iniciales');
                            Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + resultado + ';  //le sumamos el mapeo lexicografico');
                            Auxiliar.agregarCuadruplo(valorObtenido + ' = heap[' + posActual + '];');
                            Existe = true; Valor = valorObtenido; TipoValor = Lista[i].tipo; 
                            return [Existe,Valor,TipoValor];
                        }
                    }
                    var aux ='';
                    var temporal = Auxiliar.getTemp();
                    var temporal2 = Auxiliar.getTemp();
                    var temporal3 = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo(temporal + ' = S + ' + Lista[i].Posicion + ';');
                    Auxiliar.agregarCuadruplo(temporal2 + ' = stack[' + temporal + ']; //Obtienendo el contenido de la variable ' + Lista[i].nombreSimbolo + '');
                    aux = temporal2;
                    if(Lista[i].isPuntero){
                        
                        if(Lista[i].ubicacionPuntero){
                            Auxiliar.agregarCuadruplo(temporal3 + ' = heap[' + temporal2 + ']; //Obtienendo el contenido de la variable ' + Lista[i].nombreSimbolo + '');
                        aux = temporal3;
                        }else{
                            Auxiliar.agregarCuadruplo(temporal3 + ' = stack[' + temporal2 + ']; //Obtienendo el contenido de la variable ' + Lista[i].nombreSimbolo + '');
                            aux = temporal3;
                        }
                        
                    }
                    Existe = true; 
                    Valor = aux; 
                    TipoValor = Lista[i].tipo;
                    
                }            
            }
        }
        else if(tipo_val == 'objeto'){
            for(var i = 0; i < Lista.length; i++)
            {
                var strNombreVariable = nodoId.getHijos()[0].getValor();
                
                //Entra si viene una lista de atributos y ademas es global.
                if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar && IsGlobal)
                {
                    if(Lista[i].isArray){
                        var temporal = Auxiliar.getTemp();
                        var HeapPivote = Auxiliar.getTemp();
                        var posThis = Auxiliar.getTemp();
                        var valThis = Auxiliar.getTemp();
                        var posRelativaThis = Auxiliar.getTemp();

                        Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                        Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                        Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 
                        Auxiliar.agregarCuadruplo(HeapPivote + ' = ' + ' heap[' + posRelativaThis + ']; ');

                        var temporal3 = Auxiliar.getTemp(); 
                        Auxiliar.agregarCuadruplo(temporal3 + ' = heap['+HeapPivote+'];   //tamanio de arreglo\n');
                        
                        Existe = true; Valor = temporal3, TipoValor = "(entero)";
                        return [Existe,Valor,TipoValor];
                    }
                    else if(Lista[i].isObjeto)
                    {
                        if(Lista[i].isEstruct){
                            if(!Lista[i].isInicializado){
                                var tempo = Auxiliar.getTemp();
                                var posThis = Auxiliar.getTemp();
                                var valThis = Auxiliar.getTemp();
                                var posRelativaThis = Auxiliar.getTemp();

                                Auxiliar.agregarCuadruplo(tempo + ' = H; '); 

                                Auxiliar.agregarCuadruplo('H = H + ' + Lista[i].ListaObjetos.length.toString() + '; //Aumentamos el puntero el numero de atributos. \n')
                                Auxiliar.aumPunteroH_en(Lista[i].ListaObjetos.length);

                                decVarStruct(Lista[i].ListaObjetos,tempo,listaActual);
                                
                                Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                                Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                                Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 
                                Auxiliar.agregarCuadruplo('heap[' + posRelativaThis + '] = ' + tempo + ';     //Se crea la variable global ' + Lista[i].nombreSimbolo + '\n');

                                Lista[i].isInicializado = true;
                            }
                        }
                        var temporal = Auxiliar.getTemp();
                        var HeapPivote = Auxiliar.getTemp();
                        var posThis = Auxiliar.getTemp();
                        var valThis = Auxiliar.getTemp();
                        var posRelativaThis = Auxiliar.getTemp();

                        Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                        Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                        Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 
                        Auxiliar.agregarCuadruplo(HeapPivote + ' = ' + ' heap[' + posRelativaThis + ']; ');
                        return RecursivoObtenerValGeneral(nodoId.getHijos()[1],Dimensiones,Lista[i].ListaObjetos,Contador + 1,IsGlobal,HeapPivote,StackSym,listaActual,strNombreVariable);
                    }
                }

                //Entra si es una lista de atributos y es local.
                else if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar)
                {
                    if(Lista[i].isArray){
                        var temporal = Auxiliar.getTemp();
                        var temporal2 = Auxiliar.getTemp();
                        Auxiliar.agregarCuadruplo(temporal + ' = ' + ' S + ' + Lista[i].Posicion + '; \n');
                        Auxiliar.agregarCuadruplo(temporal2 + ' = ' + ' stack[' + temporal + ']; //Obteniendo posicion inicio de ' + strNombreVariable + ' \n');
                        var temporal3 = Auxiliar.getTemp(); 
                        Auxiliar.agregarCuadruplo(temporal3 + ' = heap['+temporal2+'];   //tamanio de arreglo\n');

                        Existe = true; Valor = temporal3, TipoValor = "(entero)";
                        return [Existe,Valor,TipoValor];
                    }
                    if(Lista[i].isObjeto)
                    {
                        if(Lista[i].isEstruct){
                            if(!Lista[i].isInicializado){
                                var tempo = Auxiliar.getTemp();
                    
                                Auxiliar.agregarCuadruplo(tempo + ' = H; '); 

                                Auxiliar.agregarCuadruplo('H = H + ' + Lista[i].ListaObjetos.length.toString() + '; //Aumentamos el puntero el numero de atributos. \n')
                                Auxiliar.aumPunteroH_en(Lista[i].ListaObjetos.length);

                                decVarStruct(Lista[i].ListaObjetos,tempo,listaActual);
                                
                                var temporal = Auxiliar.getTemp();
                                var temporal2 = Auxiliar.getTemp();
                                Auxiliar.agregarCuadruplo(temporal + ' = ' + ' S + ' + Lista[i].Posicion + '; ');
                                Auxiliar.agregarCuadruplo('stack[' + temporal + '] = ' + tempo + ';     //Se crea la variable local ' + Lista[i].nombreSimbolo + '\n');

                                Lista[i].isInicializado = true;
                            }
                        }
                        var temporal = Auxiliar.getTemp();
                        var temporal2 = Auxiliar.getTemp();
                        Auxiliar.agregarCuadruplo(temporal + ' = ' + ' S + ' + Lista[i].Posicion + '; \n');
                        Auxiliar.agregarCuadruplo(temporal2 + ' = ' + ' stack[' + temporal + ']; //Obteniendo posicion inicio de ' + strNombreVariable + ' \n');
                        return RecursivoObtenerValGeneral(nodoId.getHijos()[1],Dimensiones,Lista[i].ListaObjetos,Contador + 1,IsGlobal,temporal2,StackSym,listaActual,strNombreVariable);
                    }
                }
            }
            return [Existe,Valor,TipoValor];
        }
        return [Existe,Valor,TipoValor];
    }

    obtenerValGeneralSym2(nodoFuncion,Dimensiones,Lista,Contador,IsGlobal,ListaParametros){
        
        var Existe = false;
        var Valor = ValorNulo;
        var TipoValor = "";
        var lis;
        var nodo;
        var cont;     
        var isThis = "";
       
        
        for(var i = 0; i < Lista.length; i++)
        {
            var strNombreVariable = nodoFuncion.getHijos()[0].getValor();
    
            console.log(Lista[i].nombreSimbolo + ' = ' + strNombreVariable);
            console.log(Lista[i].IsVar);
            console.log(nodoFuncion.getHijos().length + ' = ' + Contador);
            console.log(IsGlobal);
    
            if((Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsFuncion && nodoFuncion.getHijos().length >= 2)){
                
                if(Lista[i].ListParametros.length == ListaParametros.length)
                {
                    for(var j = 0;  j < ListaParametros.length; j++)
                    {
                        if(ListaParametros[j][1] == Lista[i].ListParametros[j].tipo || ListaParametros[j][1] == 'array') {
                            Existe = true;
                            if(Lista[i].ValorSimbolo!=null){
                                isThis = Lista[i].ValorSimbolo;
                            }
                        }
                        else{
                            Existe = false; break;
                        }
                    }
                    if(ListaParametros.length == 0){
                        Existe = true;
                        if(Lista[i].ValorSimbolo!=null){
                            isThis = Lista[i].ValorSimbolo;
                        }
                    } 
                    if(Existe){
                        lis = Lista;
                        nodo = nodoFuncion;
                        cont = i;
                        break;
                    }
                }
               
                
            }
            
        }
        
        return [Existe,lis,nodo,cont,isThis];
    }

    obtenerValGeneralSym3(nodoId,Dimensiones,Lista,Contador,IsGlobal,StackSym,listaActual){
        
        var Existe = false;
        var Valor = ValorNulo;
        var TipoValor = '';
        var ubicacionPuntero = null;

        var tipo_val = nodoId.getEtiqueta();
         
        if(tipo_val == 'id' || tipo_val == 'arreglo'){
            if(tipo_val == 'arreglo'){
                nodoId = nodoId.getHijos()[0];
            }    
            for(var i = 0; i < Lista.length; i++)
            {
                var strNombreVariable = nodoId.getValor();

                console.log(Lista[i].nombreSimbolo + ' = ' + strNombreVariable);
                console.log(Lista[i].IsVar);
                console.log(nodoId.getHijos().length + ' = ' + Contador);
                console.log(IsGlobal);
            
                
                //Entra acá si queremos obtener el valor de un atributo.
                if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar && IsGlobal)
                {
                    if(Lista[i].isArray && Dimensiones.length > 0)
                    {
                        var resultado = MapeoLexicografico(Lista[i].Dimensiones,Dimensiones);

                        var posThis = Auxiliar.getTemp();
                        var valThis = Auxiliar.getTemp();
                        var posRelativaThis = Auxiliar.getTemp();
                        var posActual = Auxiliar.getTemp();   
                        var valorObtenido = Auxiliar.getTemp();  
                        
                        Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                        Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                        Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 
                        //Obtenemos posicion inicial del arreglo
                        Auxiliar.agregarCuadruplo(posActual + ' = heap['+posRelativaThis+'];     //inicio de arreglo \n');
                        Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + Lista[i].Dimensiones.length + ';   //le sumamos el numero de dimensiones');
                        Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + 2;  //le sumamos los dos espacios iniciales');
                        Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + resultado + ';  //le sumamos el mapeo lexicografico');
                        Auxiliar.agregarCuadruplo(valorObtenido + ' = heap[' + posActual + '];');
                        Existe = true; Valor = valorObtenido; TipoValor = Lista[i].tipo; 
                        return [Existe,Valor,TipoValor,true];
                    }
                    
                    var posThis = Auxiliar.getTemp();
                    var valThis = Auxiliar.getTemp();
                    var posRelativaThis = Auxiliar.getTemp();
                    var temporal = Auxiliar.getTemp();

                    Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                    Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                    Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 

                    Existe = true; Valor = posRelativaThis; TipoValor = Lista[i].tipo; ubicacionPuntero = true;
                }

                //Queremos obtener el valor de una varaible local.
                else if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar)
                {
                    if(Lista[i].isArray)
                    { 
                        //Entramos si queremos obtener todo el arreglo como tal (referencia)
                        if(Dimensiones.length == 0)
                        {
                            var temporal1 = Auxiliar.getTemp();
                            var temporal2 = Auxiliar.getTemp();
                            Auxiliar.agregarCuadruplo(temporal1 + ' = S + ' + Lista[i].Posicion + ';\n');
                            Auxiliar.agregarCuadruplo(temporal2 + ' = stack[' + temporal1 + '];\n');
                            Existe = true; Valor = temporal2; TipoValor = 'array';
                            return [Existe,Valor,TipoValor,false];
                        }
                        else
                        {
                            //Queremos obtener una posicion especifica del arreglo. 

                            var resultado = MapeoLexicografico(Lista[i].Dimensiones,Dimensiones);
                            var posActual = Auxiliar.getTemp();     
                            var temporal1 = Auxiliar.getTemp();
                            var valorObtenido = Auxiliar.getTemp(); 

                            Auxiliar.agregarCuadruplo(temporal1 + ' = S + ' + Lista[i].Posicion + ';');
                            //Obtenemos posicion inicial del arreglo
                            Auxiliar.agregarCuadruplo(posActual + ' = stack['+temporal1+'];     //inicio de arreglo \n');
                            Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + Lista[i].Dimensiones.length + ';   //le sumamos el numero de dimensiones');
                            Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + 2;  //le sumamos los dos espacios iniciales');
                            Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + resultado + ';  //le sumamos el mapeo lexicografico');
                            Auxiliar.agregarCuadruplo(valorObtenido + ' = heap[' + posActual + '];');
                            Existe = true; Valor = valorObtenido; TipoValor = Lista[i].tipo; ubicacionPuntero =false;
                            return [Existe,Valor,TipoValor, ubicacionPuntero];
                        }
                    }
                    
                    var temporal = Auxiliar.getTemp();
                    var temporal2 = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo(temporal + ' = S + ' + Lista[i].Posicion + ';');
                   
                    Existe = true; 
                    Valor = temporal; 
                    TipoValor = Lista[i].tipo;
                    ubicacionPuntero = false;
                    
                }            
            }
        }
        else if(tipo_val == 'objeto'){
            for(var i = 0; i < Lista.length; i++)
            {
                var strNombreVariable = nodoId.getHijos()[0].getValor();
                
                //Entra si viene una lista de atributos y ademas es global.
                if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar && IsGlobal)
                {
                    if(Lista[i].isArray){
                        var temporal = Auxiliar.getTemp();
                        var HeapPivote = Auxiliar.getTemp();
                        var posThis = Auxiliar.getTemp();
                        var valThis = Auxiliar.getTemp();
                        var posRelativaThis = Auxiliar.getTemp();

                        Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                        Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                        Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 
                        Auxiliar.agregarCuadruplo(HeapPivote + ' = ' + ' heap[' + posRelativaThis + ']; ');

                        var temporal3 = Auxiliar.getTemp(); 
                        Auxiliar.agregarCuadruplo(temporal3 + ' = heap['+HeapPivote+'];   //tamanio de arreglo\n');
                        
                        Existe = true; Valor = temporal3, TipoValor = "(entero)";
                        return [Existe,Valor,TipoValor,true];
                    }
                    else if(Lista[i].isObjeto)
                    {
                        var temporal = Auxiliar.getTemp();
                        var HeapPivote = Auxiliar.getTemp();
                        var posThis = Auxiliar.getTemp();
                        var valThis = Auxiliar.getTemp();
                        var posRelativaThis = Auxiliar.getTemp();

                        Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                        Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                        Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 
                        Auxiliar.agregarCuadruplo(HeapPivote + ' = ' + ' heap[' + posRelativaThis + ']; ');
                        return RecursivoObtenerValGeneral2(nodoId.getHijos()[1],Dimensiones,Lista[i].ListaObjetos,Contador + 1,IsGlobal,HeapPivote,StackSym,listaActual,strNombreVariable);
                    }
                }

                //Entra si es una lista de atributos y es local.
                else if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar)
                {
                    if(Lista[i].isArray){
                        var temporal = Auxiliar.getTemp();
                        var temporal2 = Auxiliar.getTemp();
                        Auxiliar.agregarCuadruplo(temporal + ' = ' + ' S + ' + Lista[i].Posicion + '; \n');
                        Auxiliar.agregarCuadruplo(temporal2 + ' = ' + ' stack[' + temporal + ']; //Obteniendo posicion inicio de ' + strNombreVariable + ' \n');
                        var temporal3 = Auxiliar.getTemp(); 
                        Auxiliar.agregarCuadruplo(temporal3 + ' = heap['+temporal2+'];   //tamanio de arreglo\n');

                        Existe = true; Valor = temporal3, TipoValor = "(entero)";
                        return [Existe,Valor,TipoValor,false];
                    }
                    if(Lista[i].isObjeto)
                    {
                        var temporal = Auxiliar.getTemp();
                        var temporal2 = Auxiliar.getTemp();
                        Auxiliar.agregarCuadruplo(temporal + ' = ' + ' S + ' + Lista[i].Posicion + '; \n');
                        Auxiliar.agregarCuadruplo(temporal2 + ' = ' + ' stack[' + temporal + ']; //Obteniendo posicion inicio de ' + strNombreVariable + ' \n');
                        return RecursivoObtenerValGeneral2(nodoId.getHijos()[1],Dimensiones,Lista[i].ListaObjetos,Contador + 1,IsGlobal,temporal2,StackSym,listaActual,strNombreVariable);
                    }
                }
            }
            return [Existe,Valor,TipoValor,ubicacionPuntero];
        }
        return [Existe,Valor,TipoValor,ubicacionPuntero];
    }

    AsignarValorGeneral(ptnId,Valor,Dimensiones,strTipoValor,Lista,Contador,IsGlobal,IsNuevo,listaActual,StackSym){
        var Existe = false;
        debugger;
        for(var i = 0; i < Lista.length; i++)
        {
            
            var strNombreVariable = ptnId.getHijos()[Contador].getValor();
            console.log(Lista[i].nombreSimbolo + ' = ' + strNombreVariable);
            console.log(Lista[i].IsVar);
            console.log((ptnId.getHijos().length - 1) + ' = ' + Contador);
            console.log(IsGlobal);

            var tipo_val = ptnId.getHijos()[1].getEtiqueta();
            var isCadena = false;
            var cadena = '';
            if(tipo_val == 'exp'){
                if(ptnId.getHijos()[1].getHijos()[0].getEtiqueta() == 'string_cad'){
                    isCadena = true;
                    cadena = ptnId.getHijos()[1].getHijos()[0].getValor().replace(/\"/g,"").replace(/\'/g,"");
                    console.log(cadena);
                }
            }

            var tipo = ptnId.getEtiqueta();

            switch (tipo) {
                case "arreglo":
                case "lista":
                    //Entra si el id es global. 
                    if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar && IsGlobal)
                    {
                        if(Lista[i].isArray)
                        {   
                            if(Lista[i].isObjeto)
                            {
                                //Entra si vamos a hacer una nueva instancia else si no es instancia pero si pasamos un objeto
                                if(IsNuevo)
                                {
                                    if(Lista[i].tipo == strTipoValor)
                                    {
                                        var nodoInstancia = ptnId.getHijos()[2];
                                        var nombreInstancia = nodoInstancia.getHijos()[0].getHijos()[0].getValor();
                                        var paramsInstancia = nodoInstancia.getHijos()[1];
                                        var tempo = Auxiliar.getTemp();
                                        
                                        var temp1 = Auxiliar.getTemp();
                                        var temp2 = Auxiliar.getTemp();

                                        var tipoParamInstancia = [];
                                        var nombreLlamada = '';
                                        var CambioAmbito = Expresion.obtenerPosicion2(false) + 2;

                                        Auxiliar.agregarCuadruplo('//Iniciando instancia de clase: ' + strTipoValor);
                                        Auxiliar.agregarCuadruplo(tempo + ' = H;        //posicion donde inicia nuevo objeto \n'); 
                                        Auxiliar.agregarCuadruplo(temp1 + ' = S + '+CambioAmbito+';    //cambio simulado a constructor de: ' + nombreInstancia); 
                                        Auxiliar.agregarCuadruplo(temp2 + ' = ' + temp1 + ' + 0;    //Pos del this de constructor');
                                        Auxiliar.agregarCuadruplo('stack[' +temp2+ '] = '+ tempo + ';     //Val del this \n');

                                        
                                        for(var h = 0; h<paramsInstancia.getHijos().length; h++){
                                            var temp3 = Auxiliar.getTemp();
                                            var param = paramsInstancia.getHijos()[h];
                                            Auxiliar.agregarCuadruplo(temp3 + ' = ' + temp1 + ' + ' + (h + 2) + ';  //pos de parametro numero:' + (h + 1));
                                            Expresion.enviarListaActual(listaActual,StackSym);
                                            var expGenerada = Expresion.evaluarExp(param);
                                            tipoParamInstancia.push(expGenerada.valorTipo.replace("(","").replace(")",""));

                                            var valorRet = ValorNulo;

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
                                                valorRet = ValorNulo;
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
                                            

                                            Auxiliar.agregarCuadruplo('stack['+temp3+'] = ' + valorRet + ';    //asignamos valor a la posicion del parametro \n');
                                        }

                                        Auxiliar.agregarCuadruplo("S = S + "+CambioAmbito+";   //cambiamos ambito");

                                        nombreLlamada = 'call ' + nombreInstancia.toLowerCase() + '@' + nombreInstancia.toLowerCase();

                                        for(var j = 0; j < tipoParamInstancia.length; j ++){
                                            nombreLlamada += '@' + tipoParamInstancia[j];
                                        }
                                        
                                        nombreLlamada += '();     //nombre de metodo';
                                        Auxiliar.agregarCuadruplo(nombreLlamada);
                                        Auxiliar.agregarCuadruplo("S = S - "+CambioAmbito+";   //regresamos al ambito\n");

                                        //Comenzamos con la parte del arreglo
                                        var resultado = MapeoLexicografico(Lista[i].Dimensiones,Dimensiones);

                                        var posThis = Auxiliar.getTemp();
                                        var valThis = Auxiliar.getTemp();
                                        var posRelativaThis = Auxiliar.getTemp();
                                        var posActual = Auxiliar.getTemp();     
                                        
                                        Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                                        Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                                        Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 
                                        //Obtenemos posicion inicial del arreglo
                                        Auxiliar.agregarCuadruplo(posActual + ' = heap['+posRelativaThis+'];     //inicio de arreglo \n');
                                        Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + Lista[i].Dimensiones.length + ';   //le sumamos el numero de dimensiones');
                                        Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + 2;  //le sumamos los dos espacios iniciales');
                                        Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + resultado + ';  //le sumamos el mapeo lexicografico');
                                        Auxiliar.agregarCuadruplo('heap[' + posActual + '] = ' + tempo + '; //Asignando al arreglo global ' + Lista[i].nombreSimbolo + '\n');
                                        Existe = true;
                                        return Existe;
                                    }
                                    else
                                    {}
                                }
                                else
                                {
                                    var resultado = MapeoLexicografico(Lista[i].Dimensiones,Dimensiones);

                                    var posThis = Auxiliar.getTemp();
                                    var valThis = Auxiliar.getTemp();
                                    var posRelativaThis = Auxiliar.getTemp();
                                    var posActual = Auxiliar.getTemp();     
                                    
                                    Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                                    Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                                    Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 
                                    //Obtenemos posicion inicial del arreglo
                                    Auxiliar.agregarCuadruplo(posActual + ' = heap['+posRelativaThis+'];     //inicio de arreglo \n');
                                    Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + Lista[i].Dimensiones.length + ';   //le sumamos el numero de dimensiones');
                                    Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + 2;  //le sumamos los dos espacios iniciales');
                                    Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + resultado + ';  //le sumamos el mapeo lexicografico');
                                    Auxiliar.agregarCuadruplo('heap[' + posActual + '] = ' + Valor + '; //Asignando al arreglo global ' + Lista[i].nombreSimbolo + '\n');
                                    Existe = true;
                                    return Existe;
                                }
                                return Existe;
                            }
                            //Verificar si lo que traigo es un string
                            else if(isCadena){
                                
                                var posicion = 0;
                                var escape = false;
                                var listaCaracteres = [];

                                Auxiliar.agregarCuadruplo('//Inicio de asignacion a arreglo de la cadena: \"' + cadena + '\" \n' );

                                for(var k = 0; k < cadena.length; k++){
                                    if(cadena[k] == '\\' && !escape)
                                    {
                                        escape = true;
                                        posicion = k;
                                    }
                                    else if(escape)
                                    {
                                        var TipoCaracterEspecial = cadena[k];
                                        switch(TipoCaracterEspecial)
                                        {
                                            case 'n': 
                                            listaCaracteres.push(10);
                                            
                                                break;
                                            case '\\':
                                            listaCaracteres.push(92);
                                            
                                                break;
                                            case 't':
                                            listaCaracteres.push(9);
                                            
                                                break;
                                        }
                                        posicion = k;
                                        escape = false;
                                    }
                                    else
                                    {
                                        listaCaracteres.push(cadena.charCodeAt(k));
                                        posicion = k;
                                    }
                                }

                                var posThis = Auxiliar.getTemp();
                                var valThis = Auxiliar.getTemp();
                                var posRelativaThis = Auxiliar.getTemp();
                                var posActual = Auxiliar.getTemp();
                                var tamTotal = Auxiliar.getTemp();
                                
                                
                                var tamInicial = 1;
                                for(var l = 0; l<Lista[i].Dimensiones.length;l++){
                                    tamInicial = tamInicial * Lista[i].Dimensiones[l];
                                }
                                 
                                
                                Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                                Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                                Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 
                                //Obtenemos posicion inicial del arreglo
                                Auxiliar.agregarCuadruplo(posActual + ' = heap['+posRelativaThis+'];     //inicio de arreglo \n');
                                Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + Lista[i].Dimensiones.length + ';   //le sumamos el numero de dimensiones');
                                Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + 2;  //le sumamos los dos espacios iniciales');
                                //Final del for, tamanio total + ini arreglo.
                                Auxiliar.agregarCuadruplo(tamTotal + ' = ' + tamInicial + ' + ' + posActual + ';  //tamanio total mas inico de arreglo \n');

                                var for_v = Auxiliar.getEtq();
                                var for_f = Auxiliar.getEtq();
                                var tempo = Auxiliar.getTemp();
                        
                                Auxiliar.agregarCuadruplo('if ('+ tamInicial + ' >= '+ listaCaracteres.length+') goto '+for_v+';\n'+'goto ' + for_f +';\n');
                                Auxiliar.agregarCuadruplo(for_v + ':');

                                for(var p = 0; p<listaCaracteres.length;p++){
                                    Auxiliar.agregarCuadruplo(tempo + ' = ' + posActual + ' + ' + p + ';');
                                    Auxiliar.agregarCuadruplo('heap[' + tempo + '] = ' + listaCaracteres[p] + '; \n');
                                    
                                }
                                Auxiliar.agregarCuadruplo(for_f + ':');
                                Existe = true;
                                return Existe;

                            }
                            else if(Dimensiones.length == null || Dimensiones.length == 0){
                                
                                var posThis = Auxiliar.getTemp();
                                var valThis = Auxiliar.getTemp();
                                var posRelativaThis = Auxiliar.getTemp();

                                Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                                Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                                Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 
                                Auxiliar.agregarCuadruplo('heap[' + posRelativaThis + '] = ' + Valor + ';     //Se asigna al arreglo global ' + Lista[i].nombreSimbolo  + '\n');
                                Existe = true;
                                return Existe;
                            }
                            else{
                                var resultado = MapeoLexicografico(Lista[i].Dimensiones,Dimensiones);

                                var posThis = Auxiliar.getTemp();
                                var valThis = Auxiliar.getTemp();
                                var posRelativaThis = Auxiliar.getTemp();
                                var posActual = Auxiliar.getTemp();     
                                
                                Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                                Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                                Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 
                                //Obtenemos posicion inicial del arreglo
                                Auxiliar.agregarCuadruplo(posActual + ' = heap['+posRelativaThis+'];     //inicio de arreglo \n');
                                Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + Lista[i].Dimensiones.length + ';   //le sumamos el numero de dimensiones');
                                Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + 2;  //le sumamos los dos espacios iniciales');
                                Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + resultado + ';  //le sumamos el mapeo lexicografico');
                                Auxiliar.agregarCuadruplo('heap[' + posActual + '] = ' + Valor + '; //Asignando al arreglo global ' + Lista[i].nombreSimbolo + '\n');
                                Existe = true;
                                return Existe;
                            }
                        }
                        
                        if(Lista[i].isObjeto)
                        {
                            //Entra si vamos a hacer una nueva instancia else si no es instancia pero si pasamos un objeto
                            if(IsNuevo)
                            {
                                if(Lista[i].tipo == strTipoValor)
                                {
                                    var nodoInstancia = ptnId.getHijos()[1];
                                    var nombreInstancia = nodoInstancia.getHijos()[0].getHijos()[0].getValor();
                                    var paramsInstancia = nodoInstancia.getHijos()[1];
                                    var tempo = Auxiliar.getTemp();
                                    
                                    var temp1 = Auxiliar.getTemp();
                                    var temp2 = Auxiliar.getTemp();

                                    var tipoParamInstancia = [];
                                    var nombreLlamada = '';
                                    

                                    Auxiliar.agregarCuadruplo('//Iniciando instancia de clase: ' + strTipoValor);
                                    Auxiliar.agregarCuadruplo(tempo + ' = H;        //posicion donde inicia nuevo objeto \n'); 
                                    Auxiliar.agregarCuadruplo(temp1 + ' = S + 1;    //cambio simulado a constructor de: ' + nombreInstancia); 
                                    Auxiliar.agregarCuadruplo(temp2 + ' = ' + temp1 + ' + 0;    //Pos del this de constructor');
                                    Auxiliar.agregarCuadruplo('stack[' +temp2+ '] = '+ tempo + ';     //Val del this \n');

                                    
                                    for(var h = 0; h<paramsInstancia.getHijos().length; h++){
                                        var temp3 = Auxiliar.getTemp();
                                        var param = paramsInstancia.getHijos()[h];
                                        Auxiliar.agregarCuadruplo(temp3 + ' = ' + temp1 + ' + ' + (h + 2) + ';  //pos de parametro numero:' + (h + 1));
                                        Expresion.enviarListaActual(listaActual,StackSym);
                                        var expGenerada = Expresion.evaluarExp(param);
                                        tipoParamInstancia.push(expGenerada.valorTipo.replace("(","").replace(")",""));

                                        var valorRet = ValorNulo;

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
                                            valorRet = ValorNulo;
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
                                        

                                        Auxiliar.agregarCuadruplo('stack['+temp3+'] = ' + valorRet + ';    //asignamos valor a la posicion del parametro \n');
                                    }

                                    Auxiliar.agregarCuadruplo("S = S + 1;   //cambiamos ambito");

                                    nombreLlamada = 'call ' + nombreInstancia.toLowerCase() + '@' + nombreInstancia.toLowerCase();

                                    for(var j = 0; j < tipoParamInstancia.length; j ++){
                                        nombreLlamada += '@' + tipoParamInstancia[j];
                                    }
                                    
                                    nombreLlamada += '();     //nombre de metodo';
                                    Auxiliar.agregarCuadruplo(nombreLlamada);
                                    Auxiliar.agregarCuadruplo("S = S - 1;   //regresamos al ambito\n");

                                    var posThis = Auxiliar.getTemp();
                                    var valThis = Auxiliar.getTemp();
                                    var posRelativaThis = Auxiliar.getTemp();

                                    
                                    Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                                    Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                                    Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+nombreInstancia+'\"'); 
                                    Auxiliar.agregarCuadruplo('heap[' + posRelativaThis + '] = ' + tempo + ';     //Se crea la variable global ' + nombreInstancia + '\n');
                                    Existe = true;
                                }
                                else
                                {}
                            }
                            else
                            {
                                var posThis = Auxiliar.getTemp();
                                var valThis = Auxiliar.getTemp();
                                var posRelativaThis = Auxiliar.getTemp();
                                var temporal = Auxiliar.getTemp();
                
                                Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                                Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                                Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 
                                Auxiliar.agregarCuadruplo('heap[' + posRelativaThis + '] = ' + Valor + ';  //Asignando a la variable global ' + strNombreVariable + '\n');
                                Existe = true;
                            }
                            return Existe;
                        }
                        
                        //Creo que aca nunca entra porque todo lo global es un objeto osea entra al los if de arriba.
                        if(Lista[i].tipo == strTipoValor || Valor == ValorNulo )
                        {
                            Lista[i].ValorSimbolo = Valor;

                            var posThis = Auxiliar.getTemp();
                            var valThis = Auxiliar.getTemp();
                            var posRelativaThis = Auxiliar.getTemp();
                            var temporal = Auxiliar.getTemp();
            
                            Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                            Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                            Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 
                            Auxiliar.agregarCuadruplo('heap[' + posRelativaThis + '] = ' + Valor + ';  //Asignando a la variable global ' + strNombreVariable + '\n');
                            Existe = true;
                        }            
                    }
                    //Guardamos el valor en una variable local.
                    else if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar)
                    {
                        if(Lista[i].isArray)
                        {
                            if(Lista[i].isObjeto)
                            {
                                if(IsNuevo)
                                {
                                    if(Lista[i].tipo == strTipoValor)
                                    {
                                        var nodoInstancia = ptnId.getHijos()[2];
                                        var nombreInstancia = nodoInstancia.getHijos()[0].getHijos()[0].getValor();
                                        var paramsInstancia = nodoInstancia.getHijos()[1];
                                        var tempo = Auxiliar.getTemp();
                                        
                                        var temp1 = Auxiliar.getTemp();
                                        var temp2 = Auxiliar.getTemp();

                                        var tipoParamInstancia = [];
                                        var nombreLlamada = '';
                                        var CambioAmbito = Expresion.obtenerPosicion2(false) + 2;

                                        Auxiliar.agregarCuadruplo('//Iniciando instancia de clase: ' + strTipoValor);
                                        Auxiliar.agregarCuadruplo(tempo + ' = H;        //posicion donde inicia nuevo objeto \n'); 
                                        Auxiliar.agregarCuadruplo(temp1 + ' = S + ' +CambioAmbito +';    //cambio simulado a constructor de: ' + nombreInstancia); 
                                        Auxiliar.agregarCuadruplo(temp2 + ' = ' + temp1 + ' + 0;    //Pos del this de constructor');
                                        Auxiliar.agregarCuadruplo('stack[' +temp2+ '] = '+ tempo + ';     //Val del this \n');

                                        
                                        for(var h = 0; h<paramsInstancia.getHijos().length; h++){
                                            var temp3 = Auxiliar.getTemp();
                                            var param = paramsInstancia.getHijos()[h];
                                            Auxiliar.agregarCuadruplo(temp3 + ' = ' + temp1 + ' + ' + (h + 2) + ';  //pos de parametro numero:' + (h + 1));
                                            Expresion.enviarListaActual(listaActual,StackSym);
                                            var expGenerada = Expresion.evaluarExp(param);
                                            tipoParamInstancia.push(expGenerada.valorTipo.replace("(","").replace(")",""));

                                            var valorRet = ValorNulo;

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
                                                valorRet = ValorNulo;
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
                                            

                                            Auxiliar.agregarCuadruplo('stack['+temp3+'] = ' + valorRet + ';    //asignamos valor a la posicion del parametro \n');
                                        }

                                        Auxiliar.agregarCuadruplo("S = S + "+CambioAmbito+";   //cambiamos ambito");

                                        nombreLlamada = 'call ' + nombreInstancia.toLowerCase() + '@' + nombreInstancia.toLowerCase();

                                        for(var j = 0; j < tipoParamInstancia.length; j ++){
                                            nombreLlamada += '@' + tipoParamInstancia[j];
                                        }
                                        
                                        nombreLlamada += '();     //nombre de metodo';
                                        Auxiliar.agregarCuadruplo(nombreLlamada);
                                        Auxiliar.agregarCuadruplo("S = S - "+CambioAmbito+";   //regresamos al ambito\n");

                                        var resultado = MapeoLexicografico(Lista[i].Dimensiones,Dimensiones);
                                        var posActual = Auxiliar.getTemp();     
                                        var temporal1 = Auxiliar.getTemp();

                                        var resultado = MapeoLexicografico(Lista[i].Dimensiones,Dimensiones);
                                        var posActual = Auxiliar.getTemp();     
                                        var temporal1 = Auxiliar.getTemp();

                                        Auxiliar.agregarCuadruplo(temporal1 + ' = S + ' + Lista[i].Posicion + ';');
                                        //Obtenemos posicion inicial del arreglo
                                        Auxiliar.agregarCuadruplo(posActual + ' = stack['+temporal1+'];     //inicio de arreglo \n');
                                        Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + Lista[i].Dimensiones.length + ';   //le sumamos el numero de dimensiones');
                                        Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + 2;  //le sumamos los dos espacios iniciales');
                                        Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + resultado + ';  //le sumamos el mapeo lexicografico');
                                        Auxiliar.agregarCuadruplo('heap[' + posActual + '] = ' + tempo + '; //Asignando al arreglo global ' + Lista[i].nombreSimbolo + '\n');
                                        Existe = true;
                                        return Existe;
                                    }
                                    else
                                    {
                                        
                                    }
                                }
                                else
                                {
                                    var resultado = MapeoLexicografico(Lista[i].Dimensiones,Dimensiones);
                                    var posActual = Auxiliar.getTemp();     
                                    var temporal1 = Auxiliar.getTemp();

                                    Auxiliar.agregarCuadruplo(temporal1 + ' = S + ' + Lista[i].Posicion + ';');
                                    //Obtenemos posicion inicial del arreglo
                                    Auxiliar.agregarCuadruplo(posActual + ' = stack['+temporal1+'];     //inicio de arreglo \n');
                                    Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + Lista[i].Dimensiones.length + ';   //le sumamos el numero de dimensiones');
                                    Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + 2;  //le sumamos los dos espacios iniciales');
                                    Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + resultado + ';  //le sumamos el mapeo lexicografico');
                                    Auxiliar.agregarCuadruplo('heap[' + posActual + '] = ' + Valor + '; //Asignando al arreglo global ' + Lista[i].nombreSimbolo + '\n');
                                    Existe = true;
                                    return Existe;
                                }
                                return Existe;
                            }
                            else if(isCadena){
                                
                                var posicion = 0;
                                var escape = false;
                                var listaCaracteres = [];

                                Auxiliar.agregarCuadruplo('//Inicio de asignacion a arreglo de la cadena: \"' + cadena + '\" \n' );

                                for(var k = 0; k < cadena.length; k++){
                                    if(cadena[k] == '\\' && !escape)
                                    {
                                        escape = true;
                                        posicion = k;
                                    }
                                    else if(escape)
                                    {
                                        var TipoCaracterEspecial = cadena[k];
                                        switch(TipoCaracterEspecial)
                                        {
                                            case 'n': 
                                            listaCaracteres.push(10);
                                            
                                                break;
                                            case '\\':
                                            listaCaracteres.push(92);
                                            
                                                break;
                                            case 't':
                                            listaCaracteres.push(9);
                                            
                                                break;
                                        }
                                        posicion = k;
                                        escape = false;
                                    }
                                    else
                                    {
                                        listaCaracteres.push(cadena.charCodeAt(k));
                                        posicion = k;
                                    }
                                }

                                
                                var posActual = Auxiliar.getTemp();
                                var tamTotal = Auxiliar.getTemp();
                                
                                
                                var tamInicial = 1;
                                for(var l = 0; l<Lista[i].Dimensiones.length;l++){
                                    tamInicial = tamInicial * Lista[i].Dimensiones[l];
                                }
                                 
                                var temporal1 = Auxiliar.getTemp();
                                Auxiliar.agregarCuadruplo(temporal1 + ' = S + ' + Lista[i].Posicion + ';');
                                Auxiliar.agregarCuadruplo(posActual + ' = stack['+temporal1+'];     //inicio de arreglo \n');
                                Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + Lista[i].Dimensiones.length + ';   //le sumamos el numero de dimensiones');
                                Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + 2;  //le sumamos los dos espacios iniciales');
                                //Final del for, tamanio total + ini arreglo.
                                Auxiliar.agregarCuadruplo(tamTotal + ' = ' + tamInicial + ' + ' + posActual + ';  //tamanio total mas inico de arreglo \n');

                                var for_v = Auxiliar.getEtq();
                                var for_f = Auxiliar.getEtq();
                                var tempo = Auxiliar.getTemp();
                        
                                Auxiliar.agregarCuadruplo('if ('+ tamInicial + ' >= '+ listaCaracteres.length+') goto '+for_v+';\n'+'goto ' + for_f +';\n');
                                Auxiliar.agregarCuadruplo(for_v + ':');

                                for(var p = 0; p<listaCaracteres.length;p++){
                                    Auxiliar.agregarCuadruplo(tempo + ' = ' + posActual + ' + ' + p + ';');
                                    Auxiliar.agregarCuadruplo('heap[' + tempo + '] = ' + listaCaracteres[p] + '; \n');
                                    
                                }
                                Auxiliar.agregarCuadruplo(for_f + ':');
                                Existe = true;
                                return Existe;

                            }
                            if(Dimensiones.length == null || Dimensiones.length == 0)
                            {
                                
                                var temporal1 = Auxiliar.getTemp();
                                Auxiliar.agregarCuadruplo(temporal1 + ' = S + ' + Lista[i].Posicion + ';');
                                Auxiliar.agregarCuadruplo('stack[' + temporal1 + '] = ' + Valor + '; //Asignando al arreglo ' + Lista[i].nombreSimbolo + '\n');
                                
                                Existe = true;
                                return Existe;
                            }
                            else
                            {
                                var resultado = MapeoLexicografico(Lista[i].Dimensiones,Dimensiones);
                                var posActual = Auxiliar.getTemp();     
                                var temporal1 = Auxiliar.getTemp();

                                Auxiliar.agregarCuadruplo(temporal1 + ' = S + ' + Lista[i].Posicion + ';');
                                //Obtenemos posicion inicial del arreglo
                                Auxiliar.agregarCuadruplo(posActual + ' = stack['+temporal1+'];     //inicio de arreglo \n');
                                Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + Lista[i].Dimensiones.length + ';   //le sumamos el numero de dimensiones');
                                Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + 2;  //le sumamos los dos espacios iniciales');
                                Auxiliar.agregarCuadruplo(posActual + ' = ' + posActual + ' + ' + resultado + ';  //le sumamos el mapeo lexicografico');
                                Auxiliar.agregarCuadruplo('heap[' + posActual + '] = ' + Valor + '; //Asignando al arreglo global ' + Lista[i].nombreSimbolo + '\n');
                                Existe = true;
                                return Existe;
                            }
                        }
                        
                        if(Lista[i].isObjeto)
                        {
                            if(IsNuevo)
                            {
                                if(Lista[i].tipo == strTipoValor)
                                {
                                    var nodoInstancia = ptnId.getHijos()[1];
                                    var nombreInstancia = nodoInstancia.getHijos()[0].getHijos()[0].getValor();
                                    var paramsInstancia = nodoInstancia.getHijos()[1];
                                    var tempo = Auxiliar.getTemp();
                                    
                                    var temp1 = Auxiliar.getTemp();
                                    var temp2 = Auxiliar.getTemp();

                                    var tipoParamInstancia = [];
                                    var nombreLlamada = '';
                                    var CambioAmbito = Expresion.obtenerPosicion2(false) + 2;

                                    Auxiliar.agregarCuadruplo('//Iniciando instancia de clase: ' + strTipoValor);
                                    Auxiliar.agregarCuadruplo(tempo + ' = H;        //posicion donde inicia nuevo objeto \n'); 
                                    Auxiliar.agregarCuadruplo(temp1 + ' = S + '+CambioAmbito+';    //cambio simulado a constructor de: ' + nombreInstancia); 
                                    Auxiliar.agregarCuadruplo(temp2 + ' = ' + temp1 + ' + 0;    //Pos del this de constructor');
                                    Auxiliar.agregarCuadruplo('stack[' +temp2+ '] = '+ tempo + ';     //Val del this \n');

                                    
                                    for(var h = 0; h<paramsInstancia.getHijos().length; h++){
                                        var temp3 = Auxiliar.getTemp();
                                        var param = paramsInstancia.getHijos()[h];
                                        Auxiliar.agregarCuadruplo(temp3 + ' = ' + temp1 + ' + ' + (h + 2) + ';  //pos de parametro numero:' + (h + 1));
                                        Expresion.enviarListaActual(listaActual,StackSym);
                                        var expGenerada = Expresion.evaluarExp(param);
                                        tipoParamInstancia.push(expGenerada.valorTipo.replace("(","").replace(")",""));

                                        var valorRet = ValorNulo;

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
                                            valorRet = ValorNulo;
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
                                        

                                        Auxiliar.agregarCuadruplo('stack['+temp3+'] = ' + valorRet + ';    //asignamos valor a la posicion del parametro \n');
                                    }

                                    Auxiliar.agregarCuadruplo("S = S + "+CambioAmbito+";   //cambiamos ambito");

                                    nombreLlamada = 'call ' + nombreInstancia.toLowerCase() + '@' + nombreInstancia.toLowerCase();

                                    for(var j = 0; j < tipoParamInstancia.length; j ++){
                                        nombreLlamada += '@' + tipoParamInstancia[j];
                                    }
                                    
                                    nombreLlamada += '();     //nombre de metodo';
                                    Auxiliar.agregarCuadruplo(nombreLlamada);
                                    Auxiliar.agregarCuadruplo("S = S - "+CambioAmbito+";   //regresamos al ambito\n");

                                    var posThis = Auxiliar.getTemp();
                                    var valThis = Auxiliar.getTemp();
                                    var posRelativaThis = Auxiliar.getTemp();

                                    var temporal = Auxiliar.getTemp();
                                    Auxiliar.agregarCuadruplo(temporal + ' = S + ' + Lista[i].Posicion + ';\n');
                                    Auxiliar.agregarCuadruplo('stack[' + temporal + '] = ' + tempo + '; //Asignando a la variable ' + nombreInstancia + '\n');
                                    Existe = true;
                                }
                                else
                                {
                                    
                                }
                            }
                            else
                            {
                                var temporal = Auxiliar.getTemp();
                                Auxiliar.agregarCuadruplo(temporal + ' = S + ' + Lista[i].Posicion + ';\n');
                                Auxiliar.agregarCuadruplo('stack[' + temporal + '] = ' + Valor + '; //Asignando a la variable ' + strNombreVariable + '\n');
                                Existe = true;
                            }
                            return Existe;
                        }
                        
                        if(Lista[i].tipo ==  strTipoValor  || Valor == ValorNulo)
                        {
                            Lista[i].ValorSimbolo = Valor;
                            var temporal = Auxiliar.getTemp();
                            Auxiliar.agregarCuadruplo(temporal + ' = S + ' + Lista[i].Posicion + ';\n');
                            Auxiliar.agregarCuadruplo('stack[' + temporal + '] = ' + Valor + '; //Asignando a la variable ' + strNombreVariable + '\n');
                            Existe = true;
                        }else{
                            console.log("error en archivo clases utimo metodo");
                        }
                        
                    }
                    break;
                    case "objeto":
                        //Si viene una lista de atributos a.a.a.a
                        if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar && IsGlobal)
                        {
                            if(Lista[i].isObjeto)
                            {
                                if(Lista[i].isEstruct){
                                    if(!Lista[i].isInicializado){
                                        var tempo = Auxiliar.getTemp();
                                        var posThis = Auxiliar.getTemp();
                                        var valThis = Auxiliar.getTemp();
                                        var posRelativaThis = Auxiliar.getTemp();

                                        Auxiliar.agregarCuadruplo(tempo + ' = H; '); 

                                        Auxiliar.agregarCuadruplo('H = H + ' + Lista[i].ListaObjetos.length.toString() + '; //Aumentamos el puntero el numero de atributos. \n')
                                        Auxiliar.aumPunteroH_en(Lista[i].ListaObjetos.length);

                                        decVarStruct(Lista[i].ListaObjetos,tempo,listaActual);
                                        
                                        Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                                        Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                                        Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 
                                        Auxiliar.agregarCuadruplo('heap[' + posRelativaThis + '] = ' + tempo + ';     //Se crea la variable global ' + Lista[i].nombreSimbolo + '\n');

                                        Lista[i].isInicializado = true;
                                    }
                                }
                                var temporal = Auxiliar.getTemp();
                                var HeapPivote = Auxiliar.getTemp();
                                var posThis = Auxiliar.getTemp();
                                var valThis = Auxiliar.getTemp();
                                var posRelativaThis = Auxiliar.getTemp();

                                Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                                Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                                Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + Lista[i].Posicion + ';     //pos relativa de \"'+Lista[i].nombreSimbolo+'\"'); 
                                Auxiliar.agregarCuadruplo(HeapPivote + ' = ' + ' heap[' + posRelativaThis + ']; ');
                                return RecursivoAsignarValGeneral(ptnId.getHijos()[1],Valor,Dimensiones,strTipoValor,Lista[i].ListaObjetos,Contador + 1,IsGlobal,HeapPivote,IsNuevo,StackSym);
                            }
                        }
                        //Lista de atributos local
                        else if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar)
                        {
                            if(Lista[i].isObjeto)
                            {
                                if(Lista[i].isEstruct){
                                    if(!Lista[i].isInicializado){
                                        var tempo = Auxiliar.getTemp();
                            
                                        Auxiliar.agregarCuadruplo(tempo + ' = H; '); 

                                        Auxiliar.agregarCuadruplo('H = H + ' + Lista[i].ListaObjetos.length.toString() + '; //Aumentamos el puntero el numero de atributos. \n')
                                        Auxiliar.aumPunteroH_en(Lista[i].ListaObjetos.length);

                                        decVarStruct(Lista[i].ListaObjetos,tempo,listaActual);
                                        
                                        var temporal = Auxiliar.getTemp();
                                        var temporal2 = Auxiliar.getTemp();
                                        Auxiliar.agregarCuadruplo(temporal + ' = ' + ' S + ' + Lista[i].Posicion + '; ');
                                        Auxiliar.agregarCuadruplo('stack[' + temporal + '] = ' + tempo + ';     //Se crea la variable local ' + Lista[i].nombreSimbolo + '\n');

                                        Lista[i].isInicializado = true;
                                    }
                                }
                                var temporal = Auxiliar.getTemp();
                                var temporal2 = Auxiliar.getTemp();
                                Auxiliar.agregarCuadruplo(temporal + ' = ' + ' S + ' + Lista[i].Posicion + '; ');
                                Auxiliar.agregarCuadruplo(temporal2 + ' = ' + ' stack[' + temporal + ']; //Ingresando al objeto ' + strNombreVariable + ' ');
                                return RecursivoAsignarValGeneral(ptnId.getHijos()[1],Valor,Dimensiones,strTipoValor,Lista[i].ListaObjetos,Contador + 1,IsGlobal,temporal2,IsNuevo,StackSym);
                            }
                        }
                    break;
                default:
                    break;
            }     
        }
        
        return Existe;
    }
}

function RecursivoAsignarValGeneral(ptnId,Valor,Dimensiones,strTipoValor,Lista,Contador,IsGlobal,TemporalAnterior,IsNuevo,StackSym)
{
    var Existe = false;
    
    try
    {
        for(var i = 0; i < Lista.length; i++)
        {
            var strNombreVariable = ptnId.getHijos()[Contador].getValor();

            if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar && (ptnId.getHijos().length -1  != Contador))
            {   
                var temporal = Auxiliar.getTemp(); 
                var Posicion = Lista[i].Posicion;
                Auxiliar.agregarCuadruplo(temporal + ' = ' + TemporalAnterior + ' + ' + Posicion + ';');
                var temporal2 = Auxiliar.getTemp();
                Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temporal + ']; //Ingresando a ' + strNombreVariable + '\n');
                
                var listaProxima = [];

                if(Lista[i].ListaObjetos.length == 0)
                {
                    listaProxima = obtenerListaClase(Lista[i].tipo,StackSym);   
                }else{
                    listaProxima = Lista[i].ListaObjetos;
                }

                return RecursivoAsignarValGeneral(ptnId,Valor,Dimensiones,strTipoValor,listaProxima,Contador + 2,IsGlobal,temporal2,IsNuevo,StackSym);
            }
            else if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar && (ptnId.getHijos().length -1 == Contador))
            {
                if(IsNuevo)
                {
                    /*var [Existe,Elementos] = ObtenerElementos(strTipoValor); 
                    var Posicion = Lista[i].Posicion;
                    Lista[i].ListaObjetos = Elementos;
                    var tempo = Auxiliar.getTemp(), HeapPivote = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo(tempo + ' = ' + TemporalAnterior + ' + ' + Posicion + '; \n');
                    Auxiliar.agregarCuadruplo('H = H + 1; \n');
                    Auxiliar.agregarCuadruplo(HeapPivote + ' = H; \n'); 
                    Auxiliar.agregarCuadruplo('heap[' + tempo + '] = ' + HeapPivote + '; \n');
                    Auxiliar.agregarCuadruplo('H = H + ' + Elementos.length.toString() + '; //Aumentamos el puntero el numero de atributos. \n');
                    DeclararVariableElement(Elementos,HeapPivote);
                    Existe = true;*/
                }
                else
                {
                    if(Lista[i].tipo == "(cadena)" || Lista[i].tipo == "(entero)" || Lista[i].tipo == "(bool)" || Lista[i].tipo == "(decimal)" || Lista[i].tipo == "(caracter)")
                    {
                        if(Lista[i].tipo == strTipoValor)
                        {
                            var temporal = Auxiliar.getTemp(); 
                            var Posicion = Lista[i].Posicion;
                            Auxiliar.agregarCuadruplo(temporal + ' = ' + TemporalAnterior + ' + ' + Posicion + ';');
                            Auxiliar.agregarCuadruplo('heap[' + temporal + '] = ' + Valor + '; //Asignando valor a ' + strNombreVariable + '\n');
                            Existe = true;
                        }
                        else
                        {
                            Existe = false;
                        }

                    }
                    else
                    {
                       /* if(Lista[i].ListaObjetos.length == 0)
                        {
                            var[Existe,Elementos] = ObtenerElementos(Lista[i].tipo);
                            if(Existe)
                            {
                                Lista[i].ListaObjetos = Elementos;
                                var HeapPivote = Auxiliar.getTemp();
                                Auxiliar.agregarCuadruplo(HeapPivote + ' = H; \n');
                                Auxiliar.agregarCuadruplo('H = H + ' + Lista[i].ListaObjetos.length + '; //Aumentamos el puntero el numero de atributos. \n');
                                DeclararVariableElement(Elementos,HeapPivote);
                            }
                            else
                            {
                                //TablaError.push(new Errores('Semántico','El element ' + Lista[i].tipo + ' no existe.',0));
                            }
                        }
                        var temporal = Auxiliar.getTemp(); var Posicion = Lista[i].Posicion;
                        Auxiliar.agregarCuadruplo(temporal + ' = ' + TemporalAnterior + ' + ' + Posicion + ';\n');
                        Auxiliar.agregarCuadruplo('heap[' + temporal + '] = ' + Valor + '; //Asignando valor a ' + strNombreVariable + '\n');
                        Existe = true;*/
                    }
                }
            }
        }
    }
    catch(err)
    {
        console.log(err);
    }
    return Existe;
}

function RecursivoObtenerValGeneral(nodoId,Dimensiones,Lista,Contador,IsGlobal, TemporalAnterior,StackSym,listaActual,idPadre){
    var Existe = false;
    var Valor = ValorNulo;
    var TipoValor = '';
    var nodoFuncion = null;
    
    var strNombreVariable = '';
    for(var i = 0; i < Lista.length; i++)
    {
        var tipo = nodoId.getHijos()[Contador].getEtiqueta();
        if(tipo == 'funcion'){
            //Nombre de la funcion
            strNombreVariable = nodoId.getHijos()[Contador].getHijos()[0].getValor();
            nodoFuncion = nodoId.getHijos()[Contador];
        }
        else if(tipo == 'id'){
            strNombreVariable = nodoId.getHijos()[Contador].getValor();
        }
        else if(tipo == 'fun_tamanio'){
            strNombreVariable = "fun_tamanio";
        }

        if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar && (nodoId.getHijos().length - 1 != Contador))
        {
            debugger;
            var temporal = Auxiliar.getTemp();
            var Posicion = Lista[i].Posicion;

            Auxiliar.agregarCuadruplo(temporal + ' = ' + TemporalAnterior + ' + ' + Posicion + ';');
            var temporal2 = Auxiliar.getTemp();
            Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temporal + ']; //Ingresando a ' + strNombreVariable + '\n');
            
            var listaProxima = [];

            if(Lista[i].ListaObjetos.length == 0)
            {
                
                if(Lista[i].isObjeto){
                    listaProxima = obtenerListaClase(Lista[i].tipo,StackSym);
                }    
                else{
                    listaProxima = obtenerListaClase(Lista[i].nombreClase,StackSym);
                }
                
            }else{
                listaProxima = Lista[i].ListaObjetos;
            }

            return RecursivoObtenerValGeneral(nodoId,Dimensiones,listaProxima,Contador + 2, IsGlobal,temporal2,StackSym,listaActual,strNombreVariable);
        }
        //Entra si el ultimo nodo es un Id
        else if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar && (nodoId.getHijos().length - 1 == Contador))
        {
            var temporal = Auxiliar.getTemp(); 
            var Posicion = Lista[i].Posicion;
            Auxiliar.agregarCuadruplo(temporal + ' = ' + TemporalAnterior + ' + ' + Posicion + ';\n');
            var temporal2 = Auxiliar.getTemp();
            Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temporal + ']; //Obteniendo atributo. ' + strNombreVariable + '\n');
            
            Existe = true; Valor = temporal2, TipoValor = Lista[i].tipo;
        }
        //Entra si el ultimo nodo es una funcion
        else if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsFuncion && (nodoId.getHijos().length - 1 == Contador))
        {
            //debo meter en lista actual el

            var ptnParametros = nodoFuncion.getHijos()[1];
            var ListaParametros = [];

            var cant = ptnParametros.getHijos().length;
            for(h = 0; h < cant; h++){
                var [Valor2,TipoValor2] = generarExpresion(ptnParametros.getHijos()[h]);
                ListaParametros.push([Valor2,TipoValor2]);
            }
            
            
            var simboloFuncion = obtenerListaClaseFuncion(Lista[i].nombreClase,StackSym,nodoFuncion,ListaParametros);
            
            
            simboloFuncion.ValorSimbolo = TemporalAnterior;

            listaActual.ListaObjetos[0].listContenido.unshift(simboloFuncion);
            [ValorAsignar,valorTipo] = generarExpresion(nodoId.getHijos()[Contador],listaActual);
            listaActual.ListaObjetos[0].listContenido.shift();

            Existe = true; Valor = ValorAsignar, TipoValor = Lista[i].tipo;
        }
        else if(strNombreVariable == "fun_tamanio" && (nodoId.getHijos().length - 1 == Contador))
        {
            var temporal = Auxiliar.getTemp(); 
            Auxiliar.agregarCuadruplo(temporal + ' = heap[' + TemporalAnterior + '];   // tamanio de arreglo\n');
            Existe = true; Valor = temporal, TipoValor = "(entero)";
        }
    }
    return [Existe,Valor,TipoValor];
}

function obtenerListaClase(nombreClase,StackSym){
    
    console.log('---------------------------------------------------------------------------------------');
    console.log('llegaste a bucsar dentro de la lista general' );
    
    for(var k = 0; k<StackSym.length; k++){
        if(StackSym[k].nombreSimbolo == nombreClase){
            return StackSym[k].ListaObjetos[0].listContenido;
        }
    }

    return [];
}

function obtenerListaClaseFuncion(nombreClase,StackSym,nodoFuncion,ListaParametros){
    
    console.log('---------------------------------------------------------------------------------------');
    console.log('llegaste a bucsar dentro de la lista general' );
    
    for(var k = 0; k<StackSym.length; k++){
        if(StackSym[k].nombreSimbolo == nombreClase){
            var Lista = StackSym[k].ListaObjetos[0].listContenido;
            for(var i = 0; i < Lista.length; i++)
            {
                var strNombreVariable = nodoFuncion.getHijos()[0].getValor();
        
                console.log(Lista[i].nombreSimbolo + ' = ' + strNombreVariable);
                console.log(Lista[i].IsVar);
    
                if((Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsFuncion && nodoFuncion.getHijos().length >= 2)){
                    
                    if(Lista[i].ListParametros.length == ListaParametros.length)
                    {
                        for(var j = 0;  j < ListaParametros.length; j++)
                        {
                            if(ListaParametros[j][1] == Lista[i].ListParametros[j].tipo || ListaParametros[j][1] == 'array') {
                                Existe = true;
                            }
                            else{
                                Existe = false; break;
                            }
                        }
                        if(ListaParametros.length == 0) Existe = true;
                        if(Existe){
                           return Lista[i];
                        }
                    }   
                } 
            }
        }
    }

    return [];
}


function RecursivoObtenerValGeneral2(nodoId,Dimensiones,Lista,Contador,IsGlobal, TemporalAnterior,StackSym,listaActual,idPadre){
    var Existe = false;
    var Valor = ValorNulo;
    var TipoValor = '';
    var nodoFuncion = null;
    
    var strNombreVariable = '';
    for(var i = 0; i < Lista.length; i++)
    {
        var tipo = nodoId.getHijos()[Contador].getEtiqueta();
        if(tipo == 'funcion'){
            //Nombre de la funcion
            strNombreVariable = nodoId.getHijos()[Contador].getHijos()[0].getValor();
            nodoFuncion = nodoId.getHijos()[Contador];
        }
        else if(tipo == 'id'){
            strNombreVariable = nodoId.getHijos()[Contador].getValor();
        }
        else if(tipo == 'fun_tamanio'){
            strNombreVariable = "fun_tamanio";
        }

        if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar && (nodoId.getHijos().length - 1 != Contador))
        {
            var temporal = Auxiliar.getTemp();
            var Posicion = Lista[i].Posicion;

            Auxiliar.agregarCuadruplo(temporal + ' = ' + TemporalAnterior + ' + ' + Posicion + ';');
            var temporal2 = Auxiliar.getTemp();
            Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temporal + ']; //Ingresando a ' + strNombreVariable + '\n');
            
            var listaProxima = [];

            if(Lista[i].ListaObjetos.length == 0)
            {
                
                if(Lista[i].isObjeto){
                    listaProxima = obtenerListaClase(Lista[i].tipo,StackSym);
                }    
                else{
                    listaProxima = obtenerListaClase(Lista[i].nombreClase,StackSym);
                }
                
            }else{
                listaProxima = Lista[i].ListaObjetos;
            }

            return RecursivoObtenerValGeneral2(nodoId,Dimensiones,listaProxima,Contador + 2, IsGlobal,temporal2,StackSym,listaActual,strNombreVariable);
        }
        //Entra si el ultimo nodo es un Id
        else if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar && (nodoId.getHijos().length - 1 == Contador))
        {
            var temporal = Auxiliar.getTemp(); 
            var Posicion = Lista[i].Posicion;
            Auxiliar.agregarCuadruplo(temporal + ' = ' + TemporalAnterior + ' + ' + Posicion + ';\n');
            var temporal2 = Auxiliar.getTemp();
            
            
            Existe = true; Valor = temporal2, TipoValor = Lista[i].tipo;
        }
    }
    return [Existe,Valor,TipoValor,IsGlobal];
}
function MapeoLexicografico(Dimensiones,Indices){
    

    var dim = Indices.length;

    switch(dim){
        case 1: return  Indices[0];
        break;  
        case 2: return ejecutar2D(Dimensiones,Indices);
        break;
        default: return ejecutar3OM(Dimensiones,Indices);
    }
}

function ejecutar2D(listaDimensionesIzq,Indices){
    var x = Auxiliar.getTemp();
    var y = Auxiliar.getTemp();
    var ty = Auxiliar.getTemp();
    var pos = Auxiliar.getTemp();

    Auxiliar.agregarCuadruplo(x + ' = ' + Indices[0] + ';   ');
    Auxiliar.agregarCuadruplo(y + ' = ' + Indices[1] + ';   ');

    Auxiliar.agregarCuadruplo(ty +' = ' + listaDimensionesIzq[1] + ';');
    Auxiliar.agregarCuadruplo(pos  + ' = ' + x + ' * ' + ty +';');
    Auxiliar.agregarCuadruplo(pos + ' = ' + pos + ' + ' + y + ';');

    return pos;
}

function ejecutar3OM(listaDimensionesIzq,Indices){
    var pos = Auxiliar.getTemp();
    var dim1 = Auxiliar.getTemp();
    var dim2 = Auxiliar.getTemp();

    Auxiliar.agregarCuadruplo(pos + ' = ' + ejecutar2D(listaDimensionesIzq,Indices)+ ';');
    Auxiliar.agregarCuadruplo(dim1 + ' = ' + Indices.length +';');
    Auxiliar.agregarCuadruplo(dim2 + ' = ' + listaDimensionesIzq.length + ';'); 

    var for_f = Auxiliar.getEtq(); 
    var for_v = Auxiliar.getEtq();
    var for_salida = Auxiliar.getEtq();
    var aux = Auxiliar.getTemp();
    var tamDimension = Auxiliar.getTemp();

    Auxiliar.agregarCuadruplo(tamDimension + ' = ' + listaDimensionesIzq[0]+ ';');

    Auxiliar.agregarCuadruplo('if ('+ dim1 + ' == '+dim2+') goto '+for_v+';\n'+'goto ' + for_f +';\n');
    Auxiliar.agregarCuadruplo(for_v + ':');
    
    for(var a = 2; a < Indices.length; a++){
        Auxiliar.agregarCuadruplo(tamDimension + ' = ' + tamDimension + ' * ' + listaDimensionesIzq[a-1] + ';');
        Auxiliar.agregarCuadruplo(aux + ' = ' + Indices[a] + ' * ' +tamDimension+ ';');
        Auxiliar.agregarCuadruplo(pos + ' = '+ pos + ' + ' + aux+ ';');
    }
    Auxiliar.agregarCuadruplo('goto ' + for_salida +';');
    Auxiliar.agregarCuadruplo(for_f + ':');
    Auxiliar.agregarCuadruplo(pos + ' = 0;');
    Auxiliar.agregarCuadruplo(for_salida + ':');

    return pos;
}

//Todo lo concerniente a EXPRESIONES 
function generarExpresion(nodo,listaActual){
    var valorRet = '';
    //No debo enviar lista actual porque se pierde el metodo donde estoy ejecutando
    Expresion.enviarListaActual(listaActual,[]);
    var expGenerada = Expresion.evaluarExp(nodo);

    if(expGenerada.cadena == ValorNulo)
		return [ValorNulo,expGenerada.valorTipo];
    
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
        valorRet = ValorNulo;
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

class ObtenerMetodo{
    constructor(strNombreMetodo,ListaParametros,strTipo){
        this.strNombreMetodo = strNombreMetodo;
        this.ListaParametros = ListaParametros;
        this.strTipo = strTipo;
    }
}

class AsignarValor{
    constructor(ptnId,Valor,Indices,strTipoValor,IsNuevo){
        this.ptnId = ptnId;
        this.Valor = Valor;
        this.Indices = Indices;
        this.strTipoValor = strTipoValor;
        this.IsNuevo = IsNuevo;
    }
}

function decVarStruct(Elementos,HeapPivote,listaActual)
{
    try
    {
        debugger;
        for(var i = 0; i < Elementos.length; i++)
        {
            if(Elementos[i].ListaObjetos.length == 0)
            {
                var [Valor,TipoValor] = generarExpresion(Elementos[i].ValorSimbolo,listaActual); 
                var temporal = Auxiliar.getTemp();
                Auxiliar.agregarCuadruplo(temporal + ' = ' + HeapPivote + ' + ' + i.toString() + ';');
                Auxiliar.agregarCuadruplo('heap[' + temporal + '] = ' + Valor + '; \n');
            }
        }
    }
    catch(err)
    {
        console.log(err);
    }        
}


module.exports = { Error, Simbolos, Contenido, Variable, Arreglo, Funcion, ObtenerVariable, AsignarValor, ObtenerMetodo}