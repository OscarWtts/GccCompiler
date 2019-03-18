class Nodo{
  
	constructor(etiqueta,valor){
		this.Etiqueta = etiqueta;
		this.Valor = valor;
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

}

module.exports = Nodo;