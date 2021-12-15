class AccesoStruct extends Instruction{

    constructor(identificador, atributos, row, column){
        super(row, column);
        this.identificador = identificador;
        this.atributos = atributos;
        this.type = null;
        this.symbol = null;
    }

    interpretar(tree, table){
        //here codee....
        var symbol = table.getTabla(this.identificador);
        if(symbol == null){
            return new Exception("Semantico", `No existe la variable ${this.identificador}.`, this.row, this.column);
        }
        if(symbol.type != Tipo.STRUCT){
            return new Exception("Semantico", `No es tipo Struct.`, this.row, this.column);
        }

        var struct = tree.getStruct(symbol.nameStruct);
        if(struct == null){
            return new Exception("Semantico", `No existe la variable en Struct.`, this.row, this.column);
        }
        this.symbol = symbol;
        var temp;
        var count = 0;
        temp = symbol.value;
        
        while(count<this.atributos.length){

            if(temp[this.atributos[count].id]){
                struct = this.recorrer(tree, struct,this.atributos[count].id);
                if(0<=struct){
                    this.type = struct;
                }
                temp = temp[this.atributos[count].id];
                if(this.type!=null){
                    return temp;
                }
                if(temp instanceof Object){
                    count ++;
                    try{
                        
                        if(temp[this.atributos[count].id]){
                            temp = temp[this.atributos[count].id];
                        }else{
                            return new Exception("Semantico", `No existe el atributo ${this.atributos[count].id}.`, this.row, this.column);
                        }
                    }catch(error){
                        this.type = Tipo.STRUCT;
                        return Object.values(temp);
                    }
                }
                
            }else{
                return new Exception("Semantico", `No existe el atributo ${this.atributos[count].id}.`, this.row, this.column);
            }
            
            struct = this.recorrer(tree, struct,this.atributos[count].id);
            if(0<=struct){
                this.type = struct;
            }
            count ++;
        }
    
        var temp = symbol.value;
        return Object.values(temp);
    }

    recorrer(tree, struct,id){
        var i = 0;
        while(i<struct.length){
            if(struct[i].name == id){
                if(struct[i].type){
                    var struct2 = tree.getStruct(struct[i].type);

                    if(struct2!= null){
                        return struct2;
                    }else{
                        return struct[i].type;
                    }

                }
            }
            i++;
        }
    }
}