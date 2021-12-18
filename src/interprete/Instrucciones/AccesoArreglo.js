class AccesoArreglo extends Instruction{
    constructor(id, list_expression, row, column, new_value=null){
        super(row, column);
        this.id = id;
        this.list_expression = list_expression;
        this.type = null;
        this.type_init = null;
        this.new_value = new_value;
        this.value = null;
    }

    interpretar(tree, table){

        var symbol = table.getTabla(this.id);
        if (symbol == null) {
            return new Exception("Semantico", "Variable "+this.id+" no encontrada.", this.row, this.column);
        }

        this.type = symbol.getValue().type;
        this.type_init = symbol.getValue().type;

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


        var auxIndex = []
        for(var numeroIndex of this.list_expression){
            if (numeroIndex instanceof Identificador || numeroIndex instanceof Aritmetica || numeroIndex instanceof LlamadaFuncion || numeroIndex instanceof Length) {
                auxIndex.push(numeroIndex.interpretar(tree, table));
            }else{
                auxIndex.push(parseInt(numeroIndex.value));
            }
        }
        if (this.new_value == null) {
            var pruea = this.searchValue(auxIndex, symbol.value.list_value, null);
            this.value = pruea.value;
            return pruea;
        }else{ //agregar lo que copie del otro lado
            if (this.new_value instanceof Identificador) {
                var valId = this.new_value.interpretar(tree,table);
                if (this.new_value.type != symbol.getValue().type_init) {
                    return new Exception("Semántico", "Tipo de dato diferente al del arreglo.", this.row, this.column);
                }
                var newPrim = new Primitivo(this.new_value.type, valId, this.row, this.column);
                this.searchValue(auxIndex, symbol.getValue().list_value, newPrim)
            }else if(this.new_value instanceof AccesoArreglo){
                var acceso = this.new_value.interpretar(tree, table);
                if (this.new_value.type_init != symbol.getValue().type_init) {
                    return new Exception("Semántico", "Tipo de dato diferente al del arreglo.", this.row, this.column);
                }
                this.searchValue(auxIndex, symbol.getValue().list_value, acceso);
            }else if (this.new_value instanceof Primitivo) {
                if (this.new_value.type != symbol.getValue().type_init) {
                    return new Exception("Semántico", "Tipo de dato diferente al del arreglo", this.row, this.column);
                }
                this.searchValue(auxIndex, symbol.getValue().list_value, this.new_value);
            }else if (this.new_value instanceof Array) {
                for (var item of this.new_value) {
                    if (item.type != symbol.getValue().type_init) {
                        return new Exception("Semántico", "Tipo de dato diferente al del arreglo.", this.row, this.column)
                    }
                    this.searchValue(auxIndex, symbol.getValue().list_value, this.new_value)
                }
            }
            
        }
        /*if (this.new_value != null) {
            return null;
        }
        console.log("fin",pruea);
        return pruea;*/
        return null;
    }

    searchValue(list_position, list_value, value){

        if (list_position.length != 0 && list_value != undefined) {
            if (value == null) {
                return this.searchValue(list_position.slice(1), list_value[list_position[0]], value)
            }
            if (list_position.length == 1 && list_value[list_position[0]] != undefined) {
                if (value.value instanceof Primitivo) {
                    list_value[list_position[0]] = value.value
                }else{
                    list_value[list_position[0]] = value

                }
                return null
            }else if (list_position.length != 1) {
                return this.searchValue(list_position.slice(1), list_value[list_position[0]], value)
            }else{
                return new Exception("Semantico", "La posicion deseada esta fuera del rango valido.", this.row, this.column);
            }
        }

        if (list_value == undefined) {
            return new Exception("Semántico", "Indice fuera de rango", this.row, this.column);
        }
        return list_value;
    }

    getNodo(){
        var nodo = new NodoAST("ACCESO-ARREGLO");
        nodo.agregarHijo(this.id.toString());
        var exp = new NodoAST("EXRESION DE LAS DIMENCIONES");
        for(var expre of this.list_expression){
            exp.agregarHijoNodo(expre.getNodo());
        }
        nodo.agregarHijoNodo(exp);
        return nodo;
    }
}