class Print extends Instruction{
    
    constructor(expression, row, column){
        super(row, column);
        this.expression = expression;
    }

    interpretar(tree, table){
        var value = this.expression.interpretar(tree, table);
        console.log(value.typeArray)
        if(value instanceof Exception) return value;
        if (value.typeArray == Tipo.ARRAY && !(value instanceof DeclaracionArray) && !(value instanceof Array)) {
            //value = this.recorrerArray(value.list_value);
            
            try {
                value = value.value;
            } catch (error) {
                value = new Exception("semático", "Index malo", this.row, this.column);
            }
        }else if (value.typeArray == Tipo.ARRAY && (value instanceof Array)) {
            value = this.recorrerArray(value);
        }else if (value.typeArray == Tipo.ARRAY && value.typeArray == Tipo.ARRAY) {
            value = this.recorrerArray(value.list_value);
        }else if (value instanceof Primitivo) {
            value = value.value;
        }
        tree.updateConsola(value);
    }

    recorrerArray(listaValores){
        var aux = [];
        for(var temp of listaValores){
            if (temp instanceof Array) {
                aux.push(this.recorrerArray(temp));
            }else{
                aux.push(temp.value);
            }
        }
        return "["+aux.toString()+"]";
    }
}