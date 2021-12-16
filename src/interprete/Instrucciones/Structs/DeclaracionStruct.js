class DeclaracionStruct extends Instruction{

    constructor(id, atributos, row, column){
        super(row, column);
        this.id = id;
        this.atributos = atributos;
        this.type = Tipo.STRUCT;
        this.value = null;
    }

    interpretar(tree, table){
        
        var struct = new Struct(this.id, this.atributos, this.row, this.column, "Global");
        var func = tree.getFuncion(this.id); 
        if(func != null){
            return new Exception("Semantico", `Ya existe esa variable ${this.id}`, this.row, this.column);
        }
        var result = tree.addStruct(struct);
        if(result instanceof Exception) return result;
        
        for(var i of this.atributos){
            if(i.bool == true){
                var searchStruct = tree.getStruct(i.type);
                if(searchStruct == null){
                    return new Exception("Semantico", `No existe esa variable ${this.type} de Struct`, this.row, this.column);
                }
            }
        }
        if(result == null){
            this.value = '';
        }else{

            this.value = result;
        }
        return result;
    }

    getNodo(){
        var nodo = new NodoAST("DECLARACION-STRUCI");
        nodo.agregarHijo(this.id.toString());
        if (this.atributos != null) {
            for(var i of this.atributos){
                nodo.agregarHijo(i.type.toString());
                nodo.agregarHijo(i.name.toString());
                nodo.agregarHijo(',');
            }
        }
        return nodo;
    }

    getTabla(tree, table, padre){
        var salida = "";
        var dict = {}
        dict['Identificador'] =this.id.toString();
        dict['Tipo'] = "Struct";
        dict['Tipo2'] = "-----";
        dict['Entorno'] = padre.toString();
        dict['Valor'] = this.value.toString();
        dict['Fila'] =this.row.toString();
        dict['Columna'] =this.column.toString();
        //tree.getTablaTsGlobal().push(dict);
        tree.addTSG(dict);
        return salida;
    }

}