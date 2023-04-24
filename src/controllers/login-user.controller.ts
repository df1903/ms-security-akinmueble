import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {SecurityConfig} from '../config/security.config';
import {Login, User} from '../models';
import {LoginRepository} from '../repositories';

export class LoginUserController {
  constructor(
    @repository(LoginRepository)
    public loginRepository: LoginRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuLoginsId, SecurityConfig.listAction],
  })
  @get('/logins/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Login',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Login.prototype._id,
  ): Promise<User> {
    return this.loginRepository.user(id);
  }
}
