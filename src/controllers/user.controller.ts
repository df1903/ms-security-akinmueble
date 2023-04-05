import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {SecurityConfig} from '../config/security.config';
import {Credentials, Login, MenuRolePermissions, User, VerificationCode} from '../models';
import {LoginRepository, UserRepository} from '../repositories';
import {AuthService, UserSecurityService} from '../services';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @service(UserSecurityService)
    public userSecurityService: UserSecurityService,
    @repository(LoginRepository)
    public loginRepository: LoginRepository,
    @service(AuthService)
    private serviceAuth: AuthService
  ) {}

  @post('/user')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['_id'],
          }),
        },
      },
    })
    user: Omit<User, '_id'>,
  ): Promise<User> {
    // Create password
    let password = this.userSecurityService.createTxt(10);
    console.log(password);
    // Encrypt password
    let encryptedPassword = this.userSecurityService.encryptTxt(password);
    // Assign encrypted password to user
    user.password = encryptedPassword;
    // Send verification email
    // ...
    return this.userRepository.create(user);
  }

  @get('/user/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @authenticate({
    strategy: "auth",
    options:[SecurityConfig.menuUserId, SecurityConfig.listAction]
  })
  @get('/user')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/user')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/user/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/user/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/user/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/user/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  /**
   * Custom API methods
   */

  @post('/loginUser')
  @response(200, {
    description: 'Login user with credentials',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async loginUser(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credentials),
        },
      },
    })
    credentials: Credentials,
  ): Promise<object> {
    let user = await this.userSecurityService.loginUser(credentials);
    if (user) {
      let code2FA = this.userSecurityService.createTxt(6);
      let login: Login = new Login();
      login.userId = user._id!;
      login.code2FA = code2FA;
      login.codeStatus = false;
      login.token = '';
      login.tokenStatus = false;
      this.loginRepository.create(login);
      user.password = '';
      // Send email notification with code2FA
      return user;
    }
    return new HttpErrors[401]('Incorrect credentials');
  }

  @post('/validate-permissions')
  @response(200, {
    description: "Validation of permissions of a user for business logic",
    content: {'application/json': {schema: getModelSchemaRef(MenuRolePermissions)}}
  })
  async validateUserPermissions(
    @requestBody(
      {
        content: {
          'application/json': {
            schema: getModelSchemaRef(MenuRolePermissions)
          }
        }
      }
    )
    data: MenuRolePermissions
  ): Promise<UserProfile | undefined> {
    // let idRole = this.securityService.getRoleFromToken(data.token)
    return this.serviceAuth.checkUserPermissionByRole(data.idRole, data.idMenu, data.action)
  }

  @post('/codeVerification')
  @response(200, {
    description: 'Validate verification code',
  })
  async validateCode(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(VerificationCode),
        },
      },
    })
    credentials: VerificationCode,
  ): Promise<object> {
    let user = await this.userSecurityService.validateCode(credentials);
    if (user) {
      let token = this.userSecurityService.createToken(user);
      if (user) {
        user.password = '';
        try {
          this.userRepository.logins(user._id).patch(
            {
              codeStatus: true,
              token: token,
            },
            {
              codeStatus: false,
              token: '',
            },
          );
        } catch {
          console.log("Code2FA status can't change into database");
        }
        return {
          user: user,
          token: token,
        };
      }
    }
    return new HttpErrors[401]('Incorrect verification code');
  }
}
