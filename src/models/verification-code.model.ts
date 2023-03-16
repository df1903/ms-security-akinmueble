import {Model, model, property} from '@loopback/repository';

@model()
export class VerificationCode extends Model {
  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  code2FA: string;

  constructor(data?: Partial<VerificationCode>) {
    super(data);
  }
}

export interface VerificationCodeRelations {
  // describe navigational properties here
}

export type VerificationCodeWithRelations = VerificationCode &
  VerificationCodeRelations;
