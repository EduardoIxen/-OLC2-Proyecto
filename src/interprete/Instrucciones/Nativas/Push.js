class Push extends Instruction{

    constructor(identificador, expression, row, column){
        super(row, column);
        this.type = null;
        this.identificador = identificador;
        this.expression = expression;
        this.valueAST = null;
    }

    interpretar(tree, table){
        var symbol = table.getTabla(this.identificador);
        if(symbol == null){
            return new Exception("Semantico", `La variable (${this.identificador}) no existe`, this.row, this.column);
        }

        if (this.expression instanceof Identificador) {
            var result = this.expression.interpretar(tree,table);
            if (symbol.getValue().type == this.expression.type) {
                this.type = symbol.getValue().type;
                this.valueAST = result;
                symbol.getValue().list_value.push(new Primitivo(this.expression.type, result, this.expression.row, this.column));
                return null;
            }
        }

        if (this.expression.type == null) {
            var value = this.expression.interpretar(tree, table);
            if (symbol.getValue().type == value.type_init) {
                this.type = symbol.getValue().type;
                this.valueAST = value.list_value;
                symbol.getValue().list_value.push(value.list_value);
            }else{
                return new Exception("Semántico", "Tipos de datos incompatibles.", this.row, this.column);
            }
        }else{
            if (symbol.getValue().type == this.expression.type) {
                this.type = symbol.getValue().type;
                this.valueAST = this.expression.value;
                symbol.getValue().list_value.push(this.expression);
            }else{
                return new Exception("Semántico", "Tipos de datos incompatibles.", this.row, this.column);
            }
        }
        return null;
    }

    getNodo(){
        var nodo = new NodoAST("PUSH");
        nodo.agregarHijo(this.identificador.toString());
        var nodoDato = new NodoAST(this.expression.value);
        nodo.agregarHijoNodo(nodoDato);
        return nodo;
    }
}