const { Router } = require('express');
const router = Router();
const control = require('../controller/Admin.controller');

router.get('/', control.inicio);
router.get('/login', control.login);
router.get('/registrarse', control.registrarse);
router.get('/registrarsitio', control.registrarsitio);
router.get('/detallessitio', control.detallessitio);
router.get('/verificarsitio', control.verificarsitio);
router.post('/registrarusuario', control.registrarusuario); 
router.post('/registrarsitiopost', control.registrarsitiopost);
router.post('/validarusuariopost', control.validarusuariopost);
router.post('/registrarmomento', control.registrarmomento);
module.exports = router;
