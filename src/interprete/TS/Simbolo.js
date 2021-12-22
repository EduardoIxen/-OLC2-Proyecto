class Simbolo{

    constructor(id, type, row, column, value, ambito){
        this.id = id;
        this.type = type;
        this.row = row;
        this.column = column;
        this.value = value;
        this.ambito = ambito;
        this.nameStruct = null;
        this.typeArray = null;

        // compile
        this.pos = 0;         // Stack position.
        this.posGlobal = 0;
        this.isTemp = null;   // Si es Temp o Label.
        this.EV = '';         // Label True.
        this.EF = '';         // Label False.
        this.isGlobal = null; // Verifica si es Global o Local.
        this.typeId = '';


    }


    getId(){ return this.id; }
    setId(id){ this.id = id; }

    getType(){ return this.type; }
    setType(type){ this.type = type; }

    getRow(){ return this.row; }
    setRow(row){ this.row = row; }

    getColumn(){ return this.column}
    setColumn(column){ this.column = column; }

    getValue(){ return this.value; }
    setValue(value){ this.value = value; }

    getAmbito(){ return this.ambito; }
    setAmbito(ambito){ this.ambito = ambito; }


//     this.EV = '';         // Label True.
//     this.EF = '';         // Label False.
//     this.isGlobal = null; // Verifica si es Global o Local.

    getPos(){ return this.pos; }
    setPos(pos){ this.pos = pos; }

    getIsTemp(){ return this.isTemp; }
    setIsTemp(isTemp){ this.isTemp = isTemp; }

    getEF(){ return this.EV; }
    setEV(EV){ this.EV = EV; }

    getEF(){ return this.EF; }
    setEF(EF){ this.EF = EF; }



}