import { Program, VariableDeclaration } from '../../core/ast.ts';
import Environment from '../environment.ts';
import { evaluate } from '../interpreter.ts';
import { RuntimeValue, make_null } from '../values.ts';

export const evaluate_program = (program: Program, env: Environment): RuntimeValue => {
    let lastEvaluated: RuntimeValue = make_null();

    for(const statement of program.body) lastEvaluated = evaluate(statement, env);

    return lastEvaluated;
}


export const evaluate_variable_declaration = (declaration: VariableDeclaration, env: Environment): RuntimeValue => {
    const value = declaration.value ? evaluate(declaration.value, env) : make_null();

    return env.declareVariable(declaration.identifier, value, declaration.constant);
}