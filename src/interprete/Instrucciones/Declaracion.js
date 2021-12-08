class Declaracion extends Instruction{

    constructor(type, id, expression=null, row, column){
        super(row, column)
        this.type = type;
        this.id = id;
        this.expression = expression;
        this.value = null;
    }

    interpretar(tree, table){
        if (this.expression != null) {
            let value = this.expression.interpretar(tree, table)  //obtenemos el valor de la expresion para asignarselo a la vatiable
            if (value instanceof Exception) return value;
            if (this.type != value.type) return new Exception("Error semantico", "Tipos incompatibles", this.row, this.column);
            this.value = value;

            var simbolo = Simbolo(this.id, this.type, this.row, this.column, this.value, "agregar ambito");
            var result = table.setTabla(simbolo);

            if (result instanceof Exception) return result;
            return null;
        }
    }
}