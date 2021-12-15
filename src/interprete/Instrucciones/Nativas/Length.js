class Length extends Instruction{

    constructor(identificador, row, column){
        super(row, column);
        this.type = null;
        this.identificador = identificador;
    }

    interpretar(tree, table){
        var symbol = table.getTabla(this.identificador);
        if(symbol == null){
            return new Exception("Semantico", `La variable (${this.identificador}) no existe`, this.row, this.column);
        }

        this.type = Tipo.ENTERO;
        if(symbol.typeArray == Tipo.ARRAY){
            return symbol.value.list_value.length;
        }

        return symbol.getValue().length;
    }

    getNodo(){
        var nodo = new NodoAST("LENGTH");
        var nodoDato = new NodoAST(this.symbol.getType());
        if (this.symbol.getType() == Tipo.STRING) {
            nodoDato.agregarHijo(this.symbol.getValue());
        }else if (this.symbol.typeArray == Tipo.ARRAY) {
            nodoDato.agregarHijo(this.symbol.getId());
        }else{
            return new Exception("Semantico", "Tipo de dato invalido para la funcion lenght", this.row, this.column);
        }
        nodo.agregarHijoNodo(nodoDato);
        return nodo;
    }
}