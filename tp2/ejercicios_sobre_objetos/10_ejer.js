const libro = {
    titulo: "El principito",
    autor: "Antoine de Saint-Exupéry",
    _anoDePublicacion: "1943",
    descripcion: function(){
        return `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut egestas auctor varius.
Nulla convallis sem at odio hendrerit ultrices. Ut ut sem eget mi posuere consequat.`
    },

    get GanoDePublicacion(){
        return this._anoDePublicacion
    },

    set SanoDePublicacion(v){
        this._anoDePublicacion=v
    }

}
console.log(`----Ano original----`)
console.log(libro.GanoDePublicacion)
libro.SanoDePublicacion= 1955
console.log(`----Ano modificado----`)
console.log(libro.GanoDePublicacion)