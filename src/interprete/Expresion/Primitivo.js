class Primitivo extends Instruction{

    constructor(type, value, row, column){
        super(row,column);
        this.type = type;
        this.value = value;
    }

    interpretar(tree, table){
        return this.value;
    }
}