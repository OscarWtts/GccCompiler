class ObtenerVariable{
    constructor(nodoId,Dimensiones){
        this.nodoId = nodoId;
        this.Dimensiones = Dimensiones;
    }
}

class Error{

    constructor(posicion, tipo, descripcion){
        this.posicion = posicion;
        this.tipo = tipo;
        this.descripcion = descripcion;
    }
}

module.exports = { Error, ObtenerVariable}