import {AuthenticationBindings, AuthenticationMetadata, AuthenticationStrategy} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {MenuRoleRepository} from '../repositories';
import {UserSecurityService} from '../services';

export class AuthStrategy implements AuthenticationStrategy {
  name: string = 'auth';

  constructor(
    @service(UserSecurityService)
    private securityService: UserSecurityService,
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata[],
    @repository(MenuRoleRepository)
    private repositoryMenuRole: MenuRoleRepository
  ) {}

  /**
   * Authentication of a user against an action in the database
   * @param request the request with the token
   * @returns The user profile, undefined when you don't have permission or an httpError
   */
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let token = parseBearerToken(request);
    if (token){
      let idRole = this.securityService.getRoleFromToken(token);
      let idMenu: string = this.metadata[0].options![0];
      let action: string = this.metadata[0].options![1];

      let permission = await this.repositoryMenuRole.findOne({
        where:{
          roleId: idRole,
          menuId: idMenu
        }
      });
      let proceed: boolean = false;
      if (permission) {
        switch (action) {
          case "save":
            proceed = permission.save
            break;
          case "edit":
            proceed = permission.edit
            break;
          case "list":
            proceed = permission.list
            break;
          case "delete":
            proceed = permission.delete
            break;
          case "download":
            proceed = permission.download
            break;
          case "create":
            proceed = permission.create
            break;
          default:
            throw new HttpErrors[401]("The action cannot be performed because it does not exist");
        }
        if(proceed){
          let profile: UserProfile = Object.assign({
            permitted: "Ok"
          });
          return profile;
        } else {
          return undefined;
        }

      } else {
        throw new HttpErrors[401]("It is not possible to execute the action due to lack of permissions.");
      }
    }
    throw new HttpErrors[401]("it is not possible to execute the action due to lack of a token.");

  }
}
