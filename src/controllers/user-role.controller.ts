import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {SecurityConfig} from '../config/security.config';
import {Role, User} from '../models';
import {UserRepository} from '../repositories';

export class UserRoleController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuUserId, SecurityConfig.listAction],
  })
  @get('/users/{id}/role', {
    responses: {
      '200': {
        description: 'Role belonging to User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Role)},
          },
        },
      },
    },
  })
  async getRole(
    @param.path.string('id') id: typeof User.prototype._id,
  ): Promise<Role> {
    return this.userRepository.role(id);
  }
}
