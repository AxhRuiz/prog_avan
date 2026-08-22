function tienePropiedad(prop, obj){
    let tieneProp= false
    for(key in obj){
        if(key == prop){
            tieneProp = true
        }
    }
    return tieneProp
}

const producto={
    nombre: `producto`,
    precio: 45215215,
    disponible: `Disponible`
}

console.log(tienePropiedad(`autor`, producto))