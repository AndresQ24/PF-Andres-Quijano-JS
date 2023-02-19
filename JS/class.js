//CONSTRUCTOR CLASS
class Cancion {
  constructor(id, nombreCancion, artista, precio, imagen, enlace) {
    //PROPERTIES OR ATTRIBUTES OF OUR CLASS
    (this.id = id),
      (this.nombreCancion = nombreCancion),
      (this.artista = artista),
      (this.precio = precio),
      (this.imagen = imagen),
      (this.enlace = enlace),
      (this.cantidad = 1);
  }
  //METHODS
  sumarUnidad() {
    this.cantidad += 1;
  }
  restarUnidad() {
    this.cantidad = this.cantidad - 1;
    return this.cantidad;
  }
}

let bibliotecaDeCanciones = [];

const cargarbibliotecaDeCanciones = async () => {
  //RELATIVE PATH: FROM HTML TO JSON AND OPEN WITH LIVE SERVER
  const response = await fetch("canciones.json");
  const data = await response.json();
  for (let cancion of data) {
    let cancionNueva = new Cancion(
      cancion.id,
      cancion.nombreCancion,
      cancion.artista,
      cancion.precio,
      cancion.imagen,
      cancion.enlace
    );
    bibliotecaDeCanciones.push(cancionNueva);
  }  
  localStorage.setItem(
    "bibliotecaDeCanciones",
    JSON.stringify(bibliotecaDeCanciones)
  );
};
//POSSIBILITY THAT SOMETHING EXISTS IN STORAGE OR THAT IT DOES NOT EXIST
//CONDITIONAL THAT EVALUATES IF THERE IS SOMETHING
if (localStorage.getItem("bibliotecaDeCanciones")) {
  //IF THERE IS SOMETHING IN THE STORAGE ENTER THE IF

  for (let cancion of JSON.parse(
    localStorage.getItem("bibliotecaDeCanciones")
  )) {
    let libroStorage = new Cancion(
      cancion.id,
      cancion.nombreCancion,
      cancion.artista,
      cancion.precio,
      cancion.imagen,
      cancion.enlace
    );
    bibliotecaDeCanciones.push(libroStorage);
  }
} else {
  cargarbibliotecaDeCanciones();
}
