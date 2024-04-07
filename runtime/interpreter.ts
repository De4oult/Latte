import { RuntimeValue, NumberValue, make_null } from './values.ts';
import { BinaryExpression, Number, Program, Statement, Identifier, VariableDeclaration } from '../core/ast.ts';
import Environment from './environment.ts';
import { evaluate_identifier, evaluate_binary_expression } from './evaluate/expressions.ts';
import { evaluate_program, evaluate_variable_declaration } from './evaluate/statements.ts';



export const evaluate = (astNode: Statement, env: Environment): RuntimeValue => {
    switch(astNode.kind) {
        case 'Number':              return { value: ((astNode as Number).value), type: 'number'} as NumberValue;
        case 'Identifier':          return evaluate_identifier(astNode as Identifier, env);
        case 'BinaryExpression':    return evaluate_binary_expression(astNode as BinaryExpression, env);
        case 'Program':             return evaluate_program(astNode as Program, env);
        case 'VariableDeclaration': return evaluate_variable_declaration(astNode as VariableDeclaration, env);
        default:
            console.error('This AST Node has not yet been setup for interpretation', astNode);
            Deno.exit(1);
    }
}