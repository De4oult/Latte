import { Statement, Program, Expression, BinaryExpression, Number, Identifier, Null, VariableDeclaration } from './ast.ts';
import { tokenize, Token, TokenType } from './lexer.ts';

export default class Parser {
    private tokens: Token[] = [];

    private not_eof = (): Boolean => this.tokens[0].type != TokenType.EOF;

    private at = (): Token => this.tokens[0] as Token;

    private eat = (): Token => this.tokens.shift() as Token;

    private expect = (type: TokenType, error: any) => {
        const prev = this.tokens.shift() as Token;

        if(!prev || prev.type != type) {
            console.error('Error: \n', error, prev, ' - Expecting: ', type);
            Deno.exit(1);
        }

        return prev;
    }

    private parse_statement = (): Statement => {
        switch(this.at().type) {
            case TokenType.Let:
            case TokenType.Const: return this.parse_variable_declaration();
            default:              return this.parse_expression();
        }
    }

    private parse_variable_declaration = (): Statement => {
        const isConstant = this.eat().type == TokenType.Const;
        const identifier = this.expect(
            TokenType.Identifier,
            'Expected identifier name',
        ).value;

        if(this.at().type == TokenType.Semicolon) {
            this.eat();
            if(isConstant) throw 'Must assign value to constant expression. No value provided';

            return { kind: 'VariableDeclaration', identifier, constant: false, value: undefined } as VariableDeclaration;
        }

        this.expect(TokenType.Equals, 'Expected equals following identifier in variable declaration');
        const declaration = { kind: 'VariableDeclaration', identifier, value: this.parse_expression(), constant: isConstant } as VariableDeclaration;

        this.expect(TokenType.Semicolon, 'Must end with semicolon');

        return declaration;
    }

    private parse_expression = (): Expression => this.parse_additive_expression();

    private parse_additive_expression = (): Expression => {
        let left = this.parse_multiplicitave_expression();

        while(this.at().value == '+' || this.at().value == '-') {
            const operator = this.eat().value;
            const right = this.parse_multiplicitave_expression();
            
            left = {
                kind: 'BinaryExpression',
                left,
                right,
                operator
            } as BinaryExpression;
        }

        return left;
    }

    private parse_multiplicitave_expression = (): Expression => {
        let left = this.parse_primary_expression();

        while(this.at().value == '/' || this.at().value == '*' || this.at().value == '%') {
            const operator = this.eat().value;
            const right = this.parse_primary_expression();
            
            left = {
                kind: 'BinaryExpression',
                left,
                right,
                operator
            } as BinaryExpression;
        }

        return left;
    }

    private parse_primary_expression = (): Expression => {
        const token = this.at().type;
        
        switch(token) {
            case TokenType.Identifier: return { kind: 'Identifier', symbol: this.eat().value } as Identifier;
            case TokenType.Number:     return { kind: 'Number',    value:  parseFloat(this.eat().value) } as Number;
            case TokenType.Null: {
                this.eat();
                return { kind: 'Null', value: 'null' } as Null;
            }
            case TokenType.LParen: {
                this.eat();
                const value = this.parse_expression();
                this.expect(TokenType.RParen, 'Expected closing paren');

                return value;
            }

            default: {
                console.error('Unexpected token found during parsing!', this.at());
                Deno.exit(1);
            }
        }
    }

    public produceAST = (source: string): Program => {
        this.tokens = tokenize(source);
        
        const program: Program = {
            kind: 'Program',
            body: []
        }

        while(this.not_eof()) program.body.push(this.parse_statement());

        return program;
    }
}