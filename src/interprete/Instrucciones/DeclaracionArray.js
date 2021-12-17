class DeclaracionArray extends Instruction{

    constructor(type_init, id, list_expresion,row, column, id_array = null){
        super(row, column);
        this.type = null;
        this.typeArray = Tipo.ARRAY;
        this.type_init = type_init;
        this.id = id;
        this.list_value = [];
        this.list_expresion = list_expresion;
        this.id_array = id_array;
        this.type_correct = true;
    }

    interpretar(tree, table){
        
        this.type = this.type_init;
        if (this.list_expresion != []) {
            if (this.list_expresion instanceof AccesoArreglo) {
                var result2 = this.list_expresion = this.list_expresion.interpretar(tree, table);
                if (result2 instanceof Exception) {
                    return result2;
                }
            }
            this.list_value = this.getValues(this.list_expresion, tree, table);
            if (this.type_correct) {
                var symbol = new Simbolo(this.id, this.type, this.row, this.column, this);
                symbol.typeArray = Tipo.ARRAY;
            }
            else{
                return new Exception("Semantico", "Datos incompatibles con el tipo del arreglo.", this.row, this.column);
            }
        }
        var result = table.setTabla(symbol);
        if (result instanceof Exception) {
            return result;
        }
        return null;
    }

    getValues(list_values, tree, table){
        var expressions = []
        if (list_values instanceof Array) {
            for(var item of list_values){
                expressions.push(this.getValues(item, tree, table));
            }
        }else{
            var value = list_values.interpretar(tree, table);
            if (list_values.type != this.type_init) {
                this.type_correct = false;
            }
            var primitive = new Primitivo(list_values.type, value, this.row, this.column, "ambito");
            return primitive;
        }

        if (expressions == undefined) {
            return new Exception("Semantico", "Index inexistente.", this.row, this.column);
        }
        return expressions;
    }

    getNodo(){
        var nodo = new NodoAST("DECLARACION ARREGLO");
        nodo.agregarHijo(this.verTipo(this.type.toString()));
        //nodo.agregarHijo(this.list_expresion);
        nodo.agregarHijo(this.id);
        var exp = new NodoAST("EXPRESION");
        try {
            for(var expre of this.list_expresion){
                exp.agregarHijoNodo(expre.getNodo());
            }
        } catch (error) {
            exp.agregarHijo("lista expresiones");
        }
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
        dict['Entorno'] =padre.toString();
        /*var temp = [];
        for(var expre of this.list_expresion){
            console.log(expre.value)
            temp.push(expre.value.toString())
        }*/
        dict['Valor'] = this.recorrerArray(this.list_expresion);
        dict['Fila'] =this.row.toString();
        dict['Columna'] =this.column.toString();
        //tree.getTablaTsGlobal().push(dict);
        tree.addTSG(dict);
        return salida;
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