

export class AcidValidateError extends Error
{
    constructor(message)
    {
        super(message);
    }
}

export class AcidROOperationError extends Error
{
    constructor(name, isPlain)
    {
        super(`The ${name}() operation is not supported for restricted ${isPlain ? 'objecs' : 'arrays'}.`);
    }
}
