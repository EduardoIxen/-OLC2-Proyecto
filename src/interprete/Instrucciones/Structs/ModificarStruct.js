class ModificarStruct extends Instruction{

    constructor(acces, expression, row, column){
        super(row, column);
        this.acces = acces;
        this.expression = expression;
        this.type = null;
    }

    interpretar(tree, table){
        //here codee....
        var value = this.expression.interpretar(tree, table);
        if(value instanceof Exception) return value;

        var acces = this.acces.interpretar(tree, table);
        if(acces instanceof Exception) return acces;
       
        var atrr = this.acces.atributos[this.acces.atributos.length-1].id;
        this.type = this.acces.type;
        this.acces.symbol.value[atrr] = value;
        // console.log("/")

    
    }

}