class If extends Instruction{

    constructor(condition, instr_if, instr_else, instr_elseif, row, column){
        super(row, column);
        this.condition = condition;
        this.instr_if = instr_if;
        this.instr_else = instr_else;
        this.instr_elseif = instr_elseif;
        this.tabla = null;
    }

    interpretar(tree, table){

        this.tabla = table;
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

    getNodo(){
        var nodo = new NodoAST("IF");
        var condicion = new NodoAST("CONDICION");
        condicion.agregarHijoNodo(this.condition.getNodo());
        nodo.agregarHijoNodo(condicion);
        var instruccionesif = new NodoAST("INSTRUCCIONES");
        for (var instr of this.instr_if) {
            instruccionesif.agregarHijoNodo(instr.getNodo());
        }
        nodo.agregarHijoNodo(instruccionesif);
        if (this.instr_else != null) {
            var instElse = new NodoAST("INSTRUCCIONES");
            for (var instr of this.instr_else) {
                instElse.agregarHijoNodo(instr.getNodo());
            }
            nodo.agregarHijoNodo(instElse);
        }else if (this.instr_elseif != null) {
            this.instr_elseif.getNodo();
        }
        return nodo;
    }

    getTabla(tree, table, padre){
        try {
            var salida = "";
            if ((this.instr_if instanceof Array)) {
                return "";
            }
            for (var instr of this.instr_if) {
                if (instr instanceof Declaracion) {
                    salida += instr.getTabla(tree, this.tabla, padre).toString();
                }
                if (instr instanceof DeclaracionArray) {
                    salida += instr.getTabla(tree, table, padre);
                }
                if (instr instanceof DeclaracionStruct) {
                    salida += instr.getTabla(tree, table, padre);
                }
                if (instr instanceof DeclaracionArrayRC) {
                    salida += instr.getTabla(tree, table, padre);
                }if (instr instanceof LlamadaFuncion){
                    salida += instr.getTabla(tree,table, padre);
                }
            }
            if (this.instr_else != null) {
                for (var instr of this.instr_else) {
                    if (instr instanceof Declaracion) {
                        salida += instr.getTabla(tree, this.tabla, padre).toString();
                    }
                    if (instr instanceof DeclaracionArray) {
                        salida += instr.getTabla(tree, table, padre);
                    }
                    if (instr instanceof DeclaracionStruct) {
                        salida += instr.getTabla(tree, table, padre);
                    }
                    if (instr instanceof DeclaracionArrayRC) {
                        salida += instr.getTabla(tree, table, padre);
                    }if (instr instanceof LlamadaFuncion){
                        salida += instr.getTabla(tree,table, padre);
                    }
                }
            }
            if (this.instr_elseif != null) {
                if (this.instr_elseif instanceof If) {
                    this.instr_elseif.getTabla(tree, table, padre);
                }
            }
            return salida;
        } catch (error) {
            console.log(error);
            console.log(this.instr_if)
        }
    }
}