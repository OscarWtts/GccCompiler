class ObjStack{
    constructor(Posicion,Contenido,Ambito){
        this.Posicion = Posicion;
        this.Contenido = Contenido;
        this.Ambito = Ambito;
    }
}

class ObjHeap{
    constructor(Posicion,Contenido){
        this.Posicion = Posicion;
        this.Contenido = Contenido;
    }
}

class ObjSym3d{
    constructor(Ambito,listContenido){
        this.Ambito = Ambito;
        this.listContenido = listContenido;
    }
}

class Error{

    constructor(posicion, tipo, descripcion){
        this.posicion = posicion;
        this.tipo = tipo;
        this.descripcion = descripcion;
    }
}

class Contenido3d{
    constructor(strNombre,Valor,IsTemp,CuerpoMetodo,IsMetodo){
        this.strNombre = strNombre;
        this.Valor = Valor;
        this.IsTemp = IsTemp;
        this.CuerpoMetodo = CuerpoMetodo;
        this.IsMetodo = IsMetodo;
    }
}

module.exports = {Error, ObjStack, ObjHeap, ObjSym3d, Contenido3d}