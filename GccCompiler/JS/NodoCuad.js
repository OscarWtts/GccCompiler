class NodoCuad{
  
	constructor(etiqueta,valor,fila,columna){
		this.Etiqueta = etiqueta;
		this.Valor = valor;
    this.fila = fila;
    this.columna = columna;
		this.hijos = [];
	}

  	addHijos(hijos){
    	this.hijos.push(hijos);
  	}

    addHijosInicio(hijos){
      this.hijos.unshift(hijos);
    }
  
  	getHijos(){
    	return this.hijos;
  	}

  	getValor(){
  		return this.Valor;
  	}

  	setValor(valor){
  		this.Valor = valor;
  	}

  	getEtiqueta(){
  		return this.Etiqueta;
  	}

  	setEtiqueta(etiqueta){
  		this.Etiqueta = etiqueta;
  	}

    getFila(){
      return this.fila;
    }

    setFila(fila){
      this.fila = fila;
    }

    getColumna(){
      return this.columna;
    }

    setColumna(col){
      this.columna = col;
    }

    getPos(){
      return [this.fila,this.columna];
    }

    setPos(fil,col){
      this.fila = fil;
      this.columna = col;
    }

}

module.exports = NodoCuad;