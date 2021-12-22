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
        return this
    }
}