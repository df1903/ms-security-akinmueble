import {Model, model, property} from '@loopback/repository';

@model()
export class RecoveryPasswordCredentials extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  constructor(data?: Partial<RecoveryPasswordCredentials>) {
    super(data);
  }
}

export interface RecoveryPasswordCredentialsRelations {
  // describe navigational properties here
}

export type RecoveryPasswordCredentialsWithRelations =
  RecoveryPasswordCredentials & RecoveryPasswordCredentialsRelations;
