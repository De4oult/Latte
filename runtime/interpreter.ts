import { RuntimeValue, NumberValue, make_null } from './values.ts';
import { BinaryExpression, Number, Program, Statement, Identifier } from '../core/ast.ts';
import Environment from './environments.ts';

const evaluate_program = (program: Program, env: Environment): RuntimeValue => {
    let lastEvaluated: RuntimeValue = make_null();

    for(const statement of program.body) lastEvaluated = evaluate(statement, env);

    return lastEvaluated;
}

const evaluate_numeric_binary_expression = (lhs: NumberValue, rhs: NumberValue, operator: string): NumberValue => {
    let result = 0;

    switch(operator) {
        case '+': result = lhs.value + rhs.value; break;
        case '-': result = lhs.value - rhs.value; break;
        case '*': result = lhs.value * rhs.value; break;
        case '/': result = lhs.value / rhs.value; break;
        case '%': result = lhs.value % rhs.value; break;
        default:  break;
    }

    return { value: result, type: 'number' };
}

const evaluate_binary_expression = (binary: BinaryExpression, env: Environment): RuntimeValue => {
    const lhs = evaluate(binary.left, env);
    const rhs = evaluate(binary.right, env);

    if(lhs.type == 'number' && rhs.type == 'number') return evaluate_numeric_binary_expression(lhs as NumberValue, rhs as NumberValue, binary.operator);

    return make_null();
}

const evaluate_identifier = (identifier: Identifier, env: Environment): RuntimeValue => env.lookupVariable(identifier.symbol);

export const evaluate = (astNode: Statement, env: Environment): RuntimeValue => {
    switch(astNode.kind) {
        case 'Number':           return { value: ((astNode as Number).value), type: 'number'} as NumberValue;
        case 'Identifier':       return evaluate_identifier(astNode as Identifier, env);
        case 'BinaryExpression': return evaluate_binary_expression(astNode as BinaryExpression, env);
        case 'Program':          return evaluate_program(astNode as Program, env);
        default:
            console.error('This AST Node has not yet been setup for interpretation', astNode);
            Deno.exit(1);
    }
}