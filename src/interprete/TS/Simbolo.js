class Simbolo{

    constructor(id, type, row, column, value){
        this.id = id;
        this.type = type;
        this.row = row;
        this.column = column;
        this.value = value;
    }


    getId(){ return this.id; }
    setId(id){ this.id = id; }

    getType(){ return this.type; }
    setType(type){ this.type = type; }

    getRow(){ return this.row; }
    setRow(row){ this.row = row; }

    getColumn(){ return this.column}
    setColumn(column){ this.column = column; }

    getValue(){ return this.valor; }
    setValue(value){ this.value = value; }

}