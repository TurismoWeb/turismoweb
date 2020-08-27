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

var storageRef = firebase.storage().ref();

const task_sitios = document.getElementById('tasks-sitios');
const getSitiosVerificados = () => db.collection('sitios_turisticos')
    .where("estado_validacion", "==", 1).get();
const getTodosSitios = () => db.collection('sitios_turisticos').get();

function ObtenerId(id) {
    return document.getElementById(id).value;
}

function Menu_Cerrarsesion() {
    localStorage.removeItem('usuarioalmacenado');
    window.location.href = "index.html";
}

function Menu_RegistrarSitio() {
    var user = localStorage['usuarioalmacenado'];
    if (user) {
        console.log('menu registra rsitio : sesion iniciada');
        window.location.href = "registrarsitio.html";
    } else {
        alert('DEBES INICIAR SESION O REGISTRARTE')
        console.log('menu registrarsitio : Debe registrarse o iniciar sesiòn ');
    }
}

window.addEventListener('DOMContentLoaded', async (e) => {

    if (task_sitios) {

        var user = localStorage['usuarioalmacenado'];
        if (user) {

            myVar = JSON.parse(user);

            if (myVar.TipoUsuario == 0) {

                console.log('cargando sitios : no administrador');
                await _mostrarsitiosverificados();
            } else {
                console.log('cargando sitios : administrador');
                await _mostrartodoslossitios();
            }
        } else {
            console.log('cargando sitios : no logueado');
            await _mostrarsitiosverificados();
        }


    }
})

async function _mostrarsitiosverificados() {
    const querySnapshot = await getSitiosVerificados();
    querySnapshot.forEach(doc => {
        task_sitios.innerHTML += `
    <div class="card" style="width: 20rem;">
    <img class="card-img-top img-fluid" src="${doc.data().urlimg}" alt="Card image cap">
    <div class="card-block">
      <h4 class="card-title">${doc.data().nombre}</h4>
      <p class="card-text"><b>UBICACIÓN:</b> ${doc.data().ubicacion} </p>
      <p class="card-text"><b>PUNTUACION:</b> ${doc.data().puntuacion} </p>
      <p class="card-text"><b>SERVICIOS:</b> ${doc.data().servicios} </p>
      <p class="card-text"><b>PRESUPUETO:</b> ${doc.data().presupuesto}</p>
      <a href="#" class="btn btn-outline-primary btn-block" 
      onclick="VerDetalle('${doc.id}','${doc.data().nombre}','${doc.data().puntuacion}' ,'${doc.data().servicios}' 
      ,'${doc.data().presupuesto}','${doc.data().ubicacion}')" 
      >Ver detalles</a>
    </div>
  </div>
    `
    })
}

async function _mostrartodoslossitios() {

    const querySnapshot = await getTodosSitios();
    querySnapshot.forEach(doc => {
        var botones = ``
        if (doc.data().estado_validacion) {
            botones = `
            <a 
            href="#" 
            class="btn btn-outline-primary btn-block" 
            onclick="VerDetalle('${doc.id}','${doc.data().nombre}','${doc.data().puntuacion}' ,'${doc.data().servicios}' 
            ,'${doc.data().presupuesto}','${doc.data().ubicacion}')" 
            >Ver detalles</a>`
        } else {
            botones = `
            <a 
            href="#" 
            class="btn btn-outline-primary btn-block" 
            onclick="VerDetalle('${doc.id}','${doc.data().nombre}','${doc.data().puntuacion}' ,'${doc.data().servicios}' 
            ,'${doc.data().presupuesto}','${doc.data().ubicacion}')" 
            >Ver detalles</a>
            <a 
            href="#" class="btn btn-outline-primary btn-block" 
            onclick="VerificarSitio('${doc.id}')"
            >Verificar este sitìo </a>`
        }

        task_sitios.innerHTML += `
    <div class="card" style="width: 20rem;">
    <img class="card-img-top img-fluid" src="${doc.data().urlimg}" alt="Card image cap">
    <div class="card-block">
      <h4 class="card-title">${doc.data().nombre}</h4>
      <p class="card-text"><b>UBICACIÓN:</b> ${doc.data().ubicacion} </p>
      <p class="card-text"><b>PUNTUACION:</b> ${doc.data().puntuacion} </p>
      <p class="card-text"><b>SERVICIOS:</b> ${doc.data().servicios} </p>
      <p class="card-text"><b>PRESUPUETO:</b> ${doc.data().presupuesto}</p>
      <p class="card-text"><b>USUARIO :</b> ${doc.data().fk_usuario}</p>
      ${botones}
      </div>
  </div>
    `
    })

}

window.addEventListener('DOMContentLoaded', async (e) => {
    if (document.getElementById('iniciar_sesion')) {

        var user = localStorage['usuarioalmacenado'];
        if (user) {
            console.log('verificando menu : logueado');
            myVar = JSON.parse(user);
            document.getElementById('iniciar_sesion').style.display = 'none';
            document.getElementById('registrarse').style.display = 'none';
            document.getElementById('cerrar_sesion').style.display = 'block';
        } else {
            console.log('verificando menu : no logueado');
            document.getElementById('registrarse').style.display = 'block';
            document.getElementById('iniciar_sesion').style.display = 'block';
            document.getElementById('cerrar_sesion').style.display = 'none';
        }

    }
})

function VerificarSitio(id) {
    db.collection("sitios_turisticos").doc(id).update({
        estado_validacion: 1
    })
        .then(function (docRef) {
            alert('Validacion Exitosa');
            window.location.href = "index.html";
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}

function VerDetalle(Id, Nombre_sitio, Puntuacion, Servicios, Presupuesto, Ubicacion) {
    myVar = {
        id: Id,
        nombre: Nombre_sitio,
        puntuacion: Puntuacion,
        servicios: Servicios,
        presupuesto: Presupuesto,
        ubicacion: Ubicacion,
    };
    console.log(Id);
    localStorage['detallesitioalmacenado'] = JSON.stringify(myVar);
    window.location.href = "detalles.html";
}

function RegistrarPersona() {
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

function ColeccionPersona(Nombre_uno, Nombre_dos, Apellido_uno, Apellido_dos, Telefono, Correo, Clave) {
    db.collection("usuarios").doc().set({
        PrimerNombre: Nombre_uno,
        SegundoNombre: Nombre_dos,
        PrimerApellido: Apellido_uno,
        SegundoApellido: Apellido_dos,
        Telefono: Telefono,
        Usuario: Correo,
        Clave: Clave,
        TipoUsuario: 0
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

var archivo = document.getElementById('archivoregistrarsitio');
var myUsuario = 'sin usuario';

function subirImagen() {

    var user = localStorage['usuarioalmacenado'];
    if (user) {

        myUsuario = JSON.parse(user).Usuario;
        var archivoFile = archivo.files[0];
        if (archivoFile) {

            var uploadTask = storage.ref('imagenessitios/' + archivoFile.name).put(archivoFile)
                .then((img) => {
                    storage.ref('imagenessitios/' + archivoFile.name).getDownloadURL()
                        .then((UrlImg) => {

                            var Nombre_sitio = ObtenerId("nombre_sitio");
                            var Puntuacion = ObtenerId("puntuacion");
                            var Servicios = ObtenerId("servicios");
                            var Presupuesto = ObtenerId("presupuesto");
                            var Ubicacion = ObtenerId("ubicacion");
                            var EstadoValidacion = 0;
                            if (ValidarCamposVaciosSitio(Nombre_sitio, Puntuacion, Servicios,
                                Presupuesto, Ubicacion, EstadoValidacion)) {
                                ColeccionSitio(Nombre_sitio, Puntuacion, Servicios, Presupuesto, Ubicacion, EstadoValidacion, UrlImg, myUsuario);
                            }

                        });
                });

        } else {
            alert('Parece que no a seleccionado una imagen')
        }

    } else {
        alert('Parece que hay un error en tu sesión')
        window.location.href = "index.html";
    }
}

function ColeccionSitio(Nombre_sitio, Puntuacion, Servicios, Presupuesto, Ubicacion, EstadoValidacion, UrlImg, MyUsuario) {
    db.collection("sitios_turisticos").doc().set({
        nombre: Nombre_sitio,
        puntuacion: Puntuacion,
        servicios: Servicios,
        presupuesto: Presupuesto,
        ubicacion: Ubicacion,
        estado_validacion: EstadoValidacion,
        urlimg: UrlImg,
        fk_usuario: MyUsuario
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


function iniciar() {
    var user = ObtenerId("usuario")
    var clave = ObtenerId("clave")
    db.collection("usuarios").where("Usuario", "==", user).where("Clave", "==", clave)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {

                alert('HAZ INICIADO SESION CORRECTAMENTE')

                myVar = {
                    PrimerApellido: doc.data().PrimerApellido,
                    PrimerNombre: doc.data().PrimerNombre,
                    SegundoApellido: doc.data().SegundoApellido,
                    SegundoNombre: doc.data().SegundoNombre,
                    Telefono: doc.data().Telefono,
                    Usuario: doc.data().Usuario,
                    TipoUsuario: doc.data().TipoUsuario,
                };
                localStorage['usuarioalmacenado'] = JSON.stringify(myVar);
                window.location.href = "index.html";
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function ValidarCamposVaciosSitio(Nombre_sitio, Puntuacion, Servicios, Presupuesto, Ubicacion) {
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
                } else {
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