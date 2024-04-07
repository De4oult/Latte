export enum TokenType {
    Number,
    Identifier,

    Equals,
    LParen,
    RParen,
    LBrace,
    RBrace,
    LBracket,
    RBracket,
    Comma,
    Colon,
    Semicolon,

    BinaryOperator,

    Let,
    Const,

    EOF
}

export interface Token {
    value: string;
    type:  TokenType;
}

const KEYWORDS: Record<string, TokenType> = {
    let:   TokenType.Let,
    const: TokenType.Const
}


const token      = (value: string = '', type: TokenType): Token => ({ value, type });
const isAlpha    = (source: string): Boolean => source.toUpperCase() != source.toLowerCase();
const isSkipable = (source: string): Boolean => source == ' ' || source == '\n' || source == '\t' || source == '\r';
const isInt      = (source: string): Boolean => {
    const c = source.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];

    return (c >= bounds[0] && c <= bounds[1]);
}

export const tokenize = (content: string): Token[] => {
    const tokens = new Array<Token>();
    const source = content.split('');

    while(source.length > 0) {
        switch(source[0]) {
            case '(': tokens.push(token(source.shift(), TokenType.LParen)); break;
            case ')': tokens.push(token(source.shift(), TokenType.RParen)); break;
            case '[': tokens.push(token(source.shift(), TokenType.LBrace)); break;
            case ']': tokens.push(token(source.shift(), TokenType.RBrace)); break;
            case '{': tokens.push(token(source.shift(), TokenType.LBracket)); break;
            case '}': tokens.push(token(source.shift(), TokenType.RBracket)); break;
            case '=': tokens.push(token(source.shift(), TokenType.Equals)); break;
            case '+': tokens.push(token(source.shift(), TokenType.BinaryOperator)); break;
            case '-': tokens.push(token(source.shift(), TokenType.BinaryOperator)); break;
            case '*': tokens.push(token(source.shift(), TokenType.BinaryOperator)); break;
            case '/': tokens.push(token(source.shift(), TokenType.BinaryOperator)); break;
            case '%': tokens.push(token(source.shift(), TokenType.BinaryOperator)); break;
            case ',': tokens.push(token(source.shift(), TokenType.Comma)); break;
            case ':': tokens.push(token(source.shift(), TokenType.Colon)); break;
            case ';': tokens.push(token(source.shift(), TokenType.Semicolon)); break;
            default:
                if(isInt(source[0])) {
                    let number = '';

                    while(source.length > 0 && isInt(source[0])) number += source.shift();

                    tokens.push(token(number, TokenType.Number));
                }
                else if(isAlpha(source[0])) {
                    let ident = '';

                    while(source.length > 0 && isAlpha(source[0])) ident += source.shift();

                    const reserved = KEYWORDS[ident];
                    
                    if(typeof reserved == 'number') tokens.push(token(ident, reserved));
                    else                            tokens.push(token(ident, TokenType.Identifier));
                }
                else if(isSkipable(source[0])) source.shift();
                else {
                    console.log('Unrecognized char found in source: ', source[0]);
                    Deno.exit(1);
                }
                break;
        }
    }

    tokens.push(token('EndOfFile', TokenType.EOF))

    return tokens;
}