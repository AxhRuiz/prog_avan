
const producto={
    nombre: `producto`,
    precio: 45215215,
    disponible: `Disponible`
}

console.log(producto)

delete producto.disponible
console.log(`\n------Se elimino la propiedad "Disponible"------\n`)
console.log(producto)