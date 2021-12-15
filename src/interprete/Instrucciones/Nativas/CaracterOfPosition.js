class CaracterOfPosition extends Instruction{
    
    constructor(identificador, expression, row, column){
        super(row, column);
        this.expression = expression;
        this.identificador = identificador;
        this.type = null;

    }


    interpretar(tree, table){
        var value = this.expression.interpretar(tree, table);
        if(value instanceof Exception) return value;

        if(this.expression.type != Tipo.ENTERO){
            return new Exception("Semantico", `Tipo de dato diferente de INT en caracterOfPosition`, this.row, this.column);
        }

        var symbol = table.getTabla(this.identificador);
        if(symbol == null){
            return new Exception("Semantico", `La variable (${this.identificador}) no existe`, this.row, this.column);
        }

        if(symbol.getType() != Tipo.STRING){
            return new Exception("Semantico", "Tipo de dato de caracterOfPosition no es Tipo String", this.row, this.column);
        }

        if(0<=value && value<symbol.getValue().length){
            this.type = symbol.getType();
            return symbol.getValue()[value];
        }else{
            return new Exception("Semantico", `Error de posición ${value} en caracterOfPosition`, this.row, this.column);
        }


    }

    getNodo(){
        var nodo = new NodoAST("CARACTER-OF-POSITION");
        var nodoDato = new NodoAST(this.symbol.getType());
        nodoDato.agregarHijo(this.symbol.getValue());
        nodo.agregarHijoNodo(nodoDato);
        return nodo;
    }

}