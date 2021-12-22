class Incremento extends Instruction{

    constructor(identificador, jump, row, column){
        super(row, column);
        this.identificador = identificador;
        this.jump = jump;
    }

    interpretar(tree, table){

        var symbol = table.getTabla(this.identificador);
        if(symbol == null){
            return null;
            // return new Exception("Semantico", `No existe ese ${this.identificador}`, this.row, this.column);
        }

        if(symbol.type == Tipo.ENTERO){
            symbol.value = parseInt(symbol.value) + 1;

        }else if(symbol.type == Tipo.DECIMAL){
            symbol.value = parseFloat(symbol.value) + 1;
        }else{
            return new Exception("Semantico", "Error de tipo de dato.", this.row, this.column);
        }

        var result = table.updateTabla(symbol);
        if(result instanceof Exception) return result;

        if(this.jump == true){
            return parseInt(symbol.value) - 1;
        }else{
            return parseInt(symbol.value);
        }
    }

    getNodo(){
        var nodo = new NodoAST("INCREMENTO");
        nodo.agregarHijo(this.identificador.toString());
        return nodo;
    }

    compilar(tree, table){
        var gen = tree.getGenerator();

        var symbol = table.getTabla(this.identificador);
        if(symbol == null){
            return new Exception("Semantico", `Variable ${this.identificador} no encontrada.`, this.row, this.column);
        }
        var temp = gen.newTemp();

        if(symbol.type == Tipo.ENTERO || symbol.type == Tipo.DECIMAL){
            tree.updateConsola(gen.getStack(temp, symbol.posGlobal));

            var auxTemp = gen.newTemp();
            tree.updateConsola(gen.setArithmetic(auxTemp, temp, '+', '1'));
            
            symbol.value = auxTemp;
            symbol.isTemp = true;

            tree.changeValueTsSymbol(symbol, auxTemp);
            tree.updateConsola("\t/********* Incremento *********/\n");
            tree.updateConsola(gen.setStack(symbol.posGlobal, auxTemp));
            tree.updateConsola(`\t/***** Fin de Incremento *****/\n\n`);

        }else{
            return new Exception("Semantico", "Error de tipo de dato.", this.row, this.column);
        }
    }

}