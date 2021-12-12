class Println extends Instruction{
    
    constructor(expression, row, column){
        super(row, column);
        this.expression = expression;
    }

    interpretar(tree, table){
        var value = this.expression.interpretar(tree, table);
        if (this.expression.type == Tipo.ARRAY) {
            var value = this.expression.interpretar(tree, table);
            //value.list_value lista valores pasar a recorrer
            value = this.recorrerArray(value.list_value);
        }else{
            var value = this.expression.interpretar(tree, table);
        }
        
        if(value instanceof Exception) return value;
        tree.updateConsola(value+'\n');
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