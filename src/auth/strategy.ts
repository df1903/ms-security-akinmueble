import {
  AuthenticationBindings,
  AuthenticationMetadata,
  AuthenticationStrategy,
} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {SecurityConfig} from '../config/security.config';
import {MenuRoleRepository} from '../repositories';
import {AuthService, UserSecurityService} from '../services';

export class AuthStrategy implements AuthenticationStrategy {
  name: string = 'auth';

  constructor(
    @service(UserSecurityService)
    private securityService: UserSecurityService,
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata[],
    @repository(MenuRoleRepository)
    private repositoryMenuRole: MenuRoleRepository,
    @service(AuthService)
    private authService: AuthService,
  ) {}

  /**
   * Authentication of a user against an action in the database
   * @param request The request with the token
   * @returns The user profile, undefined when you don't have permission or an httpError
   */
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let token = parseBearerToken(request);
    //  Access to the programmer without the need for a token (Backdoor)
    if (token == SecurityConfig.privilegedAccess) {
      let profile: UserProfile = Object.assign({
        permitted: 'Ok',
      });
      return profile;
    }
    // Access to a user with a token
    if (token) {
      let idRole = this.securityService.getRoleFromToken(token);
      let idMenu: string = this.metadata[0].options![0];
      let action: string = this.metadata[0].options![1];
      try {
        let res = await this.authService.checkUserPermissionByRole(
          idRole,
          idMenu,
          action,
        );
        return res;
      } catch (e) {
        throw e;
      }
    }
    throw new HttpErrors[401](
      'It is not possible to execute the action due to lack of a token.',
    );
  }
}
