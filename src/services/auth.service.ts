import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {MenuRoleRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
  constructor(
    @repository(MenuRoleRepository)
    private repositoryMenuRole: MenuRoleRepository,
  ) {}

  async checkUserPermissionByRole(
    idRole: string,
    idMenu: string,
    action: string,
  ): Promise<UserProfile | undefined> {
    let permission = await this.repositoryMenuRole.findOne({
      where: {
        roleId: idRole,
        menuId: idMenu,
      },
    });
    console.log(permission);
    let proceed: boolean = false;
    if (permission) {
      switch (action) {
        case 'save':
          proceed = permission.save;
          break;
        case 'edit':
          proceed = permission.edit;
          break;
        case 'list':
          proceed = permission.list;
          break;
        case 'delete':
          proceed = permission.delete;
          break;
        case 'download':
          proceed = permission.download;
          break;
        case 'create':
          proceed = permission.create;
          break;
        default:
          throw new HttpErrors[401](
            'The action cannot be performed because it does not exist',
          );
      }
      if (proceed) {
        let profile: UserProfile = Object.assign({
          permitted: 'Ok',
        });
        return profile;
      } else {
        return undefined;
      }
    } else {
      throw new HttpErrors[401](
        'It is not possible to execute the action due to lack of permissions.',
      );
    }
  }
}
