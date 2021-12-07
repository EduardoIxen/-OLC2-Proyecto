class Instruction {

    constructor(row, column) {
      if (new.target === Instruction) {
        throw new Error( 'this is an abstract class' );
      }
      this.row = row;
      this.column = column;
    }

    interpretar(tree, table){
      // here code...
      throw new Error( 'this is an abstract method' );
    }

  }