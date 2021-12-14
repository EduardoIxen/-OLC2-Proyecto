class AccesoStruct extends Instruction{

    constructor(identificador, atributos, row, column){
        super(row, column);
        this.identificador = identificador;
        this.atributos = atributos;
        this.type = null;
    }

    interpretar(tree, table){
        //here codee....
        var symbol = table.getTabla(this.identificador);
        if(symbol == null){
            return new Exception("Semantico", `No existe la variable ${this.identificador}.`, this.row, this.column);
        }

        var temp;
        var count = 0;

        temp = symbol.value;
        while(count<this.atributos.length){
            
            if(temp[this.atributos[count].id]){
                temp = symbol.value[this.atributos[count].id];
                
                if(temp instanceof Object){
                    count ++;
                    // componer
                    try{

                        if(temp[this.atributos[count].id]){
                            temp = temp[this.atributos[count].id];
                        }else{
                            return new Exception("Semantico", `No existe el atributo ${this.atributos[count].id}.`, this.row, this.column);
                        }
                    }catch(error){
                        return temp;
                    }
                }
                
            }else{
                return new Exception("Semantico", `No existe el atributo ${this.atributos[count].id}.`, this.row, this.column);
            }
            count ++;
        }

        return temp;
    }
}