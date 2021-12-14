
class Arbol {

    constructor(instruccion) {
        this.instruccion = instruccion
        this.funciones = []
        this.exception = []
        this.consola = "";
        this.tablaTsGlobal = null;
        this.struct = {};
    }

    getInstruccion() { return this.instruccion; }
    setInstruccion(instruccion) { this.instruccion = instruccion; }

    getException() { return this.exception; }
    setException(exception) { this.exception = exception; }

    getConsola() { return this.consola; }
    setConsola(consola) { this.consola = consola; }
    updateConsola(cadena) { this.consola += cadena; }

    getTablaTsGlobal() { return this.tablaTsGlobal; }
    setTablaTsGlobal(tablaTsGlobal) { this.tablaTsGlobal = tablaTsGlobal; }

    getFunciones() { return this.funciones; }
    getFuncion(id){
        for(var funcion of this.funciones){
            if (funcion.id == id) {
                return funcion;
            }
        }
        return null;
    }
    addFuncion(funcion){ this.funciones.push(funcion); }

    addStruct(struct){
        
        if(struct.id in this.struct){
            return new Exception("Semantico",`Variable ${struct.getId()} ya existe en Struct.`, struct.getRow(), struct.getColumn());
        }

        this.struct[struct.getId()] = struct.getAtributos();
        return null
        
    }

    getStruct(id){
        if(id in this.struct){
            return this.struct[id]
        }
        return null;
    }
}