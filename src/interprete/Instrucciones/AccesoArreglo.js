class AccesoArreglo extends Instruction{
    constructor(id, list_expression, row, column, new_value=null){
        super(row, column);
        this.id = id;
        this.list_expression = list_expression;
        this.type = null;
        this.type_init = null;
        this.new_value = new_value;
    }

    interpretar(tree, table){
        var symbol = table.getTabla(this.id);
        if (symbol == null) {
            return new Exception("Semantico", "Variable "+this.id+" no encontrada.", this.row, this.column);
        }

        this.type = symbol.type;

        if(symbol.typeArray != null){
            if (symbol.typeArray != Tipo.ARRAY) {
                return new Exception("Semantico", "Variable " + this.id + " no es un arreglo.", this.row, this.column);
            }    
        }else{
            if(symbol.value != null){
                if(symbol.value.typeArray != Tipo.ARRAY){
                    return new Exception("Semantico", "Variable " + this.id + " no es un arreglo.", this.row, this.column);
                }
            }
        }

        /*var num = this.list_expression.interpretar(tree, table);
        console.log("num", symbol.getValue().list_value[num])
        this.type_init = symbol.getValue().list_value[num].type
        if (symbol.getValue().list_value[num].value instanceof Array) {
            this.type_init 
        }
        return symbol.getValue().list_value[num].value*/

        var auxIndex = []
        for(var numeroIndex of this.list_expression){
            if (numeroIndex instanceof Identificador || numeroIndex instanceof Aritmetica) {
                auxIndex.push(numeroIndex.interpretar(tree, table));
            }else{
                auxIndex.push(parseInt(numeroIndex.value));
            }
        }
        //console.log("search", this.searchValue(auxIndex, symbol.getValue().list_value, null));  a [1][0][1]
        if (this.new_value == null) {
            var pruea = this.searchValue(auxIndex, symbol.getValue().list_value, null);
            
        }else{
            if (this.new_value.type != null) {
                //console.log(this.new_value.list_expression[0].type)
                //console.log(symbol.getValue().type)
                if (this.new_value.type == symbol.getValue().type_init) { //a[0] = 1
                    var pruea = this.searchValue(auxIndex, symbol.getValue().list_value, this.new_value);
                }
                else if (this.new_value instanceof Array) {  //a[1] = [1,2,3,4]
                    for(var val of this.new_value){
                        if (val.type != symbol.getValue().type_init) {
                            return new Exception("Semántico", "Tipo de datos incompatibes 1 .", this.row, this.column);
                        }
                    }
                    var pruea = this.searchValue(auxIndex, symbol.getValue().list_value, this.new_value);
                }   
                else{
                    return new Exception("Semántico", "Tipo de datos incompatibes. 2", this.row, this.column);
                }
            }else{

                if (this.new_value.list_expression[0].type == symbol.getValue().type) {
                    if (this.new_value instanceof AccesoArreglo) {
                        this.new_value = this.new_value.interpretar(tree, table);
                    }
                    var pruea = this.searchValue(auxIndex, symbol.getValue().list_value, this.new_value);
                }else{
                    return new Exception("Semántico", "Tipo de datos incompatibes. 3", this.row, this.column);
                }
            }

        }
        
        return pruea;
    }

    searchValue(list_position, list_value, value){
        if (list_position.length != 0) {
            if (value === null) {
                return this.searchValue(list_position.slice(1), list_value[list_position[0]], value)
            }
            if (list_position.length === 1) {
                list_value[list_position[0]] = value

                return null
            }else if (list_position.length !== 1) {
                return this.searchValue(list_position.slice(1), list_value[list_position[0]], value)
            }else{
                return new Exception("Semantico", "La posicion deseada esta fuera del rango valido.", this.row, this.column);
            }
        }

        if (list_value === undefined) {
            return new Exception("Semántico", "Indice fuera de rango", this.row, this.column);
        }
        return list_value;
    }
}