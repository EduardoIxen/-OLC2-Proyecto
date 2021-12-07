
class Arbol{
    
    constructor(instruccion){
        this.instruccion = instruccion
        this.funciones = []
        this.exception = []
        this.consola = ""
        this.tablaTsGlobal = null;
    }

    getInstruccion(){ return this.instruccion; }
    setInstruccion(instruccion){ this.instruccion = instruccion; }

    getException(){ return this.exception; }
    setException(exception){ this.exception = exception; }

    getConsola(){ return this.consola; }
    setConsola(consola){ this.consola = consola; }
    updateConsola(cadena){ this.consola += cadena; }

    getTablaTsGlobal(){ return this.tablaTsGlobal; }
    setTablaTsGlobal(tablaTsGlobal){ this.tablaTsGlobal = tablaTsGlobal;}
}