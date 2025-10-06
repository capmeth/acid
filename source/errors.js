
export class AcidValidateError extends Error
{
    constructor(reason, prop, value)
    {
        super();

        this.reason = reason;
        this.prop = prop;
        this.value = value;

        this.message = `${prop} ${reason}`;
        if (value !== void 0) this.message += `; received ${JSON.stringify(value) || value}`;
    }
}

export class AcidROOperationError extends Error
{
    constructor(name, isPlain)
    {
        super(`The ${name}() operation is not supported for restricted ${isPlain ? 'objects' : 'arrays'}.`);
    }
}
