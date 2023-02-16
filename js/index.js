let items = [];

/* Se traen los datos del JSON local y se agregan */
fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        items = data;
        cargarProductos(items);
    })

/* Class para cargar el array con los items */
class Productos {
  constructor(id, nombre, categoria, imagen, precio) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.imagen = imagen;
    this.precio = precio;
  }
}

//DOM - "Llamadas"
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-menu");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");


//Esta funcion recorre el array de productos/items y los va cargando a la seccion del html.
function cargarProductos(itemsElegidos) {
  //Esto vacía el contenedor de los productos.
  contenedorProductos.innerHTML=" "; 
  //Se ejecuta forEach de productos elegidos.
  itemsElegidos.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
        <img class="producto-imagen" src="${item.imagen}" alt="">
        <div class="producto-detalles">
          <h3 class="producto-titulo">${item.nombre}</h3>
          <p class="producto-precio">$${item.precio}</p>
          <button class="producto-agregar" id="${item.id}">Agregar</button>
        </div>
      `;
    
    contenedorProductos.append(div);
  })
  actualizarBotonesAgregar()
}


botonesCategorias.forEach(boton => {
  //Acá, ponemos "active" al boton de la categoría en que clickeamos.
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach(boton => boton.classList.remove("active"));
    e.currentTarget.classList.add("active");

    //Uso if/else para cargar los productos por categoria.
    if(e.currentTarget.id != "Todos") {
      //Utilizo find para cambiar los titulos de acuerdo a la categoria donde estemos.
      const productosCategoria = items.find(item => item.categoria === e.currentTarget.id);
      tituloPrincipal.innerText = productosCategoria.categoria;
    
    //Se crea un array con el filter para filtrar productos de acuerdo a la categoria.  
    const itemsBoton = items.filter(item => item.categoria === e.currentTarget.id);
    cargarProductos(itemsBoton);
    } else {
      tituloPrincipal.innerText = "Todos los productos";
        cargarProductos(items);
    }
  });
});

function actualizarBotonesAgregar() {
   botonesAgregar = document.querySelectorAll(".producto-agregar");
  
   botonesAgregar.forEach(boton => {
    boton.addEventListener("click", agregarAlCarrito);
   });
}


let productosEnCarrito;
const productosEnCarritoLS = JSON.parse(localStorage.getItem("productos-en-carrito"));
// Si hay productos dentro de lo que traemos del localStorage, los metemos en productosEnCarrito. Si no, vaciamos. 
  if (productosEnCarritoLS) {
    productosEnCarrito = productosEnCarritoLS;
    actualizarNumerito();
  } else {
    productosEnCarrito = [];
  }


function agregarAlCarrito(e) {
  /* Alert al agregar producto */
    Toastify({
      text: "Producto Agregado",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #37D5D6, #36096D)",
        borderRadius: "2rem",
      },
      offset: {
        x: "1.5rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
        y: "1.5rem" // vertical axis - can be a number or a string indicating unity. eg: '2em'
      },
      onClick: function(){} // Callback after click
    }).showToast();

    //
    const idBoton = e.currentTarget.id;
    const productoAgregado = items.find(item => item.id === idBoton);

    //Chequeo si el producto existe en el carrito o no. Si existe, aumenta cantidad. Si no existe, lo agrega.
    if(productosEnCarrito.some(item => item.id === idBoton )) {
        const index = productosEnCarrito.findIndex(item => item.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
      productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }
    
    actualizarNumerito();

    //Guardamos en localStorage para utilizar desde la pagina "carrito"
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

//Actualiza numerito del carrito
function actualizarNumerito() {
  let nuevoNumerito = productosEnCarrito.reduce((acc, item) => acc + item.cantidad, 0);
  numerito.innerText = nuevoNumerito;
}