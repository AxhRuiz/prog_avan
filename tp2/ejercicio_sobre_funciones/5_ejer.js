const actualizarEdad =(per, nEdad) =>{
    per.edad = nEdad
    return per
}

const crearPersona = (nombre, edad) => {
    return{
        nombre: nombre,
        edad: edad
    }
}
let persona = crearPersona(`Axel`, 28)
console.log(persona)
actualizarEdad(persona, 29)
console.log(`\nPersona con la edad modificada\n`)
console.log(persona)