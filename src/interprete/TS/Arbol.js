
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
        this.generator = null;
        this.nativas = false;
        this.nativeConca = false;
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
        this.tablaSimbolos.push(this.verTipo(value));
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
        var nodos = [];
        var aristas = [];
        var nivelAST = 1;
        nodos.push({id:"n0", label:"RAIZ", level:0})
        this.recorrerAST("n0",raiz, nodos, aristas, nivelAST);
        this.dot += "}";
        return {dot: this.dot, nodosG:nodos, aristasG:aristas};
    }

    recorrerAST(idPadre, nodoPadre, nodos, aristas, nivelAST){
        for (var hijo of nodoPadre.getHijos()) {
            var nombreHijo = "n"+ this.contador.toString();
            this.dot += nombreHijo + "[label=\"" + hijo.getValor().replace("\"", "\\\"") + "\"];\n";
            var dict = {}
            dict['id'] = nombreHijo;
            dict['label'] = hijo.getValor().replace("\"", "\\\"");
            dict['level'] = nivelAST;
            nodos.push(dict);
            this.dot += idPadre + "->" + nombreHijo+"\n";
            var arista = {}
            arista['from'] = idPadre;
            arista['to'] = nombreHijo;
            aristas.push(arista);
            this.contador += 1;
            this.recorrerAST(nombreHijo, hijo, nodos, aristas, nivelAST+1);
        }
    }


    getGenerator(){ return this.generator; }
    setGenerator(generator){ this.generator = generator; }

    verTipo(tipoDato){
        if (tipoDato['Tipo2'] == Tipo.ENTERO) {
            tipoDato['Tipo2'] = "INT";
        }else if (tipoDato['Tipo2'] == Tipo.DECIMAL) {
            tipoDato['Tipo2'] = "DOUBLE";
        }else if (tipoDato['Tipo2'] == Tipo.STRING) {
            tipoDato['Tipo2'] = "STRING";
        }else if (tipoDato['Tipo2'] == Tipo.BOOLEANO) {
            tipoDato['Tipo2'] = "BOOLEAN";
        }else if (tipoDato['Tipo2'] == Tipo.CARACTER) {
            tipoDato['Tipo2'] = "CHAR";
        }else if (tipoDato['Tipo2'] == Tipo.IDENTIFICADOR) {
            tipoDato['Tipo2'] = "IDENTIFICADOR";
        }else if (tipoDato['Tipo2'] == Tipo.NULO) {
            tipoDato['Tipo2'] = "NULO";
        }else if (tipoDato['Tipo2'] == Tipo.ARRAY) {
            tipoDato['Tipo2'] = "ARRAY";
        }else if (tipoDato['Tipo2'] == Tipo.STRUCT) {
            tipoDato['Tipo2'] = "STRUCT";
        }else if (tipoDato['Tipo2'] == Tipo.VOID) {
            tipoDato['Tipo2'] = "VOID";
        }
        return tipoDato;
    }
}