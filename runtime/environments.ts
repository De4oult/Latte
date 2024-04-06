import { RuntimeValue } from './values.ts';



export default class Environment {
    private parent?: Environment;
    
    private varibales: Map<string, RuntimeValue>;

    constructor(parentENV?: Environment) {
        this.parent    = parentENV;
        this.varibales = new Map();
    }

    public declareVariable(name: string, value: RuntimeValue): RuntimeValue {
        if(this.varibales.has(name)) throw `Cannot declare variable '${name}'. As it already is defined`;

        this.varibales.set(name, value);
        return value;
    }

    public assignVariable(name: string, value: RuntimeValue): RuntimeValue {
        const env = this.resolve(name);

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