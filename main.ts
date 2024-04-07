import Parser from './core/parser.ts';
import Environment, { setupGlobalEnvironment } from './runtime/environment.ts';
import { evaluate } from './runtime/interpreter.ts';

const execute = async(filename: string) => {
    const parser  = new Parser();
    const env     = setupGlobalEnvironment();

    const source  = await Deno.readTextFile(filename);
    const program = parser.produceAST(source);
    const result  = evaluate(program, env);

    console.log(result);
}

const latte = async() => {
    const parser = new Parser();
    const env    = new Environment();

    console.log('Latte v0.1')

    while(true) {
        const input = prompt('>');

        if(input.includes('exit')) Deno.exit(1);

        const program = parser.produceAST(input);

        const result = evaluate(program, env);
        console.log(result);
    }
}

execute('./source.lt');