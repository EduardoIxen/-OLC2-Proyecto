class Parse extends Instruction{
    
    constructor(type, expression, row, column){
        super(row, column);
        this.type = type;
        this.expression = expression;
    }

    interpretar(tree, table){
        // here code...
        var value = this.expression.interpretar(tree, table);
        if(value instanceof Exception) return value;
        console.log(value);
        try {
            
            if(this.type == Tipo.ENTERO){
                
                var a = parseInt(value);
                if(a>=0 || a<=0){
                    return parseInt(value);
                }
                return new Exception("Semantico", `No se puede convertir ${value} a INT..`, this.row, this.column);

            }else if(this.type == Tipo.DECIMAL){
                var a = parseFloat(value);
                if(a>=0 || a<=0){
                    return parseFloat(value)*1.0;
                }
                return new Exception("Semantico", `No se puede convertir ${value} a FLOAT..`, this.row, this.column);
            }else if(this.type == Tipo.BOOLEANO){
                if(value == '1'){
                    return Boolean(value);
                }else if(value == '0'){
                    return Boolean(value);
                }else{
                    return new Exception("Semantico", "Tipo de dato de Parse incorrecto.", this.row, this.column);
                }
            }else{
                return new Exception("Semantico", "Tipo de dato de Parse incorrecto.", this.row, this.column);
            }
        } catch (error) {
            return new Exception("Semantico", "Expresion incorrecta en Parse, no se puede convertir.", this.row, this.column);
        }

    }
}