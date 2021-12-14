class Declaracion extends Instruction{

    constructor(type, id, expression=null, row, column){
        super(row, column);
        this.type = type;
        this.id = id;
        this.expression = expression;
    }

    interpretar(tree, table){
        var value = null;
     
        if (this.expression != null) {
            if (this.expression != "null") {
                value = this.expression.interpretar(tree, table);  //obtenemos el valor de la expresion para asignarselo a la vatiable
                if (value instanceof Exception) return value;

            }else{
                value = "null";
            }

            if (this.type != this.expression.type) {
                if (this.expression.type == Tipo.ARRAY) {
                    if (this.type != value.type) {
                        return new Exception("Semantico", "Expresion incompatible con el tipo de dato de la variable.", this.row, this.column);
                    }
                }else{
                    return new Exception("Semantico", "Expresion incompatible con el tipo de dato de la variable.", this.row, this.column);
                }
            }
            var simbolo = new Simbolo(this.id, this.type, this.row, this.column, value, "agregar ambito");
            var result = table.setTabla(simbolo);
    
            if (result instanceof Exception) return result;
            return null;

        }else{
            if (this.type == Tipo.ENTERO) {
                value = 0;
            }else if (this.type == Tipo.DECIMAL) {
                value = 0.0;
            } else if (this.type == Tipo.STRING) {
                value = "null";
            } else if (this.type == Tipo.BOOLEANO) {
                value = false;
            } else if (this.type == Tipo.CARACTER) {
                value = String.fromCharCode(0);
            }
            for (let identificador of this.id) {
                let simbolo = new Simbolo(identificador, this.type, this.row, this.column, value, "agregar ambito");
                let result = table.setTabla(simbolo);
        
                if (result instanceof Exception) return result;
            }
            return null;
        }
    }
}