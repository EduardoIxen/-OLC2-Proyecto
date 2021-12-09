class Return extends Instruction{

    constructor(expression, row, column){
        super(row, column);
        this.expression = expression;
        this.type = null;
        this.result = null;
    }

    interpretar(tree, table){
        var result = this.expression.interpretar(tree, table);
        if(result instanceof Exception) return result;

        this.type = this.expression.type; // Almacena el tipo de la expresion.
        this.result = result;             // Almacena el resultado de la expresión a interpretar.
        return this; 
    }
}