class Case extends Instruction{

    constructor(condition, instruction, row, column){
        super(row, column);
        this.condition = condition;
        this.instruction = instruction;
        this.tabla = null;
    }

    interpretar(tree, table){
        this.tabla = table;
        var condition = this.condition.interpretar(tree, table);
        if(condition instanceof Exception) return condition;

        return condition;
    }

    getInstruction(){ return this.instruction; }
    setInstruction(instruction){ this.instruction = instruction; }

    getNodo(){
        var nodo = new NodoAST("CASE");
        var instrucciones = new NodoAST("INSTRUCIONES");
        for(var instr of this.instruction){
            instrucciones.agregarHijoNodo(instr.getNodo());
        }
        nodo.agregarHijoNodo(instrucciones);
        return nodo;

    }

    getTabla(tree,table, padre){
        var salida = "";
        for(var instr of this.instruction){
            if (instr instanceof Declaracion){
                salida += instr.getTabla(tree,this.tabla, padre).toString();
            }
            if (instr instanceof DeclaracionArray){
                salida += instr.getTabla(tree,table, padre);
            }
            if (instr instanceof DeclaracionStruct){
                salida += instr.getTabla(tree,table, padre);
            }if (instr instanceof DeclaracionArrayRC){
                salida += instr.getTabla(tree,table, padre);
            } //faltaria declaracion arreglo copia y referencia
        }
        return salida;
    }

}