class Switch extends Instruction{

    constructor(condition, instr_case, instr_default, row, column){
        super(row, column);
        this.condition = condition;
        this.instr_case = instr_case;
        this.instr_default = instr_default;

    }

    interpretar(tree, table){
        var condition = this.condition.interpretar(tree, table);
        if(condition instanceof Exception) return condition;
        var newTable = new TablaSimbolo(table);

        if(this.instr_case != null && this.instr_default != null){ // Condition 1 => [<CASES_LIST>][<DEFAULT>]
            
            this.instr_case.map(instruction => {
                var result = instruction.interpretar(tree, newTable);
                if(result instanceof Exception){
                    tree.getException().push(result);
                    tree.updateConsola(result.toString());
                }

                if(condition == result){
                    instruction.getInstruction().map(instruction2 => {
                        var value = instruction2.interpretar(tree, newTable);
                        if(value instanceof Exception){
                            tree.getException().push(value);
                            tree.updateConsola(value.toString());
                        }
                        if(value instanceof Break) return null;
                        if(value instanceof Return) return value;
                        if(value instanceof Continue) return null;
                    })
                }

            })


            this.instr_case.getInstruction().map(instruction => {
                var value = instruction.interpretar(tree, newTable);
                        if(value instanceof Exception){
                            tree.getException().push(value);
                            tree.updateConsola(value.toString());
                        }
                        if(value instanceof Break) return null;
                        if(value instanceof Return) return value;
                        if(value instanceof Continue) return null;
            })


        }else if(this.instr_case != null && this.instr_default == null){ // Condition 2 => [<CASES_LIST>]

        }else if(this.instr_case == null && this.instr_default != null){ // Condition 3 => [<DEFAULT>]
        
        }
    }
}