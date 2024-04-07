import { AssignmentExpression, BinaryExpression, Identifier, Object } from '../../core/ast.ts';
import Environment from '../environment.ts';
import { evaluate } from '../interpreter.ts';
import { NumberValue, ObjectValue, RuntimeValue, make_null } from '../values.ts';

export const evaluate_numeric_binary_expression = (lhs: NumberValue, rhs: NumberValue, operator: string): NumberValue => {
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

export const evaluate_binary_expression = (binary: BinaryExpression, env: Environment): RuntimeValue => {
    const lhs = evaluate(binary.left, env);
    const rhs = evaluate(binary.right, env);

    if(lhs.type == 'number' && rhs.type == 'number') return evaluate_numeric_binary_expression(lhs as NumberValue, rhs as NumberValue, binary.operator);

    return make_null();
}

export const evaluate_identifier = (identifier: Identifier, env: Environment): RuntimeValue => env.lookupVariable(identifier.symbol);

export const evaluate_assignment = (node: AssignmentExpression, env: Environment): RuntimeValue => {
    if(node.assign.kind != 'Identifier') throw `Cannot assign value to not-identifier`;
    
    const name = (node.assign as Identifier).symbol;
    return env.assignVariable(name, evaluate(node.value, env));
}

export const evaluate_object_expression = (obj: Object, env: Environment): RuntimeValue => {
    const object = { type: 'object', properties: new Map() } as ObjectValue;

    for(const { key, value } of obj.properties) {
        const runtimeValue = (value == undefined) ? env.lookupVariable(key) : evaluate(value, env);

        object.properties.set(key, runtimeValue);
    }
    
    return object;
}