class Ternario extends Instruction{

    constructor(condition, instr_true, instr_false, row, column){
        super(row, column);
        this.condition = condition;
        this.instr_true = instr_true;
        this.instr_false = instr_false;
        this.type = null;
    }

    interpretar(tree, table){
        var condition = this.condition.interpretar(tree, table);
        if(this.condition.type == Tipo.BOOLEANO){
            
            if(Boolean(condition) == true){ 
                var value = this.instr_true.interpretar(tree, table);
                if(value instanceof Exception) return value;
                this.type = this.instr_true.type;
                return value;
                
            }else{

                var value = this.instr_false.interpretar(tree, table);
                if(value instanceof Exception) return value;
                this.type = this.instr_false.type;
                return value;
            }

        }else{  
            return new Exception("Semántico","Tipo de dato no Booleano para Ternario.", this.row, this.column);
        }

    }

    getNodo(){
        var nodo = new NodoAST("TERNARIO");
        var condicion = new NodoAST("CONDICION");
        condicion.agregarHijoNodo(this.condition.getNodo());
        var condV = new NodoAST("CONDICION VERDADERA");
        condV.agregarHijoNodo(this.instr_true.getNodo());
        var condF = new NodoAST("CONDICION FALSA");
        condF.agregarHijoNodo(this.instr_false.getNodo());
        nodo.agregarHijoNodo(condicion);
        nodo.agregarHijoNodo(condV);
        nodo.agregarHijoNodo(condF);
        return nodo;
    }
}