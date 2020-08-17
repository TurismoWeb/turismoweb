
const task_sitios = document.getElementById('task_datos_sitio');

window.addEventListener('DOMContentLoaded', async (e) => {
    var user = localStorage['detallesitioalmacenado'];
    if (user) {
        myVar = JSON.parse(user);

        task_sitios.innerHTML += `
        <div class="titulo"><p><b>Sitio:</b>${myVar.nombre}  </p></div>
        <div class="titulo"><p><b>Puntuacion:</b>${myVar.puntuacion}  </p></div>
        <div class="titulo"><p><b>Servicio:</b> ${myVar.servicios} </p></div>
        <div class="titulo"><p><b>Presupuesto:</b> ${myVar.presupuesto} </p></div>
   
 
    `
    } else {
        console.log('error no se esta guardando el sitio en detalles');
      
    }

})
