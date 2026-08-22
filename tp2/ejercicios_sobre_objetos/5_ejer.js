const producto={
    nombre: `producto`,
    precio: 45215215,
    disponible: `Disponible`
}

for( key in producto){
    console.log(key+ `:` , producto[key])
}

producto.precio= 1900
console.log(`\n----------------Actualizacion de precio----------------\n`)
for( key in producto){
    console.log(key+ `:` , producto[key])
}