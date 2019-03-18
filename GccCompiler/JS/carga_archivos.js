window.addEventListener('load', inicio, false);

    function inicio() {
        document.getElementById('archivo_altoNivel').addEventListener('change', cargar_alto, false); 
        document.getElementById('archivo_cuadruplos').addEventListener('change', cargar_cuadruplo, false);           
        document.getElementById('btn_descarga_altoNivel').addEventListener('click', download_alto, false);
        document.getElementById('btn_descarga_cuadruplo').addEventListener('click', download_cuadruplo, false);
        document.getElementById('txt_altoNivel').addEventListener('keydown', function(e) {
          var keyCode = e.keyCode || e.which;

          if (keyCode == 9) {
            e.preventDefault();
            var val = this.value,
                start = this.selectionStart,
                end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = val.substring(0, start) + '\t' + val.substring(end);

            // put caret at right position again
            this.selectionStart = this.selectionEnd = start + 1;
          }
        });

        document.getElementById('txt_cuadruplo').addEventListener('keydown', function(e) {
          var keyCode = e.keyCode || e.which;

          if (keyCode == 9) {
            e.preventDefault();
            var val = this.value,
                start = this.selectionStart,
                end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = val.substring(0, start) + '\t' + val.substring(end);

            // put caret at right position again
            this.selectionStart = this.selectionEnd = start + 1;
          }
        });
    }

    function cargar_alto(ev) {
        document.getElementById('txt_altoNivel').value='';
        for(var f=0;f<ev.target.files.length;f++) {
        
          var arch=new FileReader();
          arch.addEventListener('load',leer_alto,false);
          arch.readAsText(ev.target.files[f]);
        }  
    }

    function cargar_cuadruplo(ev) {
        document.getElementById('txt_cuadruplo').value='';
        for(var f=0;f<ev.target.files.length;f++) {
        
          var arch=new FileReader();
          arch.addEventListener('load',leer_cuadruplo,false);
          arch.readAsText(ev.target.files[f]);
        }  
    }
    
    function leer_alto(ev) {
        document.getElementById('txt_altoNivel').value=document.getElementById('txt_altoNivel').value+ev.target.result+
                                                '\n%%--------------------------------------------------\n';
    }

    function leer_cuadruplo(ev) {
        document.getElementById('txt_cuadruplo').value=document.getElementById('txt_cuadruplo').value+ev.target.result+
                                                '\n%%--------------------------------------------------\n';
    }

    function download_alto()
    {
      var text = document.getElementById('txt_altoNivel').value;

      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', 'GccCompiler.gccAN');
   
      element.style.display = 'none';
      document.body.appendChild(element);
   
      element.click();
   
      document.body.removeChild(element);
    }

    function download_cuadruplo()
    {
      var text = document.getElementById('txt_cuadruplo').value;

      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', 'GccCompiler.gccCua');
   
      element.style.display = 'none';
      document.body.appendChild(element);
   
      element.click();
   
      document.body.removeChild(element);
    }

