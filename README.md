# GccCompiler

Para comenzar está desactualizado el bootstrap, estoy usando la version 3.7.7 y ya va por la 4 

El proyecto en general cuenta con dos secciones principales, lecciones y Prueba.

La primera deja crear lecciones, y se almacenan en un base de datos MySQL, además también puede haber 
carga masiva de lecciones, basta con seleccionar el boton carga masiva, seleccionar el archivo y listo.

Se pueden visualizar y modificar las lecciones, otra funcionalidad ya no hay...

Ahora la seccion más importante es la de pruebas, acá uno puede tipear código libre, siguiendo en lenguaje que nos 
asignaron, luego se da click en compilar y el codigo se traduce a 3d y éste a cuadruplos hay un analizador para 
cada uno, luego se puede ejecutar el código cuádruplos y se muestra las salidas en consola, también 
la tabla de simbolos, erroes, heap y stack..

Hay una carpeta que se llama servidor, en esta está la lógica para levantar el server, además es la que me redirecciona,
entre páginas y donde se ejecuta todo. 

en este proyecto se manejo herencia, eso si está bien, importaciones, no está muy bien, objetos y objetos de objetos, 
está bien pero hay que revisar, polimorfismo Estructuras y Clases, el debugger no funciona no me dio tiempo.
existen archivos .bat el principal es el de iniciar_servidor, está el de gramatica que solo compila la gramatica
y el de árbol que nos genera el árbol.
