class If extends Instruction{

    constructor(condition, instr_if, instr_else, instr_elseif, row, column){
        super(row, column);
        this.condition = condition;
        this.instr_if = instr_if;
        this.instr_else = instr_else;
        this.instr_elseif = instr_elseif;
    }

    interpretar(tree, table){

        var condition = this.condition.interpretar(tree, table);
        if(condition instanceof Exception) return condition;

        if(this.condition.type == Tipo.BOOLEANO){
            var newGlobalTable = new TablaSimbolo(table);

            if(Boolean(condition) == true){ //[CONDITION][IF]
                this.instr_if.map(instruction => {
                    var result = instruction.interpretar(tree, newGlobalTable);
                    if (result instanceof Exception){
                        tree.getException().push(result);
                        tree.updateConsola(result.toString());
                    }
                })

            }else{
                if(this.instr_elseif != null){ // [CONDITION][ELSE][IF]
                    var result = this.instr_elseif.interpretar(tree, table);
                    if(result instanceof Exception) return result;
                }
                else if(this.instr_else != null){ //[CONDITION][ELSE]
                    this.instr_else.map(instruction => {
                        var result = instruction.interpretar(tree, newGlobalTable);
                        if (result instanceof Exception){
                            tree.getException().push(result);
                            tree.updateConsola(result.toString());
                        }
                    })
                }
            }

        }else{
            return new Exception("Semantico", "Tipo de dato no booleano en IF.", this.row, this.column);
        }
    }
}