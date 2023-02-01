//33098976-9a4e668950f6d69c57ca79f17
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registroPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
  formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
  e.preventDefault();
  const terminoBusquedaBusqueda = document.querySelector('#termino').value;
  if (terminoBusquedaBusqueda === '') {
    mostrarAlerta('Agrega un termino de busqueda', 'error')
    return;
  }
  buscarImagenes();
}


function mostrarAlerta(mensaje, tipo) {
  Swal.fire({
    icon: tipo,
    title: 'Oops...',
    text: mensaje,
  })

}

function buscarImagenes() {
  const termino = document.querySelector('#termino').value;
  const apiKey = '33098976-9a4e668950f6d69c57ca79f17';
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`;

  fetch(url)
    .then(resultado => {
      return resultado.json();
    })
    .then(datos => {
      totalPaginas = calcularPagina(datos.totalHits);
      console.log(totalPaginas);
      mostrarImagenes(datos.hits);
    })

}
function calcularPagina(total) {
  return parseInt(Math.ceil(total / registroPorPagina));
}

// * Generador que va a registrar la cantidad de elementos de acuerdo a las paginas

function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function mostrarImagenes(imagenes) {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }

  // * Iterar sobre el arreglo de imagnes y contruir el HTML
  imagenes.forEach(imagen => {
    const { previewURL, likes, views, largeImageURL } = imagen;
    resultado.innerHTML += `
    <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
      <div class="bg-white rounded-md">
      <img class="w-full rounded-md" src="${previewURL}">
          <div class="p-4">
            <p class="font-bold"> ${likes} <span class="font-light">Me gusta</span> </p>
            <p class="font-bold"> ${views} <span class="font-light">Veces Vista</span> </p>
            <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1 " href="${largeImageURL}" target="_blank rel="noopener noreferrer"">
               Ver Imagen
            </a>
           </div >
      </div >
    </div >
   `;

  });

  // * Limpiar paginador previo

  while (paginacionDiv.firstChild) {
    paginacionDiv.removeChild(paginacionDiv.firstChild);
  }

  // * Generamos el nuevo HTML

  imprimirPaginador();
}

function imprimirPaginador() {
  iterador = crearPaginador(totalPaginas);
  //console.log(iterador.next().value);
  while (true) {
    const { value, done } = iterador.next();
    if (done) return;

    //* Caso contario, generar un boton por cada elemento en el generadoor
    const boton = document.createElement('A');
    boton.href = '#';
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');

    boton.onclick = () => {
      paginaActual = value;
      buscarImagenes();
    }

    // * Intectar en el HTML que se vea en la web
    paginacionDiv.appendChild(boton);
  }

}
