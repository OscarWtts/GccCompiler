const Control_3d = require('./Control_3d.js');
var control_3d = new Control_3d();

var punteroH = 0;
var punteroS = 0;
//Funciones auxliares para llevar el control de los tokens de arboles
// Devuelve solo el tipo por ejemplo "5 (numero)", devuelve (numero)
function obtenerTipo(Token){
    var strResultado = '';
        
    var token = Token.replace('"','').replace('\'','').split(' ');
    strResultado = token[token.length - 1].toString();
    
    return strResultado;
}
// Devuelve solo el valor importante por ejemplo si se evia "5 (numero)",devuelve solo el 5
function obtenerToken(Token){
    var strResultado = '';
    
    var token = Token.replace('"','').replace('\'','').split(' ');
    
    for(var i = 0; i < token.length - 1; i++){
        strResultado += token[i].toString();
    }
    
    if(strResultado == '') strResultado = ' ';
    
    
    return strResultado;
}
//---------------------------------------------------------------------------------------------------------
//Funciones auxiliares para  llevar control del codigo cuadruplos
function agregarCuadruplo(texto){
    control_3d.setCad(texto);
}

function agregarCuadruploInicio(texto){
    control_3d.setIniCad(texto);
}

function obtenerCuadruplo(){
    return control_3d.getCad();
}

function reinicioCuadruplo(){
    punteroH = 0;
    punteroS = 0;
    control_3d.setReinicio();
}

function imprimirCuadruplo(){
    console.log(control_3d.getCad());
}

function getTemp(){
    return control_3d.getTemp();
}

function getLastTemp(){
    return control_3d.getLastTemp();
}
function getEtq(){
    return control_3d.getEtq();
}
//------------------------------------------------------------------------------------------------------------
//Funciones para la conversion o casteo
function toBool(item){
    var valor = -1;
    
    if(item.toString() == 'true') valor =  1; 
    else if(item.toString() == 'false') valor = 0;
    
    return valor;
}

/*function toChar(item){
 }*/

//---------------------------------------------------------------------------------------------------------------------
//Funciones para controlar los punteros 
function getPunteroH(){
    return punteroH;
}

function getPunteroS(){
    return punteroS;
}

function aumPunteroH(){
    punteroH++;
}

function aumPunteroH_en(val){
    punteroH += val;
}

function aumPunteroS(){
    punteroS++;
}


//-------------------------------------------------------------------------------------------------------------------


module.exports = {obtenerToken, obtenerTipo, agregarCuadruplo, reinicioCuadruplo, imprimirCuadruplo, 
                    getTemp, getEtq, toBool, getPunteroH, aumPunteroH, getPunteroS, aumPunteroS, aumPunteroH_en, 
                    obtenerCuadruplo, getLastTemp, agregarCuadruploInicio }