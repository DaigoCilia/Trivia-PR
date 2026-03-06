// ------------------- INICIO ESCENA -------------------
class InicioScene extends Phaser.Scene {

    constructor(){
        super("InicioScene"); // Nombre de la escena
    }

    preload(){
        // Carga la imagen del fondo para la pantalla de inicio
        this.load.image("fondoInicio","Fondo_1.png"); //aqui se pone el fondo con el que inicia el juego
    }

    create(){
        // Agrega la imagen de fondo y ajusta su tamaño al canvas
        this.add.image(0,0,"fondoInicio")
            .setOrigin(0) // Para que la posición (0,0) sea la esquina superior izquierda
            .setDisplaySize(this.scale.width, this.scale.height); // Se adapta a cualquier pantalla

        // Título del juego
        this.add.text(180,200,"Trivia: Power Rangers",{ //cambia el titulo
            fontSize:"25px",
            fontFamily: "Russo One", //fuente de Google Fonts
            color:"#00fff2"
        }).setOrigin(0.5); // Centrado //se asegura que este bien centrado

        // Botón de comenzar
        let boton = this.add.rectangle(180,450,200,60,0x550000)
            .setInteractive(); // Lo hace clickeable

        this.add.text(180,450,"COMENZAR",{
            fontSize:"20px",
            fontFamily: "Russo One",
        }).setOrigin(0.5);

        // Evento al presionar el botón
        boton.on("pointerdown",()=>{
            this.scene.start("TriviaScene",{ //cambia de escena cuando se presiona el boton
    vidas: 4, //aqui se agregan mas vidas
    puntaje: 0,
    indice: 0 }); 
        });

    }
}

// ------------------- ESCENA DEL JUEGO -------------------
class TriviaScene extends Phaser.Scene {

    constructor(){
        super("TriviaScene");
    }

    init(data){
        // Inicializa variables con valores enviados o por defecto
        this.vidas = data.vidas ?? 4; 
        this.puntaje = data.puntaje ?? 0;
        this.indice = data.indice ?? 0;
    }

    preload(){
        // Carga la imagen de fondo del juego
        this.load.image("fondoJuego","Fondo_2.png"); //Aqui se cambia el fondo que se vera mientras se responden las preguntas
    }

    create(){
        // Fondo adaptado a cualquier pantalla
        this.add.image(0,0,"fondoJuego")
            .setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height);

        // Arreglo de preguntas
        //muchas preguntas, disculpe soy muy nerd
        this.preguntas = [
            {pregunta:"¿Cuál es el nombre de la franquicia en la que se basa Power Rangers? ", opciones:["Kamen Rider","Metal Hero","Super Sentai","Ultraman"], correcta:2},
            {pregunta:"¿Nombre de la serie de la que se usó el metraje para realizar Mighty Morphin Power Rangers?", opciones:["Bakuryū Sentai Abaranger","Kyōryū Sentai Zyuranger","Zyuden Sentai Kyoryuger","Kishiryū Sentai Ryūsoulger"], correcta:1},
            {pregunta:"¿Cuales fueron los colores de los primeros 5 rangers?", opciones:["🔴🔵🟡🌸⚫","🔴🔵🟡🌸🟢","🔴🔵🟡⚫⚪","🔴🔵🟢⚫⚪"], correcta:0},
            {pregunta:"¿Porque la primer Ranger Amarilla no lleva falda en su traje, a diferencia de la Ranger Rosa?", opciones:["Error de diseño de vestuario","El personaje en Japón era hombre","Facilitaba las acrobacias","La actriz pidió un traje diferente"], correcta:1},
            {pregunta:"¿Como se les conoce a los robots gigantes que pilotean los Rangers?", opciones:["Jeagers","Mechas","Autobots","Megazords"], correcta:3},
            {pregunta:"Power Rangers finalizo con 30 temporadas, ¿con cuantas temporadas termino Super Sentai?", opciones:["50","Sigue en emisión","49","35"], correcta:2},
            {pregunta:"¿Qué color es el que está relacionado con el líder del equipo?", opciones:["Rojo","Blanco","Verde","Azul"], correcta:0},
            {pregunta:"¿Qué famosa compañía adquirió los derechos de Power Rangers en 2002?", opciones:["Nexflix","Televisa","Nickelodeon","Disney"], correcta:3},
            {pregunta:"¿A qué país llevo el tacaño de Disney la producción de PR para abaratar costos?", opciones:["Nueva Zelanda","Japón","Se quedo en EEUU","Perú"], correcta:0},
            {pregunta:"En la temporada 30: Cosmic Fury, el personaje de Amelia se convierte en la primer Red Ranger femenina de un equipo principal ¿Cuál era su color antes?", opciones:["Blanco","Rosa","Plateado","Amarillo"], correcta:1},
        ]

        // Texto de vidas y puntaje
        this.textoVidas = this.add.text(20,20,"❤️".repeat(this.vidas),{fontSize:"22px"});
        this.textoPuntaje = this.add.text(240,20,"Puntos: "+this.puntaje,{fontSize:"22px", fontFamily: "Russo One", color:"#000000",}); // se agrego fontFamily: para asignar la fuente de google fonts que asignamos en el index

        // Muestra la primera pregunta
        this.mostrarPregunta();
    }

    mostrarPregunta(){
        if(this.indice >= this.preguntas.length){
            this.scene.start("FinalScene",{gano:true,puntaje:this.puntaje});
            return;
        }

        let actual = this.preguntas[this.indice];

        // Mostrar la pregunta centrada
        this.textoPregunta = this.add.text(180,150,actual.pregunta,{
            fontSize:"20px",
            fontFamily: "Russo One",
            color:"#002794", //color para las preguntas
            wordWrap:{width:300},
            align:"center"
        }).setOrigin(0.5);

        this.botones = [];

        // Crear botones para las opciones
        for(let i=0;i<4;i++){
            let boton = this.add.rectangle(180,250+i*80,300,60,0xffffff,0.7) //le agruegue opacidad a los botones de respuesta
                .setInteractive();

            let texto = this.add.text(180,250+i*80,actual.opciones[i],{
                fontSize:"18px",
                fontFamily: "Russo One", //fuente de google fonts
                 color:"#ff0000", //color
            }).setOrigin(0.5);

            boton.on("pointerdown",()=>{ this.verificar(i); });

            this.botones.push(boton);
        }

        // Temporizador de la pregunta
        this.tiempoRestante = 20; //aumente el tiempo de las preguntas a 20
        this.textoTiempo = this.add.text(150,20,"⏳ 20",{fontSize:"22px", fontFamily: "Russo One", color:"#000000",});

        this.temporizador = this.time.addEvent({
            delay: 1000,
            callback: ()=>{
                this.tiempoRestante--;
                this.textoTiempo.setText("⏳ " + this.tiempoRestante);

                if(this.tiempoRestante <= 0){
                    this.temporizador.remove();
                    this.vidas--;
                    this.textoVidas.setText("❤️".repeat(this.vidas));
                    this.efectoRojo();

                    if(this.vidas <= 0){
                        this.scene.start("FinalScene",{gano:false,puntaje:this.puntaje});
                        return;
                    }

                    this.indice++;
                    this.time.delayedCall(800,()=>{
                        this.scene.restart({
                            vidas:this.vidas,
                            puntaje:this.puntaje,
                            indice:this.indice
                        });
                    });
                }
            },
            loop: true
        });
    }

    verificar(respuesta){
        let actual = this.preguntas[this.indice];
        this.temporizador.remove();

        if(respuesta === actual.correcta){
            this.puntaje++;
            this.textoPuntaje.setText("Puntos: "+this.puntaje);
            this.efectoVerde();
        }else{
            this.vidas--;
            this.textoVidas.setText("❤️".repeat(this.vidas));
            this.efectoRojo();

            if(this.vidas <= 0){
                this.scene.start("FinalScene",{gano:false,puntaje:this.puntaje});
                return;
            }
        }

        this.indice++;
        this.time.delayedCall(800,()=>{
            this.scene.restart({
                vidas:this.vidas,
                puntaje:this.puntaje,
                indice:this.indice
            });
        });
    }

    efectoRojo(){
        let overlay = this.add.rectangle(180,320,360,640,0xff0000,0.4);
        this.tweens.add({targets: overlay, alpha: 0, duration: 400, onComplete: ()=> overlay.destroy()});
    }

    efectoVerde(){
        let overlay = this.add.rectangle(180,320,360,640,0x00ff00,0.3);
        this.tweens.add({targets: overlay, alpha: 0, duration: 300, onComplete: ()=> overlay.destroy()});
    }
}

// ------------------- ESCENA FINAL -------------------
class FinalScene extends Phaser.Scene {
    constructor(){ super("FinalScene"); }

    init(data){
        this.gano = data.gano;
        this.puntaje = data.puntaje;

        // Calcula estrellas según puntaje
        let estrellas = 0;
        if(this.puntaje >= 9) estrellas = 3; // se cambia el valor del sistema de estellas debido a que hay mas preguntas
        else if(this.puntaje === 8) estrellas = 2; 
        else if(this.puntaje === 7) estrellas = 1;

        let textoEstrellas = "⭐".repeat(estrellas);
        this.add.text(180,360,textoEstrellas,{fontSize:"32px", fontFamily: "Russo One",}).setOrigin(0.5);
    }

    create(){
        this.cameras.main.setBackgroundColor("#863030");
        let mensaje = this.gano ? "⚡ GANASTE ⚡" : "💀 GAME OVER 💀";

        this.add.text(180,250,mensaje,{fontSize:"36px",fontFamily: "Russo One",}).setOrigin(0.5);
        this.add.text(180,320,"Puntaje: "+this.puntaje,{fontSize:"26px", fontFamily: "Russo One",}).setOrigin(0.5);

        // Botón de reinicio
        let boton = this.add.rectangle(180,420,200,60,0x550000).setInteractive();
        this.add.text(180,420,"REINICIAR",{fontSize:"20px", fontFamily: "Russo One",}).setOrigin(0.5);

        boton.on("pointerdown",()=>{ this.scene.start("InicioScene"); });
    }
}

// ------------------- CONFIGURACIÓN DEL JUEGO -------------------
const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    transparent: true,
    parent: "juego",
    scale:{
        mode: Phaser.Scale.FIT, // Ajusta el juego al tamaño de pantalla
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene:[InicioScene,TriviaScene,FinalScene] //Indica en que orden se van a ejecutar las escenas
};

const game = new Phaser.Game(config);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js")
      .then((registration) => {
        console.log("Service Worker registrado:", registration.scope);
      })
      .catch((error) => {
        console.log("Error al registrar Service Worker:", error);
      });
  });

}


