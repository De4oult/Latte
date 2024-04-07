import Parser from './core/parser.ts';
import Environment from './runtime/environment.ts';
import { evaluate } from './runtime/interpreter.ts';
import { make_number, make_null, make_boolean } from './runtime/values.ts';

const latte = async() => {
    const parser = new Parser();
    const env    = new Environment();

    env.declareVariable('true',  make_boolean(true));
    env.declareVariable('false', make_boolean(false));
    env.declareVariable('null',  make_null());

    console.log('Latte v0.1')

    while(true) {
        const input = prompt('>');

        if(input.includes('exit')) Deno.exit(1);

        const program = parser.produceAST(input);

        const result = evaluate(program, env);
        console.log(result);
    }
}

latte();