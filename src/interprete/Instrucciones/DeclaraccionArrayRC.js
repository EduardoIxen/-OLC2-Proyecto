class DeclaracionArrayRC extends Instruction{
    constructor(type, id, idRC, copy,row, column){
        super(row, column);
        this.type = type;
        this.id = id;
        this.idRC = idRC;
        this.copy = copy;
        this.typeArray = Tipo.ARRAY;
        this.type_init = type;
        this.list_value = [];
        this.list_expresion = [];
    }

    interpretar(tree, table){
        var symbol = table.getTabla(this.idRC);
        if (symbol == null) {
            return new Exception("Semantico", "Variable "+this.id+" no encontrada.", this.row, this.column);
        }
        if (this.type != symbol.type) {
            return new Exception("Semantico", "Tipos de datos incompatibles.", this.row, this.column);
        }
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

        if (this.copy == false) {
            this.list_expresion = symbol.getValue().list_expresion;
            this.list_value = symbol.getValue().list_value;
            var newSymbol = new Simbolo(this.id, this.type, this.row, this.column, symbol.getValue());
            newSymbol.typeArray = Tipo.ARRAY;
            var result = table.setTabla(newSymbol);
        }else{
            var cloneFood = JSON.parse(JSON.stringify(symbol));
            var temp2 = this.recorrerArray(cloneFood.value.list_expresion);
            var aaa = new DeclaracionArray(this.type, this.id, temp2, this.row, this.column);
            aaa.type = cloneFood.value.type;
            aaa.list_value = this.recorrerArray(cloneFood.value.list_value);
            this.list_value = aaa.list_value;
            aaa.row = this.row;
            aaa.column = this.column;
            var newSymbol = new Simbolo(this.id, this.type, this.row, this.column, aaa);
            newSymbol.typeArray = Tipo.ARRAY;
            var result = table.setTabla(newSymbol);
        }
        

        if (result instanceof Exception) {
            return result;
        }
        return null;
    }

    recorrerArray(listaValores){
        var aux = [];
        for(var temp of listaValores){
            if (temp instanceof Array) {
                aux.push(this.recorrerArray(temp));
            }else{
                aux.push(new Primitivo(temp.type, temp.value, this.row, this.column));
            }
        }
        return aux;
    }

    getNodo(){
        var nodo = new NodoAST("DECLARACION ARREGLO");
        nodo.agregarHijo(this.verTipo(this.type.toString()));
        //nodo.agregarHijo(this.list_expresion);
        nodo.agregarHijo(this.id);
        var exp = new NodoAST("EXPRESION");
        if (this.copy) {
            exp.agregarHijo("#");
        }
        exp.agregarHijo(this.idRC.toString());
        nodo.agregarHijoNodo(exp);
        return nodo;
    }

    verTipo(tipoDato){
        if (tipoDato == Tipo.ENTERO) {
            return "INT";
        }else if (tipoDato == Tipo.DECIMAL) {
            return "DOUBLE";
        }else if (tipoDato == Tipo.STRING) {
            return "STRING";
        }else if (tipoDato == Tipo.BOOLEANO) {
            return "BOOLEAN";
        }else if (tipoDato == Tipo.CARACTER) {
            return "CHAR";
        }else if (tipoDato == Tipo.IDENTIFICADOR) {
            return "IDENTIFICADOR";
        }else if (tipoDato == Tipo.NULO) {
            return "NULO";
        }else if (tipoDato == Tipo.ARRAY) {
            return "ARRAY";
        }else if (tipoDato == Tipo.STRUCT) {
            return "STRUCT";
        }else if (tipoDato == Tipo.VOID) {
            return "VOID";
        }
        return tipoDato.toString();
    }

    getTabla(tree, table, padre){
        var salida = "";
        var dict = {}
        dict['Identificador'] =this.id.toString();
        dict['Tipo'] = "Arreglo";
        dict['Tipo2'] = this.type.toString().replace("TIPO.", "ARREGLO->");
        dict['Entorno'] = padre.toString();
        dict['Valor'] = this.recorrerArray2(this.list_value);
        dict['Fila'] =this.row.toString();
        dict['Columna'] =this.column.toString();
        tree.addTSG(dict);
        return salida;
    }

    recorrerArray2(listaValores){
        var aux = [];
        for(var temp of listaValores){
            if (temp instanceof Array) {
                aux.push(this.recorrerArray2(temp));
            }else{
                aux.push(temp.value);
            }
        }
        return "["+aux.toString()+"]";
    }
}