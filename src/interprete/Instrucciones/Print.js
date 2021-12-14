class Print extends Instruction{
    
    constructor(expression, row, column){
        super(row, column);
        this.expression = expression;
    }

    interpretar(tree, table){
        var value = this.expression.interpretar(tree, table);
        if (this.expression.type == Tipo.ARRAY && !(value instanceof Array)) {
            //value = this.recorrerArray(value.list_value);
            
            try {
                value = value.value;
            } catch (error) {
                value = new Exception("semático", "Index malo", this.row, this.column);
            }
        }
        else if (this.expression.type == Tipo.ARRAY && (value instanceof Array)) {
            value = this.recorrerArray(value);
        }
        
        if(value instanceof Exception) return value;
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