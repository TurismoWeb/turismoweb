var firebaseConfig = {
    apiKey: "AIzaSyBL_LLC4evVeYSpHhYl97uF2jg-hxwAP8I",
    authDomain: "turismo2-4b07d.firebaseapp.com",
    databaseURL: "https://turismo2-4b07d.firebaseio.com",
    projectId: "turismo2-4b07d",
    storageBucket: "turismo2-4b07d.appspot.com",
    messagingSenderId: "361696427572",
    appId: "1:361696427572:web:93de2285ebce8480679461"
};



firebase.initializeApp(firebaseConfig);

var storage = firebase.storage();
var db = firebase.firestore();

function ObtenerId(id) {
    return document.getElementById(id).value;
}


const task_sitios = document.getElementById('task_datos_sitio');
const task_momentos = document.getElementById('task_momentos');
var archivo = document.getElementById('archivo');
var imgArchivo = document.getElementById('imgSubida');
var SitioSeleccionado = '';
var myUsuario = 'sin usuario';

const getMomentosSitio = () => db.collection('momentos_sitios')
    .where("fksitio", "==", SitioSeleccionado.id).get();


window.addEventListener('DOMContentLoaded', async (e) => {

    var user = localStorage['usuarioalmacenado'];
    if (user) {
        myUsuario = JSON.parse(user).Usuario;
        console.log(myUsuario);
    } else {
        console.log("localstorafe usuario inexistente");
    }

    var sit = localStorage['detallesitioalmacenado'];
    if (sit) {
        SitioSeleccionado = JSON.parse(sit);
        console.log(SitioSeleccionado.id);
        task_sitios.innerHTML += `
        <div class="titulo"><p><b>Sitio:</b>${SitioSeleccionado.nombre}  </p></div>
        <div class="titulo"><p><b>Puntuacion:</b>${SitioSeleccionado.puntuacion}  </p></div>
        <div class="titulo"><p><b>Servicio:</b> ${SitioSeleccionado.servicios} </p></div>
        <div class="titulo"><p><b>Presupuesto:</b> ${SitioSeleccionado.presupuesto} </p></div>
    `
    } else {
        console.log('error no se esta guardando el sitio en detalles');
        window.location.href = "index.html";
    }

    const querySnapshot = await getMomentosSitio();
    querySnapshot.forEach(doc => {
        task_momentos.innerHTML += `
    <div class="card" style="width: 20rem;">
    <img class="card-img-top img-fluid" src="${doc.data().urlimagen}" name="imgSubida" id="imgSubida" alt="">
    <div class="card-block">
      <h4 class="card-title"> Usuario: ${doc.data().fkusuario}</h4>
      <p class="card-text"> Experiencia: ${doc.data().experiencia} </p>
    </div>
  </div>
    `
    })

})

function subirImagen() {
    var archivoFile = archivo.files[0];
    if (archivoFile) {

        var uploadTask = storage.ref('imagenes/' + archivoFile.name).put(archivoFile)
            .then((img) => {
                console.log("Imagen subida..", img.totalBytes);
                storage.ref('imagenes/' + archivoFile.name).getDownloadURL()
                    .then((UrlImg) => {
                        imgArchivo.src = UrlImg;
                        console.log(UrlImg);
                        var Experiencia = ObtenerId("mensaje");

                        ColeccionMomentos(Experiencia, UrlImg, myUsuario, SitioSeleccionado.id);
                    });
            });

    } else {
        alert('Parece que no a seleccionado una imagen')
    }

}


function ColeccionMomentos(Experiencia, UrlImg, Usuario, idSitio) {
    db.collection("momentos_sitios").doc().set({
        experiencia: Experiencia,
        urlimagen: UrlImg,
        fkusuario: Usuario,
        fksitio: idSitio
    })
        .then(function (docRef) {
            alert('Registro Exitoso');
            window.location.href = "detalles.html";
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}
