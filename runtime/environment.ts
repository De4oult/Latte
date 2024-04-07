import { RuntimeValue } from './values.ts';

export default class Environment {
    private parent?: Environment;
    private varibales: Map<string, RuntimeValue>;
    private constants: Set<string>;

    constructor(parentENV?: Environment) {
        this.parent    = parentENV;
        this.varibales = new Map();
        this.constants = new Set();
    }

    public declareVariable(name: string, value: RuntimeValue, isConstant: boolean): RuntimeValue {
        if(this.varibales.has(name)) throw `Cannot declare variable '${name}'. As it already is defined`;

        this.varibales.set(name, value);

        if(isConstant) this.constants.add(name);

        return value;
    }

    public assignVariable(name: string, value: RuntimeValue): RuntimeValue {
        const env = this.resolve(name);

        if(env.constants.has(name)) throw `Cannot reasign to variable '${name}'. It was declated as constant`;

        env.varibales.set(name, value);
    
        return value;
    }

    public lookupVariable(name: string): RuntimeValue {
        const env = this.resolve(name);

        return env.varibales.get(name) as RuntimeValue;
    }

    public resolve(name: string): Environment {
        if(this.varibales.has(name)) return this;
        if(this.parent == undefined) throw `Cannot resolve '${name}' as it does not exist`;

        return this.parent.resolve(name);
    }
}