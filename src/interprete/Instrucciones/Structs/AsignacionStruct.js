class AsignacionStruct extends Instruction{

    constructor(name, id, nameStruct, atributos, row, column){
        super(row, column);
        this.name = name;
        this.id = id;
        this.nameStruct = nameStruct;
        this.atributos = atributos;
        this.type = Tipo.STRUCT;
    }

    interpretar(tree, table){
        var func = tree.getFuncion(this.id); 
        if(func != null){
            return new Exception("Semantico", `No es un Struct ${this.id}`, this.row, this.column);
        }
        
        var symbol = table.getTabla(this.name);
        if(symbol != null){
            return new Exception("Semantico", `No es variable de Struct.`, this.row, this.column);
        }
        var struct = tree.getStruct(this.name);
        if(struct == null){
            return new Exception("Semantico", `No existe la variable ${this.name} en Struct.`, this.row, this.column);
        }
        if(this.name != this.nameStruct){
            return new Exception("Semantico", `Nombre incorrecto es un Struct.`, this.row, this.column);
        }
        symbol = table.getTabla(this.id);
        if(symbol!=null){
            return new Exception("Semantico", `Ya existe la variable ${this.id} en Struct.`, this.row, this.column);
        }
        var atrr = {};
    
        if(struct.length != this.atributos.length){
            return new Exception("Semantico", `Cantidad incorrecta de paramentros en Struct.`, this.row, this.column);
        }
        var count = 0;
        for(var instruccion of this.atributos){
            var value = instruccion.interpretar(tree, table);
            if(struct[count].type == this.atributos[count].type || this.atributos[count].type == Tipo.NULO || this.atributos[count].type == Tipo.STRUCT){
                atrr[struct[count].name] = value;
            }else{
                return new Exception("Semantico", `Tipo de dato incorrecto en asignación de Struct.`, this.row, this.column);
            }
            count ++;
        }

        symbol = new Simbolo(this.id, this.type, this.row, this.column, atrr, "Ambito");
        symbol.nameStruct = this.name;
        // symbol.ref = tree.ref;
        // tree.ref ++;
        var result = table.setTabla(symbol);
        return result;
    }
}