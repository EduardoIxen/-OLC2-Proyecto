class Cos extends Instruction{
    
    constructor(name, parameters, instr, row, column){
        super(row, column);
        this.name = name;
        this.parameters = parameters;
        this.instr = instr;
    }

    interpretar(tree, table){
        var symbol = table.getTabla("01_Native_Cos");

        console.log(`--+${symbol.getValue()}`);
        console.log(`--${symbol.getType()}`)

        
    }
}