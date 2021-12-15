class For extends Instruction{

    constructor(variable, condition, update, instruction, type, row, column){
        super(row, column);
        this.variable = variable;
        this.condition = condition;
        this.update = update;
        this.instruction = instruction;
        this.type = type;
    }

    interpretar(tree, table){

        var newTable = new TablaSimbolo(table);
        if(this.type == Tipo.ENTERO){ // 

            var declaration = this.variable.interpretar(tree, newTable);
            if(declaration instanceof Exception) return declaration;

            while(true){

                var condition = this.condition.interpretar(tree, newTable);
                if(condition instanceof Exception) return condition;
    
                if(this.condition.type == Tipo.BOOLEANO){

                    if(Boolean(condition) == true){
                        var newSecondTable = new TablaSimbolo(newTable);
                        for(var instruction of this.instruction){
                            var result = instruction.interpretar(tree, newSecondTable);
                            if (result instanceof Exception){
                                tree.getException().push(result);
                                tree.updateConsola(result.toString());
                            }
                            if(result instanceof Break) return result;
                            if(result instanceof Return) return result;
                            if(result instanceof Continue) return result;
                        }
                        var update = this.update.interpretar(tree, newSecondTable);
                        if(update instanceof Exception) return update;

                    }else{
                        break;
                    }
                    
                }else{
                    return new Exception("Semántico", "Tipo de dato no booleano en For", this.row, this.column);
                }
            }

        }else if(this.type == Tipo.STRING){
            var variable = newTable.getTabla(this.variable);
            var update = this.update.interpretar(tree, newTable);
            if(update instanceof Exception) return update;
            if(this.update.type != Tipo.STRING){
                return new Exception("Semántico", "Error del tipo de Operación en For.", this.row, this.column);
            }
            var symbol;
            var newSecondTable = new TablaSimbolo(newTable);
            if(variable == null){
                symbol = new Simbolo(this.variable.toString(),this.variable.type, this.row, this.column, update[0], "Local");
                newSecondTable.setTabla(symbol);
            }
            
            for(var i of update){
                symbol = new Simbolo(this.variable.toString(),this.variable.type, this.row, this.column, i, "Local");
                newSecondTable.updateTabla(symbol);
                for(var instruction of this.instruction){
                    var result = instruction.interpretar(tree, newSecondTable);
                    if (result instanceof Exception){
                        tree.getException().push(result);
                        tree.updateConsola(result.toString());
                    }
                    if(result instanceof Break) return result;
                    if(result instanceof Return) return result;
                    if(result instanceof Continue) return result;

                }

            }

        }else if(this.type == Tipo.ARRAY){
            // here code...
        }else{
            return new Exception("Semántico", "Error del tipo de Operación en For.", this.row, this.column);
        }

    }

    getNodo(){
        var nodo = new NodoAST("FOR");
        //var condiciones = new NodoAST("CONDICIONES");
        var instrucciones = new NodoAST("INSTRUCCIONES");
        /*for (var cond of this.condition) {
            condiciones.agregarHijoNodo(cond.getNodo());
        }*/
        for(var instr of this.instruction){
            instrucciones.agregarHijoNodo(instr.getNodo());
        }
        //nodo.agregarHijoNodo(condiciones);
        nodo.agregarHijoNodo(instrucciones);
        return nodo;
    }
}