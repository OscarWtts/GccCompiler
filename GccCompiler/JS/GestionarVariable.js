function guardarVariableAtr(variable){

        if(!existeStack(variable.nombreVar))
        {
            /*if(variable.objeto)
            {
                var [existe,elemento] = obtenerElementos(variable.tipo); 
                if(existe)
                {
                    var cont = new Contenido(variable.nombreVar,variable.tipo,true,variable.valor,true,null,null,null,null,null,null,elemento,variable.objeto,Auxiliar.getPunteroH());
                    agregarSimbolo(variable.nombreVar,variable.tipo,obtenerAmbitoStack(),'Atributo global',Auxiliar.getPunteroH());
                    StackSym[0].listContenido.push(cont); var tempo = Auxiliar.getTemp(), HeapPivote = Auxiliar.getTemp();
                    if(variable.valor != valNulo && !isNaN(variable.valor))
                    {
                        Auxiliar.agregarCuadruplo(tempo + ' = H; \n'); Auxiliar.agregarCuadruplo('H = H + 1;\n'); Auxiliar.aumPunteroH();
                        Auxiliar.agregarCuadruplo(HeapPivote + ' = H; \n'); 
                        Auxiliar.agregarCuadruplo('Heap[' + tempo + '] = ' + HeapPivote + ';\n');
                        Auxiliar.agregarCuadruplo('H = H + ' + elemento.length.toString() + '; //Aumentamos el puntero el numero de atributos. \n')
                        Auxiliar.getPunteroH() += elemento.length;
                        DeclararVariableElement(elemento,HeapPivote);
                    }
                    else if(variable.valor != valNulo && isNaN(variable.valor))
                    {
                        Auxiliar.agregarCuadruplo(tempo + ' = H; \n'); Auxiliar.agregarCuadruplo('H = H + 1;\n'); Auxiliar.aumPunteroH();
                        Auxiliar.agregarCuadruplo('Heap[' + tempo + '] = ' + variable.valor + ';\n');
                    }
                    else
                    {
                        Auxiliar.agregarCuadruplo(tempo + ' = H; \n'); Auxiliar.agregarCuadruplo('H = H + 1;\n'); Auxiliar.aumPunteroH();
                        Auxiliar.agregarCuadruplo('Heap[' + tempo + '] = ' + valNulo + ';\n');
                    }
                }
                else
                {
                    var error new Error(0,'Semántico','El element ' + variable.tipo + ' no existe.');
                    agregarError(error);
                }
            }
            else
            {*/
                var cont = new Contenido(variable.nombreVar,variable.tipo,true,variable.valor,true,null,null,null,null,null,null,null,variable.objeto,Auxiliar.getPunteroH());
                agregarSimbolo(variable.nombreVar,variable.tipo,obtenerAmbitoStack(),'Atributo',Auxiliar.getPunteroH());
                agregarStack(cont);
                console.log(variable.tipo);
                console.log(variable.valTipo);

                console.log(variable.valor);

                if(variable.tipo == variable.valTipo || variable.valor == valNulo)
                {
                    Auxiliar.agregarCuadruplo('Heap[' + Auxiliar.getPunteroH() + '] = ' + variable.valor + '; //Se crea la variable global ' + variable.nombreVar + '\n');
                    Auxiliar.agregarCuadruplo('H = H + 1;\n');
                    Auxiliar.aumPunteroH();
                }
                else if(variable.tipo == "(cadena)" && variable.valTipo == "(entero)")
                {
                    var CambioAmbito = obtenerPosicion(false) + 1, temporal = Auxiliar.getTemp(), EtiquetaRetorno = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo('P = P + ' + CambioAmbito + ';\n');
                    Auxiliar.agregarCuadruplo(temporal + ' = P + 1;\n');    
                    Auxiliar.agregarCuadruplo('Stack[' + temporal + '] = ' + variable.valor + ';\n');
                    Auxiliar.agregarCuadruplo('$$_singleNumToStr();\n');
                    Auxiliar.agregarCuadruplo(EtiquetaRetorno + ' = Stack[P]; //valor retorno. \n');
                    Auxiliar.agregarCuadruplo('$$_SGB(P,1);\n');
                    Auxiliar.agregarCuadruplo('P = P - ' + CambioAmbito + ';\n');
                    
                    Auxiliar.agregarCuadruplo('Heap[' + Auxiliar.getPunteroH() + '] = ' + EtiquetaRetorno + '; //Se crea la variable global ' + variable.nombreVar + '\n');
                    Auxiliar.agregarCuadruplo('H = H + 1;\n');
                    Auxiliar.aumPunteroH();
                }
                else if(variable.tipo == "(cadena)" && variable.valTipo == "(decimal)")
                {
                    var CambioAmbito = obtenerPosicion(false) + 1, temporal = Auxiliar.getTemp(), EtiquetaRetorno = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo('P = P + ' + CambioAmbito + ';\n');
                    Auxiliar.agregarCuadruplo(temporal + ' = P + 1;\n');    
                    Auxiliar.agregarCuadruplo('Stack[' + temporal + '] = ' + variable.valor + ';\n');
                    Auxiliar.agregarCuadruplo('$$_singleNumToStr();\n');
                    Auxiliar.agregarCuadruplo(EtiquetaRetorno + ' = Stack[P]; //valor retorno. \n');
                    Auxiliar.agregarCuadruplo('$$_SGB(P,1);\n');
                    Auxiliar.agregarCuadruplo('P = P - ' + CambioAmbito + ';\n');
                    
                    Auxiliar.agregarCuadruplo('Heap[' + Auxiliar.getPunteroH() + '] = ' + EtiquetaRetorno + '; //Se crea la variable global ' + variable.nombreVar + '\n');
                    Auxiliar.agregarCuadruplo('H = H + 1;\n');
                    Auxiliar.aumPunteroH();
                }
                else if(variable.tipo == "(bool)" && variable.valTipo == "(entero)")
                {
                    var ValorGuardar = Auxiliar.getTemp(); var verdadera = generarEt(), falsa = generarEt(), salida = generarEt();;
                    Auxiliar.agregarCuadruplo('if(' + variable.valor + ' > 0' + ') goto ' + verdadera + ';\ngoto ' + falsa + ';\n');
                    Auxiliar.agregarCuadruplo(verdadera + ':\n');
                    Auxiliar.agregarCuadruplo(ValorGuardar + ' = 1;\n');
                    Auxiliar.agregarCuadruplo('goto ' + salida + ';\n');
                    Auxiliar.agregarCuadruplo(falsa + ':\n');
                    Auxiliar.agregarCuadruplo(ValorGuardar + ' = 0;\n');
                    Auxiliar.agregarCuadruplo(salida + ':\n');
                    
                    Auxiliar.agregarCuadruplo('Heap[' + Auxiliar.getPunteroH() + '] = ' + ValorGuardar + '; //Se crea la variable global ' + variable.nombreVar + '\n');
                    Auxiliar.agregarCuadruplo('H = H + 1;\n');
                    Auxiliar.aumPunteroH();
                }
                else if(variable.tipo == "(entero)" && variable.valTipo == "(bool)")
                {
                    Auxiliar.agregarCuadruplo('Heap[' + Auxiliar.getPunteroH() + '] = ' + variable.valor + '; //Se crea la variable global ' + variable.nombreVar + '\n');
                    Auxiliar.agregarCuadruplo('H = H + 1;\n');
                    Auxiliar.aumPunteroH();
                }
                else if(variable.tipo == "(cadena)" && variable.valTipo == "(bool)")
                {
                    var CambioAmbito = obtenerPosicion(false) + 1, temporal = Auxiliar.getTemp(), EtiquetaRetorno = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo('P = P + ' + CambioAmbito + ';\n');
                    Auxiliar.agregarCuadruplo(temporal + ' = P + 1;\n');
                    Auxiliar.agregarCuadruplo('Stack[' + temporal + '] = ' + variable.valor + ';\n');
                    Auxiliar.agregarCuadruplo('$$_boolToStr();\n');
                    Auxiliar.agregarCuadruplo(EtiquetaRetorno + ' = Stack[P]; //valor retorno. \n');
                    Auxiliar.agregarCuadruplo('$$_SGB(P,1);\n');
                    Auxiliar.agregarCuadruplo('P = P - ' + CambioAmbito + ';\n');
                    
                    Auxiliar.agregarCuadruplo('Heap[' + Auxiliar.getPunteroH() + '] = ' + EtiquetaRetorno + '; //Se crea la variable global ' + variable.nombreVar + '\n');
                    Auxiliar.agregarCuadruplo('H = H + 1;\n');
                    Auxiliar.aumPunteroH();
                }
            //}
        }
        else
        {
            var error = new Error(0,'Semántico','La variable ' + variable.nombreVar + ' ya existe.');
            agregarError(error);
        }
}
    
/*function guardarVariable()
    {
        if(!existeStack(variable.nombreVar))
        {
            if(variable.objeto)
            {
                var [existe,elemento] = obtenerElementos(variable.tipo);
                if(existe)
                {
                    var Posicion = obtenerPosicion(true);
                    var cont = new Contenido(variable.nombreVar,variable.tipo,true,variable.valor,true,null,null,null,null,null,null,elemento,variable.objeto,Posicion);
                    
                    agregarSimbolo(variable.nombreVar,variable.tipo,obtenerAmbitoStack(),'Atributo',Posicion);
                    StackSym[StackSym.length - 1].listContenido.push(cont);
                    var temporal = Auxiliar.getTemp();
                    
                    if(variable.valor != valNulo && !isNaN(variable.valor)) 
                    {
                        Auxiliar.agregarCuadruplo(temporal + ' = P + ' + Posicion + '; //Inicio del cuerpo del element en el Heap. \n')
                        Auxiliar.agregarCuadruplo('Stack[' + temporal + '] = H; \n')
                        var HeapPivote = Auxiliar.getTemp();
                        Auxiliar.agregarCuadruplo(HeapPivote + ' = H; \n');
                        Auxiliar.agregarCuadruplo('H = H + ' + elemento.length.toString() + '; //Aumentamos el puntero el numero de atributos. \n')

                        DeclararVariableElement(elemento,HeapPivote);
                    }
                    else if(variable.valor != valNulo && isNaN(variable.valor))
                    {
                        Auxiliar.agregarCuadruplo(temporal + ' = P + ' + Posicion + '; //Inicio del cuerpo del element en el Heap. \n')
                        Auxiliar.agregarCuadruplo('Stack[' + temporal + '] = ' + variable.valor + '; \n')
                    }
                    else
                    {
                        Auxiliar.agregarCuadruplo(temporal + ' = P + ' + Posicion + '; //Inicio del cuerpo del element en el Heap. \n')
                        Auxiliar.agregarCuadruplo('Stack[' + temporal + '] = ' + valNulo + '; \n')
                    }
                }
                else
                {
                    var error new Error(0,'Semántico','El element ' + variable.tipo + ' no existe.');
                    agregarError(error);
                }
            }
            else
            {
                var Posicion = obtenerPosicion(true);
                var cont = new Contenido(variable.nombreVar,variable.tipo,true,variable.valor,true,null,null,null,null,null,null,null,variable.objeto,Posicion);
                agregarSimbolo(variable.nombreVar,variable.tipo,obtenerAmbitoStack(),'Atributo',Posicion);
                StackSym[StackSym.length - 1].listContenido.push(cont);

                if(variable.tipo == "(cadena)" && variable.valTipo == "(cadena)" || (variable.tipo == "(cadena)" && variable.valor == valNulo))
                {
                    var temporal = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo(temporal + ' = P + ' + Posicion + ';\n');
                    Auxiliar.agregarCuadruplo('Stack[' + temporal + '] = H; //Puntero del heap donde esta el inicio de la cadena. \n')
                    Auxiliar.agregarCuadruplo('H = H + 1;\n');
                    var temporal1 = Auxiliar.getTemp(), temporal2 = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo(temporal1 + ' = P + ' + Posicion + ';\n');
                    Auxiliar.agregarCuadruplo(temporal2 + ' = Stack[' + temporal1 + '];\n');
                    Auxiliar.agregarCuadruplo('Heap[' + temporal2 + '] = ' + variable.valor + '; //Se crea la variable ' + variable.nombreVar + '\n');
                }
                else if(variable.tipo == "(cadena)" && variable.valTipo == "(entero)")
                {
                    var CambioAmbito = obtenerPosicion(false) + 1, temporal = Auxiliar.getTemp(), EtiquetaRetorno = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo('P = P + ' + CambioAmbito + ';\n');
                    Auxiliar.agregarCuadruplo(temporal + ' = P + 1;\n');
                    Auxiliar.agregarCuadruplo('Stack[' + temporal + '] = ' + variable.valor + ';\n');
                    Auxiliar.agregarCuadruplo('$$_singleNumToStr();\n');
                    Auxiliar.agregarCuadruplo(EtiquetaRetorno + ' = Stack[P]; //valor retorno. \n');
                    Auxiliar.agregarCuadruplo('$$_SGB(P,1);\n');
                    Auxiliar.agregarCuadruplo('P = P - ' + CambioAmbito + ';\n');
                    
                    temporal = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo(temporal + ' = P + ' + Posicion + ';\n');
                    Auxiliar.agregarCuadruplo('Stack[' + temporal + '] = H; //Puntero del heap donde esta el inicio de la cadena. \n');
                    Auxiliar.agregarCuadruplo('H = H + 1;\n');
                    var temporal1 = Auxiliar.getTemp(), temporal2 = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo(temporal1 + ' = P + ' + Posicion + ';\n');
                    Auxiliar.agregarCuadruplo(temporal2 + ' = Stack[' + temporal1 + '];\n');
                    Auxiliar.agregarCuadruplo('Heap[' + temporal2 + '] = ' + EtiquetaRetorno + '; //Se crea la variable ' + variable.nombreVar + '\n');
                }
                else if((variable.tipo == "(entero)" && variable.valTipo == "(entero)" || (variable.tipo == "(entero)" && variable.valor == valNulo)) || 
                        (variable.tipo == "(bool)" && variable.valTipo == "(bool)" || (variable.tipo == "(bool)" && variable.valor == valNulo))) 
                {
                    var temporal = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo(temporal + ' = P + ' + Posicion + ';\n');
                    Auxiliar.agregarCuadruplo('Stack[' + temporal + '] = ' + variable.valor + '; //Se crea la variable ' + variable.nombreVar + '\n');
                }
                else if(variable.tipo == "(bool)" && variable.valTipo == "(entero)")
                {
                    var ValorGuardar = Auxiliar.getTemp(); var verdadera = generarEt(), falsa = generarEt(), salida = generarEt();;
                    Auxiliar.agregarCuadruplo('if(' + variable.valor + ' > 0' + ') goto ' + verdadera + ';\ngoto ' + falsa + ';\n');
                    Auxiliar.agregarCuadruplo(verdadera + ':\n');
                    Auxiliar.agregarCuadruplo(ValorGuardar + ' = 1;\n');
                    Auxiliar.agregarCuadruplo('goto ' + salida + ';\n');
                    Auxiliar.agregarCuadruplo(falsa + ':\n');
                    Auxiliar.agregarCuadruplo(ValorGuardar + ' = 0;\n');
                    Auxiliar.agregarCuadruplo(salida + ':\n');
                    
                    var temporal = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo(temporal + ' = P + ' + Posicion + ';\n');
                    Auxiliar.agregarCuadruplo('Stack[' + temporal + '] = ' + ValorGuardar + '; //Se crea la variable ' + variable.nombreVar + '\n');
                }
                else if(variable.tipo == "(entero)" && variable.valTipo == "(bool)")
                {
                    var temporal = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo(temporal + ' = P + ' + Posicion + ';\n');
                    Auxiliar.agregarCuadruplo('Stack[' + temporal + '] = ' + variable.valor + '; //Se crea la variable ' + variable.nombreVar + '\n');
                }
                else if(variable.tipo == "(cadena)" && variable.valTipo == "(bool)")
                {
                    var CambioAmbito = obtenerPosicion(false) + 1, temporal = Auxiliar.getTemp(), EtiquetaRetorno = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo('P = P + ' + CambioAmbito + ';\n');
                    Auxiliar.agregarCuadruplo(temporal + ' = P + 1;\n');
                    Auxiliar.agregarCuadruplo('Stack[' + temporal + '] = ' + variable.valor + ';\n');
                    Auxiliar.agregarCuadruplo('$$_boolToStr();\n');
                    Auxiliar.agregarCuadruplo(EtiquetaRetorno + ' = Stack[P]; //valor retorno. \n');
                    Auxiliar.agregarCuadruplo('$$_SGB(P,1);\n');
                    Auxiliar.agregarCuadruplo('P = P - ' + CambioAmbito + ';\n');
                    
                    temporal = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo(temporal + ' = P + ' + Posicion + ';\n');
                    Auxiliar.agregarCuadruplo('Stack[' + temporal + '] = H; //Puntero del heap donde esta el inicio de la cadena. \n');
                    Auxiliar.agregarCuadruplo('H = H + 1;\n');
                    var temporal1 = Auxiliar.getTemp(), temporal2 = Auxiliar.getTemp();
                    Auxiliar.agregarCuadruplo(temporal1 + ' = P + ' + Posicion + ';\n');
                    Auxiliar.agregarCuadruplo(temporal2 + ' = Stack[' + temporal1 + '];\n');
                    Auxiliar.agregarCuadruplo('Heap[' + temporal2 + '] = ' + EtiquetaRetorno + '; //Se crea la variable ' + variable.nombreVar + '\n');
                }
            }
        }
        else
        {
            var error new Error(0,'Semántico','La variable ' + variable.nombreVar + ' ya existe.');
            agregarError(error);
        }
}*/
