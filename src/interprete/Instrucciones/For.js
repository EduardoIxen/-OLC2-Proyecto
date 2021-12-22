class For extends Instruction{

    constructor(variable, condition, update, instruction, type, row, column){
        super(row, column);
        this.variable = variable;
        this.condition = condition;
        this.update = update;
        this.instruction = instruction;
        this.type = type;
        this.tabla = null;
    }

    interpretar(tree, table){
        this.tabla = table;
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
                            if(result instanceof Break) return null;
                            if(result instanceof Return) return result;
                            if(result instanceof Continue) break;
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
            if(this.update.type != Tipo.STRING || update instanceof DeclaracionArray){
                if (update instanceof DeclaracionArray) {
                    var symbol;
                    var newSecondTable = new TablaSimbolo(newTable);
                    if (update.list_value.length > 0) {
                        if(variable == null){
                            symbol = new Simbolo(this.variable.toString(), update.list_value[0].type, this.row, this.column, update.list_value[0].value, "Local");
                            newSecondTable.setTabla(symbol);
                        }   
                        for (var item of update.list_value) {
                            symbol = new Simbolo(this.variable.toString(), item.type, this.row, this.column, item.value, "Local");
                            newSecondTable.updateTabla(symbol);
                            for (var instruction of this.instruction) {
                                var result = instruction.interpretar(tree, newSecondTable);
                                if (result instanceof Exception){
                                    tree.getException().push(result);
                                    tree.updateConsola(result.toString());
                                }
                                if(result instanceof Break) return null;
                                if(result instanceof Return) return result;
                                if(result instanceof Continue) break;
                            }
                        }
                        return null;
                    }
                }
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
                    if(result instanceof Break) return null;
                    if(result instanceof Return) return result;
                    if(result instanceof Continue) break;

                }

            }

        }else if(this.type == Tipo.ARRAY){
            var variable = newTable.getTabla(this.variable);
            var symbol;
            var newSecondTable = new TablaSimbolo(newTable);
            if (this.update instanceof Array && this.update.length > 0) {
                if(variable == null){
                    symbol = new Simbolo(this.variable.toString(), this.update[0].type, this.row, this.column, this.update[0], "Local");
                    newSecondTable.setTabla(symbol);
                }
                for (var item of this.update) {
                    symbol = new Simbolo(this.variable.toString(), item.type, this.row, this.column, item.value, "Local");
                    newSecondTable.updateTabla(symbol);
                    for (var instruccion of this.instruction) {
                        var result = instruccion.interpretar(tree, newSecondTable);
                        if (result instanceof Exception){
                            tree.getException().push(result);
                            tree.updateConsola(result.toString());
                        }
                        if(result instanceof Break) return null;
                        if(result instanceof Return) return result;
                        if(result instanceof Continue) break;
                    }
                }
            }
        }else{
            return new Exception("Semántico", "Error del tipo de Operación en For.", this.row, this.column);
        }

    }

    getNodo(){
        var nodo = new NodoAST("FOR");
        var condiciones = new NodoAST("LOOP");
        var instrucciones = new NodoAST("INSTRUCCIONES");
        if (this.condition == null && this.variable != null) {
            condiciones.agregarHijo(this.variable.toString());
            condiciones.agregarHijo("in");
            condiciones.agregarHijo("expersion");
        }
        for(var instr of this.instruction){
            instrucciones.agregarHijoNodo(instr.getNodo());
        }
        nodo.agregarHijoNodo(condiciones);
        nodo.agregarHijoNodo(instrucciones);
        return nodo;
    }

    getTabla(tree, table, padre){
        var salida = "";
        for (var instr of this.instruction) {
            if (instr instanceof Declaracion) {
                salida += instr.getTabla(tree, this.tabla, padre).toString();
            }
            if (instr instanceof DeclaracionArray) {
                salida += instr.getTabla(tree, table, padre);
            }
            if (instr instanceof DeclaracionStruct) {
                salida += instr.getTabla(tree, table, padre);
            }if (instr instanceof DeclaracionArrayRC) {
                salida += instr.getTabla(tree, table, padre);
            }if (instr instanceof LlamadaFuncion){
                salida += instr.getTabla(tree, table, padre);
            }
        }
        return salida;
    }

    compilar(tree, table){
        console.log(this.variable)
        console.log(this.condition)
        console.log(this.update)
        console.log(this.instruction)
        var gen = tree.getGenerator();
        if (this.type == Tipo.ENTERO) {
            var newTable = new TablaSimbolo(table);
            var newVar = this.variable.compilar(tree, newTable);
            console.log(newVar)
            var newL = gen.newLabel();
            tree.updateConsola(gen.addLabel(newL));
            if (this.condition.type == Tipo.BOOLEANO) {
                var cond = this.condition.compilar(tree,newTable);
                tree.updateConsola(gen.addLabel(cond.EV));
                for (var instruction of this.instruction) {
                    var result = instruction.compilar(tree, newTable);
                    if (result instanceof Exception) {
                        gen.setException(result);
                    }
                }
                this.update.compilar(tree,newTable);
                tree.updateConsola(gen.addGoto(newL));
                tree.updateConsola(gen.addLabel(cond.EF));
            }else{
                return new Exception("Semántico", "La expresion de comparacion no es de tipo booleana.",this.row, this.column)
            }
            
        }else{
            return new Exception("Semántico","El dato debe de ser de tipo entero.", this.row, this.column);
        }
    }
}