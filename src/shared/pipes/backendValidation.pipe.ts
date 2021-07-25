import {
  HttpStatus,
  HttpException,
  PipeTransform,
  ValidationError,
  ArgumentMetadata
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

export class BackendValidationPipe implements PipeTransform {
  async transform(
    value: any,
    metadata: ArgumentMetadata
  ): Promise<any> {
    if (typeof value !== 'object') {
      return value;
    }

    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length === 0) {
      return value;
    }

    throw new HttpException({ errors: this.formatErrors(errors) }, HttpStatus.UNPROCESSABLE_ENTITY);
  }

  private formatErrors(errors: ValidationError[]) {
    return errors.reduce((acc, err) => ({ ...acc, [err.property]: Object.values(err.constraints) }), {});
  }
}
