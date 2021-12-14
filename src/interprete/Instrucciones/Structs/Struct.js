class Struct{

    constructor(id, atributos, row, column, ambit){
        this.id = id;
        this.atributos = atributos;
        this.row = row;
        this.column = column;
        this.ambit = ambit;
        this.ref = null;
    }

    getId(){ return this.id; }
    setId(id){ this.id = id; }

    getAtributos(){ return this.atributos; }
    setAtributos(atributos){ this.atributos = atributos; } 

    getRow(){ return this.row; }
    setRow(row){ this.row = row; }

    getColumn(){ return this.column}
    setColumn(column){ this.column = column; }

    getAmbit(){ return this.ambit; }
    setAmbit(ambit){ this.ambit = ambit; }

}