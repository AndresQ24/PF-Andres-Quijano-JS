//PROJECT WITH DOM:

//VARIABLES
let cancionesDiv = document.getElementById("canciones");
let guardarCancionBtn = document.getElementById("guardarCancionBtn");
let inputBuscador = document.querySelector("#buscador");
let coincidencia = document.getElementById("coincidencia");
let selectOrden = document.getElementById("selectOrden");
let botonCarrito = document.getElementById("botonCarrito");
let modalBodyCarrito = document.getElementById("modal-bodyCarrito");
let precioTotal = document.getElementById("precioTotal");

let loaderTexto = document.getElementById("loaderTexto");
let loader = document.getElementById("loader");
let reloj = document.getElementById("reloj");
let botonFinalizarCompra = document.getElementById("botonFinalizarCompra");

//ARRAY SHOPPING CART
let productosEnCarrito = [];
if (localStorage.getItem("carrito")) {
  for (let cancion of JSON.parse(localStorage.getItem("carrito"))) {
    //QUANTITY OF STORAGE IS CAPTURED
    let cantStorage = cancion.cantidad;

    let CancionStorage = new cancion(
      cancion.id,
      cancion.nombreCancion,
      cancion.artista,
      cancion.precio,
      cancion.imagen,
      cancion.enlace
    );

    CancionStorage.cantidad = cantStorage;
    productosEnCarrito.push(CancionStorage);
  }
} else {
  productosEnCarrito = [];
  localStorage.setItem("carrito", productosEnCarrito);
}

//FUNCTIONS

function verCatalogo(array) {
  //BEFORE IT PRINTS AGAIN, THE DIV IS RESET

  cancionesDiv.innerHTML = "";

  for (let cancion of array) {
    //WE CREATED THE CATALOG WITH THE CARD THAT CONTAIN THE INFORMATION
    let nuevaCancionDiv = document.createElement("div");
    nuevaCancionDiv.className = "col-12 col-md-6 col-lg-4 my-3";
    nuevaCancionDiv.innerHTML = `
        <div id="${cancion.id}" class="card" style="width: 28rem;">
            <img class="card-img-top img-fluid" style="height: 250px;"src="assets/${
              cancion.imagen
            }" alt="${cancion.nombreCancion} de ${cancion.artista}">
            <div class="card-body">
                <h4 class="card-title">${cancion.nombreCancion}</h4>
                <p>Autor: ${cancion.artista}</p>                
                <p class="${cancion.precio <= 400 && "ofertaLibro"}">Precio: ${
      cancion.precio
    }</p>
                <button id="agregarBtn${
                  cancion.id
                }" class="btn btn-outline-success">Agregar al carrito</button>
                <a href="${
                  cancion.enlace
                }" target="_blank" class="btn btn-success">Play</a>             
            </div>
        </div> 
        `;
    cancionesDiv.appendChild(nuevaCancionDiv);
    let agregarBtn = document.getElementById(`agregarBtn${cancion.id}`);
    agregarBtn.onclick = () => {
      agregarAlCarrito(cancion);
    };
  }
}

function agregarAlCarrito(cancion) {
  //WE ADD IT TO THE VARIABLE: productosEnCarrito
  productosEnCarrito.push(cancion);

  //WE SET THE STORAGE
  localStorage.setItem("carrito", JSON.stringify(productosEnCarrito));
}

function cargarCancion(array) {
  let inputNombreCancion = document.getElementById("cancionInput");
  let inputArtista = document.getElementById("artistaInput");
  let inputPrecio = document.getElementById("precioInput");
  let URLInput = document.getElementById("URLInput");

  //WE MAKE IT WITH THE CONSTRUCTOR FUNCTION
  const nuevaCancion = new Cancion(
    array.length + 1,
    inputNombreCancion.value,
    inputArtista.value,
    parseInt(inputPrecio.value),
    "Vinilo (1).jpg",
    URLInput.value
  );

  //PUSH IT TO THE ARRAY
  array.push(nuevaCancion);
  //SAVE IN THE STORAGE:
  localStorage.setItem("bibliotecaDeCanciones", JSON.stringify(array));
  verCatalogo(array);
  let formAgregarCancion = document.getElementById("formAgregarCancion");

  formAgregarCancion.reset();

  //ADD TO TOASTIFY:
  Toastify({
    text: `La cancion ${nuevaCancion.nombreCancion} de ${nuevaCancion.artista} ha sido agregada al stock`,
    duration: 2500,
    gravity: "top",
    position: "right",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
      color: "black",
    },
  }).showToast();
}

function buscarInfo(buscado, array) {
  let busquedaArray = array.filter(
    (cancion) =>
      cancion.nombreCancion.toLowerCase().includes(buscado.toLowerCase()) ||
      cancion.artista.toLowerCase().includes(buscado.toLowerCase())
  );

  busquedaArray.length == 0
    ? ((coincidencia.innerHTML = `<h3>No hay coincidencias con su búsqueda</h3>`),
      verCatalogo(busquedaArray))
    : ((coincidencia.innerHTML = ""), verCatalogo(busquedaArray));
}

function cargarProductosCarrito(array) {
  modalBodyCarrito.innerHTML = "";

  //FOR EACH TO PRINT THE CARD
  array.forEach((productoCarrito) => {
    modalBodyCarrito.innerHTML += `
      <div class="card border-primary mb-3" id ="productoCarrito${
        productoCarrito.id
      }" style="max-width: 540px;">
          <img class="card-img-top" height="300px" src="assets/${
            productoCarrito.imagen
          }" alt="${productoCarrito.nombreCancion}">
          <div class="card-body">
                  <h4 class="card-title">${productoCarrito.nombreCancion}</h4>
              
                  <p class="card-text">Precio unitario: $${
                    productoCarrito.precio
                  }</p> 
                  <p class="card-text">Total de unidades: ${
                    productoCarrito.cantidad
                  }</p> 
                  <p class="card-text">Sub Total: ${
                    productoCarrito.precio * productoCarrito.cantidad
                  }</p> 

                  <button class= "btn btn-success" id="botonSumarUnidad${
                    productoCarrito.id
                  }"><i class=""></i>+1</button>
                  <button class= "btn btn-danger" id="botonEliminarUnidad${
                    productoCarrito.id
                  }"><i class=""></i>-1</button> 

                  <button class= "btn btn-danger" id="botonEliminar${
                    productoCarrito.id
                  }"><i class="fas fa-trash-alt"></i></button>
          </div>    
      </div>
      `;
  });

  //SECOND FOR EACH ADD FUNCTIONS
  array.forEach((productoCarrito) => {
    //FUNCTION BUTTON DELETE
    document
      .getElementById(`botonEliminar${productoCarrito.id}`)
      .addEventListener("click", () => {
        //IT IS DELETED FROM THE DOM
        let cardProducto = document.getElementById(
          `productoCarrito${productoCarrito.id}`
        );
        cardProducto.remove();
        //IT IS DELETED FROM THE ARRAY FINDINF THE PRODUCT TO REMOVE
        let productoEliminar = array.find(
          (cancion) => cancion.id == productoCarrito.id
        );

        //SEARCH THE INDEX
        let posicion = array.indexOf(productoEliminar);        
        array.splice(posicion, 1);
        
        //IT IS DELETED FROM THE DOM
        localStorage.setItem("carrito", JSON.stringify(array));
        
        //RECALCULATE TOTAL
        compraTotal(array);
      });

    //ADD UNIT - SUMAR UNIDAD
    document
      .getElementById(`botonSumarUnidad${productoCarrito.id}`)
      .addEventListener("click", () => {
        productoCarrito.sumarUnidad();
        localStorage.setItem("carrito", JSON.stringify(array));
        cargarProductosCarrito(array);
      });

    //SUBTRACT UNIT - RESTAR UNIDAD
    document
      .getElementById(`botonEliminarUnidad${productoCarrito.id}`)
      .addEventListener("click", () => {
        let cantidad = productoCarrito.restarUnidad();

        if (cantidad < 1) {
          //DELETE IT FROM THE DOM
          let cardProducto = document.getElementById(
            `productoCarrito${productoCarrito.id}`
          );
          cardProducto.remove();

          //SEARCH THE INDEX
          let posicion = array.indexOf(productoCarrito);

          array.splice(posicion, 1);

          localStorage.setItem("carrito", JSON.stringify(array));

          compraTotal(array);
        } else {
          localStorage.setItem("carrito", JSON.stringify(array));
        }
        cargarProductosCarrito(array);
      });
  });
  compraTotal(array);
}

function agregarAlCarrito(cancion) {
  //EVALUATE WHETHER THE PRODUCT ALREADY EXISTS OR NOT
  let cancionAgregada = productosEnCarrito.find(
    (elem) => elem.id == cancion.id
  );
  if (cancionAgregada == undefined) {
    //ADD TO THE productosEnCarrito VARIABLE
    productosEnCarrito.push(cancion);
    //SET THE STORAGE
    localStorage.setItem("carrito", JSON.stringify(productosEnCarrito));

    //SWEETALERT FOR THE USER EXPERIENCE
    Swal.fire({
      title: "Ha agregado un producto :D",
      text: `La cancion ${cancion.nombreCancion} de ${cancion.artista} ha sido agregada`,
      icon: "info",
      confirmButtonText: "Gracias!",
      confirmButtonColor: "green",
      timer: 3000,
      //FOR THE IMAGE
      imageUrl: `assets/${cancion.imagen}`,
      imageHeight: 200,
    });
  } else {
    //THE PRODUCT IS ALREADY FOUND
    Swal.fire({
      text: `La cancion ${cancion.nombreCancion} de ${cancion.artista} ya existe en el carrito`,
      icon: "info",
      timer: 1500,
      showConfirmButton: false,
    });
  }
}
function compraTotal(array) {
  let total = array.reduce(
    (acc, productoCarrito) =>
      acc + productoCarrito.precio * productoCarrito.cantidad,
    0
  );
  //TERNARY TO SHOW IN THE HTML
  total == 0
    ? (precioTotal.innerHTML = `No hay productos agregados`)
    : (precioTotal.innerHTML = `El total del carrito es <strong>${total}</strong>`);
  return total;
}
function finalizarComprar(array) {
  Swal.fire({
    title: "Está seguro de realizar la compra",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Sí, seguro",
    cancelButtonText: "No, no quiero",
    confirmButtonColor: "green",
    cancelButtonColor: "red",
  }).then((result) => {
    if (result.isConfirmed) {
      let totalFinalizar = compraTotal(array);
      Swal.fire({
        title: "Compra realizada",
        icon: "success",
        confirmButtonColor: "green",
        text: `Muchas gracias por su compra ha adquirido nuestros productos. Por un total de ${totalFinalizar}`,
      });

      productosEnCarrito = [];
      localStorage.removeItem("carrito");
    } else {
      Swal.fire({
        title: "Compra no realizada",
        icon: "info",
        text: `La compra no ha sido realizada! Atención sus productos siguen en el carrito :D`,
        confirmButtonColor: "green",
        timer: 3500,
      });
    }
  });
}
//FUNCTIONS TO ORDER THE LIBRARY
function ordenarMenorMayor(array) {
  //WE USE A COPY OF THE ORIGINAL ARRAY, SO AS NOT TO MODIFY THE LIBRARY OF SONGS
  const menorMayor = [].concat(array);
  menorMayor.sort((param1, param2) => param1.precio - param2.precio);
  verCatalogo(menorMayor);
}

function ordenarMayorMenor(array) {
  //ARRAY THAT RECEIVES AND COPIES IT
  const mayorMenor = [].concat(array);
  mayorMenor.sort((a, b) => b.precio - a.precio);
  verCatalogo(mayorMenor);
}

function ordenarAlfabeticamenteArtista(array) {
  const ordenadoAlfabeticamente = [].concat(array);
  //TO SORT STRINGS
  //ASCENDING A-Z SHAPE
  ordenadoAlfabeticamente.sort((a, b) => {
    if (a.artista > b.artista) {
      return 1;
    }
    if (a.artista < b.artista) {
      return -1;
    }
    return 0;
  });
  verCatalogo(ordenadoAlfabeticamente);
}

function ordenarAlfabeticamenteCancion(array) {
  const ordenadoAlfabeticamente = [].concat(array);

  ordenadoAlfabeticamente.sort((a, b) => {
    if (a.nombreCancion > b.nombreCancion) {
      return 1;
    }
    if (a.nombreCancion < b.nombreCancion) {
      return -1;
    }

    return 0;
  });
  verCatalogo(ordenadoAlfabeticamente);
}

//THE EVENTS CAPTURED BY THE CLICK:
guardarCancionBtn.addEventListener("click", () => {
  cargarCancion(bibliotecaDeCanciones);
});

inputBuscador.addEventListener("input", () => {
  buscarInfo(inputBuscador.value.toLowerCase(), bibliotecaDeCanciones);
});
//SELECT TO SORT
selectOrden.addEventListener("change", () => {
  
  if (selectOrden.value == "1") {
    ordenarMayorMenor(bibliotecaDeCanciones);
  } else if (selectOrden.value == "2") {
    ordenarMenorMayor(bibliotecaDeCanciones);
  } else if (selectOrden.value == "3") {
    ordenarAlfabeticamenteArtista(bibliotecaDeCanciones);
  } else if (selectOrden.value == "4") {
    ordenarAlfabeticamenteCancion(bibliotecaDeCanciones);
  } else {
    verCatalogo(bibliotecaDeCanciones);
  }
});

botonCarrito.addEventListener("click", () => {
  cargarProductosCarrito(productosEnCarrito);
});

botonFinalizarCompra.addEventListener("click", () => {
  finalizarComprar(productosEnCarrito);
});

//ADDITIONAL
setTimeout(() => {
  loaderTexto.innerText = "";
  loader.remove();
  verCatalogo(bibliotecaDeCanciones);
}, 3000);

setInterval(() => {
  let horaActual = DateTime.now().toLocaleString(DateTime.TIME_24_WITH_SECONDS);
  reloj.innerHTML = `${horaActual}`;
}, 1000);

verCatalogo(bibliotecaDeCanciones);

//LUXON LIBRARIE
const DateTime = luxon.DateTime;
const fechaHoy = DateTime.now();
let fecha = document.getElementById("fecha");
let fechaMostrar = fechaHoy.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
fecha.innerHTML = `${fechaMostrar}`;

// -Data loading is done through a local JSON file (see canciones.json file).

// -Taking into account the previous feedback, delivery is made through git hub and all comments are changed to English, seeking to leave the most relevant and additional, this description is also left in English at the end of the main.js file

// -When building the card of the object, the link variable is included, which allows generating a play button that redirects to YouTube based on the corresponding song; more detail in class.js file and lines 66 to 68 in main.js

// -There is the loadSong function that allows you to add a new song, due to server issues, the option for the user to load their own image was removed; However, the link option was left to redirect to the song that the user has chosen. Lines 87 to 101 in main.js

// -Includes a series of events that allow you to save the song search by the name of the song or artist, lines 376 to 406 in main.js

// -Use of the Luxon library lines 422 to 427 in main.js

// -Sorts alphabetically by both author and song, lines 344 to 374 in main.js

// -It is sorted by price both ascending and descending, lines 329 to 341 in main.js

// -The main.js file includes all the functions corresponding to the shopping cart that allow adding or removing it from the process.

// -Data loading is done through a local JSON file (see canciones.json file).

// -Taking into account the previous feedback, delivery is made through git hub and all comments are changed to English, seeking to leave the most relevant and additional, this description is also left in English at the end of the main.js file

// -When building the card of the object, the link variable is included, which allows generating a play button that redirects to YouTube based on the corresponding song; more detail in class.js file and lines 66 to 68 in main.js

// -There is the loadSong function that allows you to add a new song, due to server issues, the option for the user to load their own image was removed; However, the link option was left to redirect to the song that the user has chosen. Lines 87 to 101 in main.js

// -Includes a series of events that allow you to save the song search by the name of the song or artist, lines 376 to 406 in main.js

// -Use of the Luxon library lines 422 to 427 in main.js

// -Sorts alphabetically by both author and song, lines 344 to 374 in main.js

// -It is sorted by price both ascending and descending, lines 329 to 341 in main.js

// -The main.js file includes all the functions corresponding to the shopping cart that allow adding or removing it from the process.