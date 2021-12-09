class Exception{

    constructor(type, description, row, column){
        this.type = type;
        this.description = description;
        this.row = row;
        this.column = column;
    }


    toString(){
        return `${this.type} - ${this.description} - (${this.row},${this.column})\n`
    }
    

}