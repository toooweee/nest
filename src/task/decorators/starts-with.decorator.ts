import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function StartsWithDecorator(
  prefix: string,
  validationOptions?: ValidationOptions,
) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'StartsWith',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(
          value: any,
          args?: ValidationArguments,
        ): Promise<boolean> | boolean {
          return typeof value === 'string' && value.startsWith(prefix);
        },
        defaultMessage(args?: ValidationArguments): string {
          return `${prefix}${args}`;
        },
      },
    });
  };
}
