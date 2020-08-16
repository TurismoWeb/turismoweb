


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

var db = firebase.firestore();

const task_sitios = document.getElementById('tasks-sitios');

function ObtenerId(id) {
    return document.getElementById(id).value;
}

const getSitios = () => db.collection('sitios_turisticos').get();

window.addEventListener('DOMContentLoaded', async (e) => {
    const querySnapshot = await getSitios();
    querySnapshot.forEach(doc => {
        task_sitios.innerHTML += `
        <div class="card" style="width: 20rem;">
        <img class="card-img-top img-fluid" src="img/calera/calera.png" alt="Card image cap">
        <div class="card-block">
          <h4 class="card-title">${doc.data().nombre}</h4>
          <p class="card-text"> UBICACIÓN: ${doc.data().ubicacion} </p>
          <p class="card-text"> PUNTUACION: ${doc.data().puntuacion} </p>
          <p class="card-text"> SERVICIOS: ${doc.data().servicios} </p>
          <p class="card-text">PRESUPUETO: ${doc.data().presupuesto}</p>
          <a href="#" class="btn btn-outline-primary btn-block">Ver detalles</a>
          <a href="#" class="btn btn-outline-primary btn-block">Registrar Momento</a>
        </div>
      </div>
        `
    })
})



function RegistrarSitio() {
    var Nombre_sitio = ObtenerId("nombre_sitio");
    var Puntuacion = ObtenerId("puntuacion");
    var Servicios = ObtenerId("servicios");
    var Presupuesto = ObtenerId("presupuesto");
    var Ubicacion = ObtenerId("ubicacion");
    if (ValidarCamposVaciosSitio(Nombre_sitio,Puntuacion,Servicios,Presupuesto,Ubicacion)) {
        ColeccionSitio(Nombre_sitio,Puntuacion,Servicios,Presupuesto,Ubicacion);

    }
}

function ColeccionSitio(Nombre_sitio,Puntuacion,Servicios,Presupuesto,Ubicacion) {
    db.collection("sitios_turisticos").doc().set({
        nombre: Nombre_sitio,
        puntuacion: Puntuacion,
        servicios: Servicios,
        presupuesto: Presupuesto,
        ubicacion: Ubicacion,
    })
        .then(function (docRef) {
            alert('Registro Exitoso');
            window.location.href = "index.html";
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}

function Registrar() {
    var Nombre_uno = ObtenerId("nombre_uno");
    var Nombre_dos = ObtenerId("nombre_dos");
    var Apellido_uno = ObtenerId("apellido_uno");
    var Apellido_dos = ObtenerId("apellido_dos");
    var Telefono = ObtenerId("telefono");
    var Correo = ObtenerId("correo");
    var Clave = ObtenerId("clave");
    var CalveConfirmada = ObtenerId("clave_confirmada");
    if (ValidarCamposVacios(Nombre_uno, Apellido_uno, Apellido_dos, Telefono, Correo, Clave, CalveConfirmada)) {
        ColeccionPersona(Nombre_uno, Nombre_dos, Apellido_uno, Apellido_dos, Telefono, Correo, Clave);

    }
}
function iniciar(){
   
   var user = ObtenerId("usuario")
    var clave = ObtenerId("clave")
    db.collection("usuarios").where("Usuario", "==", user).where("Clave", "==", clave)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            ComprobarInicio = true;
           alert('HAZ INICIADO SESION CORRECTAMENTE')
           window.location.href = "index.html";
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}



function ColeccionPersona(Nombre_uno, Nombre_dos, Apellido_uno, Apellido_dos, Telefono, Correo, Clave) {
    db.collection("usuarios").doc().set({
        PrimerNombre: Nombre_uno,
        SegundoNombre: Nombre_dos,
        PrimerApellido: Apellido_uno,
        SegundoApellido: Apellido_dos,
        Telefono: Telefono,
        Usuario: Correo,
        Clave: Clave
    })
        .then(function (docRef) {
            alert('Registro Exitoso');
            window.location.href = "login.html";
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}

function ValidarCamposVaciosSitio(Nombre_sitio,Puntuacion,Servicios,Presupuesto,Ubicacion) {
    var Comprobar = true;
    if (Nombre_sitio.length == 0) {
        alert("Debe Ingresar el Nombre del sitio");
        Comprobar = false;
    } else {
        if (Puntuacion.length == 0) {
            alert("Debe Ingresar una puntuación");
            Comprobar = false;
        } else {
            if (Servicios.length == 0) {
                alert("Debe detallar los servicios");
                Comprobar = false;
            } else {
                if (Presupuesto.length == 0) {
                    alert("Debe ingresar un presupuesto estimado");
                    Comprobar = false;
                }else{
                    if (Ubicacion.length == 0) {
                        alert("Debe ingresar la ubicacion");
                        Comprobar = false;
                    }
                }
            }
        }
    }
    return Comprobar;
}

function ValidarCamposVacios(Nombre_uno, Apellido_uno, Apellido_dos, Telefono, Correo, Clave, CalveConfirmada) {
    var Comprobar = true;
    if (Nombre_uno.length == 0) {
        alert("Debe Ingresar el Primer Nombre");
        Comprobar = false;
    } else {
        if (Apellido_uno.length == 0) {
            alert("Debe Ingresar el Primer Apellido");
            Comprobar = false;
        } else {
            if (Apellido_dos.length == 0) {
                alert("Debe Ingresar el Segundo Apellido");
                Comprobar = false;
            } else {
                if (Telefono.length == 0) {
                    alert("Debe Ingresar el Telefono");
                    Comprobar = false;
                } else {
                    if (Correo.length == 0) {
                        alert("Debe Ingresar el ");
                        Comprobar = false;
                    } else {
                        if (Clave.length == 0) {
                            alert("Debe Ingresar la contraseña");
                            Comprobar = false;
                        } else {
                            if (CalveConfirmada.length == 0) {
                                alert("Debe Confirmar la contraseña");
                            }
                        }
                    }
                }
            }
        }
    }
    return Comprobar;
}