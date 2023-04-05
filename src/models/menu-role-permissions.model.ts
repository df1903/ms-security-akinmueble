import {Model, model, property} from '@loopback/repository';

@model()
export class MenuRolePermissions extends Model {
  @property({
    type: 'string',
    required: true,
  })
  idRole: string;

  @property({
    type: 'string',
    required: true,
  })
  idMenu: string;

  @property({
    type: 'string',
    required: true,
  })
  action: string;


  constructor(data?: Partial<MenuRolePermissions>) {
    super(data);
  }
}

export interface MenuRolePermissionsRelations {
  // describe navigational properties here
}

export type MenuRolePermissionsWithRelations = MenuRolePermissions & MenuRolePermissionsRelations;
