class Asignacion extends Instruction{
    constructor(id, expression, row, column){
        super(row, column);
        this.id = id;
        this.expression = expression;
    }

    interpretar(tree, table){
        var value = this.expression.interpretar(tree, table);
        if (value instanceof Exception) {
            return value;
        }
        if (value instanceof Primitivo) {
            value = value.value;
        }
        var simbolo = new Simbolo(this.id, this.expression.type, this.row, this.column, value, "ambito");
        var result = table.updateTabla(simbolo);
        if (result instanceof Exception) {
            return result;
        }
        return null;
    }

    getNodo(){
        var nodo = new NodoAST("ASIGNACION");
        nodo.agregarHijo(this.id.toString());
        if (this.expression != null) {
            nodo.agregarHijoNodo(this.expression.getNodo());
        }
        return nodo;
    }

    compilar(tree, table){
        var gen = tree.getGenerator();
        var symbol = table.getTabla(this.id);

        if(symbol == null){
            return new Exception("Semantico", `Variable ${this.identificador} no encontrada.`, this.row, this.column);
        }

        var value = this.expression.compilar(tree, table);
        if(value instanceof Exception) return result;
        console.log(symbol);
        console.log(value);
        if(symbol.type != value.type){
            return new Exception("Semantico", `Tipos diferentes.`, this.row, this.column);
        }

        symbol.value = value.value;
        symbol.isTemp = true;

        tree.changeValueTsSymbol(symbol, value.value);
        tree.updateConsola("\t/********* Asignación *********/\n");
        tree.updateConsola(gen.setStack(symbol.posGlobal, value.value));
        tree.updateConsola(`\t/***** Fin de Asignación *****/\n\n`);

        console.log("a")
        
        return null;

    }
}