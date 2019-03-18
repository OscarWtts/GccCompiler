class Control_3d{

	constructor(){
	   this.inc = 0;
     this.inc2 = 0;
     this.cad = "";
	}
  	getTemp(){
      var temp = this.inc;
      this.inc++;

      return "T" + temp;
    }

    getLastTemp(){
      return "T" + (this.inc - 1);
    }

    getEtq(){
      var temp = this.inc2;
      this.inc2++;

      return "L" + temp;
    }

    setCad(cade){
      this.cad += cade + "\n";
    }

    setIniCad(cade){
      this.cad = cade + "\n" + this.cad;
    }


    getCad(){
      return this.cad;
    }

    setReinicio(){
      this.inc = 0;
      this.inc2 = 0;
      this.cad = "";
    }

}

module.exports = Control_3d;


