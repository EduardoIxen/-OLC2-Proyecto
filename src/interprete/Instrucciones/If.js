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
                try {
                    for(var instruction of this.instr_if){
                        var result = instruction.interpretar(tree, newGlobalTable);
                        if (result instanceof Exception){
                            tree.getException().push(result);
                            tree.updateConsola(result.toString());
                        }
                        if(result instanceof Break) return result;
                        if(result instanceof Return) return result;
                        if(result instanceof Continue) return result;
                    }
                } catch (error) {
                    var result = this.instr_if.interpretar(tree, newGlobalTable);
                        if (result instanceof Exception){
                            tree.getException().push(result);
                            tree.updateConsola(result.toString());
                        }
                        if(result instanceof Break) return result;
                        if(result instanceof Return) return result;
                        if(result instanceof Continue) return result;
                }
                

            }else{
                if(this.instr_elseif != null){ // [CONDITION][ELSE][IF]
                    var result = this.instr_elseif.interpretar(tree, table);
                    if(result instanceof Exception) return result;
                    if(result instanceof Break) return result;
                    if(result instanceof Return) return result;
                    if(result instanceof Continue) return result;
                }
                else if(this.instr_else != null){ //[CONDITION][ELSE]

                    try {
                        for(var instruction of this.instr_else){
                            var result = instruction.interpretar(tree, newGlobalTable);
                            if (result instanceof Exception){
                                tree.getException().push(result);
                                tree.updateConsola(result.toString());
                            }
                            if(result instanceof Break) return result;
                            if(result instanceof Return) return result;
                            if(result instanceof Continue) return result;
                        }
                    } catch (error) {
                        var result = this.instr_else.interpretar(tree, newGlobalTable);
                            if (result instanceof Exception){
                                tree.getException().push(result);
                                tree.updateConsola(result.toString());
                            }
                            if(result instanceof Break) return result;
                            if(result instanceof Return) return result;
                            if(result instanceof Continue) return result;
                    }
                    
                }
            }

        }else{
            return new Exception("Semantico", "Tipo de dato no booleano en IF.", this.row, this.column);
        }
    }
}