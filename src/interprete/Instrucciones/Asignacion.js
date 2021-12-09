class Asignacion extends Instruction{
    constructor(id, expression, row, column){
        super(row, column);
        this.id = id;
        this.expression = expression;
    }

    interpretar(tree, table){
        var value = this.expression.interpretar(tree, table);
        if (value instanceof Exception) {
            return value;
        }
        var simbolo = new Simbolo(this.id, this.expression.type, this.row, this.column, value, "ambito");
        var result = table.updateTabla(simbolo);
        if (result instanceof Exception) {
            return result;
        }
        return null;
    }
}