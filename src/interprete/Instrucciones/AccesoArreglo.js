class AccesoArreglo extends Instruction{
    constructor(id, list_expression, row, column){
        super(row, column);
        this.id = id;
        this.list_expression = list_expression;
        this.type = null;
        this.type_init = null;
    }

    interpretar(tree, table){
        var symbol = table.getTabla(this.id);
        if (symbol == null) {
            return new Exception("Semantico", "Variable "+this.id+" no encontrada.", this.row, this.column);
        }

        this.type = symbol.type;
        if (symbol.getType() != Tipo.ARRAY) {
            return new Exception("Semantico", "Variable " + this.id + " no es un arreglo.", this.row, this.column);
        }

        /*var num = this.list_expression.interpretar(tree, table);
        console.log("num", symbol.getValue().list_value[num])
        this.type_init = symbol.getValue().list_value[num].type
        if (symbol.getValue().list_value[num].value instanceof Array) {
            this.type_init 
        }
        return symbol.getValue().list_value[num].value*/
        console.log("aaa",symbol.getValue().list_value)
        var auxIndex = []
        for(var numeroIndex of this.list_expression){
            console.log(numeroIndex.value);
            auxIndex.push(parseInt(numeroIndex.value));
        }
        console.log(auxIndex);
        //console.log("search", this.searchValue(auxIndex, symbol.getValue().list_value, null));
        var pruea = this.searchValue(auxIndex, symbol.getValue().list_value, null);
        console.log("---",pruea)
        return pruea;
    }

    searchValue(list_position, list_value, value){
        console.log("ls val",list_value)
        console.log("ls pos",list_position)
        console.log("ls pos1",list_position.length)
        console.log("ls pos2",list_position.length != 0)
        if (list_position.length != 0) {
            console.log("entro")
            if (value === null) {
                console.log("1",list_value[list_position[0]])
                return this.searchValue(list_position.slice(1), list_value[list_position[0]], value)
            }
            if (list_position.length === 1) {
                console.log("2",list_value[list_position[0]])
                list_value[list_position[0]] = value
                return null
            }else if (list_position.length !== 1) {
                console.log("3",list_value[list_position[0]])
                return this.searchValue(list_position.slice(1), list_value[list_position[0]], value)
            }else{
                return new Exception("Semantico", "La posicion deseada esta fuera del rango valido.", this.row, this.column);
            }
        }
        
        return list_value;
    }
}