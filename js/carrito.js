//Traemos Array del localStorage
let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

//DOM - "Llamadas"
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");


//Esta funcion recorre el array "productosEnCarrito" y los va cargando a la seccion del html del carrito.
function cargarProductosCarrito() {
    //
    if(productosEnCarrito && productosEnCarrito.length > 0) {
        //Esto es para que nos aparezca el msj de "carrito vacío" o "comprado".
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML="";

        productosEnCarrito.forEach(item => {
            
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${item.imagen}" alt="${item.nombre}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${item.nombre}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                <small>Cantidad</small>
                <p>${item.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                <small>Precio</small>
                <p>$${item.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                <small>Subtotal</small>
                <p>$${item.precio * item.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${item.id}"><i class="bi bi-trash3"></i></button>
            `;

            contenedorCarritoProductos.append(div);
        })
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }

    actualizarBotonesEliminar();
    actualizarTotal();
}

cargarProductosCarrito()

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    botonesEliminar.forEach(boton => {
     boton.addEventListener("click", eliminarDelCarrito);
    });
 
 }

 function eliminarDelCarrito (e) {
    /* Alert al eliminar producto */
    Toastify({
        text: "Producto Eliminado",
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


    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(item => item.id === idBoton);

    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito()

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
 }

botonVaciar.addEventListener("click", vaciarCarrito);

 function vaciarCarrito() {
    /* Alert al vaciar carrito */
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: 'Se borrarán todos los productos seleccionados',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                productosEnCarrito.length = 0;
                localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
                cargarProductosCarrito();
            } 
          })
}

 function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0); 
    total.innerText = `$${totalCalculado}`;
 }


 botonComprar.addEventListener("click", comprarCarrito);

 function comprarCarrito() {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
    
 }