class DeclaracionStruct extends Instruction{

    constructor(id, atributos, row, column){
        super(row, column);
        this.id = id;
        this.atributos = atributos;
        this.type = Tipo.STRUCT;
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
        return result;
    }

    getNodo(){
        var nodo = new NodoAST("DECLARACION-STRUCI");
        nodo.agregarHijo(this.id.toString());
        if (this.atributos != null) {
            nodo.agregarHijoNodo(this.atributos.getNodo());
        }
        return nodo;
    }
}