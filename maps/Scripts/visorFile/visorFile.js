// Archivo JScript
var c; //Es el canvas
var ctx; //Es el contexto 2d del canvas
var imageObj = null; //Imagen de fondo.


//Datos del medidor de ángulos
var rutaImagenMedidorAngulos ;
var anchoImagenMedidorAngulos = 202 //Es el ancho en píxeles de la imagen del medidor de ángulos.
var altoImagenMedidorAngulos = 202  //Es el alto  en píxeles de la imagen del medidor de ángulos.
var imagenCirculo = null; //Imagen de círculo para la medición de ángulos. Es el tipo image


//Los parámetros de escala y resolución, intervienen en 
//var escalaImagen = 1.25; //Es la escala que tiene la imagen
//var resolucionImagenPPP = 96.56; //Resolución de la pantalla en puntos por pulgada.


var rutaImagenFondo ; //Imagen de fondo

var escalaTipoMedida  ; //puede ser cm -> centímetros o px-> píxeles.
var escalaParametro1  ;   //de base de datos es en cm
var escalaParametro2  ;  //de base de datos es en cm



var zoomActual = 1; //Este es el zoom actual que se está aplicando a la imagen, cada vez que sube lo hace multiplicando por 2. Ej: 1, 2, 4, 8, 16...
var zoomMaximo = 16; //Este es el zoom máximo. Inicialmente lo ponemos a 16, lo que quiere decir que el usuario solo podrá hacer zoom 4 veces sobre la imagen

var ddlModo; //Es el modo elegido por el usuario: regla, angulo o camino.
var strModo; //Es una cadena que indica el valor actual del modo que ha elegido el usuario

//var gradosRotacion = 2; //Son los grados que rotará el medidor de ángulos cada vez que lo rotemos con los botones.
var gradosRotacion = 0.5; //Carlos me solicita que reduzcamos los grados que rota
var gradosRotacionMedidorAngulo = 0; //Son los grados acumulados de rotación de la imagen del medidor de ángulos.

var caminoFinalizado = false; //Es una variable booleana para indicar si el usuario ha finalizado el camino, en caso de haber pulsado doble click sobre el canvas. 

window.onload=function() {
    //Esta línea hace invisible el botón de cálculo de escala. Ponerlo invisible siempre para la web de senasa y para el examen del alumno.
    //Solo estará visible en la web de FCL. 
    document.getElementById("btn_calcular_escala").style.visibility = 'hidden';
    
    document.getElementById("textDistanciaMedir").style.visibility = 'hidden';

    //Cargo las variables que ha dejado el formulario en los campos ocultos
    rutaImagenMedidorAngulos= document.getElementById("rutaImagenMedidorAngulos").value;
    rutaImagenFondo= document.getElementById("rutaImagenFondo").value;
    
    escalaTipoMedida= document.getElementById("escalaTipoMedida").value;
    escalaParametro1= document.getElementById("escalaParametro1").value.replace(/,/g, '.');
    escalaParametro2= document.getElementById("escalaParametro2").value.replace(/,/g, '.');
    
    //Enviamos los parámetros de escala a -1 cuando no se necesita medir la distancia. Por eso deshabilitamos el botón 
    if (escalaParametro1 == -1)
    {
        //Dherrero 14 - 01 - 2021 Esta utilidad ayuda a calcular la escala
        //Se crea el nuevo botón btn_calcular_escala que solo se podrá usar en imágenes que no tengan escala (escalaParametro1 = - 1)

        //document.getElementById("btn_calcular_escala").style.visibility = 'visible';
        //document.getElementById("textDistanciaMedir").style.visibility = 'hidden';

        //Fin Dherrero


        document.getElementById("btn_distancia").style.visibility='hidden';
        document.getElementById("btn_angulo").className="active";
        document.getElementById("btn_camino").className="inactive";
        
        //Por defecto al iniciar la aplicación si no hay escala se pone en ángulo.
        strModo ="angulo";
        
        document.getElementById("btZoomIn").style.visibility = 'hidden';
        document.getElementById("btZoomOut").style.visibility = 'hidden';
        
        document.getElementById("btnRotacion_der").style.visibility = 'visible';
        document.getElementById("btnRotacion_izq").style.visibility = 'visible';
      
        gradosRotacionMedidorAngulo = 0;
        puntoMedidorAngulos.x = -1;
        puntoMedidorAngulos.y = -1;
      document.getElementById("lblNumPuntos").innerHTML="Num. ptos: " + arrPuntos.length;
      
      document.getElementById("lblNumPuntos").style.visibility= 'hidden';

      document.getElementById("lblTextoUsuario").innerHTML="Pulse en cualquier punto de la imagen para anclar el medidor";
        
        
        
        
        
         document.getElementById("btn_distancia").className="inactive";
        document.getElementById("btn_camino").className="inactive";
        
    }
    else
    {
        //Dherrero 14/01/2021 Desactivo lo dos controles del cálculo de escala
        //document.getElementById("textDistanciaMedir").style.visibility = 'hidden';
        //document.getElementById("btn_calcular_escala").style.visibility = 'hidden';
        //Fin Dherrero

        document.getElementById("btn_distancia").className="active";
        document.getElementById("btn_camino").className="inactive";
        document.getElementById("btn_angulo").className="inactive";
        
        //Por defecto al iniciar la aplicación está en modo regla.
        strModo = 'regla';
        document.getElementById("lblNumPuntos").innerHTML="Num. ptos: " + arrPuntos.length;
        document.getElementById("btnRotacion_der").style.visibility= 'hidden';
        document.getElementById("btnRotacion_izq").style.visibility= 'hidden';
    }
    
    c = document.getElementById("canvas");
    ctx = c.getContext("2d");

    //Oculto los botones de rotar, porque el primer modo es el de regla
    //document.getElementById("btnRotacion_der").style.visibility= 'hidden';
    //document.getElementById("btnRotacion_izq").style.visibility= 'hidden';
    
    //Cargo una imagen
    imageObj = new Image();
    imageObj.onload = function () 
    { 
        c.width = this.width;
        c.height = this.height;
        ctx.drawImage(imageObj, 0, 0);
        var aa= "a";

    };
    
    
    
    imageObj.src = this.rutaImagenFondo;
    //imageObj.src = this.aaaaaa;



        
    //Añado los eventos en respuesta 
    c.addEventListener("mousedown", onMouseDown, false);
    //c.addEventListener("mouseup", onMouseUp, false);
    c.addEventListener("mousemove", onMouseMove, false);
    //Añado los eventos en respuesta 
    c.addEventListener("dblclick", ondblclick, false);

    //Este es el change del desplegable 
    ddlModo = document.getElementById("ddlModo");
    ddlModo.addEventListener("change", onchange_ddlModo, false);
    


    //Es el cambio en el desplegable.
    function onchange_ddlModo(e){
        
        var e = document.getElementById("ddlModo");
        var value = e.options[e.selectedIndex].value;
        strModo =value;
        cambioModo();
    }
    
    //Click del botón de borrar punto
    document.getElementById("btBorrarPunto").addEventListener("click", function(){
        
        if (strModo == "variasCircunferencias") {
            arrCircunferencias.pop();
            console.log('Ha entrado x borrar varias circunferencias');
        }
        else
        {
            if (strModo == "variasLineas") {
                arrLineas.pop();
            }
            else
            {
                console.log('Ha entrado x borrar varios puntos');
                caminoFinalizado = false;
                arrPuntos.pop();
                document.getElementById("lblNumPuntos").innerHTML = "Num. ptos: " + arrPuntos.length;

                //En caso de que no haya puntos, borramos el punto del medidor de ángulos
                if (arrPuntos.length == 0) {
                    document.getElementById("lblTextoUsuario").innerHTML = "";
                    puntoMedidorAngulos.x = -1;
                    puntoMedidorAngulos.y = -1;

                    gradosRotacionMedidorAngulo = 0;

                }
            }
        }
        dibujaTrazado();
      });

  //Click del botón de ampliar imagen
    document.getElementById("btZoomIn").addEventListener("click", function(){
        console.log("Ruta fondo desde el server: " + rutaImagenFondo);
        if (zoomActual < zoomMaximo)
        {
          zoomActual = zoomActual * 2;
          c.width = (c.width * 2);
          c.height = (c.height * 2);
          ctx.scale(zoomActual, zoomActual);
          dibujaTrazado();
        }
      });
      
      //Click del botón de cálculo de distancia
    document.getElementById("btn_distancia").addEventListener("click", function(){
        strModo ="regla";
        cambioModo();
        this.className = "active";
        document.getElementById("btn_angulo").className="inactive";
        document.getElementById("btn_camino").className = "inactive";
        document.getElementById("btn_calcular_escala").className = "inactive";
        document.getElementById("btn_variasLineas").className = "inactive";
        document.getElementById("btn_variasCircunferencias").className = "inactive";
      });
      
        //Click del botón de cálculo de ángulos
    document.getElementById("btn_angulo").addEventListener("click", function(){
        strModo ="angulo";
        cambioModo();
        this.className = "active";
         document.getElementById("btn_distancia").className="inactive";
        document.getElementById("btn_camino").className = "inactive";
        document.getElementById("btn_calcular_escala").className = "inactive";
        document.getElementById("btn_variasLineas").className = "inactive";
        document.getElementById("btn_variasCircunferencias").className = "inactive";
      });
      
        //Click del botón de cálculo de distancia
    document.getElementById("btn_camino").addEventListener("click", function(){
        strModo ="camino";
        cambioModo();
        this.className = "active";
        document.getElementById("btn_distancia").className="inactive";
        document.getElementById("btn_angulo").className = "inactive";
        document.getElementById("btn_calcular_escala").className = "inactive";
        document.getElementById("btn_variasLineas").className = "inactive";
        document.getElementById("btn_variasCircunferencias").className = "inactive";
    });


    //Click del botón del cálculo de escala
    document.getElementById("btn_calcular_escala").addEventListener("click", function () {
        strModo = "calculoEscala";
        cambioModo();
        this.className = "active";
        document.getElementById("btn_distancia").className = "inactive";
        document.getElementById("btn_angulo").className = "inactive";
        document.getElementById("btn_camino").className = "inactive";
        document.getElementById("btn_variasLineas").className = "inactive";
        document.getElementById("btn_variasCircunferencias").className = "inactive";
    });

    //Dherrero 17-02-2022
    //Click del botón que se usa para dibujar varias líneas
    document.getElementById("btn_variasLineas").addEventListener("click", function () {
        strModo = "variasLineas";
        cambioModo();
        this.className = "active";
        document.getElementById("btn_distancia").className = "inactive";
        document.getElementById("btn_angulo").className = "inactive";
        document.getElementById("btn_camino").className = "inactive";
        document.getElementById("btn_calcular_escala").className = "inactive";
        document.getElementById("btn_variasCircunferencias").className = "inactive";
        document.getElementById("lblTextoUsuario").innerHTML = "Haga click en el punto origen y destino de cada línea independente que quiera dibujar. Elimine líneas con el aspa.";
    });

    //Dherrero 18-02-2022
    //Click del botón que se usa para dibujar varias líneas
    document.getElementById("btn_variasCircunferencias").addEventListener("click", function () {
        strModo = "variasCircunferencias";
        cambioModo();
        this.className = "active";
        document.getElementById("btn_distancia").className = "inactive";
        document.getElementById("btn_angulo").className = "inactive";
        document.getElementById("btn_camino").className = "inactive";
        document.getElementById("btn_calcular_escala").className = "inactive";
        document.getElementById("btn_variasLineas").className = "inactive";
        document.getElementById("lblTextoUsuario").innerHTML = "Haga click en el centro y radio de cada circunferencia independente que quiera dibujar. Elimine circunferencias con el aspa.";
    });

  
   //Click del botón de reducir imagen
    document.getElementById("btZoomOut").addEventListener("click", function(){
        //No queremos que la imagen se haga más pequeña que su tamaño original.
        if (zoomActual>1)
        {

          zoomActual = zoomActual / 2;
          c.width = (c.width / 2);
          c.height = (c.height / 2);

          ctx.scale(zoomActual, zoomActual);
          dibujaTrazado();
          
        }
      });


   //Click del botón rotar medidor de angulos en sentido de las agujas del reloj
   //document.getElementById("btnRotacion_der").addEventListener("click", function(){
      
   //   gradosRotacionMedidorAngulo = gradosRotacionMedidorAngulo + gradosRotacion;
   //   console.log('Grados: ' + gradosRotacionMedidorAngulo.toString());
   //   dibujaTrazado();
   // });

    //Dherrero 16-02-2022 Carlos pide que se pueda girar con más precisión (lo he dejado en 0,5 grados por click) y también de manera más rápida 
    //(Lo soluciono con una especie de timer y la velocidad de giro que la guardo en contadorIteracionesRealizadas)

    //Referencia al timer de controla cuando sigue pulsado el botón para que siga girando el medidor
    var intervaloGiro ; //Es el objeto que devuelve setInterval (Es como un timer)
    var contadorIteracionesRealizadas=0; //Cuenta el número de ejecuciones de la función de rotación en el giro actual.

    function rotarAnguloDerecha()
    {
            gradosRotacionMedidorAngulo = gradosRotacionMedidorAngulo + gradosRotacion + (0.5 * contadorIteracionesRealizadas) ; //El último cálculo lo uso para rotar más rápidamente si el usuario lleva tiempo con el botón pulsado.
            console.log('Grados: ' + gradosRotacionMedidorAngulo.toString());
            dibujaTrazado();
            if (contadorIteracionesRealizadas < 20) { //Le meto un límite de velocidad de rotación porque no me fío. 
                contadorIteracionesRealizadas++;
            }
    }   

    //Acaba de pulsar el botón del ratón
    document.getElementById("btnRotacion_der").addEventListener("mousedown", function () { rotarAnguloDerecha();intervaloGiro=setInterval(rotarAnguloDerecha, 100);  });

    //Acaba de pulsar soltar el botón del ratón
    document.getElementById("btnRotacion_der").addEventListener("mouseup", function () { contadorIteracionesRealizadas = 0;clearInterval(intervaloGiro); });








    //Click del botón rotar medidor de angulos en sentido de las agujas del reloj
    //document.getElementById("btnRotacion_der").addEventListener("click", function () { rotarAnguloDerecha(); });



  //Click del botón rotar medidor de angulos en sentido contrario a las agujas del reloj
  //document.getElementById("btnRotacion_izq").addEventListener("click", function(){
  //    gradosRotacionMedidorAngulo = gradosRotacionMedidorAngulo - gradosRotacion;
  //    console.log('Grados: ' + gradosRotacionMedidorAngulo.toString());
  //    dibujaTrazado();
  //  });

    function rotarAnguloIzquierda() {
        //if (seguirGirando) {

        gradosRotacionMedidorAngulo = gradosRotacionMedidorAngulo - gradosRotacion - (0.5 * contadorIteracionesRealizadas); //El último cálculo lo uso para rotar más rápidamente si el usuario lleva tiempo con el botón pulsado.
        console.log('Grados: ' + gradosRotacionMedidorAngulo.toString());
        dibujaTrazado();
        if (contadorIteracionesRealizadas < 20) { //Le meto un límite de velocidad de rotación porque no me fío.
            contadorIteracionesRealizadas++;
        }
        //}
    } 

    //Acaba de pulsar el botón del ratón
    document.getElementById("btnRotacion_izq").addEventListener("mousedown", function () { rotarAnguloIzquierda(); intervaloGiro = setInterval(rotarAnguloIzquierda, 100); });

    //Acaba de pulsar soltar el botón del ratón
    document.getElementById("btnRotacion_izq").addEventListener("mouseup", function () { contadorIteracionesRealizadas = 0; clearInterval(intervaloGiro); });



};







//Inicializa el control con los controles propios del modo.
function cambioModo()
{

  switch(strModo) {
      case "regla":
          caminoFinalizado = false;
          arrPuntos = [];
          puntoMedidorAngulos.x=-1;
          puntoMedidorAngulos.y = -1;
          dibujaTrazado();
      
          document.getElementById("btZoomIn").style.visibility= 'visible';
          document.getElementById("btZoomOut").style.visibility= 'visible';

          document.getElementById("btnRotacion_der").style.visibility= 'hidden';
          document.getElementById("btnRotacion_izq").style.visibility= 'hidden';
      
          document.getElementById("lblNumPuntos").style.visibility= 'visible';

          document.getElementById("textDistanciaMedir").style.visibility = 'hidden';

          document.getElementById("lblTextoUsuario").innerHTML="";
      
            break;
    case "angulo":
          caminoFinalizado = false;
          arrPuntos = [];
          dibujaTrazado();

          document.getElementById("btZoomIn").style.visibility = 'visible';
          document.getElementById("btZoomOut").style.visibility = 'visible';
        
          document.getElementById("btnRotacion_der").style.visibility = 'visible';
          document.getElementById("btnRotacion_izq").style.visibility = 'visible';
      
          gradosRotacionMedidorAngulo = 0;
          puntoMedidorAngulos.x = -1;
          puntoMedidorAngulos.y = -1;
          document.getElementById("lblNumPuntos").innerHTML="Num. ptos: " + arrPuntos.length;
      
          document.getElementById("lblNumPuntos").style.visibility = 'hidden';

          document.getElementById("textDistanciaMedir").style.visibility = 'hidden';


          document.getElementById("lblTextoUsuario").innerHTML="Pulse en cualquier punto de la imagen para anclar el medidor";
      
      break;
      case "camino":
          
          arrPuntos = [];
          puntoMedidorAngulos.x=-1;
          puntoMedidorAngulos.y = -1;
          dibujaTrazado();

          document.getElementById("btZoomIn").style.visibility = 'visible';
          document.getElementById("btZoomOut").style.visibility ='visible';

          document.getElementById("btnRotacion_der").style.visibility = 'hidden';
          document.getElementById("btnRotacion_izq").style.visibility ='hidden';
      
          document.getElementById("lblNumPuntos").style.visibility = 'visible';

          document.getElementById("textDistanciaMedir").style.visibility = 'hidden';

      
          document.getElementById("lblTextoUsuario").innerHTML="Haga click en cada punto y doble click en el último";
      
          break;


      case "calculoEscala":
          caminoFinalizado = false;
          arrPuntos = [];
          puntoMedidorAngulos.x = -1;
          puntoMedidorAngulos.y = -1;
          dibujaTrazado();

          document.getElementById("btZoomIn").style.visibility = 'visible';
          document.getElementById("btZoomOut").style.visibility = 'visible';

          document.getElementById("btnRotacion_der").style.visibility = 'hidden';
          document.getElementById("btnRotacion_izq").style.visibility = 'hidden';

          document.getElementById("lblNumPuntos").style.visibility = 'hidden';

          document.getElementById("textDistanciaMedir").style.visibility = 'visible';

          document.getElementById("lblTextoUsuario").innerHTML = "Primero introducir la distancia en MN que hay entre dos puntos de la imagen. Después pulsar los dos para conocer la escala";

          break;
      case "variasLineas":
          //arrPuntos = [];
          //puntoMedidorAngulos.x = -1;
          //puntoMedidorAngulos.y = -1;
          caminoFinalizado = false;
          dibujaTrazado();

          document.getElementById("btZoomIn").style.visibility = 'visible';
          document.getElementById("btZoomOut").style.visibility = 'visible';

          document.getElementById("btnRotacion_der").style.visibility = 'hidden';
          document.getElementById("btnRotacion_izq").style.visibility = 'hidden';

          document.getElementById("lblNumPuntos").style.visibility = 'visible';

          document.getElementById("textDistanciaMedir").style.visibility = 'hidden';

          document.getElementById("lblTextoUsuario").innerHTML = "";

          break;

      case "variasCircunferencias":
          caminoFinalizado = false;
          //arrPuntos = [];
          //puntoMedidorAngulos.x = -1;
          //puntoMedidorAngulos.y = -1;
          dibujaTrazado();

          document.getElementById("btZoomIn").style.visibility = 'visible';
          document.getElementById("btZoomOut").style.visibility = 'visible';

          document.getElementById("btnRotacion_der").style.visibility = 'hidden';
          document.getElementById("btnRotacion_izq").style.visibility = 'hidden';

          document.getElementById("lblNumPuntos").style.visibility = 'visible';

          document.getElementById("textDistanciaMedir").style.visibility = 'hidden';

          document.getElementById("lblTextoUsuario").innerHTML = "";

          break;
  }

  //Inicializo las variables
  //zoomActual = 1;
  //arrPuntos = [];
  //dibujaTrazado();


  document.getElementById("lblNumPuntos").innerHTML="Num. ptos: " + arrPuntos.length;
  
}


//Recoge la pulsación de la tecla escape para borrar el último punto.
document.addEventListener("keydown", function(event) {
    if (event.which == 27)
    {
        
        caminoFinalizado=false;
        //alert('Ha pulsado escape');
        arrPuntos.pop();
        document.getElementById("lblNumPuntos").innerHTML="Num. ptos: " + arrPuntos.length;
        //En caso de que no haya puntos, borramos el punto del medidor de ángulos
        if (arrPuntos.length==0){
          
          puntoMedidorAngulos.x = -1;
          puntoMedidorAngulos.y = -1;
          
          gradosRotacionMedidorAngulo = 0;
          
          puntoMedidorAngulos.x = -1;
          puntoMedidorAngulos.y = -1;
        }
        dibujaTrazado();
    };
  })

//Indica si hemos ya hemos presionado sobre un punto.
var puntoPresionado = false;

//Es la lista de puntos en los que ha pulsado el alumno.
var arrPuntos = [];

//Este objeto contiene el último punto en el que ha pulsado el alumno.
var punto = {
    x: 0,
    y: 0,
};

//Contiene las corrdenadas del punto actual y lo va actualizando mouseMove
var puntoActual = {
    x: 0,
    y: 0,
};

//Este es el punto en el que pulsó el alumno para fijar el medidor de ángulos
var puntoMedidorAngulos = {
  x: -1,
  y: -1,
};


//Este es el tipo línea. La linea viene definida por dos puntos (x1,y1) y (x2,y2)
var linea = {
    x1: -1,
    y1: -1,
    x2: -1,
    y2: -1
};

//Este es el array de líneas que se usa para el modo de varias líneas separadas
var arrLineas = [];


//Este es el tipo circunferencia, que queda definida por su punto central (x,y) y su radio
var circunferencia = {
    x: -1,
    y: -1,
    radio: -1,
};

//Este es el array de circunferencias
var arrCircunferencias = [];



var rect = {};

//función que dibuja una línea desde el último punto en el que hemos pulsado al punto actual en el que se encuentra el ratón
function dibujaTrazado( puntoActual){
   console.log('Entra en dibuja trazado');
   console.log('en dibuja trazado el punto de medidor de angulos es: x:' + puntoMedidorAngulos.x + ' e y:' + puntoMedidorAngulos.y);
   //Estas líneas borran todo lo anterior
   ctx.clearRect(0, 0, 800, 600);
   
   //Cargo una imagen
   ctx.drawImage(imageObj, 0, 0);

    ctx.beginPath();


    //Dibujar líneas separadas y círculos separados

    //if (strModo == 'variasLineas')
    //{
    var i;
    for (i = 0; i < arrLineas.length; i++) {
        //Dibujo el punto
        //dibujaPunto(arrPuntos[i]);
        //Pinto la línea desde el punto anterior al punto en el que estamos iterando

        if (arrLineas[i].x2 > -1)
        {
            ctx.moveTo(arrLineas[i].x1, arrLineas[i].y1);
            ctx.lineTo(arrLineas[i].x2, arrLineas[i].y2);
            ctx.strokeStyle = 'red';
            //Dherrero 16-02-2022 piden que se vean mas finas las líneas.
            //ctx.lineWidth = 3;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

    }

    //}
    //if (strModo == 'variasCircunferencias')
    //{

    var i;

    for (i = 0; i < arrCircunferencias.length; i++) {

        //Dibujo el punto
        //dibujaPunto(arrPuntos[i]);
        //Pinto la línea desde el punto anterior al punto en el que estamos iterando


        //ctx.moveTo(puntoPresionado.x, puntoPresionado.y);

        if (arrCircunferencias[i].radio > -1) {
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.arc(arrCircunferencias[i].x, arrCircunferencias[i].y, arrCircunferencias[i].radio, 0, 2 * Math.PI);
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
    }

    //}
        //Ahora dibujamos la circunferencia última en la que no hemos pulsado el radio, solo estamo con el ratón sobre el punto.


                //var ultimaCircunferencia = arrCircunferencias[arrCircunferencias.length - 1];
                //var radio = Math.sqrt(Math.pow((ultimaCircunferencia.x - puntoActual.x), 2) + Math.pow((ultimaCircunferencia.y - puntoActual.y), 2));

                //ctx.beginPath();
                //ctx.strokeStyle = 'red';
                //ctx.arc(ultimaCircunferencia.x, ultimaCircunferencia.y, radio, 0, 2 * Math.PI);
                //ctx.stroke();

          

   //Esto pinta todo el trazado de puntos y líneas del desarrollo inicial
   var i;
   for (i = 0; i < arrPuntos.length; i++) {
        //Pinto la línea desde el punto anterior al punto en el que estamos iterando
        if (i>0)
        {
            ctx.beginPath();   
            ctx.moveTo(arrPuntos[i-1].x, arrPuntos[i-1].y);
            ctx.lineTo(arrPuntos[i].x, arrPuntos[i].y);
            ctx.strokeStyle = 'red';
            //Dherrero 16-02-2022 piden que se vean mas finas las líneas.
            //ctx.lineWidth = 3;
            ctx.lineWidth = 2;
            ctx.stroke();
       }
       //Dibujo el punto
       dibujaPunto(arrPuntos[i]);
    }

    //Añado la imagen del medidor de ángulos si tuviera valores

    if (puntoMedidorAngulos.x != -1)
    {
      var puntoActual = {
        x: 0,
        y: 0,
      };

      puntoActual.x = puntoMedidorAngulos.x;
      puntoActual.y = puntoMedidorAngulos.y;

      pintarImagenMedidorAngulos(puntoActual);
    }

    
        

    

  }

/*Esta función se ejecu
  function pintar(item, index) {
    document.getElementById("demo").innerHTML += index + ":" + item + "<br>";
  }
*/

//dibuja un punto en el canvas:
function dibujaPunto(p){
    var ctx = this.c.getContext("2d");
    ctx.beginPath();
    //DHerrero 16-02-2022 piden que los puntos y líneas se vean mas finos
    //ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI, false);
    ctx.arc(p.x, p.y, 1, 0, 2 * Math.PI , false);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    //Movemos la posición del dibujo al punto central de la circunferencia del circulito que acabamos de pintar.
    ctx.moveTo(p.x, p.y);
  }

//Evento que se produce al pulsar un botón del ratón sobre el canvas
function onMouseDown(e) {
  console.log('Ha entrado en click');
    if (((strModo == 'regla' || strModo == 'angulo' || strModo == 'calculoEscala') && arrPuntos.length < 2) || (strModo == 'camino' && arrPuntos.length >= 0))
    {

        if (strModo == 'angulo' && arrPuntos.length == 0) {
            var puntoActual = obtenerPuntoActual(e);
            //puntoActual.x = puntoActual.x ;
            //puntoActual.y = puntoActual.y ;

            puntoMedidorAngulos.x = puntoActual.x;
            puntoMedidorAngulos.y = puntoActual.y;

            document.getElementById("lblTextoUsuario").innerHTML = "Haga click en el botón del aspa para cambiar la posición del medidor";
        }
        if (strModo == 'angulo' && arrPuntos.length == 1) {
            document.getElementById("lblTextoUsuario").innerHTML = "Haga click en el botón del aspa para eliminar la marca del mapa. Pulse una vez los botones de rotación para girar 0,5 grados. Manténgalos pulsados para mayor velocidad de rotación";
        }

        punto = obtenerPuntoActual(e);
        arrPuntos.push(punto);

        //Mostramos al usuario el número de puntos pulsados
        document.getElementById("lblNumPuntos").innerHTML = "Num. ptos: " + arrPuntos.length;

        puntoPresionado = true;
        dibujaTrazado();
    }
    else //Dherrero 17-02-2022 MouseDown para varias líneas
    {
        if (strModo == 'variasLineas') {

            var lineaModificar;
            punto = obtenerPuntoActual(e);

            //Ya hay líneas anteriores así que cojo la última
            if (arrLineas.length > 0) {
                ultimaLinea = arrLineas[arrLineas.length - 1];

                if (ultimaLinea.x2 == -1) {
                    //Relleno el segundo punto de la última línea
                    ultimaLinea.x2 = punto.x;
                    ultimaLinea.y2 = punto.y;
                    dibujaTrazado();

                }
                else {
                    //En este caso la línea existente tiene los dos puntos rellenos.
                    //Así que creamos línea nueva
                    lineaNueva = {
                        x1: punto.x,
                        y1: punto.y,
                        x2: -1,
                        y2: -1
                    };
                    arrLineas.push(lineaNueva);
                }
            }
            else {
                //Es la primera línea que se crea
                lineaNueva = {
                    x1: punto.x,
                    y1: punto.y,
                    x2: -1,
                    y2: -1
                };
                arrLineas.push(lineaNueva);
            }


        }
        else
        {
                //Ha hecho click en la imagen mientras está en modo varias circunferencias
                if (strModo == 'variasCircunferencias')
                {
                    //Para dibujar una circunferencia, el usuario hará click en el punto central de la misma
                    // y despues hará click en otro punto. La distancia entre ambos puntos será el radio.

                    if (arrCircunferencias.length != 0) //Solo pintamos algo si ya hemos pulsado en un punto.
                    {

                        //Obtengo la última circunferencia
                        var ultimaCircunferencia = arrCircunferencias[arrCircunferencias.length - 1];

                        if (ultimaCircunferencia.radio == -1) //No ha pulsado segundo punto (a partir del q se calcula el radio)
                        {
                            
                            var puntoActualRaton = obtenerPuntoActual(e);
                            
                            //ctx.moveTo(puntoPresionado.x, puntoPresionado.y);
                            var radio = Math.sqrt(Math.pow((ultimaCircunferencia.x - puntoActualRaton.x), 2) + Math.pow((ultimaCircunferencia.y - puntoActualRaton.y), 2));

                            ultimaCircunferencia.radio = radio;
                            
                        }
                        else
                        {
                            //Creo nueva circunferencia con centro en el punto actual
                            punto = obtenerPuntoActual(e);

                            var nuevaCircunferencia = {
                                x: punto.x,
                                y: punto.y,
                                radio: -1,
                            };

                            arrCircunferencias.push(nuevaCircunferencia);
                            
                        }

                    }
                    else //Es el primer click que hacemos para crear circunferencias
                    {
                         //Creo nueva circunferencia con centro en el punto actual
                        punto = obtenerPuntoActual(e);

                        var nuevaCircunferencia = {
                            x: punto.x,
                            y: punto.y,
                            radio: -1,
                        };

                        arrCircunferencias.push(nuevaCircunferencia);
                        
                    } 
                    

                }
            }
        }
};

//Evento que se produce al pulsar doble click en el canvas
function ondblclick(e) {
  console.log('Ha entrado en doble click');
  if ((strModo=='camino' && arrPuntos.length>1) ){
    caminoFinalizado = true;
    arrPuntos.pop();
    document.getElementById("lblNumPuntos").innerHTML="Num. ptos: " + arrPuntos.length;
  }
};


//Devuelve un punto con la posición x e y actual, respecto del canvas que contiene la posición.
function obtenerPuntoActual(e)
{
    var rect = c.getBoundingClientRect();
    //puntoPosicionX = (e.clientX / zoomActual) - rect.left;
    //puntoPosicionY = (e.clientY / zoomActual) - rect.top; 
    var puntoActual = {
        x: 0,
        y: 0,
    };
    puntoActual.x = (e.clientX / zoomActual)  - (rect.left / zoomActual);
    puntoActual.y = (e.clientY / zoomActual)  - (rect.top / zoomActual);
    return puntoActual;
}

//function onMouseUp(e) {
    //mouseIsDown = false;
//};

function onMouseMove(e) {

    puntoActual = obtenerPuntoActual(e);

    //Establezco el puntero
    if (strModo=='regla' || strModo=='camino') 
    {
        c.style.cursor="crosshair";
    }
    else
    {
        c.style.cursor="default";
    }
    
    //Solo previsualizamos la siguiente línea en el caso de que haya pulsado un punto previamente.
    if (((strModo == 'regla' || strModo == 'angulo' || strModo == 'calculoEscala') && arrPuntos.length == 1) || (strModo == 'camino' && arrPuntos.length > 0 && caminoFinalizado == false))
    {
        dibujaTrazado();
        //El usuario todavía no ha decidido donde poner el siguiente punto, está moviendo el ratón
        //y queremos que se previsualice la línea desde el punto anterior.
        var puntoActualRaton = obtenerPuntoActual(e);
        //ctx.moveTo(puntoPresionado.x, puntoPresionado.y);
        ctx.lineTo(puntoActualRaton.x , puntoActualRaton.y );
        ctx.strokeStyle = 'red';
        //Dherrero 16-02-2022 Piden que se vea más finas las líneas
        //ctx.lineWidth = 3;
        ctx.lineWidth = 2;
        ctx.stroke();

        var ultimoPuntoPresionado = arrPuntos[arrPuntos.length -1];

        //Mostramos la distancia en función de la escala y el tamaño de la línea.
        //Lo separo en varias líneas para que sea más legible.
        var distanciaLineaPixeles     = Math.sqrt(Math.pow((ultimoPuntoPresionado.x - puntoActualRaton.x ),2) + Math.pow((ultimoPuntoPresionado.y - puntoActualRaton.y),2));
        //var distanciaLineaCentimetros = distanciaLineaPixeles * 2.54 / resolucionImagenPPP ;

        //Aquí detectamos cuantos pixeles por pulgada tiene la pantalla:
        var PPP_pantalla = document.getElementById('ppitest').offsetWidth;
        console.log('Detectados estos ppi:' + PPP_pantalla);



        var escalaDivisor = '';  
        
        if (escalaTipoMedida=='cm') //Son centímetros
        {
          escalaDivisor=(PPP_pantalla/2.54) * escalaParametro2;
          console.log("Escala: " + escalaTipoMedida); 
        }
        else  //Son píxeles
        {
          escalaDivisor = escalaParametro2;
          console.log("Escala: " + escalaTipoMedida); 
        }

          
        var escalaDividendo = escalaParametro1;
        var escala = escalaDividendo/escalaDivisor;
        var distanciaMillasNauticas = distanciaLineaPixeles * escala;

        
  

        console.log ("distanciaLineaPixeles: " + distanciaLineaPixeles.toString() + " distanciaMillasNauticas: " + distanciaMillasNauticas.toString());
        

        //Calculamos la distancia en el modo regla:
        if (strModo=='regla')
        {
          var e = document.getElementById("lblTextoUsuario");
            e.innerHTML = 'Distancia: ' + Math.round(distanciaMillasNauticas * 100) / 100 + ' NM';
        }
        if (strModo == 'calculoEscala')
        {
            
            var distanciaMillasNauticasIntroducida = document.getElementById("textDistanciaMedir").value;

            var e = document.getElementById("lblTextoUsuario");
            e.innerHTML = 'La escala es: ' + (distanciaMillasNauticasIntroducida).toString()  + ' : ' + distanciaLineaPixeles.toString();
        }
    }
    else
    {
          //Pintamos la circunferencia en caso de que estemos midiendo ángulos:
        if (strModo == 'angulo' && arrPuntos.length == 0) {
            dibujaTrazado();

            var rect = c.getBoundingClientRect();
            //puntoPosicionX = (e.clientX / zoomActual) - rect.left;
            //puntoPosicionY = (e.clientY / zoomActual) - rect.top; 
            var puntoActual = {
                x: 0,
                y: 0,
            };

            var puntoActual = obtenerPuntoActual(e);

            puntoActual.x = puntoActual.x;
            puntoActual.y = puntoActual.y;

            pintarImagenMedidorAngulos(puntoActual);
        }
        else
        {
            if (strModo == 'variasCircunferencias') {
                //Movimiento de ratón en el modo de varias circunferencias tenemos dos tres para cada circunferencia a dibujar:
                //1º Que no hayamos pulsado ningún punto antes para la circunferencia: En ese caso no se dibuja nada.
                //2º Que hayamos pulsado un punto, que es el centro de la circunferencia: En ese caso vamos a dibujar la 
                //    circunferencia tomando como centro el primer punto pulsado y como radio, la distancia desde el centro hasta el punto actual.
                //  El usuario pulsará doble click para finalizar la circunferencia



                if (arrCircunferencias.length != 0) //Solo pintamos algo si ya hemos pulsado en un punto.
                {

                    var ultimaCircunferencia = arrCircunferencias[arrCircunferencias.length - 1];
                    if (ultimaCircunferencia.radio == -1) {

                        dibujaTrazado();
                        //La circunferencia que se dibuja en este caso es la que tiene centro en el último punto y radio = distancia desde el último punto hasta punto actual del ratón
                        

                        var ultimaCircunferencia = arrCircunferencias[arrCircunferencias.length - 1];
                        var radio = Math.sqrt(Math.pow((ultimaCircunferencia.x - puntoActual.x), 2) + Math.pow((ultimaCircunferencia.y - puntoActual.y), 2));

                        ctx.beginPath();
                        ctx.lineWidth = 2
                        ctx.strokeStyle = 'red';
                        ctx.arc(ultimaCircunferencia.x, ultimaCircunferencia.y, radio, 0, 2 * Math.PI);
                        ctx.stroke();

                    }

                    //Obtengo la última circunferencia
                    //var ultimaCircunferencia = arrCircunferencias[arrCircunferencias.length - 1];

                    //dibujaTrazado();

                    //if (ultimaCircunferencia.radio == -1) //No ha pulsado segundo punto (a partir del q se calcula el radio)
                    //{



                    //var puntoActualRaton = obtenerPuntoActual(e);
                    ////ctx.moveTo(puntoPresionado.x, puntoPresionado.y);

                    //var radio = Math.sqrt(Math.pow((ultimaCircunferencia.x - puntoActualRaton.x), 2) + Math.pow((ultimaCircunferencia.y - puntoActualRaton.y), 2));

                    //ctx.beginPath();
                    //ctx.strokeStyle = 'red';
                    //ctx.arc(ultimaCircunferencia.x, ultimaCircunferencia.y, radio, 0, 2 * Math.PI);
                    //ctx.stroke();

                    //var puntoActual = obtenerPuntoActual(e);
                    //dibujaTrazado(puntoActual);
                    //}

                }
            }
            else
            {
                
                if (strModo == 'variasLineas')
                {
                    if (arrLineas.length > 0)
                    {
                        var ultimaLinea = arrLineas[arrLineas.length - 1];

                        if (ultimaLinea.x2 == -1) {
                            
                            dibujaTrazado();

                            ctx.beginPath();
                            //El usuario todavía no ha decidido donde poner el siguiente punto, está moviendo el ratón
                            //y queremos que se previsualice la línea desde el punto anterior.
                            var puntoActualRaton = obtenerPuntoActual(e);
                            ctx.moveTo(ultimaLinea.x1, ultimaLinea.y1);
                            ctx.lineTo(puntoActualRaton.x, puntoActualRaton.y);
                            ctx.strokeStyle = 'red';
                            //Dherrero 16-02-2022 Piden que se vea más finas las líneas
                           
                            ctx.lineWidth = 2;
                            ctx.stroke();
                        }
                    }
                }
            }
        }
    }
};


function pintarImagenMedidorAngulos(posicion)
{           
            imagenCirculo = new Image();
            imagenCirculo.src = rutaImagenMedidorAngulos;


            console.log('Entra en pintarImagenMedidorAngulos con posicion x: ' + posicion.x + " y posición y:" + posicion.y );

            console.log('Entra en pintarImagenMedidorAngulos la imagen del medidor angulos tiene posicion x: ' + puntoMedidorAngulos.x + " y posición y:" + puntoMedidorAngulos.y );

            if (puntoMedidorAngulos.x == -1) //Todavía no hemos fijado el punto por lo que debe seguir al ratón. 
            {
                imagenCirculo.onload = function () { 
                ctx.save(); //Salvamos lo que llevemos dibujado hasta ahora
                           
                //ctx.translate((posicion.x) , (posicion.y)); 
  
                
                ctx.translate((posicion.x ) , (posicion.y )); //Esquina superior izquierda de del círculo.
  
                //ctx.translate((  anchoImagenMedidorAngulos/2 ) , ( altoImagenMedidorAngulos/2 )); //Centro del círculo.
  
  
                //ctx.translate(anchoImagenMedidorAngulos/2 , altoImagenMedidorAngulos/2); //centro del círculo
  
                //ctx.rotate(gradosRotacionMedidorAngulo * (Math.PI / 180)); //Lo rotamos en radianes
                ctx.drawImage(imagenCirculo,   - anchoImagenMedidorAngulos/2  , - altoImagenMedidorAngulos/2  , anchoImagenMedidorAngulos , altoImagenMedidorAngulos ); //pintamos
                //ctx.translate(- (posicion.x) ,- (posicion.y) );
  
                //gradosRotacionMedidorAngulo = 0;
                
                ctx.restore();//Volvemos al punto en el que estábamos antes de salvar.
               };
            }
            else //Ya hemos fijado la imagen de la herramienta de medición de ángulos.
            {
              
              imagenCirculo.onload = function () { 
                ctx.save(); //Salvamos lo que llevemos dibujado hasta ahora
                           
                //ctx.translate((posicion.x) , (posicion.y)); 
  
                
                ctx.translate((puntoMedidorAngulos.x ) , (puntoMedidorAngulos.y )); //Esquina superior izquierda de del círculo.
  
                //ctx.translate((anchoImagenMedidorAngulos/2 ) , (altoImagenMedidorAngulos/2 )); //Centro del círculo.
  
                ctx.rotate(gradosRotacionMedidorAngulo * (Math.PI / 180)); //Lo rotamos en radianes
                
                ctx.drawImage(imagenCirculo,   - anchoImagenMedidorAngulos/2  , - altoImagenMedidorAngulos/2  , anchoImagenMedidorAngulos , altoImagenMedidorAngulos ); //pintamos
                //ctx.translate(- (posicion.x) ,- (posicion.y) );
  
                //gradosRotacionMedidorAngulo = 0;
                
                ctx.restore();//Volvemos al punto en el que estábamos antes de salvar.
              };

            }
}












