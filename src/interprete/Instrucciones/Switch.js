class Switch extends Instruction{

    constructor(condition, instr_case, instr_default, row, column){
        super(row, column);
        this.condition = condition;
        this.instr_case = instr_case;
        this.instr_default = instr_default;
        this.tabla = null;
    }

    interpretar(tree, table){
        this.tabla = table;
        var condition = this.condition.interpretar(tree, table);
        if(condition instanceof Exception) return condition;
        var newTable = new TablaSimbolo(table);

        if(this.instr_case != null && this.instr_default != null){ // Condition 1 => [<CASES_LIST>][<DEFAULT>]

            for(var instruction of this.instr_case){
                var result = instruction.interpretar(tree, newTable);
                if(result instanceof Exception){
                    tree.getException().push(result);
                    tree.updateConsola(result.toString());
                }

                if(condition == result){
                    for(var instruction2 of instruction.getInstruction()){
                        var value = instruction2.interpretar(tree, newTable);
                        if(value instanceof Exception){
                            tree.getException().push(value);
                            tree.updateConsola(value.toString());
                        }
                        if(value instanceof Break) return null;
                        if(value instanceof Return) return value;
                        if(value instanceof Continue) return null;
                    }
                    
                }   
            }


            for(var instruction of this.instr_default.getInstruction()){
                var value = instruction.interpretar(tree, newTable);
                if(value instanceof Exception){
                    tree.getException().push(value);
                    tree.updateConsola(value.toString());
                }
                if(value instanceof Break) return null;
                if(value instanceof Return) return value;
                if(value instanceof Continue) return null;
            }

        }else if(this.instr_case != null && this.instr_default == null){ // Condition 2 => [<CASES_LIST>]

            for (let instruction of this.instr_case) {
                var result = instruction.interpretar(tree, newTable);

                if(result instanceof Exception){
                    tree.getException().push(result);
                    tree.updateConsola(result.toString());
                }

                if(condition == result){
                    for(let instruction2 of instruction.getInstruction()){
                        var value = instruction2.interpretar(tree, newTable);
                        if(value instanceof Exception){
                            tree.getException().push(value);
                            tree.updateConsola(value.toString());
                        }
                        if(value instanceof Break) return null;
                        if(value instanceof Return) return value;
                        if(value instanceof Continue) return null;
                    }
                }


            }
        }else if(this.instr_case == null && this.instr_default != null){ // Condition 3 => [<DEFAULT>]
            
            for (let instruction of this.instr_default.getInstruction()){
                var result = instruction.interpretar(tree, newTable);

                if(result instanceof Exception){
                    tree.getException().push(result);
                    tree.updateConsola(result.toString());
                }

                if(result instanceof Break) return null;
                if(result instanceof Return) return result;
                if(result instanceof Continue) return null;
            }
        }
    }

    getNodo(){
        var nodo = new NodoAST("SWITCH");
        var lsCase = new NodoAST("LISTA CASE");
        for(var caso of this.instr_case){
            lsCase.agregarHijoNodo(caso.getNodo());
        }
        nodo.agregarHijoNodo(lsCase);

        if (this.instr_default != null) {
            var defaultInst = new NodoAST("DEFAULT");
            defaultInst.agregarHijoNodo(this.defaultInst.getNodo());
            nodo.agregarHijoNodo(defaultInst);
        }
        return nodo;
    }

    getTabla(tree, table, padre){
        var salida = "";
        for (var instrCase of this.instr_case) {
            if (instrCase instanceof Case) {
                salida += instrCase.getTabla(tree, this.tabla, padre).toString();
            }
        }
        if (this.instr_default != null) {
            if (this.instr_default instanceof Case) {
                this.instr_default.getTabla(tree, this.tabla, padre);
            }
        }
        return salida;
    }

    compilar(tree, table){
        var gen = tree.getGenerator();

        var newTable = new TablaSimbolo(table);

        var newLprueba = gen.newLabel();
        var newLsalida = gen.newLabel();
        tree.updateConsola(gen.addGoto(newLprueba));
        tree.updateConsola(gen.addGoto(newLsalida));
        tree.updateConsola(gen.addLabel(newLprueba));
        
        // if(this.instr_case != null && this.instr_default != null){ // Condition 1 => [<CASES_LIST>][<DEFAULT>]
        // }else if(this.instr_case != null && this.instr_default == null){ // Condition 2 => [<CASES_LIST>]
        // }else if(this.instr_case != null && this.instr_default == null){ // Condition 2 => [<CASES_LIST>]
        // }


    }
}