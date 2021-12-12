class DeclaracionArray extends Instruction{
    constructor(type_init, id, list_expresion,row, column, id_array = null){
        super(row, column);
        this.type = Tipo.ARRAY;
        this.type_init = type_init;
        this.id = id;
        this.list_value = [];
        this.list_tabla = [];
        this.list_expresion = list_expresion;
        this.id_array = id_array;
        this.type_correct = true;
    }

    interpretar(tree, table){
        if (this.list_expresion != []) {
            this.list_value = this.getValues(this.list_expresion, tree, table);
            if (this.type_correct) {
                var symbol = new Simbolo(this.id, Tipo.ARRAY, this.row, this.column, this);
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
            console.log("ls",list_values);
            if (list_values.type != this.type_init) {
                this.type_correct = false;
            }
            var primitive = new Primitivo(list_values.type, value, this.row, this.column, "ambito");
            return primitive;
        }
        return expressions;
    }
}