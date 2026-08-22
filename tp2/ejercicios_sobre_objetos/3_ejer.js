const libro = {
    titulo: "El principito",
    autor: "Antoine de Saint-Exupéry",
    anoDePublicacion: "1943",
    descripcion: function(){
        return `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut egestas auctor varius.
Nulla convallis sem at odio hendrerit ultrices. Ut ut sem eget mi posuere consequat.`
    }

}

let descripcionDelLibro= libro.descripcion()
console.log(descripcionDelLibro)