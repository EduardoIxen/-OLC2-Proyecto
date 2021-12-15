class Continue extends Instruction{
    
    constructor(row, column){
        super(row, column);
    }

    interpretar(tree, table){
        return this;
    }

    getNodo(){
        var nodo = new NodoAST("CONTINUE");
        return nodo;
    }
}