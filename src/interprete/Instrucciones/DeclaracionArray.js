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
        nodo.agregarHijo(this.type.toString());
        nodo.agregarHijo(this.list_expresion);
        nodo.agregarHijo(this.id);
        var exp = new NodoAST("EXPRESION");
        for(var expre of this.list_expresion){
            exp.agregarHijoNodo(expre.getNodo());
        }
        nodo.agregarHijoNodo(exp);
        return nodo;
    }
}