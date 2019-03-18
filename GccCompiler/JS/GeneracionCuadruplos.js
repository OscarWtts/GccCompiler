const {Simbolos, Contenido, Variable, Arreglo, Funcion, ObtenerMetodo, AsignarValor} = require('./clases.js');
const {Error} = require('./clases2');
const Expresion = require('./Expresion.js');
const Auxiliar = require('./Auxiliar.js');
const Nodo = require('./Nodo.js');

//Nos servirá para llevar control de reportes de los errores y de simbolos. 
var rep_error = '';
var tab_error = [];
var valNulo = -123456; 
var posAtr = 0;
var contadorMetodos = 0;
var clase_principal = '';
var metodoPrincipal = null;
var constructor_clase = false; 
var listaActual = null;
var rep_simbolos = '';
var funcionActual ='';
var StackSym = [];
var claseActual = '';
var cadenaInit = '';

//Método para inicializar variables, y objetos.
function inicializar(){
	rep_error = '';
	tab_error = [];
    posAtr = 0;
    contadorMetodos = 0;
    clase_principal = '';
	rep_simbolos = '';
    metodoPrincipal = null;
    listaActual = null;
    constructor_clase = false;
    funcionActual = '';
	StackSym = [];
    claseActual = '';
    cadenaInit = '';
    Expresion.inicializarErrores();
	//Instancia de la Clase Control 3D 
	Auxiliar.reinicioCuadruplo();
}
//------------------------------------------------------------------------------------------------------------
//FASE 1, RECOLECCION
function faseRecoleccion(raiz){
	try {
		if(raiz.getHijos().length > 0){
            //Recolectamos Clases y su contenido
            recolectarClases(raiz);
            //Recolectamos Estructuras y contenido.
			recolectarStructs(raiz);
            //Recolectamos imports
            console.log(StackSym);
            
            faseGeneracion();
		}	
	} catch(e) {
		agregarError(new Error(e.index,'Sintáctico-Léxico',e.message));
		console.log("Error en fase de recoleccion");
	
	}
	
}
//------------------------------------------------------------------------------------------------------
// FASE 2, GENERACION
function faseGeneracion(){
    recorrerArreglo();
    //imprimir codigo
    Auxiliar.imprimirCuadruplo();
    //console.log(StackSym[StackSym.length - 1].ListaObjetos[0].listContenido[3].ListParametros);
}

function recorrerArreglo(){
    StackSym.forEach( function(item) {
        if(item.isClase){
                genacionCuadrupoPorClase(item);
            }
    });
}

function obtenerListaClase(nombreClase,StackSym){
    debugger;
    console.log('---------------------------------------------------------------------------------------');
    console.log('llegaste a bucsar dentro de la lista general' );
    
    for(var k = 0; k<StackSym.length; k++){
        if(StackSym[k].nombreSimbolo == nombreClase){
            return StackSym[k].ListaObjetos[0].listContenido;
        }
    }

    return [];
}

function genacionCuadrupoPorClase(nodo){
    debugger;
    listaActual = nodo; 
    var lista = [];

    if(listaActual.nombreHereda != ''){
        var lista  = obtenerListaClase(listaActual.nombreHereda);
        if(lista.length == 0){
            tab_error.push(new Error(0,'Semantico','La clase '+listaActual.nombreHereda+' de la cual quieres heredar no existe'));
        }
    }

    for(var p = 0; p<lista.length;p++){
        listaActual.ListaObjetos[0].listContenido.unshift(lista[p]);
    }

    console.log(listaActual);
    claseActual = nodo.nombreSimbolo;

    agregarSimbolo(claseActual,"(clase)","global",'Clase',0);

    Auxiliar.agregarCuadruplo('//-----------------------------------------------------');
    Auxiliar.agregarCuadruplo('//---------------COMIENZA CLASE "' + claseActual + '"-----------');
    Auxiliar.agregarCuadruplo('void init_'+claseActual.toLowerCase()+'(){\n');

    //Generamos el codigo de las variables.
    //console.log(nodo.ListaObjetos[0].listContenido);
    var tamanioClase = 0;

    nodo.ListaObjetos[0].listContenido.forEach(function(item){
        if(item.IsVar){
            tamanioClase++;
        }
    });

    Auxiliar.agregarCuadruplo('H = H + '+ tamanioClase + '; //reservamos espacio para la clase \n');
    Auxiliar.aumPunteroH_en(tamanioClase);

    nodo.ListaObjetos[0].listContenido.forEach(function(item){
        if(item.IsVar){
            agregarSimbolo(item.nombreSimbolo,item.tipo,claseActual,'Atributo',item.Posicion);
            item.nombreClase = item.nombreSi
            generarCodigoVar(item);
        }
    });

    Auxiliar.agregarCuadruplo('} \n');

    //Generamos el codigo de las funciones
    generacionFunciones(claseActual,nodo);
}

function generarCodigoVar(variable){
    if(variable.isArray){
        var tamTotalIzq  = Auxiliar.getTemp();
        var listaDimensionesIzq = [];
        var numDimensiones = 1;
        var isCadena = false;
        
        var listaDimensionesDer = [];

        Auxiliar.agregarCuadruplo(tamTotalIzq + ' = ' + '1;        //inicializamos contador de tamanio total de arreglo \n');
        
        //Fase 1 --> lado izquierd: tamanioTotal, listaDimensionesIzq, numDimensiones.
        //Generacion de expresiones en dimensiones.
        for(var i = 0; i < variable.Dimensiones.getHijos().length; i++)
        {
            var [Valor,TipoValor] = generarExpresion(variable.Dimensiones.getHijos()[i]);
            if(TipoValor == "(entero)")
            {
                listaDimensionesIzq.push(Valor);
                Auxiliar.agregarCuadruplo(tamTotalIzq + ' = ' + tamTotalIzq + ' * ' + Valor + ';      //fin de dimension '+ (i + 1) + ' ');
                Auxiliar.agregarCuadruplo('//---------')
            }
            else
            {
                tab_error.push(new Error(0,'Semántico','Las dimensiones debe de ser numéricas'));
                Auxiliar.agregarCuadruplo(tamTotalIzq + ' = ' + '1;')
                listaDimensionesIzq = [];
            }
        }
        //Asiganamos cantidad de dimensiones.
        numDimensiones = listaDimensionesIzq.length;

        //--------------------------------------------------------------------------------------------------
        //Validadciones del lado derecho 
        
        var tamTotalDer = variable.ValorSimbolo.getHijos().length;
        
        //Verificando que los valores a asignar sean del mismo tipo 
        for(var i = 0; i < tamTotalDer; i++)
        {
            var tipo_asig = variable.ValorSimbolo.getHijos()[i].getEtiqueta();
            if(tipo_asig == 'instancia'){
                var [Valor, TipoValor] = obtenerInstancia(variable.ValorSimbolo.getHijos()[i],variable.tipo);
            }
            else if(tipo_asig == 'string_cad'){
                isCadena = true;
                var cadena = variable.ValorSimbolo.getHijos()[0].getValor().replace(/\"/g,"").replace(/\'/g,"");
                var posicion = 0;
                var escape = false;

                Auxiliar.agregarCuadruplo('//Inicio de asignacion a arreglo de la cadena: \"' + cadena + '\"' );

                for(var i = 0; i < cadena.length; i++){
                    
                    if(cadena[i] == '\\' && !escape)
                    {
                        escape = true;
                        posicion = i;
                    }
                    else if(escape)
                    {
                        var TipoCaracterEspecial = cadena[i];
                        switch(TipoCaracterEspecial)
                        {
                            case 'n': 
                            listaDimensionesDer.push(10);
                            Auxiliar.agregarCuadruplo('//Codigo ascii de caracter \\n ');
                                break;
                            case '\\':
                            listaDimensionesDer.push(92);
                            Auxiliar.agregarCuadruplo('//Codigo ascii de caracter \ ');
                                break;
                            case 't':
                            listaDimensionesDer.push(9);
                            Auxiliar.agregarCuadruplo('//Codigo ascii de caracter \\t ');
                                break;
                        }
                        posicion = i;
                        escape = false;
                    }
                    else
                    {
                        listaDimensionesDer.push(cadena.charCodeAt(i));
                        Auxiliar.agregarCuadruplo('//Codigo ascii de caracter ' + cadena.charAt(i) + '');
                        posicion = i;
                    }
                }
                Auxiliar.agregarCuadruplo('//***************************************\n');
                tamTotalDer = cadena.length;
            }
            else{
                var [Valor,TipoValor] = generarExpresion(variable.ValorSimbolo.getHijos()[i]);
            }
            
            if(!isCadena){
                if(TipoValor == variable.tipo)
                {
                    listaDimensionesDer.push(Valor);
                }
                else if(TipoValor == "(null)"){
                    TipoValor = "(cadena)"
                    listaDimensionesDer = [];
                }
                else
                {
                    tab_error.push(new Error(0,'Semántico','Los valores a asignar al arreglo \''+ variable.nombreSimbolo+'\' deben ser del mismo tipo'));
                    listaDimensionesDer = [];
                }
            }
        }

        if(listaDimensionesDer.length==0){
            for(var i = 0; i < variable.ValorSimbolo.getHijos().length; i++) listaDimensionesDer.push(valNulo);
        }  

        if(tamTotalDer > 0){
            var et_v = Auxiliar.getEtq();
            var et_f = Auxiliar.getEtq();
            var salida = Auxiliar.getEtq();
            var ini = Auxiliar.getTemp();
            var temporal = Auxiliar.getTemp();

            Auxiliar.agregarCuadruplo(ini +' = H;   //Inicia arreglo ' + variable.nombreSimbolo +'\n');
            Auxiliar.agregarCuadruplo(temporal + ' = H;');
            Auxiliar.agregarCuadruplo('heap['+temporal+'] = ' + tamTotalIzq +';   //Guardamos tamanio del arreglo');
            Auxiliar.agregarCuadruplo('H = H + 1; \n');

            Auxiliar.agregarCuadruplo(temporal + ' = H;');
            Auxiliar.agregarCuadruplo('heap['+temporal+'] = ' + numDimensiones +';   //Guardamos la cantidad de dimensiones');
            Auxiliar.agregarCuadruplo('H = H + 1; \n');

            for(i = 0; i<numDimensiones; i++){
                Auxiliar.agregarCuadruplo(temporal + ' = H;');
                Auxiliar.agregarCuadruplo('heap['+temporal+'] = ' + listaDimensionesIzq[i] +';   //Guardamos el tamanio de cada dimension');
                Auxiliar.agregarCuadruplo('H = H + 1; \n');
            }

            //VALIDACION
            
            if(!isCadena){
                Auxiliar.agregarCuadruplo('if ('+ tamTotalIzq + ' == '+tamTotalDer+') goto '+et_v+';\n'+'goto ' + et_f +';\n');
                Auxiliar.agregarCuadruplo(et_v + ':');
                
                for(i = 0; i<tamTotalDer; i++){
                    Auxiliar.agregarCuadruplo(temporal + ' = H;');
                    Auxiliar.agregarCuadruplo('heap['+temporal+'] = ' + listaDimensionesDer[i] +';   //Guardamos el tamanio de cada dimension');
                    Auxiliar.agregarCuadruplo('H = H + 1; \n');
                }
            }else{
                Auxiliar.agregarCuadruplo('if ('+ tamTotalIzq + ' >= '+tamTotalDer+') goto '+et_v+';\n'+'goto ' + et_f +';\n');
                Auxiliar.agregarCuadruplo(et_v + ':');

                var cont1 = Auxiliar.getTemp();
                var for_ini1 = Auxiliar.getEtq();
                var for_v1 = Auxiliar.getEtq();
                var for_f1 = Auxiliar.getEtq();
                var auxPrimeraPos = Auxiliar.getTemp();

                Auxiliar.agregarCuadruplo(cont1 + ' =  0;    //inicializando contador');
                Auxiliar.agregarCuadruplo(auxPrimeraPos + ' = H;');
                Auxiliar.agregarCuadruplo(for_ini1 + ':');

                Auxiliar.agregarCuadruplo('if ('+ cont1 + ' < '+tamTotalIzq+') goto '+for_v1+';\n'+'goto ' + for_f1 +';\n');
                Auxiliar.agregarCuadruplo(for_v1 + ':');

               
                Auxiliar.agregarCuadruplo(temporal + ' = H;');
                Auxiliar.agregarCuadruplo('H = H + 1; \n');
                
                Auxiliar.agregarCuadruplo(cont1 + ' = ' + cont1 +' + 1;' );
                Auxiliar.agregarCuadruplo('goto ' + for_ini1+ ';\n');
                Auxiliar.agregarCuadruplo(for_f1 + ':');
                
                for(i = 0; i<tamTotalDer; i++){
                    Auxiliar.agregarCuadruplo(temporal + ' = '+auxPrimeraPos+' + '+i+';');
                    Auxiliar.agregarCuadruplo('heap['+temporal+'] = ' + listaDimensionesDer[i] +';   //Guardamos el tamanio de cada dimension');
                }
                
            }

            Auxiliar.agregarCuadruplo('goto ' + salida + ';');
            Auxiliar.agregarCuadruplo(et_f +':');

            var cont = Auxiliar.getTemp();
            var for_ini = Auxiliar.getEtq();
            var for_v = Auxiliar.getEtq();
            var for_f = Auxiliar.getEtq();

            Auxiliar.agregarCuadruplo(cont + ' =  0;    //inicializando contador');
            Auxiliar.agregarCuadruplo(for_ini + ':');

            Auxiliar.agregarCuadruplo('if ('+ cont + ' < '+tamTotalIzq+') goto '+for_v+';\n'+'goto ' + for_f +';\n');
            Auxiliar.agregarCuadruplo(for_v + ':');

            Auxiliar.agregarCuadruplo(temporal + ' = H;');
            if(variable.tipo == '(entero)' || variable.tipo == '(bool)' || variable.tipo == '(decimal)'){
                Auxiliar.agregarCuadruplo('heap['+temporal+'] = 0;   //Guardamos el tamanio de cada dimension');
            }
            else if(variable.tipo == '(caracter)'){
                Auxiliar.agregarCuadruplo('heap['+temporal+'] = 666;   //Guardamos el tamanio de cada dimension');
            }     
                
            Auxiliar.agregarCuadruplo('H = H + 1; \n');
            
            Auxiliar.agregarCuadruplo(cont + ' = ' + cont +' + 1;' );
            Auxiliar.agregarCuadruplo('goto ' + for_ini+ ';\n');
            Auxiliar.agregarCuadruplo(for_f + ':');
            Auxiliar.agregarCuadruplo(salida + ':');
            Auxiliar.agregarCuadruplo(temporal + ' = H;');
            Auxiliar.agregarCuadruplo('heap['+temporal+'] = 0 ;   //Posicion final');
            Auxiliar.agregarCuadruplo('H = H + 1; \n');
            
            var posThis = Auxiliar.getTemp();
            var valThis = Auxiliar.getTemp();
            var posRelativaThis = Auxiliar.getTemp();

            Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
            Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
            Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + variable.Posicion + ';     //pos relativa de \"'+variable.nombreSimbolo+'\"'); 

            Auxiliar.agregarCuadruplo('heap[' + posRelativaThis + '] = ' + ini + ';     //Se crea el arreglo global ' + variable.nombreSimbolo + '\n');  

            //actualizando nuestro arreglo en tabla de simbolos
            variable.ValorSimbolo = tamTotalIzq;
            variable.Dimensiones = listaDimensionesIzq;
            variable.Elementos = listaDimensionesDer;
            
        }
    }
    else if(variable.isObjeto){
        debugger;
        var [existe,elemento,isEstruct] = obtenerElementos(variable.tipo); 
        
        variable.ListaObjetos = elemento;
        
        if(isEstruct){
            variable.isEstruct = true;
            variable.isInicializado = false;
        }

        if(existe)
        {
            var tempo = Auxiliar.getTemp();
            var posThis = Auxiliar.getTemp();
            var valThis = Auxiliar.getTemp();
            var posRelativaThis = Auxiliar.getTemp();

            if(variable.ValorSimbolo.getEtiqueta() == "exp"){
                [ValorAsignar,valorTipo] = generarExpresion(variable.ValorSimbolo);

                Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + variable.Posicion + ';     //pos relativa de \"'+variable.nombreSimbolo+'\"'); 
                Auxiliar.agregarCuadruplo('heap[' + posRelativaThis + '] = ' + ValorAsignar + ';     //Se crea la variable global ' + variable.nombreSimbolo + '\n');
            }
            else if(variable.ValorSimbolo.getEtiqueta() == "instancia"){
                //ValorAsignar trae el nodo "instancia"       
                //VIene una instancia a clase, verificar si es el mismo tipo de dato, llammar a constructores.
                var nodoInstancia = variable.ValorSimbolo;
                var nombreInstancia = nodoInstancia.getHijos()[0].getHijos()[0].getValor();
                var paramsInstancia = nodoInstancia.getHijos()[1];

                if(variable.tipo != nombreInstancia){
                    tab_error.push(new Error(0,'Semantico','Este lenguaje no permite polimormismo, tipos de datos deben ser iguales'));
                    return;
                }
                
                var temp1 = Auxiliar.getTemp();
                var temp2 = Auxiliar.getTemp();

                var tipoParamInstancia = [];
                var nombreLlamada = '';

                Auxiliar.agregarCuadruplo('//Iniciando instancia de clase: ' + nombreInstancia);
                Auxiliar.agregarCuadruplo(tempo + ' = H;        //posicion donde inicia nuevo objeto \n'); 
                Auxiliar.agregarCuadruplo(temp1 + ' = S + 1;    //cambio simulado a constructor de: ' + nombreInstancia); 
                Auxiliar.agregarCuadruplo(temp2 + ' = ' + temp1 + ' + 0;    //Pos del this de constructor');
                Auxiliar.agregarCuadruplo('stack[' +temp2+ '] = '+ tempo + ';     //Val del this \n');

                for(i = 0; i<paramsInstancia.getHijos().length; i++){
                    var temp3 = Auxiliar.getTemp();
                    var param = paramsInstancia.getHijos()[i];
                    Auxiliar.agregarCuadruplo(temp3 + ' = ' + temp1 + ' + ' + (i + 2) + ';  //pos de parametro numero:' + (i + 1));
                    Expresion.enviarListaActual(listaActual,StackSym);
                    var expGenerada = Expresion.evaluarExp(param);
                    tipoParamInstancia.push(expGenerada.valorTipo.replace("(","").replace(")",""));

                    var valorRet = valNulo;

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

                    Auxiliar.agregarCuadruplo('stack['+temp3+'] = ' + valorRet + ';    //asignamos valor a la posicion del parametro \n');
                }

                Auxiliar.agregarCuadruplo("S = S + 1;   //cambiamos ambito");

                nombreLlamada = 'call ' + nombreInstancia.toLowerCase() + '@' + nombreInstancia.toLowerCase();

                for(j = 0; j < tipoParamInstancia.length; j ++){
                    nombreLlamada += '@' + tipoParamInstancia[j];
                }
                
                nombreLlamada += '();     //nombre de metodo';
                Auxiliar.agregarCuadruplo(nombreLlamada);
                Auxiliar.agregarCuadruplo("S = S - 1;   //regresamos al ambito\n");

                Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + variable.Posicion + ';     //pos relativa de \"'+variable.nombreSimbolo+'\"'); 
                Auxiliar.agregarCuadruplo('heap[' + posRelativaThis + '] = ' + tempo + ';     //Se crea la variable global ' + variable.nombreSimbolo + '\n');

                /*//Esto va a ser exclusivo para los structs cuando se inicialicen 
                Auxiliar.agregarCuadruplo(tempo + ' = H; '); 

                Auxiliar.agregarCuadruplo('H = H + ' + elemento.length.toString() + '; //Aumentamos el puntero el numero de atributos. \n')
                Auxiliar.aumPunteroH_en(elemento.length);

                decVarStruct(elemento,tempo);
                
                Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + variable.Posicion + ';     //pos relativa de \"'+variable.nombreSimbolo+'\"'); 
                Auxiliar.agregarCuadruplo('heap[' + posRelativaThis + '] = ' + tempo + ';     //Se crea la variable global ' + variable.nombreSimbolo + '\n');*/
            
            }
        }
        else
        {
            //console.log('Entre al primero');
            var error=  new Error(0,'Semántico','El objeto ' + variable.tipo + ' no existe.');
            agregarError(error);
        }
    }
    else
    {
        var [Valor,TipoValor] = generarExpresion(variable.ValorSimbolo);

        if(variable.tipo == TipoValor || Valor == valNulo){
            var posThis = Auxiliar.getTemp();
            var valThis = Auxiliar.getTemp();
            var posRelativaThis = Auxiliar.getTemp();

            Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
            Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
            Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + variable.Posicion + ';     //pos relativa de \"'+variable.nombreSimbolo+'\"'); 
            Auxiliar.agregarCuadruplo('heap[' + posRelativaThis + '] = ' + Valor + ';     //Se crea la variable global ' + variable.nombreSimbolo + '\n');
        }else{

           tab_error.push(new Error('0','Semántico','No se puede inicializar la variable: "'+ variable.nombreSimbolo +'" de tipo: "' +variable.tipo+ '" con el tipo: "' + TipoValor + '" '));
        }
    }
}

function obtenerInstancia(nodoInstancia,nomClase){
    
    //ValorAsignar trae el nodo "instancia"       
    //VIene una instancia a clase, verificar si es el mismo tipo de dato, llammar a constructores.
    var tempo = Auxiliar.getTemp();
    var tempo1 = Auxiliar.getTemp();
    var nombreInstancia = nodoInstancia.getHijos()[0].getHijos()[0].getValor();
    var paramsInstancia = nodoInstancia.getHijos()[1];

    var temp1 = Auxiliar.getTemp();
    var temp2 = Auxiliar.getTemp();

    var tipoParamInstancia = [];
    var nombreLlamada = '';
    var CambioAmbito = obtenerPosicion2(false) + 2;

    Auxiliar.agregarCuadruplo('//Iniciando instancia de clase: ' + nombreInstancia);
    Auxiliar.agregarCuadruplo(tempo + ' = H;        //posicion donde inicia nuevo objeto \n'); Auxiliar.agregarCuadruplo(temp1 + ' = S + ' + CambioAmbito + ';    //cambio simulado a constructor de: ' + nombreInstancia);
    Auxiliar.agregarCuadruplo(temp2 + ' = ' + temp1 + ' + 0;    //Pos del this de constructor');
    Auxiliar.agregarCuadruplo('stack[' +temp2+ '] = '+ tempo + ';     //Val del this \n');

    for(i = 0; i<paramsInstancia.getHijos().length; i++){
        var temp3 = Auxiliar.getTemp();
        var param = paramsInstancia.getHijos()[i];
        Auxiliar.agregarCuadruplo(temp3 + ' = ' + temp1 + ' + ' + (i + 2) + ';  //pos de parametro numero:' + (i + 1));

        Expresion.enviarListaActual(listaActual,StackSym);
        var expGenerada = Expresion.evaluarExp(param);
        tipoParamInstancia.push(expGenerada.valorTipo.replace("(","").replace(")",""));

        var valorRet = valNulo;

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

        Auxiliar.agregarCuadruplo('stack['+temp3+'] = ' + valorRet + ';    //asignamos valor a la posicion del parametro \n');
    }

    Auxiliar.agregarCuadruplo("S = S + " + CambioAmbito +" ;   //cambiamos ambito");
    nombreLlamada = 'call ' + nombreInstancia.toLowerCase() + '@' + nombreInstancia.toLowerCase();

    for(j = 0; j < tipoParamInstancia.length; j ++){
        nombreLlamada += '@' + tipoParamInstancia[j];
    }
    
    nombreLlamada += '();     //nombre de metodo';
    Auxiliar.agregarCuadruplo(nombreLlamada);
    Auxiliar.agregarCuadruplo("S = S - "+CambioAmbito+" ;   //regresamos al ambito\n");

    return [tempo,nomClase];

    /*//Esto va a ser exclusivo para los structs cuando se inicialicen 
    Auxiliar.agregarCuadruplo(tempo + ' = H; '); 

    Auxiliar.agregarCuadruplo('H = H + ' + elemento.length.toString() + '; //Aumentamos el puntero el numero de atributos. \n')
    Auxiliar.aumPunteroH_en(elemento.length);

    decVarStruct(elemento,tempo);
    
    Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
    Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
    Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + variable.Posicion + ';     //pos relativa de \"'+variable.nombreSimbolo+'\"'); 
    Auxiliar.agregarCuadruplo('heap[' + posRelativaThis + '] = ' + tempo + ';     //Se crea la variable global ' + variable.nombreSimbolo + '\n');*/
                    
}
//--------------------------------------------------------------------------------------------------------------
//Recoleccion de Structs 
function recolectarStructs(nodo){
	switch(nodo.getEtiqueta()){
		case "contenido":
			nodo.getHijos().forEach(function(item){
				recolectarStructs(item);
			});
			break;
		case "def_struct":
			gestionarStruck(nodo);			
			break;
		default: break;
	}
}

function gestionarStruck(nodo){
	var nombreEstructura = nodo.getHijos()[0].getValor();
	var atributosEstructura = nodo.getHijos()[1];
	//Verificamos si no existe otro estruct con el mismo nombre, en el arreglo global
	if(!existeStructClase(nombreEstructura,false,StackSym)){
        agregarSimbolo(nombreEstructura,"(estructura)","global",'Estructura',0);
        guardarEstruct(nombreEstructura,atributosEstructura,StackSym);
    }
    else{
 	    tab_error.push(new Error(0,'Semántico','La estructura "' + nombreEstructura + '" ya existe.'));
    }
}

function existeStructClase(nombre,isClase,lista){
    for(i = 0; i < lista.length; i++){
        if(lista[i].nombreSimbolo == nombre){
            return true;
        }
    }
    
    return false;
}


function guardarEstruct(nombre,atr,lista){
	//Agregamos la primera tabla de simbolos dentro del contenido global.
	var contenido = new Contenido(nombre,"(estructura)",true,null,false,null,null,false,null,null,false,[],true,0,false,false,false);  
    lista.push(contenido);
    
    var cont = 0;
    atr.getHijos().forEach(function(item){
		if(item.getHijos()[0].getEtiqueta() == "declarar"){
			var tipo_declaracion = item.getHijos()[0].getHijos()[0].getEtiqueta();
			switch (tipo_declaracion) {
				case "lista":
					// En caso de una declaracion normal, enviamos nodo LISTA
                    for(i = 0; i < item.getHijos()[0].getHijos()[0].getHijos()[2].getHijos().length; i++){
                        var nombreAtr = item.getHijos()[0].getHijos()[0].getHijos()[2].getHijos()[i].getValor();
					   guardarLista(item.getHijos()[0].getHijos()[0],nombre,cont,nombreAtr,lista[lista.length - 1].ListaObjetos);
                       cont++;
                    }
					break;
				case "arreglo":
					// En caso de un arreglo
					guardarArreglo(item.getHijos()[0].getHijos()[0],nombre,cont,lista[lista.length - 1].ListaObjetos);
                    cont++;
					break;
				default:
					break;
			}
		}	
	});
}


//Funcion para guardar declaraciones de ID 
function guardarLista(item,nombre_estructura,cont,nombreAtr,lista){
	var atributo = item;
   // console.log(atributo);
    var objeto = false;
        
	//Tipo de atributo, si lo que viene es "id", entonces obtener su valor. 
	var tipo = atributo.getHijos()[1].getHijos()[0].getEtiqueta();
    tipo = '('+tipo+')';
	if(tipo == "(id)"){
        objeto = true;
		tipo =  atributo.getHijos()[1].getHijos()[0].getValor();
    }

	//Valor del atributo.
	var valor = null;

	//Trae vaalor asignado
	if(atributo.getHijos().length == 4){
		valor = atributo.getHijos()[3];
    }else{
        valor = agregarInicializacion(tipo,false);
    }

    //console.log(`nombre: ${nombreAtr} tipo : ${tipo}  objeto: ${objeto} valor: ${valor}`);
    //console.log(valor.getHijos()[0]);
	//Revisamos en el contenido de nuestro struct si existe un atributo con el mismo nombre. 
	if(!existeAtributo(nombreAtr,lista))
    {
        var contenidoAtributo = new Contenido(nombreAtr,tipo,true,valor,true,null,null,false,null,null,false,[],objeto,cont,false,false,false,nombre_estructura);
        //Agregamos a la lista de mi estruct la tabla de simbolos de mi atributo.
        lista.push(contenidoAtributo);
    }
    else
    {
        tab_error.push(new Error(0,'Semántico','El atributo "' + nombreAtr + '" de la estructura o clase "' + nombre_estructura + '" ya existe.'));
    }
}

//Funcion para guardar arreglos
function guardarArreglo(item,nombre,cont,lista){
	var atributo = item;
    var objeto = false;
    
    //Tipo de atributo, si lo que viene es "id", entonces obtener su valor. 
	var tipo = atributo.getHijos()[1].getHijos()[0].getEtiqueta();
    tipo = '('+tipo+')';
	if(tipo == "(id)"){
        objeto = true;
		tipo =  atributo.getHijos()[1].getHijos()[0].getValor();
    }

    //Nombre del atributo 
    var nombreAtr = atributo.getHijos()[2].getValor();

    //Dimensiones dle arreglo [exp,exp,exp]
    var dimensiones = atributo.getHijos()[3];
    //Valor del atributo.
    var valor = null;

    //Trae vaalor asignado
    if(atributo.getHijos().length == 5){
        valor = atributo.getHijos()[4];
    }else{
        valor = agregarInicializacion(tipo,true);
    }

    //console.log(`nombre: ${nombreAtr} tipo : ${tipo}  objeto: ${objeto} valor: ${valor}`);

    //Revisamos en el contenido de nuestro struct si existe un atributo con el mismo nombre. 
    if(!existeAtributo(nombreAtr,lista))
    {
        var contenidoAtributo = new Contenido(nombreAtr,tipo,true,valor,true,null,null,false,dimensiones,[],true,[],objeto,cont,false,false,false,nombre);
        //Agregamos a la lista de mi estruct la tabla de simbolos de mi atributo.
        lista.push(contenidoAtributo);
    }
    else
    {
        tab_error.push(new Error(0,'Semántico','El atributo "' + nombreAtr + '" de la estructura o clase "' + nombre + '" ya existe.'));
    }
}

function agregarInicializacion(tipo,arreglo){
    if(!arreglo){
        switch(tipo){
            case "(entero)": 
                var nuevo = new Nodo("numero","0");
                var exp = new Nodo("exp",null);
                exp.addHijos(nuevo);
                return exp;
            case "(decimal)": 
                var nuevo = new Nodo("numero","0.0");
                var exp = new Nodo("exp",null);
                exp.addHijos(nuevo);
                return exp;
            case "(bool)":
                var nuevo = new Nodo("false","false");
                var exp = new Nodo("exp",null);
                exp.addHijos(nuevo);
                return exp;
            case "(caracter)":
                var nuevo = new Nodo("char_cad",'666');
                var exp = new Nodo("exp",null);
                exp.addHijos(nuevo);
                return exp;
            case "(cadena)":
                var nuevo = new Nodo("null","null");
                var exp = new Nodo("exp",null);
                exp.addHijos(nuevo);
                return exp;
            default: 
                var nuevo = new Nodo("null","null");
                var exp = new Nodo("exp",null);
                exp.addHijos(nuevo);
                return exp;
        }
    }else {
        var aux = new Nodo('par_fun',null);
        var nuevo = new Nodo("null","null");
        var exp = new Nodo("exp",null);
        exp.addHijos(nuevo);
        aux.addHijos(exp);
        return aux;
    }
}
//----------------------------------------------------------------------------------------------------------------------
//Recoleccion de clases 
function recolectarClases(nodo){
	switch(nodo.getEtiqueta()){
		case "contenido":
			nodo.getHijos().forEach(function(item){
				recolectarClases(item);
			});
			break;
		case "clase":
			gestionarClase(nodo);			
			break;
		default: break;
	}
}

function gestionarClase(nodo){
	var nombreClase = nodo.getHijos()[0].getValor();
    claseActual = nombreClase;
    var atributosClase;
    var nombreHereda = '';
    //2 si no hereda, 3 si tiene heredar
    debugger;
    if(nodo.getHijos().length == 2){
        atributosClase = nodo.getHijos()[1];
    } 
    else{
        nombreHereda = nodo.getHijos()[1].getValor();
        atributosClase = nodo.getHijos()[2];
    }
        

	//Verificamos si no existe otra clase con el mismo metodo, ya que estan en el mismo ambito.
	if(!existeStructClase(nombreClase,true,StackSym)){
        guardarClase(nombreClase,atributosClase,StackSym,nombreHereda);
    }
    else{
 	    tab_error.push(new Error(0,'Semántico','La clase "' + nombreClase + '" ya existe.'));
    }
}

function guardarClase(nombre_clase,atr_clase,lista,nombreHereda){
	//Agregamos la primera tabla de simbolos dentro del contenido global.
    var simbolo = new Simbolos("global",'',null,'','',0,[]);
	var contenido = new Contenido(nombre_clase,"(clase)",true,null,false,null,null,false,null,null,false,[],true,0, true, false,false,nombre_clase,false,false,false,false,nombreHereda);

    contenido.ListaObjetos.push(simbolo);

    lista.push(contenido);

    //Recolección de atributos de la clase. 
    var cont = 0;
    atr_clase.getHijos().forEach(function(item){
        if(item.getEtiqueta() == "variable"){
            if(item.getHijos()[0].getEtiqueta() == "declarar"){
                var tipo_declaracion = item.getHijos()[0].getHijos()[0].getEtiqueta();
                switch (tipo_declaracion) {
                    case "lista":
                        // En caso de una declaracion normal, enviamos nodo LISTA
                        for(i = 0; i < item.getHijos()[0].getHijos()[0].getHijos()[2].getHijos().length; i++){
                            var nombreAtr = item.getHijos()[0].getHijos()[0].getHijos()[2].getHijos()[i].getValor();
                           guardarLista(item.getHijos()[0].getHijos()[0],nombre_clase,cont,nombreAtr,lista[lista.length - 1].ListaObjetos[0].listContenido);
                           cont++;
                        }
                        break;
                    case "arreglo":
                        // En caso de un arreglo
                        guardarArreglo(item.getHijos()[0].getHijos()[0],nombre_clase,cont,lista[lista.length - 1].ListaObjetos[0].listContenido,);
                        cont++;
                        break;
                    default:
                        break;
                }
            }
        }
    });

    //Recoleccion de los structs internos de clase
    atr_clase.getHijos().forEach(function(item){    
        if(item.getEtiqueta() == "def_struct"){
            var nombreEstructura = item.getHijos()[0].getValor();
            var atributosEstructura = item.getHijos()[1];
            //Verificamos si no existe otro estruct con el mismo nombre, en el arreglo global
            if(!existeStructClase(nombreEstructura,false,lista[lista.length - 1].ListaObjetos[0].listContenido)){

                agregarSimbolo(nombreEstructura,"(estructura)",nombre_clase,'Estructura',0);
                guardarEstruct(nombreEstructura,atributosEstructura,lista[lista.length - 1].ListaObjetos[0].listContenido);
            }
            else{
                tab_error.push(new Error(0,'Semántico','La estructura "' + nombreEstructura + '" ya existe.'));
            }
        }
        else if(item.getEtiqueta() == "def_funcion" || item.getEtiqueta() == "constructor"){
            gestionarFuncion(nombre_clase,item,lista[lista.length - 1].ListaObjetos);
        }
    });

}


//Recolectamos los atributos de las clases y generamos su codigo 
function recolectarAtrClaseArreglo(nodoArreglo){
    
    try{
        var objeto = false;
        var crearVar = true;

        //Visibilidad 
        var visibilidad = nodoArreglo.getHijos()[0].getHijos()[0].getEtiqueta();
        //Tipo de nodoArreglo, si lo que viene es "id", entonces obtener su valor. 
        var tipo = nodoArreglo.getHijos()[1].getHijos()[0].getEtiqueta();
        tipo = '('+tipo+')';
        if(tipo == "(id)"){
            objeto = true;
            tipo =  nodoArreglo.getHijos()[1].getHijos()[0].getValor();
        }
       
        //nombre de ID
        var nombreArreglo = nodoArreglo.getHijos()[2].getValor();
        //Lista de dimensiones del lado izquierdo
        var Dimensiones = nodoArreglo.getHijos()[3];

        var tamTotalIzq  = Auxiliar.getTemp();
        var listaDimensionesIzq = [];
        var listaDimensionesDer = [];
        var numDimensiones = 1;
        var isCadena = false;
        
        Auxiliar.agregarCuadruplo(tamTotalIzq + ' = ' + '1;        //inicializamos contador de tamanio total de arreglo \n');
        
        //Fase 1 --> lado izquierd: tamanioTotal, listaDimensionesIzq, numDimensiones.
        //Generacion de expresiones en dimensiones.
        for(var i = 0; i < Dimensiones.getHijos().length; i++)
        {
            var [Valor,TipoValor] = generarExpresion(Dimensiones.getHijos()[i]);
            if(TipoValor == "(entero)")
            {
                listaDimensionesIzq.push(Valor);
                Auxiliar.agregarCuadruplo(tamTotalIzq + ' = ' + tamTotalIzq + ' * ' + Valor + ';      //fin de dimension '+ (i + 1) + ' ');
                Auxiliar.agregarCuadruplo('//---------')
            }
            else
            {
                tab_error.push(new Error(0,'Semántico','Las dimensiones debe de ser numéricas'));
                Auxiliar.agregarCuadruplo(tamTotalIzq + ' = ' + '1;')
                listaDimensionesIzq = [];
                crearVar = false;
            }
        }
        //Asiganamos cantidad de dimensiones.
        numDimensiones = listaDimensionesIzq.length;

        //--------------------------------------------------------------------------------------------------
        //Validadciones del lado derecho 

        var ValorSimbolo = null;

        //Trae vaalor asignado
        if(nodoArreglo.getHijos().length == 5){
            ValorSimbolo = nodoArreglo.getHijos()[4];
        }else{
            ValorSimbolo = agregarInicializacion(tipo,true);
        }

        
        var tamTotalDer = ValorSimbolo.getHijos().length;
        
        //Verificando que los valores a asignar sean del mismo tipo 
        for(var i = 0; i < tamTotalDer; i++)
        {
            var tipo_asig = ValorSimbolo.getHijos()[i].getEtiqueta();
            if(tipo_asig == 'instancia'){
                var [Valor, TipoValor] = obtenerInstancia(ValorSimbolo.getHijos()[i],tipo);
            }
            else if(tipo_asig == 'string_cad'){
                isCadena = true;
                var cadena = ValorSimbolo.getHijos()[0].getValor().replace(/\"/g,"").replace(/\'/g,"");
                var posicion = 0;
                var escape = false;

                Auxiliar.agregarCuadruplo('//Inicio de asignacion a arreglo de la cadena: \"' + cadena + '\"' );

                for(var i = 0; i < cadena.length; i++){
                    
                    if(cadena[i] == '\\' && !escape)
                    {
                        escape = true;
                        posicion = i;
                    }
                    else if(escape)
                    {
                        var TipoCaracterEspecial = cadena[i];
                        switch(TipoCaracterEspecial)
                        {
                            case 'n': 
                            listaDimensionesDer.push(10);
                            Auxiliar.agregarCuadruplo('//Codigo ascii de caracter \\n ');
                                break;
                            case '\\':
                            listaDimensionesDer.push(92);
                            Auxiliar.agregarCuadruplo('//Codigo ascii de caracter \ ');
                                break;
                            case 't':
                            listaDimensionesDer.push(9);
                            Auxiliar.agregarCuadruplo('//Codigo ascii de caracter \\t ');
                                break;
                        }
                        posicion = i;
                        escape = false;
                    }
                    else
                    {
                        listaDimensionesDer.push(cadena.charCodeAt(i));
                        Auxiliar.agregarCuadruplo('//Codigo ascii de caracter ' + cadena.charAt(i) + '');
                        posicion = i;
                    }
                }
                Auxiliar.agregarCuadruplo('//***************************************\n');
                tamTotalDer = cadena.length;
            }
            else{
                var [Valor,TipoValor] = generarExpresion(ValorSimbolo.getHijos()[i]);
            }
            
            if(!isCadena){
                if(TipoValor == tipo)
                {
                    listaDimensionesDer.push(Valor);
                }
                else if(TipoValor == "(null)"){
                    TipoValor = "(cadena)"
                    listaDimensionesDer = [];
                }
                else
                {
                    tab_error.push(new Error(0,'Semántico','Los valores a asignar al arreglo \''+ nombreArreglo+'\' deben ser del mismo tipo'));
                    listaDimensionesDer = [];
                    crearVar = false;
                }
            }
        }

        if(crearVar)
        {
            //Verificamos si no existe la arreglo (atributo) en dentro de la clase.
            if(!existeStack(nombreArreglo))
            {   
                var posicion2 = obtenerPosicion2(true) + 1;
                if(listaDimensionesDer.length==0){
                    for(var i = 0; i < ValorSimbolo.getHijos().length; i++) listaDimensionesDer.push(valNulo);
                }  
        
                if(tamTotalDer > 0){
                    var et_v = Auxiliar.getEtq();
                    var et_f = Auxiliar.getEtq();
                    var salida = Auxiliar.getEtq();
                    var ini = Auxiliar.getTemp();
                    var temporal = Auxiliar.getTemp();
        
                    Auxiliar.agregarCuadruplo(ini +' = H;   //Inicia arreglo ' + nombreArreglo +'\n');
                    Auxiliar.agregarCuadruplo(temporal + ' = H;');
                    Auxiliar.agregarCuadruplo('heap['+temporal+'] = ' + tamTotalIzq +';   //Guardamos tamanio del arreglo');
                    Auxiliar.agregarCuadruplo('H = H + 1; \n');
        
                    Auxiliar.agregarCuadruplo(temporal + ' = H;');
                    Auxiliar.agregarCuadruplo('heap['+temporal+'] = ' + numDimensiones +';   //Guardamos la cantidad de dimensiones');
                    Auxiliar.agregarCuadruplo('H = H + 1; \n');
        
                    for(i = 0; i<numDimensiones; i++){
                        Auxiliar.agregarCuadruplo(temporal + ' = H;');
                        Auxiliar.agregarCuadruplo('heap['+temporal+'] = ' + listaDimensionesIzq[i] +';   //Guardamos el tamanio de cada dimension');
                        Auxiliar.agregarCuadruplo('H = H + 1; \n');
                    }
        
                    //VALIDACION
                    
                    if(!isCadena){
                        Auxiliar.agregarCuadruplo('if ('+ tamTotalIzq + ' == '+tamTotalDer+') goto '+et_v+';\n'+'goto ' + et_f +';\n');
                        Auxiliar.agregarCuadruplo(et_v + ':');
                        
                        for(i = 0; i<tamTotalDer; i++){
                            Auxiliar.agregarCuadruplo(temporal + ' = H;');
                            Auxiliar.agregarCuadruplo('heap['+temporal+'] = ' + listaDimensionesDer[i] +';   //Guardamos el tamanio de cada dimension');
                            Auxiliar.agregarCuadruplo('H = H + 1; \n');
                        }
                    }else{
                        Auxiliar.agregarCuadruplo('if ('+ tamTotalIzq + ' >= '+tamTotalDer+') goto '+et_v+';\n'+'goto ' + et_f +';\n');
                        Auxiliar.agregarCuadruplo(et_v + ':');
        
                        var cont1 = Auxiliar.getTemp();
                        var for_ini1 = Auxiliar.getEtq();
                        var for_v1 = Auxiliar.getEtq();
                        var for_f1 = Auxiliar.getEtq();
                        var auxPrimeraPos = Auxiliar.getTemp();
        
                        Auxiliar.agregarCuadruplo(cont1 + ' =  0;    //inicializando contador');
                        Auxiliar.agregarCuadruplo(auxPrimeraPos + ' = H;');
                        Auxiliar.agregarCuadruplo(for_ini1 + ':');
        
                        Auxiliar.agregarCuadruplo('if ('+ cont1 + ' < '+tamTotalIzq+') goto '+for_v1+';\n'+'goto ' + for_f1 +';\n');
                        Auxiliar.agregarCuadruplo(for_v1 + ':');
        
                       
                        Auxiliar.agregarCuadruplo(temporal + ' = H;');
                        Auxiliar.agregarCuadruplo('H = H + 1; \n');
                        
                        Auxiliar.agregarCuadruplo(cont1 + ' = ' + cont1 +' + 1;' );
                        Auxiliar.agregarCuadruplo('goto ' + for_ini1+ ';\n');
                        Auxiliar.agregarCuadruplo(for_f1 + ':');
                        
                        for(i = 0; i<tamTotalDer; i++){
                            Auxiliar.agregarCuadruplo(temporal + ' = '+auxPrimeraPos+' + '+i+';');
                            Auxiliar.agregarCuadruplo('heap['+temporal+'] = ' + listaDimensionesDer[i] +';   //Guardamos el tamanio de cada dimension');
                        }
                        
                    }
        
                    Auxiliar.agregarCuadruplo('goto ' + salida + ';');
                    Auxiliar.agregarCuadruplo(et_f +':');
        
                    var cont = Auxiliar.getTemp();
                    var for_ini = Auxiliar.getEtq();
                    var for_v = Auxiliar.getEtq();
                    var for_f = Auxiliar.getEtq();
        
                    Auxiliar.agregarCuadruplo(cont + ' =  0;    //inicializando contador');
                    Auxiliar.agregarCuadruplo(for_ini + ':');
        
                    Auxiliar.agregarCuadruplo('if ('+ cont + ' < '+tamTotalIzq+') goto '+for_v+';\n'+'goto ' + for_f +';\n');
                    Auxiliar.agregarCuadruplo(for_v + ':');
        
                    Auxiliar.agregarCuadruplo(temporal + ' = H;');
                    if(tipo == '(entero)' || tipo == '(bool)' || tipo == '(decimal)'){
                        Auxiliar.agregarCuadruplo('heap['+temporal+'] = 0;   //Guardamos el tamanio de cada dimension');
                    }
                    else if(tipo == '(caracter)'){
                        Auxiliar.agregarCuadruplo('heap['+temporal+'] = 666;   //Guardamos el tamanio de cada dimension');
                    }     
                        
                    Auxiliar.agregarCuadruplo('H = H + 1; \n');
                    
                    Auxiliar.agregarCuadruplo(cont + ' = ' + cont +' + 1;' );
                    Auxiliar.agregarCuadruplo('goto ' + for_ini+ ';\n');
                    Auxiliar.agregarCuadruplo(for_f + ':');
                    Auxiliar.agregarCuadruplo(salida + ':');
                    Auxiliar.agregarCuadruplo(temporal + ' = H;');
                    Auxiliar.agregarCuadruplo('heap['+temporal+'] = 0 ;   //Posicion final');
                    Auxiliar.agregarCuadruplo('H = H + 1; \n');
                    
                    var tempo1 = Auxiliar.getTemp();
        
                    Auxiliar.agregarCuadruplo(tempo1 + ' =  S + ' + posicion2 + ';     //pos relativa de \"'+nombreArreglo+'\"'); 
                    Auxiliar.agregarCuadruplo('stack[' + tempo1 + '] = ' + ini + ';     //Se crea la variable global ' + nombreArreglo + '\n'); 
                    
                }
                var cont = new Contenido(nombreArreglo,tipo,true,tamTotalIzq,true,null,null,null,listaDimensionesIzq,listaDimensionesDer,true,null,objeto,posicion2,false,false,false);
                agregarSimbolo(nombreArreglo,tipo,funcionActual,'variable',posicion2);
                listaActual.ListaObjetos[listaActual.ListaObjetos.length - 1].listContenido.push(cont);
                posAtr++;
            }
            else{
                var error = new Error(0,'Semántico','La variable \'' + nombreArreglo + '\' ya existe en la funcion \"'+funcionActual+'\"');
                agregarError(error);
            }
        }
        
    }
    catch(err)
    {
        console.log('Error en la parte de asignacion a los arreglos.');
        tab_error.push(new Error(0,'Semántico',err));
    }
}

function gestionarFuncion(nombre_clase, nodo, lista){
    var cantidad = nodo.getHijos().length;
   /* console.log('comenzar a analizis de funciones ------------>>>')
    console.log(nombre_clase);*/

    switch (cantidad) {
        //Principal
        case 2:
        if(nodo.getHijos()[0].getEtiqueta() == "PRINCIPAL"){
            if(clase_principal == ''){
                clase_principal = nombre_clase;
                metodoPrincipal = nodo.getHijos()[1];
                StackSym[StackSym.length - 1].isPrincipal = true;
            }
        }
        else {
            StackSym[StackSym.length - 1].isConstructor = true;
            recolectarConstructor(nodo,false,nombre_clase);
        }
            break;
        //Constructor
        case 3:
                recolectarConstructor(nodo,true,nombre_clase);
            break;
        // funcion Sin parametros (metodo)
        case 5:
                recolectarFuncion(nodo,false);
            break;
        //funcion con parametros
        case 6:
                recolectarFuncion(nodo,true);
            break;
        default:
            // statements_def
            break;
    }
}

function recolectarConstructor(nodo,isParam,nombreClase){
    try{
        var tipoMetodoRetorno = '(vacio)';
        var nombreFuncion =  nodo.getHijos()[0].getValor();
        var listaParemetros = null;
        var cuerpoFuncion = null;
        var ListaParametros = [];
        var elementosIzq =[];
        
        if(isParam){
            listaParemetros = nodo.getHijos()[1];
            cuerpoFuncion = nodo.getHijos()[2];

            for(var i = 0; i < listaParemetros.getHijos().length; i++){
                var param = listaParemetros.getHijos()[i];
                var tipo = param.getHijos()[0].getHijos()[0].getEtiqueta();
                tipo = '(' + tipo + ')';
                var nombreParam = param.getHijos()[1].getValor();
                var cont = null;
                var ListaDimensiones = [];
                var nElementos = 1;

                if(param.getHijos().length > 2)
                {
                    var Dimensiones = param.getHijos()[2];
                    for(var j = 0; j < Dimensiones.getHijos().length; j++)
                    {
                        elementosIzq.push('dims');
                    }
                    cont = new Contenido(nombreParam,tipo,true,0,true,null,null,null,elementosIzq,[],true,null,false,null,false, false,false);

                }
                else
                {
                    var ref = false;

                    //Si el tipo es una Estructura o Clase
                    if(param.getHijos()[0].getHijos()[0].getEtiqueta() == "id"){
                       
                        var [Existe,Elementos] = obtenerElementos(param.getHijos()[0].getHijos()[0].getValor());

                        if(!Existe){
                            tab_error.push(new Error(0,'Semántico','No existe el objeto: '+ param.getHijos()[0].getHijos()[0].getValor()+''));
                        }
                        cont = new Contenido(nombreParam,tipo,true,null,true,null,null,null,null,null,null,Elementos,true,null,false, false,false);
                    }
                    else{
                         //Verificamos si va a ser punteor o no.
                        if(param.getHijos()[0].getHijos().length > 1)
                            ref = true;

                        cont = new Contenido(nombreParam,tipo,ref,null,true,null,null,null,null,null,null,null,false,null,false, false);
                    }
                }
                ListaParametros.push(cont);
            }

        }else{
            cuerpoFuncion = nodo.getHijos()[1];
        }

        var nuevaFuncion = new Funcion('null',tipoMetodoRetorno,nombreFuncion,ListaParametros,cuerpoFuncion);
        //console.log(nuevaFuncion + '\n');
        guardarFuncion(nuevaFuncion,true);
    }
    catch(error){
        console.log(error);
        tab_error.push(new Error(0,'Semántico',error));
    }
}

function recolectarFuncion(nodo,isParam){

    try{
        var visibilidad = nodo.getHijos()[0].getHijos()[0].getEtiqueta();
        var tipoMetodoRetorno = '(' + nodo.getHijos()[1].getHijos()[0].getEtiqueta() + ')';
        var nombreFuncion =  nodo.getHijos()[3].getValor();
        var listaParemetros = null;
        var cuerpoFuncion = null;
        var ListaParametros = [];
        var elementosIzq =[];
        
        if(isParam){
            listaParemetros = nodo.getHijos()[4];
            cuerpoFuncion = nodo.getHijos()[5];

            for(var i = 0; i < listaParemetros.getHijos().length; i++){
                var param = listaParemetros.getHijos()[i];
                var tipo = param.getHijos()[0].getHijos()[0].getEtiqueta();
                tipo = '(' + tipo + ')';
                var nombreParam = param.getHijos()[1].getValor();
                var cont = null;
                var ListaDimensiones = [];
                var nElementos = 1;

                if(param.getHijos().length > 2)
                {
                    var Dimensiones = param.getHijos()[2];
                    for(var j = 0; j < Dimensiones.getHijos().length; j++)
                    {
                        elementosIzq.push('dims');
                    }
                    cont = new Contenido(nombreParam,tipo,true,0,true,null,null,null,elementosIzq,[],true,null,false,null,false,false,false);

                }
                else
                {
                    var ref = false;

                    //Si el tipo es una Estructura o Clase
                    if(param.getHijos()[0].getHijos()[0].getEtiqueta() == "id"){
                       
                        var [Existe,Elementos] = obtenerElementos(param.getHijos()[0].getHijos()[0].getValor());

                        if(!Existe){
                            tab_error.push(new Error(0,'Semántico','No existe el objeto: '+ param.getHijos()[0].getHijos()[0].getValor()+''));
                        }
                        cont = new Contenido(nombreParam,tipo,true,null,true,null,null,null,null,null,null,Elementos,true,null,false,false,false);
                    }
                    else{
                         //Verificamos si va a ser punteor o no.
                        if(param.getHijos()[0].getHijos().length > 1)
                            ref = true;

                        cont = new Contenido(nombreParam,tipo,ref,null,true,null,null,null,null,null,null,null,false,null,false,false,false);
                    }
                }
                ListaParametros.push(cont);
            }

        }else{
            cuerpoFuncion = nodo.getHijos()[4];
        }

        var nuevaFuncion = new Funcion(visibilidad,tipoMetodoRetorno,nombreFuncion,ListaParametros,cuerpoFuncion);
        //console.log(nuevaFuncion + '\n');
        guardarFuncion(nuevaFuncion,false);
    }
    catch(error){
        console.log(error);
        tab_error.push(new Error(0,'Semántico',error));
    }
}


function guardarFuncion(nuevaFuncion,isConstruct){

    var parametrosRepetidos = false;
    for(var i = 0; i < nuevaFuncion.paramsFuncion.length; i++)
    {
        for(var j = 0; j < nuevaFuncion.paramsFuncion.length; j++)
        {
            if(nuevaFuncion.paramsFuncion[i].nombreSimbolo == nuevaFuncion.paramsFuncion[j].nombreSimbolo && i!=j)
            {
                parametrosRepetidos = true;
            }
        }
    }
     

    if(!parametrosRepetidos){
        var existeFun = false;

        if(StackSym[StackSym.length - 1].ListaObjetos[0].existeFuncion(nuevaFuncion.nombreFuncion,nuevaFuncion.tipoFuncion,nuevaFuncion.paramsFuncion)){
            existeFun = true;
        }
    
        if(!existeFun){
            var EtqRetorno = Auxiliar.getEtq();
            
            //Auxiliar.agregarCuadruplo('void metodo_'+ contadorMetodos +'(){\n');
            if(nuevaFuncion.tipoFuncion == '(vacio)'){
                StackSym[StackSym.length - 1].ListaObjetos.push(new Simbolos("metodo",'',nuevaFuncion.cuerpoFuncion,'',EtqRetorno,0,[]));
            }
            else{
                StackSym[StackSym.length - 1].ListaObjetos.push(new Simbolos("funcion",'',nuevaFuncion.cuerpoFuncion,'',EtqRetorno,0,[])); 
            } 
            
            
            for(var i = 0; i < nuevaFuncion.paramsFuncion.length; i++){
                var Posicion = obtenerPosicion(true);
                if(nuevaFuncion.paramsFuncion[i].isArray)
                {
                    var cont = new Contenido(nuevaFuncion.paramsFuncion[i].nombreSimbolo,nuevaFuncion.paramsFuncion[i].tipo,true,nuevaFuncion.paramsFuncion[i].ValorSimbolo,true, null,null,null,nuevaFuncion.paramsFuncion[i].Dimensiones,nuevaFuncion.paramsFuncion[i].Elementos,true, nuevaFuncion.paramsFuncion[i].ListaObjetos,nuevaFuncion.paramsFuncion[i].isObjeto,Posicion,false,false,false);

                    StackSym[StackSym.length - 1].ListaObjetos[StackSym[StackSym.length - 1].ListaObjetos.length -1].listContenido.push(cont);
                }
                else
                {
                    var cont = new Contenido(nuevaFuncion.paramsFuncion[i].nombreSimbolo,nuevaFuncion.paramsFuncion[i].tipo,true,valNulo,true,
                                         null,null,null,null,null,null,nuevaFuncion.paramsFuncion[i].ListaObjetos,nuevaFuncion.paramsFuncion[i].isObjeto,Posicion,false,isConstruct,false,'');

                    //Guardando los parametros en la ultima funcion que agregamos.
                    StackSym[StackSym.length - 1].ListaObjetos[StackSym[StackSym.length - 1].ListaObjetos.length -1].listContenido.push(cont);
                }                    
            }
            
            //ejecutarInst(nuevaFuncion.cuerpoFuncion);
            var cont = new Contenido(nuevaFuncion.nombreFuncion,nuevaFuncion.tipoFuncion,false,null,false,EtqRetorno,nuevaFuncion.paramsFuncion,true,null,null,null,nuevaFuncion.cuerpoFuncion,'metodo_' + contadorMetodos,obtenerPosicion(false),false,isConstruct,false,claseActual);
            StackSym[StackSym.length - 1].ListaObjetos[0].listContenido.push(cont);
            StackSym[StackSym.length - 1].ListaObjetos.pop();
            //Auxiliar.agregarCuadruplo(EtqRetorno+': //Retorno de metodo_'+contadorMetodos);
            //Auxiliar.agregarCuadruplo('\n}\n\n');
            contadorMetodos++;
        }
        else{
            tab_error.push(new Error(0,'Semántico','La funcion ' + nuevaFuncion.nombreFuncion + ' ya existe.'));
        }
    }
    else{
        tab_error.push(new Error(0,'Semántico','La funcion ' + nuevaFuncion.nombreFuncion + ' tiene parametros repetidos.'));
    }
}
//GENERACION DE CODIGO CUADRUPLOS !!!
function generacionFunciones(claseActual,nodo){
    //---- Generar 3d para métodos y funciones.
    var lista = nodo.ListaObjetos[0].listContenido;

    for(var i = 0; i < lista.length; i++)
    {
        if(lista[i].IsFuncion)
        {
            funcionActual = lista[i].nombreSimbolo;
            generarCuadruploFunciones(claseActual,lista[i]);
        }
    }

    //Si no se creo, generamos un constructor por defecto.
    if(!listaActual.isConstructor){
         var nombreFuncion = 'void '+ claseActual.toLowerCase() +'@'+claseActual.toLowerCase() + '() {\n';
         
         var posThis = Auxiliar.getTemp();
         var valThis = Auxiliar.getTemp();
         var camSimulado = Auxiliar.getTemp();
         var posRelativaThis = Auxiliar.getTemp();

         Auxiliar.agregarCuadruplo('//Constructor generado por defecto.');
         Auxiliar.agregarCuadruplo(nombreFuncion);
         Auxiliar.agregarCuadruplo(posThis + '= S + 0;      //Pos del this');
         Auxiliar.agregarCuadruplo(valThis + '= stack[' + posThis+ '];      //Val del this');
         Auxiliar.agregarCuadruplo(camSimulado + '= S + 1;  //Cambio simulado');
         Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + camSimulado + ' + 0;      //Pos this del init');
         Auxiliar.agregarCuadruplo('stack['+ posRelativaThis +'] = '+ valThis +';       //this en init \n');
         Auxiliar.agregarCuadruplo('S = S + 1;      //Cambio real de ambito');
         Auxiliar.agregarCuadruplo('call init_' + claseActual.toLowerCase() +'();');
         Auxiliar.agregarCuadruplo('S = S - 1;      //regreso al ambito');
         Auxiliar.agregarCuadruplo('}\n')
    }

    //Agrendado el metodo principal, y la instancia automatica para inicializar clase principal.
    if(listaActual.isPrincipal != false){
        var EtqRetorno = Auxiliar.getEtq();
        Auxiliar.agregarCuadruplo('void principal(){')
        listaActual.ListaObjetos.push(new Simbolos("metodo",'',metodoPrincipal,'',EtqRetorno,0,[]));
        agregarSimbolo('principal','(vacio)',claseActual,'metodo',0);
        funcionActual = 'principal';
        ejecutarInst(metodoPrincipal);
        Auxiliar.agregarCuadruplo(EtqRetorno+': //Retorno del método principal.');
        listaActual.ListaObjetos.pop();
        Auxiliar.agregarCuadruplo('\n}\n');

        metodoPrincipal = null;

        //Aca comenzamos a generar metodo por defecto.

        concatena('void init_init(){');

        var tempo = Auxiliar.getTemp();
        var temp1 = Auxiliar.getTemp();
        var temp2 = Auxiliar.getTemp();

        var nombreLlamada = '';

        concatena('//Iniciando instancia de clase que contiene Principal: ' + clase_principal);
        concatena(tempo + ' = H;        //posicion donde inicia nuevo objeto \n'); 
        concatena(temp1 + ' = S + 0;    //cambio simulado a constructor de: ' + clase_principal); 
        concatena(temp2 + ' = ' + temp1 + ' + 0;    //Pos del this de constructor');
        concatena('stack[' +temp2+ '] = '+ tempo + ';     //Val del this \n');

        concatena("S = S + 0;   //cambiamos ambito");

        nombreLlamada = 'call ' + clase_principal.toLowerCase() + '@' + clase_principal.toLowerCase() + '();  //Nombre del constructor de clase principal';        
        concatena(nombreLlamada);

        concatena("S = S - 0;   //regresamos al ambito\n");

        concatena("S = S + 0;   //cambiamos ambito");

        nombreLlamada = 'call principal();    //Llamada al metodo principal';   
        concatena(nombreLlamada);

        concatena("S = S - 0;   //regresamos al ambito\n");
        concatena('}');
        
        Auxiliar.agregarCuadruploInicio(cadenaInit);

    }


    //StackSym[StackSym.length - 1].ListaObjetos.pop();

}

function concatena(cad){
    cadenaInit += cad + '\n';
}

function generarCuadruploFunciones(claseActual,fun){   
    try
    {
        var EtqRetorno = Auxiliar.getEtq();
        var nombreFuncion = 'void '+ claseActual.toLowerCase() +'@'+fun.nombreSimbolo.toLowerCase();

        fun.ListParametros.forEach(function(item){
            nombreFuncion += '@' + item.tipo.replace("(","").replace(")","");
        });

        nombreFuncion += '() {';

        Auxiliar.agregarCuadruplo(nombreFuncion);


        //Auxiliar.agregarCuadruplo('void '+ fun.isObjeto +'(){\n');
        
        if(fun.tipo == '(vacio)'){
           listaActual.ListaObjetos.push(new Simbolos("metodo",'',fun.ListaObjetos,'',EtqRetorno,0,[]));
           agregarSimbolo(fun.nombreSimbolo,fun.tipo,claseActual,'metodo',0);
        } 
        else{
           listaActual.ListaObjetos.push(new Simbolos("funcion",'',fun.ListaObjetos,'',EtqRetorno,0,[]));
           agregarSimbolo(fun.nombreSimbolo,fun.tipo,claseActual,'funcion',0);
        } 
        
        for(var i = 0; i < fun.ListParametros.length; i++)
        {
            var Posicion = obtenerPosicion2(true) + 1;
            if(fun.ListParametros[i].isArray)
            {
                var cont = new Contenido(fun.ListParametros[i].nombreSimbolo,fun.ListParametros[i].tipo,true,fun.ListParametros[i].ValorSimbolo,true,null,null,null,fun.ListParametros[i].Dimensiones,fun.ListParametros[i].Elementos,true,
                                         fun.ListParametros[i].ListaObjetos,fun.ListParametros[i].isObjeto,Posicion,false,false,false);
                listaActual.ListaObjetos[listaActual.ListaObjetos.length - 1].listContenido.push(cont);
                agregarSimbolo(fun.ListParametros[i].nombreSimbolo,fun.ListParametros[i].tipo,fun.nombreSimbolo,'parametro',Posicion);
            }
            else
            {
                var cont = new Contenido(fun.ListParametros[i].nombreSimbolo,fun.ListParametros[i].tipo,true,valNulo,true,null,null,null,null,null,null,fun.ListParametros[i].ListaObjetos,fun.ListParametros[i].isObjeto,Posicion,false,false,false);
                listaActual.ListaObjetos[listaActual.ListaObjetos.length - 1].listContenido.push(cont);
                agregarSimbolo(fun.ListParametros[i].nombreSimbolo,fun.ListParametros[i].tipo,fun.nombreSimbolo,'parametro',Posicion);
            }
        }
        
        if(fun.isConstructor){
            var posThis = Auxiliar.getTemp();
            var valThis = Auxiliar.getTemp();
            var camSimulado = Auxiliar.getTemp();
            var posRelativaThis = Auxiliar.getTemp();
            var CambioAmbito = obtenerPosicion2(false) + 2;

            Auxiliar.agregarCuadruplo(posThis + '= S + 0;      //Pos del this');
            Auxiliar.agregarCuadruplo(valThis + '= stack[' + posThis+ '];      //Val del this');
            Auxiliar.agregarCuadruplo(camSimulado + '= S + ' + CambioAmbito + ';  //Cambio simulado');
            Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + camSimulado + ' + 0;      //Pos this del init');
            Auxiliar.agregarCuadruplo('stack['+ posRelativaThis +'] = '+ valThis +';       //this en init \n');
            Auxiliar.agregarCuadruplo('S = S + ' + CambioAmbito + ';      //Cambio real de ambito');
            Auxiliar.agregarCuadruplo('call init_' + fun.nombreClase.toLowerCase() +'();');
            Auxiliar.agregarCuadruplo('S = S - ' + CambioAmbito + ';      //regreso al ambito \n');
        }

        console.log('prueba -------------------------------------');
        console.log(listaActual.ListaObjetos);
        ejecutarInst(fun.ListaObjetos);
        listaActual.ListaObjetos.pop();
        Auxiliar.agregarCuadruplo(EtqRetorno+': //Retorno de '+fun.isObjeto);
        Auxiliar.agregarCuadruplo('}\n');
    }
    catch(err)
    {
        console.log(err);
    }
}

function recolectarAtrClase(nodoVarLocal){
    try
    {
        var objeto = false;
        var crearVar = true;
        var inst = false;
        //Tipo de atributo, si lo que viene es "id", entonces obtener su valor. 
        var tipo = nodoVarLocal.getHijos()[1].getHijos()[0].getEtiqueta();
        tipo = '('+tipo+')';

        if(tipo == "(id)"){
            objeto = true;
            tipo =  nodoVarLocal.getHijos()[1].getHijos()[0].getValor();
        }
        
        //lista de Id's
        var listaAtr = nodoVarLocal.getHijos()[2];

        //Valor del nodoVarLocal.
        var valor = null;
        //Trae valor asignado

        if(nodoVarLocal.getHijos().length == 4){
            valor = nodoVarLocal.getHijos()[3];
        }else {
            valor = agregarInicializacion(tipo, false);
        }

        //console.log(valor.getEtiqueta());
        if(valor.getEtiqueta() == "exp")
        {
            [ValorAsignar,valorTipo] = generarExpresion(valor);
            if(valorTipo != "(null)")
                if( tipo != valorTipo)
                 {
                       tab_error.push(new Error('0','Semántico','No se puede inicializar la variable: "'+ listaAtr.getHijos()[0].getValor()+'" de tipo: "' +tipo+ '" con el tipo: "' +valorTipo+ '" '));
                       ValorAsignar = valNulo; 
                       crearVar = false;
                 }
        }
        //Por si viene una instancia.
        else{
            var nombreInstancia = valor.getHijos()[0].getHijos()[0].getValor();
            if(tipo != nombreInstancia){
                    tab_error.push(new Error(0,'Semantico','Este lenguaje no permite polimormismo, tipos de datos deben ser iguales'));
                    return;
            }
            inst = true;
            ValorAsignar = valor;
            valorTipo = tipo;
        }
        
        if(crearVar)
        {
            for(var i = 0; i < listaAtr.getHijos().length; i++)
            {
                var nom = listaAtr.getHijos()[i].getValor();
                
                var pp = `tipo: ${tipo} \n valorAsignar: ${ValorAsignar} \n nombre: ${nom} \n isObject: ${objeto} \n  valorTipo: ${valorTipo} \n`;
                
                //console.log(pp);
                var vari = new Variable(tipo,ValorAsignar,nom,objeto,valorTipo,posAtr,false);
                guardarVariableAtr(vari,inst);
                posAtr++;
            }
        }
        
    }
    catch(err)
    {
        console.log('Error en la parte de asignacion a las variables.');
        tab_error.push(new Error(0,'Semántico',err));
    }
}

function guardarVariableAtr(variable, isInstancia){
    //Verificamos si no existe la variable (atributo) en dentro de la clase.
    if(!existeStack(variable.nombreVar))
    {
        if(variable.objeto)
        {
            debugger;
            var [existe,elemento,isEstruct] = obtenerElementos(variable.tipo); 

            if(isEstruct){
                variable.isEstruct = true;
                variable.isInicializado = false;
            }

            if(existe)
            {
                //por que necesitamos las primeras dos para el this y el return 
                var posicion = obtenerPosicion2(true) + 1;
                var cont = new Contenido(variable.nombreVar,variable.tipo,true,variable.valor,true,null,null,null,null,null,null,elemento,variable.objeto,posicion,false,false,false,claseActual,variable.isPuntero,variable.ubicacionPuntero,variable.isEstruct,variable.isInicializado);
                agregarSimbolo(variable.nombreVar,variable.tipo,funcionActual,'variable',posicion);

                listaActual.ListaObjetos[listaActual.ListaObjetos.length - 1].listContenido.push(cont); 
                var tempo = Auxiliar.getTemp();
                var tempo1 = Auxiliar.getTemp();

                if(isInstancia){     
                    //ValorAsignar trae el nodo "instancia"       
                    //VIene una instancia a clase, verificar si es el mismo tipo de dato, llammar a constructores.
                    var nodoInstancia = variable.valor;
                    var nombreInstancia = nodoInstancia.getHijos()[0].getHijos()[0].getValor();
                    var paramsInstancia = nodoInstancia.getHijos()[1];

                    var temp1 = Auxiliar.getTemp();
                    var temp2 = Auxiliar.getTemp();

                    var tipoParamInstancia = [];
                    var nombreLlamada = '';
                    var CambioAmbito = obtenerPosicion2(false) + 2;

                    Auxiliar.agregarCuadruplo('//Iniciando instancia de clase: ' + nombreInstancia);
                    Auxiliar.agregarCuadruplo(tempo + ' = H;        //posicion donde inicia nuevo objeto \n'); Auxiliar.agregarCuadruplo(temp1 + ' = S + ' + CambioAmbito + ';    //cambio simulado a constructor de: ' + nombreInstancia);
                    Auxiliar.agregarCuadruplo(temp2 + ' = ' + temp1 + ' + 0;    //Pos del this de constructor');
                    Auxiliar.agregarCuadruplo('stack[' +temp2+ '] = '+ tempo + ';     //Val del this \n');

                    for(i = 0; i<paramsInstancia.getHijos().length; i++){
                        var temp3 = Auxiliar.getTemp();
                        var param = paramsInstancia.getHijos()[i];
                        Auxiliar.agregarCuadruplo(temp3 + ' = ' + temp1 + ' + ' + (i + 2) + ';  //pos de parametro numero:' + (i + 1));

                        Expresion.enviarListaActual(listaActual,StackSym);
                        var expGenerada = Expresion.evaluarExp(param);
                        tipoParamInstancia.push(expGenerada.valorTipo.replace("(","").replace(")",""));

                        var valorRet = valNulo;

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

                        Auxiliar.agregarCuadruplo('stack['+temp3+'] = ' + valorRet + ';    //asignamos valor a la posicion del parametro \n');
                    }

                    Auxiliar.agregarCuadruplo("S = S + " + CambioAmbito +" ;   //cambiamos ambito");
                    nombreLlamada = 'call ' + nombreInstancia.toLowerCase() + '@' + nombreInstancia.toLowerCase();

                    for(j = 0; j < tipoParamInstancia.length; j ++){
                        nombreLlamada += '@' + tipoParamInstancia[j];
                    }
                    
                    nombreLlamada += '();     //nombre de metodo';
                    Auxiliar.agregarCuadruplo(nombreLlamada);
                    Auxiliar.agregarCuadruplo("S = S - "+CambioAmbito+" ;   //regresamos al ambito\n");

                    Auxiliar.agregarCuadruplo(tempo1 + ' =  S + ' + posicion + ';     //pos relativa de \"'+variable.nombreVar+'\"'); 
                    Auxiliar.agregarCuadruplo('stack[' + tempo1 + '] = ' + tempo + ';     //Se crea la variable global ' + variable.nombreVar + '\n');

                    /*//Esto va a ser exclusivo para los structs cuando se inicialicen 
                    Auxiliar.agregarCuadruplo(tempo + ' = H; '); 

                    Auxiliar.agregarCuadruplo('H = H + ' + elemento.length.toString() + '; //Aumentamos el puntero el numero de atributos. \n')
                    Auxiliar.aumPunteroH_en(elemento.length);

                    decVarStruct(elemento,tempo);
                    
                    Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                    Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                    Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + variable.Posicion + ';     //pos relativa de \"'+variable.nombreSimbolo+'\"'); 
                    Auxiliar.agregarCuadruplo('heap[' + posRelativaThis + '] = ' + tempo + ';     //Se crea la variable global ' + variable.nombreSimbolo + '\n');*/
                }
                else{
                    Auxiliar.agregarCuadruplo(tempo1 + ' =  S + ' + posicion + ';     //pos relativa de \"'+variable.nombreVar+'\"'); 
                    Auxiliar.agregarCuadruplo('stack[' + tempo1 + '] = ' + variable.valor + ';     //Se crea la variable global ' + variable.nombreVar + '\n');
                }
            }
            else
            {
                //console.log('Entre al primero');
                var error=  new Error(0,'Semántico','El objeto ' + variable.tipo + ' no existe.');
                agregarError(error);
            }
        }
        else
        {
            //Porque necesitamos las primeras dos para el this y el return.
            var posicion = obtenerPosicion2(true) + 1;
            var cont = new Contenido(variable.nombreVar,variable.tipo,true,variable.valor,true,null,null,null,null,null,null,null,variable.objeto,posicion,false,false,false,claseActual,variable.isPuntero,variable.ubicacionPuntero);
            
            agregarSimbolo(variable.nombreVar,variable.tipo,funcionActual,'variable',posicion);
            listaActual.ListaObjetos[listaActual.ListaObjetos.length - 1].listContenido.push(cont);

            if(variable.tipo == variable.valTipo || variable.valor == valNulo)
            {
                var tempo1 = Auxiliar.getTemp();
                

                Auxiliar.agregarCuadruplo(tempo1 + ' =  S + ' + posicion + ';     //pos relativa de \"'+variable.nombreVar+'\"'); 
                Auxiliar.agregarCuadruplo('stack[' + tempo1 + '] = ' + variable.valor + ';     //Se crea la variable global ' + variable.nombreVar + '\n');
            }
        }
    }
    else
    {
        var error = new Error(0,'Semántico','La variable \'' + variable.nombreVar + '\' ya existe en la funcion \"'+funcionActual+'\"');
        agregarError(error);
    }
}

function ejecutarInst(nodo){
        if(nodo.getHijos().length > 0){
        for(var i = 0; i < nodo.getHijos().length; i++){
            switch(nodo.getHijos()[i].getEtiqueta().toLowerCase()){
                case "basicas": evaluarBasicas(nodo.getHijos()[i].getHijos()[0]);
                    break;
                case "variable": evaluarVAR(nodo.getHijos()[i]);
                    break;
                case "imprimir": evaluarIMPRIMIR(nodo.getHijos()[i].getHijos()[0]);
                    break;
                case "funcion": evaluarLlamada(nodo.getHijos()[i]);
                    break;
                case "objeto" : evaluarObjetoLlamada(nodo.getHijos()[i]);
                    break;
                case "continue": evaluarCONTINUE();
                    break;
                case "break":    evaluarBREAK();
                    break;
                case "return":  evaluarRETURN(nodo.getHijos()[i]);
                    break; 
                case "puntero": evaluarPUNTERO(nodo.getHijos()[i]);
                    break;
            }
        }
    }
}

function evaluarRETURN(nodoReturn){
    try
    {
        var Existe = false;
        
        if(nodoReturn.getHijos().length == 0)
        {
            for(var i = listaActual.ListaObjetos.length - 1; i >= 0; i--)
            {
                if(listaActual.ListaObjetos[i].Ambito == "metodo")
                {
                    Auxiliar.agregarCuadruplo('goto ' + listaActual.ListaObjetos[i].EtqFinal + '; //Salida del método. \n'); Existe = true;
                    break;
                }
                else if(listaActual.ListaObjetos[i].Ambito == "funcion")
                {
                    Auxiliar.agregarCuadruplo('goto ' + listaActual.ListaObjetos[i].EtqFinal + '; //Salida de la función. \n'); Existe = true;
                    tab_error.push(new Error(0,'Semántico','Las funciones deben retornar una Exprsión.'));
                    break;
                }
            }
        }
        else
        {
            for(var i = listaActual.ListaObjetos.length - 1; i >= 0; i--)
            {
                if(listaActual.ListaObjetos[i].Ambito == "metodo")
                {
                    Auxiliar.agregarCuadruplo('goto ' + listaActual.ListaObjetos[i].EtqFinal + '; //Salida del método. \n'); Existe = true;
                    tab_error.push(new Error(0,'Semántico','Los métodos no pueden retornar una expresión.'));
                    break;
                }
                else if(listaActual.ListaObjetos[i].Ambito == "funcion")
                {
                    var [Valor,TipoValor] = generarExpresion(nodoReturn.getHijos()[0]);
                    var posRelativaReturn = Auxiliar.getTemp();
                    if(TipoValor == "cadena")
                    {
                        Auxiliar.agregarCuadruplo(posRelativaReturn + ' = S + 1;      //Pos del return');
                        Auxiliar.agregarCuadruplo('stack['+posRelativaReturn+'] = ' + Valor + '; //Guardando valor de retorno \n');
                    }
                    else if(TipoValor == 'array')
                    {
                        Auxiliar.agregarCuadruplo(posRelativaReturn + ' = S + 1;      //Pos del return');
                        Auxiliar.agregarCuadruplo('stack['+posRelativaReturn+'] = ' + Valor + '; //Guardando valor de retorno \n');
                    }
                    else{
                        Auxiliar.agregarCuadruplo(posRelativaReturn + ' = S + 1;      //Pos del return');
                        Auxiliar.agregarCuadruplo('stack['+posRelativaReturn+'] = ' + Valor + '; //Guardando valor de retorno \n');
                    }
                    Auxiliar.agregarCuadruplo('goto ' + listaActual.ListaObjetos[i].EtqFinal + '; //Salida de la función. \n'); Existe = true;
                    break;
                }
            }
        }
        
        if(!Existe)
        {
            tab_error.push(new Error(0,'Semántico','La sentencia return, debe ir dentro de métodos o funciones.'));
        }
    }
    catch(err)
    {
        tab_error.push(new Error(0,'Semántico',err));
    }
}

function evaluarLlamada(nodo_Llamada){
    try
    {
        
        var ptnId = nodo_Llamada.getHijos()[0];
        var ptnParametros = nodo_Llamada.getHijos()[1];

        var ListaParametros = [];
        var strNombreMetodo = ptnId.getValor();
        
        for(var i = 0; i < ptnParametros.getHijos().length; i++){
            var [Valor,TipoValor] = generarExpresion(ptnParametros.getHijos()[i]);
            ListaParametros.push([Valor,TipoValor]);
        }
        
        var metodo = new ObtenerMetodo(strNombreMetodo,ListaParametros,'(vacio)');
        InvocarMetodo(metodo);
    }
    catch(err)
    {
        console.log(err);
        tab_error.push(new Error(0,'Semántico',err));
    }
}

function evaluarObjetoLlamada(nodoAtr){
    try
    {
        
        var Lista = [];
        var IsGlobal = false;
        var nombre = nodoAtr.getHijos()[0].getValor();

        for(var i = listaActual.ListaObjetos.length - 1; i >= 0; i--)
        {
            if(listaActual.ListaObjetos[i].Ambito == "metodo" || listaActual.ListaObjetos[i].Ambito == "funcion")
            {
                if(listaActual.ListaObjetos[i].existeSimbolo(nombre))
                {
                    Lista = listaActual.ListaObjetos[i].listContenido;
                    break;
                }
                    Lista = listaActual.ListaObjetos[0].listContenido;
                    IsGlobal = true;
                    break;
            }
            else
            {
                if(listaActual.ListaObjetos[i].existeSimbolo(nombre))
                {
                    Lista = listaActual.ListaObjetos[i].listContenido;
                    break;
                }
            }
        }

        for(var i = 0; i < Lista.length; i++)
        {
            var strNombreVariable = nombre;
            var Dimensiones = [];
            var Contador = 0;
            
            //Entra si viene una lista de atributos y ademas es global.
            if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar && IsGlobal)
            {
                if(Lista[i].isObjeto)
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
                    
                    RecursividadAtr(nodoAtr.getHijos()[1],Dimensiones,Lista[i].ListaObjetos,Contador + 1,IsGlobal,HeapPivote);
                }
            }

            //Entra si es una lista de atributos y es local.
            else if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar)
            {
                if(Lista[i].isObjeto)
                {
                    var temporal = Auxiliar.getTemp();
                    var temporal2 = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo(temporal + ' = ' + ' S + ' + Lista[i].Posicion + '; \n');
                    Auxiliar.agregarCuadruplo(temporal2 + ' = ' + ' stack[' + temporal + ']; //Obteniendo posicion inicio de ' + strNombreVariable + ' \n');
                    RecursividadAtr(nodoAtr.getHijos()[1],Dimensiones,Lista[i].ListaObjetos,Contador + 1,IsGlobal,temporal2);
                }
            }
        }
    }
    catch(err)
    {
        console.log(err);
        tab_error.push(new Error(0,'Semántico',err));
    }
}

function RecursividadAtr(nodoId,Dimensiones,Lista,Contador,IsGlobal, TemporalAnterior){
    var Existe = false;
    var Valor = valNulo;
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
                listaProxima = obtenerListaClase(Lista[i].tipo);   
            }else{
                listaProxima = Lista[i].ListaObjetos;
            }

            return RecursividadAtr(nodoId,Dimensiones,listaProxima,Contador + 2, IsGlobal,temporal2);
        }
        //Entra si el ultimo nodo es un Id
        /*else if(Lista[i].nombreSimbolo == strNombreVariable && Lista[i].IsVar && (nodoId.getHijos().length - 1 == Contador))
        {
            var temporal = Auxiliar.getTemp(); 
            var Posicion = Lista[i].Posicion;
            Auxiliar.agregarCuadruplo(temporal + ' = ' + TemporalAnterior + ' + ' + Posicion + ';\n');
            var temporal2 = Auxiliar.getTemp();
            Auxiliar.agregarCuadruplo(temporal2 + ' = heap[' + temporal + ']; //Obteniendo atributo. ' + strNombreVariable + '\n');
            
            Existe = true; Valor = temporal2, TipoValor = Lista[i].tipo;
        }*/
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
            
            
            var simboloFuncion = obtenerListaClaseFuncion(Lista[i].nombreClase,nodoFuncion,ListaParametros);
            
            
            simboloFuncion.ValorSimbolo = TemporalAnterior;

            listaActual.ListaObjetos[0].listContenido.unshift(simboloFuncion);
            [ValorAsignar,valorTipo] = generarExpresion(nodoId.getHijos()[Contador]);
            listaActual.ListaObjetos[0].listContenido.shift();

            Existe = true; Valor = ValorAsignar, TipoValor = Lista[i].tipo;
        }
    }

   /* if(Existe){
        var ptnId = nodoFuncion.getHijos()[0];
        var ptnParametros = nodoFuncion.getHijos()[1];

        var ListaParametros = [];
        var strNombreMetodo = ptnId.getValor();
        
        for(var i = 0; i < ptnParametros.getHijos().length; i++){
            var [Valor,TipoValor] = generarExpresion(ptnParametros.getHijos()[i]);
            ListaParametros.push([Valor,TipoValor]);
        }
        
        var metodo = new ObtenerMetodo(strNombreMetodo,ListaParametros,'(vacio)');
        InvocarMetodo(metodo);
    }*/
}

function obtenerListaClase(nombreClase){
    
    console.log('---------------------------------------------------------------------------------------');
    console.log('llegaste a bucsar dentro de la lista general' );
    
    for(var k = 0; k<StackSym.length; k++){
        if(StackSym[k].nombreSimbolo == nombreClase){
            return StackSym[k].ListaObjetos[0].listContenido;
        }
    }

    return [];
}

function obtenerListaClaseFuncion(nombreClase,nodoFuncion,ListaParametros){
    
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

function InvocarMetodo(metodo){
    
    var [Existe,NombreMetodo,Tamanio,NombreClase] = RecorrerMetodoGeneral(metodo.strNombreMetodo,metodo.strTipo,metodo.ListaParametros);
    if(!Existe)
    {
        tab_error.push(new Error(0,'Semántico','El método ' + metodo.strNombreMetodo + ' a invocar no existe.'));
    }
    else
    {
        var Referencias = ObtenerTipoReferencias(metodo.strNombreMetodo,metodo.strTipo,metodo.ListaParametros);
        var CambioAmbito = obtenerPosicion2(false) + 2;
        var temp1 = Auxiliar.getTemp();
        var temp2 = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temp1 + ' =  s + 0 ;  //Pos del this');
        Auxiliar.agregarCuadruplo(temp2 + ' =  stack[' + temp1 + '] ;  //Val del this \n');

        Auxiliar.agregarCuadruplo('S = S + ' + CambioAmbito + ';');

        //Pasando el this al metodo a llamar
        var temporal = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temporal + ' = S + 0;  ');
        Auxiliar.agregarCuadruplo('stack[' + temporal + '] = ' + temp2 + '; //Asignando this. \n');

        for(var i = 0; i < metodo.ListaParametros.length; i++)
        {
            if(metodo.ListaParametros[i][1] == "(cadena)")
            {
                var temporal = Auxiliar.getTemp();
                Auxiliar.agregarCuadruplo(temporal + ' = S + ' + (i + 2).toString() + ';  ');
                Auxiliar.agregarCuadruplo('stack[' + temporal + '] = ' + metodo.ListaParametros[i][0] + '; //Asignando parametro. \n');
            }
            else if(metodo.ListaParametros[i][1] == 'array')
            {
                
                var temporal1 = Auxiliar.getTemp();
                Auxiliar.agregarCuadruplo(temporal1 + ' = S + ' + (i + 2).toString() + ';');
                Auxiliar.agregarCuadruplo('stack[' + temporal1 + '] = ' + metodo.ListaParametros[i][0] + '; //Asignando al parametro arreglo \n');
            }
            else
            {
                var temporal = Auxiliar.getTemp();
                Auxiliar.agregarCuadruplo(temporal + ' = S + ' + (i + 2).toString() + ';  ');
                Auxiliar.agregarCuadruplo('stack[' + temporal + '] = ' + metodo.ListaParametros[i][0] + '; //Asignando parametro. \n');
            }
        }
        var nombreLlamada = 'call ' + NombreClase.toLowerCase() + '@' + NombreMetodo.toLowerCase();

        for(z = 0; z < metodo.ListaParametros.length; z++){
            nombreLlamada += '@' + metodo.ListaParametros[z][1].replace("(","").replace(")",""); 
        }

        nombreLlamada += '();';

        Auxiliar.agregarCuadruplo(nombreLlamada);
        Auxiliar.agregarCuadruplo('S = S - ' + CambioAmbito + ';');
        //agregarSimbolo(metodo.strNombreMetodo,metodo.strTipo,'global','metodo',0);
    }
}

function ObtenerTipoReferencias(strNombreMetodo,strTipo,ListaParametros)
{
    var Referencias = [];
    
    Referencias = listaActual.ListaObjetos[0].ObtenerReferencias(strNombreMetodo,strTipo,ListaParametros);
    
    return Referencias;
}

function RecorrerMetodoGeneral(strNombreMetodo,strTipo,ListaParametros){
    
    var Existe = false, NombreMetodo = '', Tamanio = 0;

    [Existe,NombreMetodo,Tamanio,NombreClase] = listaActual.ListaObjetos[0].ObtenerMetodo(strNombreMetodo,strTipo,ListaParametros);
    
    return [Existe,NombreMetodo,Tamanio, NombreClase];
}

function evaluarPUNTERO(nodoPuntero){
    try
    {
        var objeto = false;
        var crearVar = true;
        var inst = false;
        //Tipo de atributo, si lo que viene es "id", entonces obtener su valor. 
        var tipo = nodoPuntero.getHijos()[0].getHijos()[0].getHijos()[0].getEtiqueta();
        tipo = '('+tipo+')';

        if(tipo == "(id)"){
            objeto = true;
            tipo =  nodoPuntero.getHijos()[0].getHijos()[0].getHijos()[0].getValor();
        }
    
        //Valor del nodoPuntero.
        var valor = null;
        //Trae valor asignado

        if(nodoPuntero.getHijos().length == 2){
            valor = nodoPuntero.getHijos()[1];
        }

        //console.log(valor.getEtiqueta());
        if(valor.getEtiqueta() == "exp")
        {
            [ValorAsignar,valorTipo,ubicacionPuntero] = generarExpresion(valor);
            if(valorTipo != "(null)"){
                if(!objeto){
                    if( tipo != valorTipo)
                    {
                        tab_error.push(new Error('0','Semántico','No se puede inicializar la variable: "'+ nodoPuntero.getHijos()[0].getHijos()[1].getValor()+'" de tipo: "' +tipo+ '" con el tipo: "' +valorTipo+ '" '));
                        ValorAsignar = valNulo; 
                        crearVar = false;
                    }
                }
            }
        }
        
        if(crearVar)
        {
           var nombrePuntero = nodoPuntero.getHijos()[0].getHijos()[1].getValor();
            
           var pp = `tipo: ${tipo} \n valorAsignar: ${ValorAsignar} \n nombre: ${nombrePuntero} \n isObject: ${objeto} \n  valorTipo: ${valorTipo} \n`;
                
            //console.log(pp);
            var vari = new Variable(tipo,ValorAsignar,nombrePuntero,objeto,valorTipo,posAtr,true,ubicacionPuntero);
            guardarVariableAtr(vari,inst);
            posAtr++;
            
        }
        
    }
    catch(err)
    {
        console.log('Error en la parte de asignacion a las variables.');
        tab_error.push(new Error(0,'Semántico',err));
    }
}


function evaluarVAR(nodo){
    //recibimos nodo "variable"
    if(nodo.getHijos()[0].getEtiqueta() == "declarar"){
        var tipo_declaracion = nodo.getHijos()[0].getHijos()[0].getEtiqueta();
        switch (tipo_declaracion) {
            case "lista":
                // En caso de una declaracion normal, enviamos nodo LISTA
                recolectarAtrClase(nodo.getHijos()[0].getHijos()[0]);
                break;
            case "arreglo":
                recolectarAtrClaseArreglo(nodo.getHijos()[0].getHijos()[0]);
                break;
            default:
                break;
        }
    }   
    //Es una asignacion 
    if(nodo.getHijos()[0].getEtiqueta() == "asignar"){
        
        var tipo_declaracion = nodo.getHijos()[0].getHijos()[0].getEtiqueta();
        switch (tipo_declaracion) {
            case "lista":
                // En caso de una declaracion normal, enviamos nodo LISTA
                asignacionLista(nodo.getHijos()[0].getHijos()[0]);
                break;
            case "arreglo":
                asignacionArreglo(nodo.getHijos()[0].getHijos()[0]);
                break;
            case "objeto":
                asignacionObjeto(nodo.getHijos()[0].getHijos()[0]);
                break;
            default:
                break;
        }
    }
}

function asignacionLista(nodoLista){
    try
    {
        debugger;
        //Asignacion lista
        
        var ptnDimension = [];
        var ptnValorAsignar = nodoLista.getHijos()[1];
        var IsNuevo = false;

     
        var ValorAsignar = valNulo;
        var TipoValor = '';

        if(ptnValorAsignar.getEtiqueta() == 'exp')
        {
            [ValorAsignar,TipoValor] = generarExpresion(ptnValorAsignar);
        }
        //Viene una instancia.
        else
        {
            var strNombreClase = ptnValorAsignar.getHijos()[0].getHijos()[0].getValor();
            TipoValor = strNombreClase; 
            IsNuevo = true;
        }
        
        var asig = new AsignarValor(nodoLista,ValorAsignar,ptnDimension,TipoValor,IsNuevo);
        Asignar(asig);
        
    }
    catch(err)
    {
        console.log(err);
        tab_error.push(new Error(0,'Semántico',err));
    }
}

function asignacionArreglo(nodoArreglo){
    try
    {
        //Asignacion arreglo
        
        var ptnId = nodoArreglo;
        var ptnDimension = nodoArreglo.getHijos()[1];
        var ptnValorAsignar = nodoArreglo.getHijos()[2];
        var IsNuevo = false;

     
        var ValorAsignar = valNulo;
        var TipoValor = '';

        
        //Mandar lista de dimensiones, no el nodo.
        var ListaIndices = [];
        for(var i = 0; i < ptnDimension.getHijos().length; i++)
        {
            var [Valor,TipoValor] = generarExpresion(ptnDimension.getHijos()[i]);
            if(TipoValor == "(entero)"){
                ListaIndices.push(Valor);
            }
        }
        
        if(ptnValorAsignar.getEtiqueta() == 'exp')
        {
            [ValorAsignar,TipoValor] = generarExpresion(ptnValorAsignar);
        }
        //Viene una instancia.
        else
        {
            var strNombreClase = ptnValorAsignar.getHijos()[0].getHijos()[0].getValor();
            TipoValor = strNombreClase; 
            IsNuevo = true;
        }

        var asig = new AsignarValor(ptnId,ValorAsignar,ListaIndices,TipoValor,IsNuevo);
        Asignar(asig);
        
    }
    catch(err)
    {
        console.log(err);
        tab_error.push(new Error(0,'Semántico',err));
    }
}

function asignacionObjeto(nodoObjeto){
    try
    {
        //Asignacion arreglo
        
        var ptnId = nodoObjeto;
        var ptnValorAsignar = nodoObjeto.getHijos()[2];
        var IsNuevo = false;

     
        var ValorAsignar = valNulo;
        var TipoValor = '';
        
        //Mandar lista de dimensiones, no el nodo.
        var ListaIndices = [];
        
        if(ptnValorAsignar.getEtiqueta() == 'exp')
        {
            [ValorAsignar,TipoValor] = generarExpresion(ptnValorAsignar);
        }
        //Viene una instancia.
        else
        {
            var strNombreClase = ptnValorAsignar.getHijos()[0].getHijos()[0].getValor();
            TipoValor = strNombreClase; 
            IsNuevo = true;
        }

        var asig = new AsignarValor(ptnId,ValorAsignar,ListaIndices,TipoValor,IsNuevo);
        Asignar(asig);
        
    }
    catch(err)
    {
        console.log(err);
        tab_error.push(new Error(0,'Semántico',err));
    }
}


function Asignar(asig)
{
    
    var Existe = ReasignarValorGeneral(asig.ptnId,asig.Valor,asig.Indices,asig.strTipoValor,asig.IsNuevo);
    if(!Existe)
    {
        tab_error.push(new Error(0,'Semántico','La variable a asignar a \''+ asig.ptnId.getHijos()[0].getValor() +'\' no se encuentra, o tiene el tipo de dato incorrecto.'));
    }
}

function ReasignarValorGeneral(ptnId,Valor,Dimensiones,strTipoValor,IsNuevo)
{
    var Existe = false;
    
    for(var i = listaActual.ListaObjetos.length - 1; i >= 0; i--)
    {
        if(listaActual.ListaObjetos[i].Ambito == "metodo" || listaActual.ListaObjetos[i].Ambito == "funcion")
        {
            if(listaActual.ListaObjetos[i].AsignarValorGeneral(ptnId,Valor,Dimensiones,strTipoValor,listaActual.ListaObjetos[i].listContenido,0,false,IsNuevo,listaActual,StackSym))
            {
                Existe = true;
                break;
            }
            Existe = listaActual.ListaObjetos[0].AsignarValorGeneral(ptnId,Valor,Dimensiones,strTipoValor,listaActual.ListaObjetos[0].listContenido,0,true,IsNuevo,listaActual,StackSym);
            
            break;                
        }
        else
        {
            if(listaActual.ListaObjetos[i].AsignarValorGeneral(ptnId,Valor,Dimensiones,strTipoValor,listaActual.ListaObjetos[i].listContenido,0,false,IsNuevo,listaActual,StackSym))
            {
                Existe = true;
                break;
            }
        }
        
    }
        
    //}
    
    return Existe;
}


function evaluarCONTINUE(){
    try
    {
        var existe = false;
        for(var i = listaActual.ListaObjetos.length - 1; i >= 0; i--)
        {
            if(listaActual.ListaObjetos[i].Ambito == "ciclo")
            {
                Auxiliar.agregarCuadruplo('goto ' + listaActual.ListaObjetos[i].EtqInicio + '; //Inicia el ciclo. \n'); existe = true;
                break;
            }
            else if(listaActual.ListaObjetos[i].Ambito == "metodo" || listaActual.ListaObjetos[i].Ambito == "funcion"){
                break;
            }
        }
        
        if(!existe){
            tab_error.push(new Error(0,'Semántico','La sentencia continue, debe ir dentro de ciclos.'));
        }
    }
    catch(err)
    {
        tab_error.push(new Error(0,'Semántico',err));
    }
}


function evaluarBREAK(nodo){
    try
    {
        for(var i = listaActual.ListaObjetos.length - 1; i >= 0; i--)
        {
            if(listaActual.ListaObjetos[i].Ambito == "ciclo")
            {
                Auxiliar.agregarCuadruplo('goto ' + listaActual.ListaObjetos[i].EtqFinal + '; //Salida del ciclo. \n');
                break;
            }
            else if(listaActual.ListaObjetos[i].Ambito == "switch")
            {
                Auxiliar.agregarCuadruplo('goto ' + listaActual.ListaObjetos[i].EtqFinal + '; //Salida del switch. \n'); 
                break;
            }
            else if(listaActual.ListaObjetos[i].Ambito == "metodo" || listaActual.ListaObjetos[i].Ambito == "funcion"){
                break;
            }
        }
    }
    catch(err)
    {
        tab_error.push(new Error(0,'Semántico',err));
    }
}

function evaluarIMPRIMIR(raiz){
    try
    {
        var [Valor, TipoValor] = generarExpresion(raiz);
        var CambioAmbito = obtenerPosicion2(false) + 2;
        var temporal = Auxiliar.getTemp();

        if(TipoValor == '(cadena)'){
            Auxiliar.agregarCuadruplo('S = S + ' + CambioAmbito + ';');
            Auxiliar.agregarCuadruplo(temporal + ' = S + 1;');
            Auxiliar.agregarCuadruplo('stack[' + temporal + '] = ' + Valor + ';');
            Auxiliar.agregarCuadruplo('$$_print();');
            Auxiliar.agregarCuadruplo('S = S - ' + CambioAmbito + ';\n');
        }
        else if(TipoValor == '(caracter)'){
            Auxiliar.agregarCuadruplo('S = S + ' + CambioAmbito + ';');
            Auxiliar.agregarCuadruplo(temporal + ' = S + 1;');
            Auxiliar.agregarCuadruplo('stack[' + temporal + '] = ' + Valor + ';');
            Auxiliar.agregarCuadruplo('$$_printChar();');
            Auxiliar.agregarCuadruplo('S = S - ' + CambioAmbito + ';\n');
        }
        else{
            tab_error.push(new Error(0,'Semantico','Solo puedes imprimir, cadenas o caracteres'));
        }

    }
    catch(err)
    {
        console.log(err);
        tab_error.push(new Error(0,'Semántico',err));
    }
}

function evaluarBasicas(nodo){
    Expresion.enviarListaActual(listaActual,StackSym);
    var tipo = nodo.getEtiqueta();

    switch (tipo) {
        case "if_normal": evaluarIF(nodo);  
            break;
        case "if_else": evaluarIF(nodo);  
            break;
        case "switch": evaluarSWITCH(nodo);
            break;
        case "while": evaluarWHILE(nodo);
            break;
        case "do_while": evaluarDO_WHILE(nodo);
            break;
        case "whilex": evaluarWHILEX(nodo);
            break;
        case "repeat": evaluarREPEAT(nodo);
            break;
        case "loop" : evaluarLOOP(nodo);
            break;
        case "count": evaluarCOUNT(nodo);
            break;
        case "for": evaluarFOR(nodo);
            break;
        default:
            // statements_def
            break;
    }
}
//------------------------------------------------------------------------------------------------------------------
//EVALUAR FOR 
function evaluarFOR(nodoFor){
    try
    {
        
        var ptnDeclaracion = nodoFor.getHijos()[0];
        var ptnCondicion = nodoFor.getHijos()[1];
        var ptnCuerpoInstruccion = nodoFor.getHijos()[2];
        
        var EtiquetaInicio = Auxiliar.getEtq();
        var EtiquetaFin = Auxiliar.getEtq();
        
        listaActual.ListaObjetos.push(new Simbolos("ciclo",'',ptnCuerpoInstruccion,EtiquetaInicio,EtiquetaFin,0,[]));
        
        var Posicionamiento = 0;
        var EsGlobal = false;
       
        var strTipo = "(entero)";
        var strNombreVariable = ptnDeclaracion.getHijos()[0].getValor();
        var [Valor,TipoValor] = generarExpresion(ptnDeclaracion.getHijos()[1]);
        
        var Posicion = obtenerPosicion2(true) + 1;
        var cont = new Contenido(strNombreVariable,strTipo,true,Valor,true,null,null,null,null,null,null,null,false,Posicion);
        agregarSimbolo(strNombreVariable,strTipo,listaActual.ListaObjetos[listaActual.ListaObjetos.length - 1].Ambito,'Variable de for',Posicion);

        listaActual.ListaObjetos[listaActual.ListaObjetos.length - 1].listContenido.push(cont);
        var temporal = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(temporal + ' = S + ' + Posicion + ';');
        Auxiliar.agregarCuadruplo('stack[' + temporal + '] = ' + Valor + '; //Se crea la variable ' + strNombreVariable + '\n');
        Posicionamiento = Posicion;
        
        Auxiliar.agregarCuadruplo(EtiquetaInicio + ':\n');
        var [sent , Condicion] = generarCondicion(ptnCondicion);
        
        if(Condicion.et_v != '' && Condicion.et_f != '')
        {
            Auxiliar.agregarCuadruplo(sent);
            Auxiliar.agregarCuadruplo(Condicion.et_v + '\n');
            ejecutarInst(ptnCuerpoInstruccion);
            
          
            var temporal = Auxiliar.getTemp();
            Auxiliar.agregarCuadruplo(temporal + ' = S + ' + Posicionamiento + ';');
            var temporal1 = Auxiliar.getTemp();
            Auxiliar.agregarCuadruplo(temporal1 + ' = stack[' + temporal + '];');
            Auxiliar.agregarCuadruplo(temporal1 + ' = ' + temporal1 + ' + 1;');
            Auxiliar.agregarCuadruplo('stack[' + temporal + '] = ' + temporal1 + ';');
             
            
            Auxiliar.agregarCuadruplo('goto ' + EtiquetaInicio + ';\n');
            Auxiliar.agregarCuadruplo(Condicion.et_f + '');
            Auxiliar.agregarCuadruplo(EtiquetaFin + ':');
        }
        else
        {
            tab_error.push(new Error(0,'Semántico','La condición del for debe ser booleana.'));
        }        
        
        listaActual.ListaObjetos.pop();
        
    }
    catch(err)
    {
        console.log(err);
        tab_error.push(new Error(0,'Semántico',err));
    }
}
//-------------------------------------------------------------------------------------------------------------------
//EVALUAR IF 
function evaluarIF(nodo_If){
    try
    {
        //---- Se obtiene la condicion.
        Auxiliar.agregarCuadruplo('//Inicio de sentencia if');
        var [sent , Condicion] = generarCondicion(nodo_If.getHijos()[0]);
        
        var EtiquetaSalto = Auxiliar.getEtq();
        var SentenciaSalto = 'goto ' + EtiquetaSalto + ';';

        if(Condicion.et_v != '' && Condicion.et_f != ''){
            Auxiliar.agregarCuadruplo(sent);
            //Agregamos etiqueta verdadera
            Auxiliar.agregarCuadruplo(Condicion.et_v+'\n');

            //---- Inicio ámbito.
            listaActual.ListaObjetos.push(new Simbolos("if",'',null,'',EtiquetaSalto,0,[]));
            ejecutarInst(nodo_If.getHijos()[1]);
            listaActual.ListaObjetos.pop();
            //---- Fin del ámbito.
            
            Auxiliar.agregarCuadruplo(SentenciaSalto);
            Auxiliar.agregarCuadruplo(Condicion.et_f+'\n');

            if(nodo_If.getHijos().length > 2){
                
                //---- Inicio ámbito.
                listaActual.ListaObjetos.push(new Simbolos("if",'',null,'',EtiquetaSalto,0,[]));
                ejecutarInst(nodo_If.getHijos()[2]);
                listaActual.ListaObjetos.pop();
                //---- Fin del ámbito.
            }

            Auxiliar.agregarCuadruplo(EtiquetaSalto + ':\n');
            Auxiliar.agregarCuadruplo('//Fin de sentencia if\n');
        }
        else{
            tab_error.push(new Error(0,'Semántico','La condición del if debe ser booleana.'));
        }
    }
    catch(err)
    {
        tab_error.push(new Error(0,'Semántico',err));
    }
}
//----------------------------------------------------------------------------------------------------------------------------
// Evaluar SWITCH 
function evaluarSWITCH(nodo){
    try
    {
        
        var nodoExp = nodo.getHijos()[0];
        var nodoListaCasos = nodo.getHijos()[1];

        var nodoDefecto = null;

        if(nodo.getHijos().length > 2)
            nodoDefecto = nodo.getHijos()[2];
        
        var EtiquetaInicio = Auxiliar.getEtq();
        var EtiquetaFin = Auxiliar.getEtq();
        
        Auxiliar.agregarCuadruplo('//Inicio de la sentencia switch');
        
        var [ExpresionComp,TipoValor] = generarExpresion(nodoExp);
        
        var TemporalDefecto = Auxiliar.getTemp();
        var TemporalEncontro = Auxiliar.getTemp();
        Auxiliar.agregarCuadruplo(TemporalDefecto + ' = 1;'); 
        Auxiliar.agregarCuadruplo(TemporalEncontro + ' = 0;');
        listaActual.ListaObjetos.push(new Simbolos("switch",'',null,EtiquetaInicio,EtiquetaFin,0,[]));
        
        if(TipoValor == "(entero)" || TipoValor == "(caracter)" || TipoValor == "(decimal)" || TipoValor == "(bool)")
        {
            for(var i = 0; i < nodoListaCasos.getHijos().length; i++)
            {
                var nodoCaso = nodoListaCasos.getHijos()[i];

                var nodoExpCaso = nodoCaso.getHijos()[0];
                var nodoSent = nodoCaso.getHijos()[1];

                var [Valor,TipoValor] = generarExpresion(nodoExpCaso);

                if(TipoValor == "(entero)" || TipoValor == "(decimal)" || TipoValor == "(caracter)" || TipoValor == "(bool)"){ 
                    var verdadera = Auxiliar.getEtq();
                    var falsa = Auxiliar.getEtq();
                    var vddPivote = Auxiliar.getEtq();
                    var falPivote = Auxiliar.getEtq();
                    Auxiliar.agregarCuadruplo('if(' + TemporalEncontro + ' == 1) goto ' + vddPivote + ';\ngoto ' + falPivote + ';');
                    Auxiliar.agregarCuadruplo(falPivote + ':');
                    Auxiliar.agregarCuadruplo('if(' + ExpresionComp + ' == ' + Valor + ') goto ' + verdadera + ';   //Comparando\ngoto ' + falsa + ';');
                    Auxiliar.agregarCuadruplo(verdadera + ':');
                    Auxiliar.agregarCuadruplo(vddPivote + ':');
                    Auxiliar.agregarCuadruplo(TemporalDefecto + ' = 0;');
                    Auxiliar.agregarCuadruplo(TemporalEncontro + ' = 1;');
                    
                    ejecutarInst(nodoSent);

                    Auxiliar.agregarCuadruplo(falsa + ':\n');
                }else{
                    tab_error.push(new Error(0,'Semántico','Todos los valores a comparar del switch deben ser numéricos.')); 
                    return;
                }
            }
            var verdadera = Auxiliar.getEtq();
            var falsa = Auxiliar.getEtq(); 
            if(nodoDefecto != null){
                Auxiliar.agregarCuadruplo('if(' + TemporalDefecto + ' == 1) goto ' + verdadera + ';\ngoto ' + falsa + ';');
                Auxiliar.agregarCuadruplo(verdadera + ':');
                ejecutarInst(nodoDefecto.getHijos()[0]);
            }
            Auxiliar.agregarCuadruplo(falsa + ':');
        }
        //Por si lo que se va a evaluar es un string
        else
        {
            for(var i = 0; i < nodoListaCasos.getHijos().length; i++)
            {   
                var nodoCaso = nodoListaCasos.getHijos()[i];

                var nodoExpCaso = nodoCaso.getHijos()[0];
                var nodoSent = nodoCaso.getHijos()[1];

                var [Valor,TipoValor] = generarExpresion(nodoExpCaso);

                if(TipoValor != "(cadena)"){ 
                    tab_error.push(new Error(0,'Semántico','Todos los valores a comparar del switch deben ser cadenas')); 
                    return; 
                }   

                var vddPivote = Auxiliar.getEtq();
                var falPivote = Auxiliar.getEtq();

                Auxiliar.agregarCuadruplo('if(' + TemporalEncontro + ' == 1) goto ' + vddPivote + ';\ngoto ' + falPivote + ';');
                Auxiliar.agregarCuadruplo(falPivote + ':');

                var  e_v = Auxiliar.getEtq(); 
                var e_f = Auxiliar.getEtq();
                var temp_izq = ExpresionComp; 
                var temp_der = Valor;
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
                
                Auxiliar.agregarCuadruplo('if(' + temp_comp1 + ' == ' + temp_comp2 + ') goto ' + e_v + ';\ngoto ' + e_f + ';\n');

                Auxiliar.agregarCuadruplo(e_v + ':');
                Auxiliar.agregarCuadruplo(vddPivote + ':');
                Auxiliar.agregarCuadruplo(TemporalDefecto + ' = 0;');
                Auxiliar.agregarCuadruplo(TemporalEncontro + ' = 1;');

                ejecutarInst(nodoSent);

                Auxiliar.agregarCuadruplo(e_f + ':\n');
               
            }
            var verdadera = Auxiliar.getEtq();
            var falsa = Auxiliar.getEtq(); 
            if(nodoDefecto != null){
                Auxiliar.agregarCuadruplo('if(' + TemporalDefecto + ' == 1) goto ' + verdadera + ';\ngoto ' + falsa + ';');
                Auxiliar.agregarCuadruplo(verdadera + ':');
                ejecutarInst(nodoDefecto.getHijos()[0]);
            }
            Auxiliar.agregarCuadruplo(falsa + ':');
        }
        
        
        listaActual.ListaObjetos.pop();
        Auxiliar.agregarCuadruplo(EtiquetaFin + ': //Fin de la sentencia switch ');
        
    }
    catch(err)
    {
        console.log(err);
        tab_error.push(new Error(0,'Semántico',err));
    }
}
//----------------------------------------------------------------------------------------------------------------------------
// Evaluar WHILE
function evaluarWHILE(nodo){
    try
    {
        var EtiquetaInicio = Auxiliar.getEtq();
        var EtiquetaFin = Auxiliar.getEtq();

        var CuerpoInstrucciones = nodo.getHijos()[1];
        Auxiliar.agregarCuadruplo(EtiquetaInicio + ': ');
        var [sent , Condicion] = generarCondicion(nodo.getHijos()[0]);

        if(Condicion.et_v != '' && Condicion.et_f != ''){
            
            Auxiliar.agregarCuadruplo(sent);
            Auxiliar.agregarCuadruplo(Condicion.et_v+'');
            //---- Inicio ámbito.
            listaActual.ListaObjetos.push(new Simbolos("ciclo",'',CuerpoInstrucciones,EtiquetaInicio,EtiquetaFin,0,[]));
            ejecutarInst(CuerpoInstrucciones);
            listaActual.ListaObjetos.pop();
            //---- Fin del ámbito.
            Auxiliar.agregarCuadruplo('goto ' + EtiquetaInicio + ';');
            Auxiliar.agregarCuadruplo(Condicion.et_f+'');
            Auxiliar.agregarCuadruplo(EtiquetaFin + ':\n');
        }
        else{
            tab_error.push(new Error(0,'Semántico','La condición del while debe ser booleana.'));
        }
    }
    catch(err)
    {
        tab_error.push(new Error(0,'Semántico',err));
    }
}

//----------------------------------------------------------------------------------------------------------------------------
// Evaluar DO WHILE
function evaluarDO_WHILE(nodo){
    try
    {
        var EtiquetaInicio = Auxiliar.getEtq();
        var EtiquetaFin = Auxiliar.getEtq();
        var CuerpoInstrucciones = nodo.getHijos()[0];
        
        Auxiliar.agregarCuadruplo(EtiquetaInicio + ': ');
        var [sent , Condicion] = generarCondicion(nodo.getHijos()[1]);

        if(Condicion.et_v != '' && Condicion.et_f != '')
        {
            var aux = Auxiliar.getEtq();
            
            //---- Inicio ámbito.
            listaActual.ListaObjetos.push(new Simbolos("ciclo",'',CuerpoInstrucciones,aux,EtiquetaFin,0,[]));
            ejecutarInst(CuerpoInstrucciones);
            listaActual.ListaObjetos.pop();
            //---- Fin del ámbito.

            Auxiliar.agregarCuadruplo(aux + ':');
            Auxiliar.agregarCuadruplo(sent);

            Auxiliar.agregarCuadruplo(Condicion.et_v+'');
            Auxiliar.agregarCuadruplo('goto ' + EtiquetaInicio + ';');
            Auxiliar.agregarCuadruplo(Condicion.et_f+'');
            Auxiliar.agregarCuadruplo(EtiquetaFin + ':');
        }
        else
        {
            tab_error.push(new Error(0,'Semántico','La condición del do while debe ser booleana.'));
        }
    }
    catch(err)
    {
        tab_error.push(new Error(0,'Semántico',err));
    }
}

//----------------------------------------------------------------------------------------------------------------------------
// Evaluar WHILEX
function evaluarWHILEX(nodo){
    try
    {
        var aux = Auxiliar.getEtq();
        var EtiquetaInicio = Auxiliar.getEtq();
        var EtiquetaFin = Auxiliar.getEtq();
        var ptnCondicion1 = nodo.getHijos()[0];
        var ptnCondicion2 = nodo.getHijos()[1];
        var CuerpoInstrucciones = nodo.getHijos()[2];

        
        var [sent , Condicion1] = generarCondicion(ptnCondicion1);
        var [sent2 , Condicion2] = generarCondicion(ptnCondicion2);

        
        if(Condicion1.et_v != '' && Condicion1.et_f != '')
        {
            if(Condicion2.et_v != '' && Condicion2.et_f != ''){

                Auxiliar.agregarCuadruplo(sent);
                Auxiliar.agregarCuadruplo(Condicion1.et_f+'');
                 
                Auxiliar.agregarCuadruplo(sent2);
                var falsas = Condicion2.et_f;

                Auxiliar.agregarCuadruplo(Condicion1.et_v+'');
                Auxiliar.agregarCuadruplo(Condicion2.et_v+'');
                Auxiliar.agregarCuadruplo(EtiquetaInicio + ': ');
                //---- Inicio ámbito.
                listaActual.ListaObjetos.push(new Simbolos("ciclo",'',CuerpoInstrucciones,aux,EtiquetaFin,0,[]));
                ejecutarInst(CuerpoInstrucciones);
                listaActual.ListaObjetos.pop();
                //---- Fin del ámbito.

                Auxiliar.agregarCuadruplo(aux + ':');
                var [sent , Condicion1] = generarCondicion(ptnCondicion1);
                Auxiliar.agregarCuadruplo(sent);
                Auxiliar.agregarCuadruplo(Condicion1.et_v+'');
                var [sent2 , Condicion2] = generarCondicion(ptnCondicion2);
                Auxiliar.agregarCuadruplo(sent2);
                Auxiliar.agregarCuadruplo(Condicion2.et_v+'');
                Auxiliar.agregarCuadruplo('goto ' + EtiquetaInicio + ';');
                
                Auxiliar.agregarCuadruplo(falsas+'');
                Auxiliar.agregarCuadruplo(Condicion1.et_f+'');
                Auxiliar.agregarCuadruplo(Condicion2.et_f+'');
                Auxiliar.agregarCuadruplo(EtiquetaFin + ':');
            }
            else
            {
                tab_error.push(new Error(0,'Semántico','La condicion 2 debe ser booleana.'));
            }
        }
        else
        {
            tab_error.push(new Error(0,'Semántico','La condicion 1 debe ser booleana.'));
        }
    }
    catch(err)
    {
        tab_error.push(new Error(0,'Semántico',err));
    }
}
//----------------------------------------------------------------------------------------------------------------------------
// Evaluar REPEAT
function evaluarREPEAT(nodo){
    try
    {
        Auxiliar.agregarCuadruplo('//inicio repeat.');
        var aux = Auxiliar.getEtq();
        var EtiquetaInicio = Auxiliar.getEtq();
        var EtiquetaFin = Auxiliar.getEtq();
        var CuerpoInstrucciones = nodo.getHijos()[0];

        Auxiliar.agregarCuadruplo(EtiquetaInicio + ': ');

        //---- Inicio ámbito.
        listaActual.ListaObjetos.push(new Simbolos("ciclo",'',CuerpoInstrucciones,aux,EtiquetaFin,0,[]));
        ejecutarInst(CuerpoInstrucciones);
        listaActual.ListaObjetos.pop();
        //---- Fin del ámbito.


        var [sent , Condicion] = generarCondicion(nodo.getHijos()[1]);
        if(Condicion.et_v != '' && Condicion.et_f != '')
        {

            Auxiliar.agregarCuadruplo(aux + ':');
            Auxiliar.agregarCuadruplo(sent);

            Auxiliar.agregarCuadruplo(Condicion.et_f+'');
            Auxiliar.agregarCuadruplo('goto ' + EtiquetaInicio + ';');
            Auxiliar.agregarCuadruplo(Condicion.et_v+'');
            Auxiliar.agregarCuadruplo(EtiquetaFin + ':');
        }
        else
        {
            tab_error.push(new Error(0,'Semántico','La condición del repeat debe ser booleana.'));
        }
    }
    catch(err)
    {
        tab_error.push(new Error(0,'Semántico',err));
    }

}
//----------------------------------------------------------------------------------------------------------------------------
// Evaluar LOOP 
function evaluarLOOP(nodo){
    try
    {
        var EtiquetaInicio = Auxiliar.getEtq();
        var EtiquetaFin = Auxiliar.getEtq();
        var strId = nodo.getHijos()[0].getValor();
        var CuerpoInstrucciones = nodo.getHijos()[1];

        Auxiliar.agregarCuadruplo(EtiquetaInicio + ': ');
        //---- Inicio ámbito.
        listaActual.ListaObjetos.push(new Simbolos("ciclo",strId,CuerpoInstrucciones,EtiquetaInicio,EtiquetaFin,0,[]));
        ejecutarInst(CuerpoInstrucciones);
        listaActual.ListaObjetos.pop();
        //---- Fin del ámbito.
        Auxiliar.agregarCuadruplo('goto ' + EtiquetaInicio + ';');
        Auxiliar.agregarCuadruplo(EtiquetaFin + ':');
    }
    catch(err)
    {
        tab_error.push(new Error(0,'Semántico',err));
    }
}

//----------------------------------------------------------------------------------------------------------------------------
// Evaluar COUNT 
function evaluarCOUNT(nodo){
    try
    {
        var EtiquetaInicio = Auxiliar.getEtq();
        var EtiquetaFin = Auxiliar.getEtq();
        var CuerpoInstrucciones = nodo.getHijos()[1];
        
        var expGenerada = Expresion.evaluarExp(nodo.getHijos()[0]);

        var tipo = expGenerada.valorTipo;
        if(tipo == "(bool)" || tipo == "(entero)" || tipo == "(caracter)"){
            var temporal = Auxiliar.getTemp();
            var sentencia = temporal + ' = ' + Auxiliar.obtenerToken(expGenerada.cadena) +';';
            Auxiliar.agregarCuadruplo(expGenerada.sentencia);
            Auxiliar.agregarCuadruplo(sentencia);
        }
        else{
            tab_error.push(new Error(0,'Semántico','La expresion del contador debe ser una expresión númerica.'));
            return;
        }

        Auxiliar.agregarCuadruplo(EtiquetaInicio + ': ');

        if(expGenerada.et_v == '' && expGenerada.et_f == ''){
            var aux = Auxiliar.getEtq();
            var verdadera = Auxiliar.getEtq();
            var falsa = Auxiliar.getEtq();
            var Temporal = Auxiliar.getLastTemp();
            var sentencia = 'if(' + Temporal + ' > 0) goto ' + verdadera + ';\ngoto ' + falsa + ';';
            Auxiliar.agregarCuadruplo(sentencia);
            Auxiliar.agregarCuadruplo(verdadera + ':');
            //---- Inicio ámbito.
            listaActual.ListaObjetos.push(new Simbolos("ciclo",'',CuerpoInstrucciones,aux,EtiquetaFin,0,[]));
            ejecutarInst(CuerpoInstrucciones);
            listaActual.ListaObjetos.pop();
            //---- Fin del ámbito.

            Auxiliar.agregarCuadruplo(aux + ": ");
            sentencia = Temporal + ' = ' + Temporal + ' - 1;';
            Auxiliar.agregarCuadruplo(sentencia);
            Auxiliar.agregarCuadruplo('goto ' + EtiquetaInicio + ';');            
            Auxiliar.agregarCuadruplo(falsa + ':');
            Auxiliar.agregarCuadruplo(EtiquetaFin + ':');
        }
        else{
            tab_error.push(new Error(0,'Semántico','La expresion del contador debe ser una expresión númerica.'));
        }
    }
    catch(err)
    {
        tab_error.push(new Error(0,'Semántico',err));
    }
}

//-------------------------------------------------------------------------------------------------------------------------------
function generarCondicion(nodo){
    var sent = '';
    Expresion.enviarListaActual(listaActual,StackSym);
    var Condicion = Expresion.evaluarExp(nodo);
    if(Auxiliar.obtenerTipo(Condicion.cadena) == "(bool)"){
        var et_v = Auxiliar.getEtq(); 
        var et_f = Auxiliar.getEtq();
        var sentencia = 'if(1 == '+ Auxiliar.obtenerToken(Condicion.cadena) +') goto ' + et_v + ';\ngoto ' + et_f + ';';
        sent = sentencia;
        Condicion.et_v = et_v + ': '; Condicion.et_f = et_f + ': ';
    }
    else if(Condicion.valorTipo == "(bool)" && Auxiliar.obtenerTipo(Condicion.cadena) == "(temporal)")
    {
        
        var et_v = Auxiliar.getEtq(); 
        var et_f = Auxiliar.getEtq();
        var sentencia = 'if(1 == '+ Auxiliar.obtenerToken(Condicion.cadena) +') goto ' + et_v + ';\ngoto ' + et_f + ';';
        sent = sentencia;
        Condicion.et_v = et_v + ': '; 
        Condicion.et_f = et_f + ': ';
    }
    sent += "\n" + Condicion.sentencia;
    
    return [sent, Condicion];
}

//------------------------------------------------------------------------------------------------------------
//Funciones adicionales.
function agregarError(error){
	tab_error.push(error);
}

function agregarStack(cont){
	StackSym[0].listContenido.push(cont);
}

function obtenerAmbitoStack(){
	return StackSym[StackSym.length - 1].Ambito;
}

function obtenerPosicion(agregar){
    var pos = 0;
    for(var i = StackSym[StackSym.length - 1].ListaObjetos.length - 1; i >= 0; i--)
    {
        if(StackSym[StackSym.length - 1].ListaObjetos[i].Ambito == "metodo" || StackSym[StackSym.length - 1].ListaObjetos[i].Ambito == "funcion")
        {
            if(agregar) StackSym[StackSym.length - 1].ListaObjetos[i].tamanio++;
            pos = StackSym[StackSym.length - 1].ListaObjetos[i].tamanio;
            break;
        }
    } 
    return pos;
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

function obtenerElementos(nombreSimbolo){

    var Existe = false;
    var Elementos = [];
    var PivoteElementos = [];
    var isEstruct = false;
    
    //guardo en lista, el contenido de mi ambito global, donde se encuentras los structs
    var Lista = StackSym[StackSym.length - 1].ListaObjetos[0].listContenido;
    //console.log('comenzando buscqueda');
    //console.log(Lista);
    //De primero se busca en ambiente local
    for(var i = 0; i < Lista.length; i++)
    {
        if(Lista[i].nombreSimbolo == nombreSimbolo)
        {
            Existe = true;
            PivoteElementos = Lista[i].ListaObjetos;
            if(!Lista[i].isClase)
                isEstruct = true;
            break;
        }
    }

    //Si no la encontramos localmente, ahora buscamos global.
    if(!Existe){
        for(var i = 0; i < StackSym.length; i++)
        {
            if(StackSym[i].nombreSimbolo == nombreSimbolo)
            {
                Existe = true;
                if(StackSym[i].isClase)
                    PivoteElementos = StackSym[i].ListaObjetos[0].listContenido;
                else
                    PivoteElementos = StackSym[i].ListaObjetos;
                    isEstruct = true;
                break;
            }
        }
    }
    for(var i = 0; i < PivoteElementos.length; i++)
    {
        Elementos.push(PivoteElementos[i]);
    }

    return [Existe,Elementos,isEstruct];
}

function obtenerElementosClase(strNombre){
    var Existe = false;
    var Elementos = [];
    var PivoteElementos = null;
    
    var Lista = StackSym;
    
    for(var i = 0; i < Lista.length; i++)
    {
        if(Lista[i].nombreSimbolo == strNombre)
        {
            if(Lista[i].ListaObjetos[0].listContenido.length>0){
                Existe = true;
                PivoteElementos = Lista[i].ListaObjetos[0].listContenido;
                break;
            }      
        }
    }
    
    for(var i = 0; i < PivoteElementos.length; i++)
    {
        Elementos.push(PivoteElementos[i]);
    }
    
    return [Existe,Elementos];
}

function existeStack(nombreVar)
{
    var existe = false;
    
    if(listaActual.ListaObjetos.Ambito == "global")
    {
        existe = listaActual.ListaObjetos.existeSimbolo(nombreVar);
    }
    else
    {
        for(var i = listaActual.ListaObjetos.length - 1; i >= 0; i--)
        {
            if(listaActual.ListaObjetos[i].Ambito == "metodo" || listaActual.ListaObjetos[i].Ambito == "funcion")
            {
                if(listaActual.ListaObjetos[i].existeSimbolo(nombreVar))
                {
                    existe = true;
                    break;
                }
                break;
            }
            else
            {
                if(listaActual.ListaObjetos[i].existeSimbolo(nombreVar))
                {
                    existe = true;
                    break;
                }
            }
        }
    }
    
    return existe;
}

//Para saber si existen un variable (atributo) en el mismo ambito
function existeAtributo(nombre,lista)
{
    var Existe = false;
 
    for(var i = 0; i < lista.length; i++)
    {
        if(lista[i].nombreSimbolo === nombre)
        {
            Existe = true;
            break;
        }
    }
    return Existe;
}
//------------------------------------------------------------------------------------------------------------
//Funciones para devolver respuesta. 
function obtenerRespuesta(){
	generarReporteError();
	var respuesta = [Auxiliar.obtenerCuadruplo(), rep_error, rep_simbolos]; 
	return respuesta;
}

function obtenerRespuestaError(){
	generarReporteError();
	var respuesta = ["Error, Revisar tabla de errores", rep_error, rep_simbolos, "Error en generacion de codigo 3."]; 
	return respuesta;
}

function get_class(obj){ // webreflection.blogspot.com
 	function get_class(obj){
  		return "".concat(obj).replace(/^.*function\s+([^\s]*|[^\(]*)\([^\x00]+$/, "$1") || "anonymous";
 	};
	var result = "";
 	if(obj === null)
  		result = "null";
 	else if(obj === undefined)
  		result = "undefined";
 	else {
  		result = get_class(obj.constructor);
  		if(result === "Object" && obj.constructor.prototype) {
   			for(result in this) {
    			if(typeof(this[result]) === "function" && obj instanceof this[result]) {
     				result = get_class(this[result]);
     				break;
    			}
   			}
  		}
 	};
 	return result;
};

function is_a(obj, className){ // webreflection.blogspot.com
 	className = className.replace(/[^\w\$_]+/, ""); // paranoia
 	return  get_class(obj) === className && {function:1}[eval("typeof(".concat(className,")"))] && obj instanceof eval(className)
};

//------------------------------------------------------------------------------------------------------------
// Estas funciones nos ayudaran a generan los reportes de errores y Tabla de simbolos.
function generarReporteError(){

    //Recolectamos los erroes que se dieron en Expresion y los agregamos.
    for(i=0;i<Expresion.obtenerErrores().length;i++){
        agregarError(Expresion.obtenerErrores()[i]);
    }
    

    for(var i = 0; i < tab_error.length; i++){
        rep_error += `<tr class="danger">
       					<td> ${i} 							</td>
       					<td> ${tab_error[i].posicion}  		</td>
       					<td> ${tab_error[i].tipo} 			</td>
       					<td> ${tab_error[i].descripcion} 	</td>
       				<tr>`;
    }
}

function agregarSimbolo(nombre,tipo,ambito,rol,posicion){
	var color = '';
	switch(rol){
		case "Estructura": 	color = 'class="danger"';
			break;
		case "Clase": 		color = 'class="danger"';	
			break; 
		case "metodo": 		color = 'class="info"';
			break;
        case "funcion":     color = 'class="info"';
            break;
        case "Atributo":     color = 'class="warning"';
            break;
        case "parametro":     color = 'class="success"';
            break;
	}


    rep_simbolos += `<tr ${color}>
    					<td> ${nombre}  </td>
    					<td> ${tipo}  </td>
    					<td> ${ambito}  </td>
    					<td> ${rol}  </td>
    					<td> ${posicion}  </td>
    				</tr>`;
}

//Todo lo concerniente a EXPRESIONES 
function generarExpresion(nodo){
    var valorRet = '';
    Expresion.enviarListaActual(listaActual,StackSym);
    var expGenerada = Expresion.evaluarExp(nodo);

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
    
    return [valorRet,expGenerada.valorTipo,expGenerada.ubicacionPuntero];
}

//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------

function decVarStruct(Elementos,HeapPivote)
{
    try
    {
        for(var i = 0; i < Elementos.length; i++)
        {
            if(Elementos[i].ListaObjetos.length == 0)
            {
                var [Valor,TipoValor] = generarExpresion(Elementos[i].ValorSimbolo); 
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

// GESTIONAR VARIABLE 
function guardarVariableAtrArreglo(arreglo,lista,nombre_clase){

        //Verificamos si no existe la arreglo (atributo) en dentro de la clase.
        if(!existeAtributo(arreglo.nombre,lista))
        {
            var cant = arreglo.elementosDer.length;
            if(cant > 0){
                var et_v = Auxiliar.getEtq();
                var et_f = Auxiliar.getEtq();
                var salida = Auxiliar.getEtq();
                var ini = Auxiliar.getTemp();

                Auxiliar.agregarCuadruplo('');
                Auxiliar.agregarCuadruplo('if ('+arreglo.cantidadTotal+' == '+cant+') goto '+et_v+';\n'+'goto ' + et_f +';\n');
                Auxiliar.agregarCuadruplo(et_v + ':');
                Auxiliar.agregarCuadruplo(ini +' = H;   //Inicia arreglo ' + arreglo.nombre +'\n');
                Auxiliar.agregarCuadruplo('heap[H] = ' + arreglo.cantidadTotal +';   //Guardamos tamanio del arreglo');
                Auxiliar.agregarCuadruplo('H = H + 1; \n');
                for(i = 0; i<cant; i++){
                    Auxiliar.agregarCuadruplo('heap[H] = ' + arreglo.elementosDer[i] + ';');
                    Auxiliar.agregarCuadruplo('H = H + 1; \n');
                }
                var posThis = Auxiliar.getTemp();
                var valThis = Auxiliar.getTemp();
                var posRelativaThis = Auxiliar.getTemp();

                Auxiliar.agregarCuadruplo(posThis + ' = S + 0;    //pos this.');
                Auxiliar.agregarCuadruplo(valThis + ' = stack['+posThis+'];     //val This');
                Auxiliar.agregarCuadruplo(posRelativaThis + ' = ' + valThis + ' + ' + arreglo.pos + ';     //pos relativa de \"'+arreglo.nombre+'\"'); 
                Auxiliar.agregarCuadruplo('heap[' + posRelativaThis + '] = ' + ini + ';     //Se crea el arreglo global ' + arreglo.nombre + '\n');  

                Auxiliar.agregarCuadruplo('goto ' + salida);
                Auxiliar.agregarCuadruplo(et_f +':');
            }
            //Si no esta inicializado.
            else{

            }
            
            var cont = new Contenido(arreglo.nombre,arreglo.tipo,true,arreglo.cantidadTotal,true,null,null,null,arreglo.elementosIzq,arreglo.elementosDer,true,null,false,Auxiliar.getPunteroH(),false,false,false,nombre_clase);
            agregarSimbolo(arreglo.nombre,arreglo.tipo,nombre_clase,'Atributo',arreglo.pos);
            lista.push(cont);
        
        }
        else
        {
            var error = new Error(0,'Semántico','El arreglo ' + arreglo.nombre + ' ya existe en la clase \"'+nombre_clase+'\"');
            agregarError(error);
        }
}
  


//------------------------------------------------------------------------------------------------------------
module.exports = {inicializar,agregarError,obtenerRespuesta,obtenerRespuestaError,faseRecoleccion,agregarSimbolo}