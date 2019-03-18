addEventListener('load',inicializarEventos,false);

function inicializarEventos()
{
  enviarFormulario();
  
  var ref=document.getElementById('btn_busqueda');
  ref.addEventListener('click',enviarFormulario2,false);

  var ref2= document.getElementById('select_couch');
  ref2.addEventListener('change',enviarFormulario3,false);

  //A partir de acá me sirve para la carga masiva
  var ref3 = document.getElementById('archivo');
  ref3.addEventListener('change', procesamiento, false);  
}


var conexion1;
function enviarFormulario() 
{
  conexion1=new XMLHttpRequest();
  conexion1.onreadystatechange = procesarEventos;
  conexion1.open('POST','lecciones_listado', true);
  conexion1.setRequestHeader("Content-Type","text/plain");
  conexion1.send();  
}

function enviarFormulario2() 
{
  conexion1=new XMLHttpRequest();
  conexion1.onreadystatechange = procesarEventos;
  conexion1.open('GET','filtro_busqueda?txt_busqueda='+document.getElementById('txt_busqueda').value+'', true);
  conexion1.setRequestHeader("Content-Type","text/plain");
  conexion1.send();  
}

function enviarFormulario3() 
{
  conexion1=new XMLHttpRequest();
  conexion1.onreadystatechange = procesarEventos;
  conexion1.open('GET','filtro_select?cod_busqueda='+document.getElementById('select_couch').selectedIndex+'', true);
  conexion1.setRequestHeader("Content-Type","text/plain");
  conexion1.send();  
}


function procesarEventos()
{
  var cuerpo_tabla = document.getElementById("cuerpo_tabla");
  //Si es cuatro es porque el servidor ya envio la respuesta, y mostramos lo que nos devolvio
 //Si no es porque aun se esta procesando :) hay varios estados puedes buscar en internet
  if(conexion1.readyState == 4)
  {
    cuerpo_tabla.innerHTML = conexion1.responseText;
  } 
  else 
  {
    cuerpo_tabla.innerHTML = 'Procesando...';
  }
}


function procesamiento(ev)
{
  var arch=new FileReader();
  arch.addEventListener('load',enviarFormulario4,false);
  arch.readAsText(ev.target.files[0]);
}

function enviarFormulario4(ev) 
{
  conexion1=new XMLHttpRequest();
  conexion1.onreadystatechange = procesarEventos2;
  conexion1.open('POST','carga_masiva', true);
  conexion1.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

  var cad='';
  var texto = ev.target.result;
  cad= 'texto=' + encodeURIComponent(texto);

  conexion1.send(cad);  
  enviarFormulario();
}


function procesarEventos2()
{
  if(conexion1.readyState == 4)
    alert(conexion1.responseText);
}