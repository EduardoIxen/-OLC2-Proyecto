class Declaracion extends Instruction{

    constructor(type, id, expression=null, row, column){
        super(row, column);
        this.type = type;
        this.id = id;
        this.expression = expression;
        this.value = "";
    }

    interpretar(tree, table){
        var value = null;
     
        if (this.expression != null) {
            if (this.expression != "null") {
                value = this.expression.interpretar(tree, table);  //obtenemos el valor de la expresion para asignarselo a la vatiable
                if (value instanceof Exception) return value;

            }else{
                value = "null";
            }
            this.value = value;
            if (this.value instanceof Primitivo) {
                if (this.type == value.type) {
                    var simbolo = new Simbolo(this.id, this.type, this.row, this.column, value.value, "agregar ambito");
                    var result = table.setTabla(simbolo);
                    if (result instanceof Exception) return result;
                    return null;
                }
            }
            if (this.type != this.expression.type && (this.type != Tipo.DECIMAL && this.expression.type != Tipo.ENTERO)) {
                if (this.expression.type == Tipo.ARRAY) {
                    if (this.type != value.type) {
                        return new Exception("Semantico", "Expresion incompatible con el tipo de dato de la variable.", this.row, this.column);
                    }
                }else{
                    return new Exception("Semantico", "Expresion incompatible con el tipo de dato de la variable.", this.row, this.column);
                }
            }
            var simbolo = new Simbolo(this.id, this.type, this.row, this.column, value, "agregar ambito");
            var result = table.setTabla(simbolo);
    
            if (result instanceof Exception) return result;
            return null;

        }else{
            if (this.type == Tipo.ENTERO) {
                value = 0;
            }else if (this.type == Tipo.DECIMAL) {
                value = 0.0;
            } else if (this.type == Tipo.STRING) {
                value = "null";
            } else if (this.type == Tipo.BOOLEANO) {
                value = false;
            } else if (this.type == Tipo.CARACTER) {
                value = String.fromCharCode(0);
            }
            for (let identificador of this.id) {
                this.value = value;
                let simbolo = new Simbolo(identificador, this.type, this.row, this.column, value, "agregar ambito");
                let result = table.setTabla(simbolo);
        
                if (result instanceof Exception) return result;
            }
            return null;
        }
    }

    getNodo(){
        var nodo = new NodoAST("DECLARACION");
        nodo.agregarHijo(this.id.toString());
        if (this.expression != null) {
            nodo.agregarHijoNodo(this.expression.getNodo());
        }
        return nodo;
    }

    getTabla(tree, table, padre){
        var salida = "";
        var dict = {}
        dict['Identificador'] =this.id.toString();
        dict['Tipo'] = "Variable";
        dict['Tipo2'] = this.type.toString().replace("TIPO.", "");
        dict['Entorno'] = padre.toString();
        dict['Valor'] = this.value.toString();
        dict['Fila'] =this.row.toString();
        dict['Columna'] =this.column.toString();
        //tree.getTablaTsGlobal().push(dict);
        tree.addTSG(dict);
        return salida;
    }

    compilar(tree, table){
        var value = null;
        var gen = tree.getGenerator();
        if(this.expression != null){
            value = this.expression.compilar(tree, table);
            if (value instanceof Exception) return value;
        }
        
        if (this.type != this.expression.type && (this.type != Tipo.DECIMAL && this.expression.type != Tipo.ENTERO)) {
            if (this.expression.type == Tipo.ARRAY) {
                if (this.type != value.type) {
                    return Exception("Semantico", "Expresion incompatible con el tipo de dato de la variable.", this.row, this.column);
                }
            }else{
                return new Exception("Semantico", "Expresion incompatible con el tipo de dato de la variable.", this.row, this.column);
            }
        }
    
        var symbol = table.getTabla(this.id);
        var isGlobal = '';
        if(symbol != null){
            return new Exception("Semantico", `Ya existe la variable ${this.id}`, this.row, this.column);
        }
        symbol = new Simbolo(this.id, this.type, this.row, this.column, value, null);
        if(table.isGlobal()){
            isGlobal = 'Global';
            
        }else{
            isGlobal = 'Local';

            table.size ++;
        }
        symbol.pos = null; // puede variar segun el tamaño
        symbol.ambito = isGlobal;
        
        symbol.isTemp = true;
        symbol.isGlobal = table.isGlobal();
        symbol.posGlobal = tree.getPos();
        var result = table.setTabla(symbol);
        
        if(result instanceof Exception) return result;

        var auxSymbol = new Simbolo(this.id, this.type, this.row, this.column, value, isGlobal);
        auxSymbol.pos = null; // puede variar segun el tamaño
        auxSymbol.isTemp = true;
        auxSymbol.isGlobal = table.isGlobal();
        auxSymbol.posGlobal = tree.getPos();
        auxSymbol.typeId = tree.getType(this.type);
        auxSymbol.type = tree.getType(this.type);
        tree.pushTsSymbol(auxSymbol);
        tree.updateConsola(`\t/********** Declaración **********/\n`);
        tree.updateConsola(gen.setStack(symbol.posGlobal, value.value));
        tree.updateConsola(`\t/****** Fin de Declaración *******/\n\n`);
        tree.newPos();
        console.log(symbol)

        
        return null;
    }
}