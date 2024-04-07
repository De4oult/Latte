export type ValueType = 'null' | 'number' | 'boolean' | 'object';

export interface RuntimeValue {
    type: ValueType;
}

export interface NullValue extends RuntimeValue {
    type:  'null';
    value: null;
}

export interface BooleanValue extends RuntimeValue {
    type: 'boolean';
    value: boolean;
}

export interface NumberValue extends RuntimeValue {
    type:  'number';
    value: number;
}

export interface ObjectValue extends RuntimeValue {
    type:       'object';
    properties: Map<string, RuntimeValue>;
}

export const make_null    = (n = 0)    => ({ type: 'null', value: null } as NullValue);
export const make_number  = (n = 0)    => ({ type: 'number', value: n } as NumberValue);
export const make_boolean = (b = true) => ({ type: 'boolean', value: b } as BooleanValue);