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
        if(this.instr_case != null){
            for (var instrCase of this.instr_case) {
                if (instrCase instanceof Case) {
                    salida += instrCase.getTabla(tree, this.tabla, padre).toString();
                }
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

        var condition = this.condition.compilar(tree, table);
        if(condition instanceof Exception) return condition;
        
        var newLprueba = gen.newLabel();
        var newLsalida = gen.newLabel();
        var newTable = new TablaSimbolo(table);
        var conca1 = ''; // la salida del if
        var conca2 = ''; // comparaciones de los case
        var conca3 = ''; // salida
        var labelTemp = [];

        conca1 += gen.addGoto(newLprueba);

        conca2 += gen.addGoto(newLsalida);
        conca2 += gen.addLabel(newLprueba);
        
        if(this.instr_case != null){
            for(var instruction of this.instr_case){
                var result = instruction.compilar(tree, table);
                if(result instanceof Exception){
                    gen.setException(result);
                }
                var EV = gen.newLabel();
                conca2 += gen.onlyIf(condition.value, '==', result.value, EV);
                labelTemp.push(gen.addLabel(EV).toString());
            }
        }
        var concaDefault = null;
        if(this.instr_default != null){
            var EV = gen.newLabel();
            conca2 += gen.addGoto(EV);
            concaDefault = gen.addLabel(EV);
        }

        conca3 += gen.addLabel(newLsalida);
        
        
        
        /********************** MOSTRANDO C3D DEL SWITCH **********************/
   
        tree.updateConsola(conca1);
      
        var count = 0;
        if(this.instr_case!=null){
            tree.updateConsola("\n\t/***************** [<LIST>][<CASE>] *****************/\n")
            for(var instruction of this.instr_case){
                tree.updateConsola(labelTemp[count])
                for(var instructions of instruction.getInstruction()){
                    var value = instructions.compilar(tree, newTable);
                    if(value instanceof Exception){
                        gen.setException(value);
                    }
                    if(value instanceof Break){
                        tree.updateConsola(gen.addGoto(newLsalida))
                    }
                }
                count ++;
            }
            tree.updateConsola("\t/****************************************************/\n")
        }
       

        if(concaDefault!=null){

            tree.updateConsola("\n\t/***************** [<DEFAULT>] *****************/\n")
            tree.updateConsola(concaDefault);
            for (let instruction of this.instr_default.getInstruction()){
                var value = instruction.compilar(tree, newTable);
                if(value instanceof Exception){
                    gen.setException(value);
                }
                if(value instanceof Break){
                    tree.updateConsola(gen.addGoto(newLsalida))
                }

            }
            tree.updateConsola("\t/****************************************************/\n")
        }
        
        tree.updateConsola(conca2);
        
        tree.updateConsola(conca3);        
    
        


        // if(this.instr_case != null && this.instr_default != null){ // Condition 1 => [<CASES_LIST>][<DEFAULT>]
        // }else if(this.instr_case != null && this.instr_default == null){ // Condition 2 => [<CASES_LIST>]
        // }else if(this.instr_case != null && this.instr_default == null){ // Condition 2 => [<CASES_LIST>]
        // }


    }
}