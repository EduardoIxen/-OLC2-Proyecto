
class Arbol {

    constructor(instruccion) {
        this.instruccion = instruccion
        this.funciones = []
        this.exception = []
        this.consola = "";
        this.tablaTsGlobal = null;
        this.struct = {};
        this.dot = "";
        this.contador = 0;
        this.tablaSimbolos = [];
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
    addTSG(value){
        this.tablaSimbolos.push(value);
    }
    getTablaSimbolos(){
        return this.tablaSimbolos;
    }

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

    getDot(raiz){
        this.dot = "";
        this.dot += "digraph {\n";
        this.dot += "n0[label=\"" + raiz.getValor().replace("\"", "\\\"") + "\"];\n";
        this.contador = 1;
        this.recorrerAST("n0",raiz);
        this.dot += "}";
        return this.dot;
    }

    recorrerAST(idPadre, nodoPadre){
        for (var hijo of nodoPadre.getHijos()) {
            var nombreHijo = "n"+ this.contador.toString();
            this.dot += nombreHijo + "[label=\"" + hijo.getValor().replace("\"", "\\\"") + "\"];\n";
            this.dot += idPadre + "->" + nombreHijo+"\n";
            this.contador += 1;
            this.recorrerAST(nombreHijo, hijo);
        }
    }
}