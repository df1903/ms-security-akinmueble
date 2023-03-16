import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Login extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  code2FA: string;

  @property({
    type: 'string',
    required: true,
  })
  codeStatus: boolean;

  @property({
    type: 'string',
  })
  token?: string;

  @property({
    type: 'boolean',
    required: true,
  })
  tokenStatus: boolean;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Login>) {
    super(data);
  }
}

export interface LoginRelations {
  // describe navigational properties here
}

export type LoginWithRelations = Login & LoginRelations;
