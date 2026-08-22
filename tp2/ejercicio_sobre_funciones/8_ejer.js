const procesarArray =(arr, fun) => {
    const res= []

    for(let i =0; i< arr.length; i++){
        res.push(fun(arr[i]))
    }
    
    return res
}

const multiplicarXDos= (num) => num*2

const arrNumeros =[1,5,9,6,4]

console.log(`array inicial ${arrNumeros}`)

const resMul = procesarArray(arrNumeros, multiplicarXDos)

console.log(`nuevo array ${resMul}`)