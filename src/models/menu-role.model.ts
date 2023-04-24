import {Entity, model, property} from '@loopback/repository';

@model()
export class MenuRole extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'boolean',
    required: true,
  })
  save: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  edit: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  list: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  delete: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  create: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  download: boolean;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
  })
  roleId?: string;

  @property({
    type: 'string',
  })
  menuId?: string;

  constructor(data?: Partial<MenuRole>) {
    super(data);
  }
}

export interface MenuRoleRelations {
  // describe navigational properties here
}

export type MenuRoleWithRelations = MenuRole & MenuRoleRelations;
