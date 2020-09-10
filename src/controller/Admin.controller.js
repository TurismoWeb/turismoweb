const { firebase, admin, storage } = require('../configfirebase')
const { database } = require('firebase-admin');
const controlador = {};

const bucket = storage.bucket('turismo2-4b07d.appspot.com');

/* var defaultStorage = admin.storage();
var bucket = defaultStorage.bucket('turismo2-4b07d.appspot.com'); */

const db = firebase.firestore();
const url = require('url');


const getSitiosVerificados = () => db.collection('sitios_turisticos')
    .where("estado_validacion", "==", 1).get();

const getTodosSitios = () => db.collection('sitios_turisticos').get();

const getSitioEspecifico = (idd) => db.collection('sitios_turisticos')
    .where("nombre", "==", idd).get();

const getMomentosSitio = (idd) => db.collection('momentos_sitios')
    .where("fksitio", "==", idd).get();


controlador.inicio = (req, res) => {
    console.log('-------------- Presiono el  controlador.inicio ---------------')
    _mostrarsitiosverificados(res, req);
}

controlador.login = (req, res) => {
    console.log('-------------- Presiono el  controlador.login ---------------')
    res.render('./admin/login');
}

controlador.registrarse = (req, res) => {
    console.log('-------------- Presiono el  controlador.registrarse ---------------')
    res.render('./admin/registrarse');
}

controlador.registrarsitio = (req, res) => {
    console.log('-------------- Presiono el  controlador.registrarsitio ---------------')
    if (req.query.user) {
        console.log(req.query.user);
        res.render('./admin/registrarsitio', { user: req.query.user, rol: req.query.rol });
    } else {
        console.log('debe iniciar sesión para registrar sitio')
        res.redirect('/login');
    }

}

controlador.detallessitio = async (req, res) => {
    console.log('-------------- Presiono el post controlador.detallessitio ---------------')
    console.log(req.query.sitio);
    console.log(req.query.user);

    const querySnapshot = await getSitioEspecifico(req.query.sitio);

    const sitiob = [];
    const momentos_sitios = [];

    querySnapshot.forEach(async (doc) => {

        const document = {
            id: doc.id,
            puntuacion: doc.data().puntuacion,
            presupuesto: doc.data().presupuesto,
            fk_usuario: doc.data().fk_usuario,
            ubicacion: doc.data().ubicacion,
            urlimg: doc.data().urlimg,
            servicios: doc.data().servicios,
            estado_validacion: doc.data().estado_validacion,
            nombre: doc.data().nombre,
            user: req.query.user
        };
        sitiob.push(document);

        const querySnapshot = await getMomentosSitio(doc.id);
        querySnapshot.forEach(doc2 => {
            const document2 = {
                id: doc2.id,
                urlimg: doc2.data().urlimagen,
                fkusuario: doc2.data().fkusuario,
                experiencia: doc2.data().experiencia
            };
            momentos_sitios.push(document2);

        })

        console.log(sitiob);
        console.log(momentos_sitios);
        res.render('./admin/detallesitio.hbs', { user: req.query.user, rol: req.query.rol, sitio: sitiob, momentos: momentos_sitios });

    })
}


controlador.registrarusuario = (req, res) => {
    console.log('-------------- Presiono el post controlador.registrarusuario ---------------')
    console.log(req.body)

    var Nombre_uno = req.body.nombre_uno;
    var Nombre_dos = req.body.nombre_dos;
    var Apellido_uno = req.body.apellido_uno;
    var Apellido_dos = req.body.apellido_dos;
    var Telefono = req.body.telefono;
    var Correo = req.body.correo;
    var Clave = req.body.clave;
    var CalveConfirmada = req.body.clave_confirmada;

    if (ValidarCamposVacios(Nombre_uno, Apellido_uno, Apellido_dos, Telefono, Correo, Clave, CalveConfirmada)) {
        db.collection("usuarios").doc(req.body.correo).set({
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
                console.log('ALERT : REGISTRO EXITOSO');
                console.log("CONSOLE: Usuario registrado: ");
                var us = encodeURIComponent(req.body.correo);
                res.redirect('/?user=' + us);
            })
            .catch(function (error) {
                console.log("CONSOLE: Error registrando usuario: ", error);
            });
    } else {
        console.log("ALERT: NO SE VALIDO BIEN LOS CAMPOS: ");
    }
}

controlador.registrarsitiopost = async (req, res) => {
    console.log('-------------- Presiono el post controlador.registrarsitiopost ---------------')
    console.log(req.body)
    var User = req.query.user;
    var Rol = req.query.rol;
    var UrlImg = '';
    var archivoFile = req.body.archivoregistrarsitio;

    if (archivoFile) {
        console.log('Entro al archivo punto file true');

        await bucket.upload('./src/public/img/' + archivoFile, {
            destination: 'imagenessitios/' + archivoFile,
            metadata: {
                contentType: 'image/jpeg'
            }
        }).then((data) => {
            let file = data[0]
            file.getSignedUrl({
                action: 'read',
                expires: '03-17-2025'
            }, function (err, urlres) {
                if (err) {
                    console.log('Hubo un error cargando sitio, en carga de imagen');
                    console.error(err);
                    return;
                } else {
                    UrlImg = urlres;
                    console.log(urlres);

                    var Nombre_sitio = req.body.nombre_sitio;
                    var Puntuacion = req.body.puntuacion;
                    var Servicios = req.body.servicios;
                    var Presupuesto = req.body.presupuesto;
                    var Ubicacion = req.body.ubicacion;
                    var EstadoValidacion = 0;

                    if (ValidarCamposVaciosSitio(Nombre_sitio, Puntuacion, Servicios,
                        Presupuesto, Ubicacion, EstadoValidacion)) {
                        db.collection("sitios_turisticos").doc().set({
                            nombre: Nombre_sitio,
                            puntuacion: Puntuacion,
                            servicios: Servicios,
                            presupuesto: Presupuesto,
                            ubicacion: Ubicacion,
                            estado_validacion: EstadoValidacion,
                            urlimg: UrlImg,
                            fk_usuario: User
                        })
                            .then(function (docRef) {
                                console.log('ALERT : REGISTRO EXITOSO');
                                console.log("CONSOLE: Sítio registrado: ");
                                var us = encodeURIComponent(User);
                                var rool = encodeURIComponent(Rol);
                                res.redirect(url.format({
                                    pathname: "/",
                                    query: {
                                        "rol": rool,
                                        "user": us
                                    }
                                }));
                            })
                            .catch(function (error) {
                                console.log("CONSOLE: Error registrando sítio: ", error);
                            });
                    } else {
                        console.log("ALERT: NO SE VALIDO BIEN LOS CAMPOS: ");
                    }
                }
            })
        })

    } else {
        console.log("ALERT: NO SELECCIONO IMAGEN ");
    }
}

controlador.registrarmomento = async (req, res) => {
    console.log('-------------- Presiono el post controlador.registrarsmomento ---------------')
    console.log(req.body)
    console.log(req.query.user)
    console.log(req.query.idsitio)
    var archivoFile = req.body.archivoregistrarmomento;

    if (req.query.user) {

        if (archivoFile) {
            console.log('Entro al archivo punto file true');

            await bucket.upload('./src/public/img/' + archivoFile, {
                destination: 'imagenesmomentos/' + archivoFile,
                metadata: {
                    contentType: 'image/jpeg'
                }
            }).then((data) => {
                let file = data[0]
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-17-2025'
                }, function (err, urlres) {
                    if (err) {
                        console.log('Hubo un error cargando sitio, en carga de imagen');
                        console.error(err);
                        return;
                    } else {
                        UrlImg = urlres;
                        console.log(urlres);

                        var Experiencia = req.body.experiencia;
                        var User = req.query.user;
                        var Sitio = req.query.idsitio;

                        if (Experiencia.length != 0) {
                            db.collection("momentos_sitios").doc().set({
                                experiencia: Experiencia,
                                urlimagen: UrlImg,
                                fksitio: Sitio,
                                fkusuario: User

                            })
                                .then(function (docRef) {
                                    console.log('ALERT : REGISTRO EXITOSO');
                                    console.log("CONSOLE: momento registrado: ");
                                    res.redirect('back');
                                })
                                .catch(function (error) {
                                    console.log("CONSOLE: Error registrando momento: ", error);
                                });
                        } else {
                            console.log("ALERT: NO SE VALIDO BIEN LOS CAMPOS: ");
                        }



                    }
                })
            })

        } else {
            console.log("ALERT: NO SELECCIONO IMAGEN ");
        }

    } else {
        console.log('debe iniciar sesión para registrar un momento')
        res.redirect('/login');
    }



}

controlador.validarusuariopost = (req, res) => {
    console.log('-------------- Presiono el post controlador.validarusuariopost ---------------')

    console.log(req.body);
    var user = req.body.usuario;
    var clave = req.body.contrasena;
    db.collection("usuarios").where("Usuario", "==", user).where("Clave", "==", clave)
        .get()
        .then(function (querySnapshot) {
            var validacion = 0;

            querySnapshot.forEach(function (doc) {
                console.log('ALERT : HA INICIADO CORRECTAMENTE');
                console.log('CONSOLE : validación de usuario exitosa');
                validacion = 1;

                res.redirect(url.format({
                    pathname: "/",
                    query: {
                        "rol": doc.data().TipoUsuario,
                        "user": doc.data().Usuario
                    }
                }));


            });
            if (validacion == 0) {
                console.log('ALERT : USUARIO O CONTRASEÑA INCORRECTA');
                console.log('CONSOLE : validación de usuario rechazada');
            }

        })
        .catch(function (error) {
            console.log("ALERT : ALGO A FALLADO, INTENTALO NUEVAMENTE ");
            console.log("CONSOLE : hubo un fallo al validar usuario: ", error);
        });
}

controlador.verificarsitio = (req, res) => {
    console.log('-------------- Presiono el post controlador.verificarsitio ---------------')
    console.log('id del sitio enviado')
    console.log(req.query.idsitio)
    var id = req.query.idsitio;

    db.collection("sitios_turisticos").doc(id).update({
        estado_validacion: 1
    })
        .then(function (docRef) {
            console.log('Se valido exitosamente el sitio');
            res.redirect('back');
        })
        .catch(function (error) {
            console.log("CONSOLE: Error validando sitio: ", error);
            res.redirect('back');
        });

}

async function _mostrarsitiosverificados(res, req) {
    var querySnapshot = null;
    var User = req.query.user;
    var Rol = req.query.rol;

    if (Rol) {
        if (Rol == 1) {
            console.log('cargando sitios : administrador');
            querySnapshot = await getTodosSitios();
        } else {
            console.log('cargando sitios : no administrador');
            querySnapshot = await getSitiosVerificados();
        }
    } else {
        console.log('cargando sitios : no loguedo');
        querySnapshot = await getSitiosVerificados();
    }

    const documents = [];
    const documentssliders = [];
    var i = 0;
    querySnapshot.forEach(doc => {
        const document = {
            id: doc.id,
            puntuacion: doc.data().puntuacion,
            presupuesto: doc.data().presupuesto,
            fk_usuario: doc.data().fk_usuario,
            ubicacion: doc.data().ubicacion,
            urlimg: doc.data().urlimg,
            servicios: doc.data().servicios,
            estado_validacion: doc.data().estado_validacion == 0 ? 1 : null,
            estado_activeslider: i == 0 ? 1 : null,
            nombre: doc.data().nombre,
            rol: Rol,
            user: User

        };
        if (i < 3) {
            documentssliders.push(document);
            i++;
        }
        documents.push(document);
    })


    //console.log(documents);
    res.render('index', { sitios: documents, sitiossliders: documentssliders, user: User, rol: Rol });
}


function ValidarCamposVacios(Nombre_uno, Apellido_uno, Apellido_dos, Telefono, Correo, Clave, CalveConfirmada) {
    var Comprobar = true;
    if (Nombre_uno.length == 0) {
        console.log("CONSOLE: Debe Ingresar el Primer Nombre");
        Comprobar = false;
    } else {
        if (Apellido_uno.length == 0) {
            console.log("CONSOLE: Debe Ingresar el Primer Apellido");
            Comprobar = false;
        } else {
            if (Apellido_dos.length == 0) {
                console.log("CONSOLE: Debe Ingresar el Segundo Apellido");
                Comprobar = false;
            } else {
                if (Telefono.length == 0) {
                    console.log("CONSOLE: Debe Ingresar el Telefono");
                    Comprobar = false;
                } else {
                    if (Correo.length == 0) {
                        console.log("CONSOLE: Debe Ingresar el ");
                        Comprobar = false;
                    } else {
                        if (Clave.length == 0) {
                            console.log("CONSOLE: Debe Ingresar la contraseña");
                            Comprobar = false;
                        } else {
                            if (CalveConfirmada.length == 0) {
                                console.log("CONSOLE: Debe Confirmar la contraseña");
                            }
                        }
                    }
                }
            }
        }
    }
    return Comprobar;
}

function ValidarCamposVaciosSitio(Nombre_sitio, Puntuacion, Servicios, Presupuesto, Ubicacion) {
    var Comprobar = true;
    if (Nombre_sitio.length == 0) {
        console.log("Debe Ingresar el Nombre del sitio");
        Comprobar = false;
    } else {
        if (Puntuacion.length == 0) {
            console.log("Debe Ingresar una puntuación");
            Comprobar = false;
        } else {
            if (Servicios.length == 0) {
                console.log("Debe detallar los servicios");
                Comprobar = false;
            } else {
                if (Presupuesto.length == 0) {
                    console.log("Debe ingresar un presupuesto estimado");
                    Comprobar = false;
                } else {
                    if (Ubicacion.length == 0) {
                        console.log("Debe ingresar la ubicacion");
                        Comprobar = false;
                    }
                }
            }
        }
    }
    return Comprobar;
}



module.exports = controlador;
