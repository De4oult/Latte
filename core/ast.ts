export type NodeType = 
    // stmt
    | 'Program' 
    | 'VariableDeclaration'

    // expr
    | 'Number'
    | 'Identifier' 
    | 'BinaryExpression';


export interface Statement {
    kind: NodeType;
}

export interface Program extends Statement {
    kind: 'Program';
    body: Statement[];
}

export interface VariableDeclaration extends Statement {
    kind:       'VariableDeclaration';
    constant:   boolean;
    identifier: string;
    value?:     Expression;
}

export interface Expression extends Statement {}

export interface BinaryExpression extends Expression {
    kind:     'BinaryExpression';
    left:     Expression;
    right:    Expression;
    operator: string;
}

export interface Identifier extends Expression {
    kind:   'Identifier';
    symbol: string;
}

export interface Number extends Expression {
    kind:  'Number';
    value: number;
}