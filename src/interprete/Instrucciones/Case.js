class Case extends Instruction{

    constructor(condition, instruction, row, column){
        super(row, column);
        this.condition = condition;
        this.instruction = instruction;
    }

    interpretar(tree, table){
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
}