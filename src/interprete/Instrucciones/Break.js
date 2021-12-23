class Break extends Instruction{
    
    constructor(row, column){
        super(row, column);
    }

    interpretar(tree, table){
        return this;
    }

    getNodo(){
        var nodo =  new NodoAST("BREAK");
        return nodo;
    }

    compilar(tree, table){
        var gen = tree.getGenerator();
        var breakLabel = gen.newLabel();
        tree.updateConsola(gen.addGoto(breakLabel))
      
        tree.breakLabel = breakLabel.toString();
        tree.breakReturn = true;
        
    }
}