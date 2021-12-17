class Primitivo extends Instruction{

    constructor(type, value, row, column){
        super(row,column);
        this.type = type;
        this.value = value;
    }

    interpretar(tree, table){
        return this.value;
    }

    getNodo(){
        var nodo = new NodoAST("PRIMITIVO");
        var nodoDato = new NodoAST(this.verTipo(this.type));
        nodoDato.agregarHijo(this.value.toString());
        nodo.agregarHijoNodo(nodoDato);
        return nodo;
    }

    verTipo(tipoDato){
        if (tipoDato == Tipo.ENTERO) {
            return "INT";
        }else if (tipoDato == Tipo.DECIMAL) {
            return "DOUBLE";
        }else if (tipoDato == Tipo.STRING) {
            return "STRING";
        }else if (tipoDato == Tipo.BOOLEANO) {
            return "BOOLEAN";
        }else if (tipoDato == Tipo.CARACTER) {
            return "CHAR";
        }else if (tipoDato == Tipo.IDENTIFICADOR) {
            return "IDENTIFICADOR";
        }else if (tipoDato == Tipo.NULO) {
            return "NULO";
        }else if (tipoDato == Tipo.ARRAY) {
            return "ARRAY";
        }else if (tipoDato == Tipo.STRUCT) {
            return "STRUCT";
        }else if (tipoDato == Tipo.VOID) {
            return "VOID";
        }
        return tipoDato.toString();
    }

    compilar(tree, table){
        return this.value;
    }
}
