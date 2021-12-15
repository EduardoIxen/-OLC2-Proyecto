class TypeOf extends Instruction{
    
    constructor(id, parameters, instructions, row, column){
        super(row, column);
        this.id = id;
        this.type = null;
        this.parameters = parameters;
        this.instructions = instructions;
    }

    interpretar(tree, table){
        var symbol = table.getTabla("11-Native-TypeOf");
        if(symbol == null){
            return new Exception("Semantico", `La variable (${this.id}) no existe`, this.row, this.column);
        }
        this.type= symbol.getType();
        if(symbol.getType() == Tipo.ENTERO){
            return 'int';
        }else if(symbol.getType() == Tipo.DECIMAL){
            return 'double';
        }else if(symbol.getType() == Tipo.STRING){
            return 'String';
        }else if(symbol.getType() == Tipo.BOOLEANO){
            return 'boolean';
        }else if(symbol.getType() == Tipo.CARACTER){
            return 'char';
        }else if(symbol.getType() == Tipo.NULO){
            return 'nul';
        }else if(symbol.getType() == Tipo.ARRAY){
            return 'array';
        }else if(symbol.getType() == Tipo.STRUCT){
            return 'struct';
        }else if(symbol.getType() == Tipo.VOID){
            return 'void';
        }          
        return symbol.getType().toString();
    }

    getNodo(){
        var nodo = new NodoAST("TYPE-OF");
        var nodoDato = new NodoAST(this.type);
        nodo.agregarHijoNodo(nodoDato);
        return nodo;
    }
}

