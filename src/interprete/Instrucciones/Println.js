class Println extends Instruction{
    
    constructor(expression, row, column){
        super(row, column);
        this.expression = expression;
    }

    interpretar(tree, table){
        var value = this.expression.interpretar(tree, table);
        console.log("valuep",value);
        console.log("exprp",this.expression);
        if ((this.expression.type == Tipo.ARRAY && value.type == Tipo.ARRAY)) {
            //var value = this.expression.interpretar(tree, table);
            //value.list_value lista valores pasar a recorrer
            value = this.recorrerArray(value.list_value);
        }else if (this.expression.type == Tipo.ARRAY && !(value instanceof Array)) {
            var value2 = value.interpretar(tree, table);
            value = value2;
        }else if (this.expression.type == Tipo.ARRAY && (value instanceof Array)) {
            value = this.recorrerArray(value);
            console.log("lista array",value);
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