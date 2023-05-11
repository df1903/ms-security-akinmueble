import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
  repository,
} from '@loopback/repository';
import {
  HttpErrors,
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {NotificationsConfig} from '../config/notifications.config';
import {SecurityConfig} from '../config/security.config';
import {
  Credentials,
  Login,
  MenuRolePermissions,
  RecoveryPasswordCredentials,
  User,
  VerificationCode,
} from '../models';
import {LoginRepository, RoleRepository, UserRepository} from '../repositories';
import {
  AuthService,
  NotificationsService,
  UserSecurityService,
} from '../services';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    @service(UserSecurityService)
    public userSecurityService: UserSecurityService,
    @repository(LoginRepository)
    public loginRepository: LoginRepository,
    @service(AuthService)
    private serviceAuth: AuthService,
    @service(NotificationsService)
    public serviceNotifications: NotificationsService,
  ) {}

  /**
   * A user is created by generating and encrypting the password
   * @param user
   * @returns new user
   */
  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuUserId, SecurityConfig.createAction],
  })
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
    console.log('OE');

    // Create password
    let password = this.userSecurityService.createTxt(10);
    // Encrypt password
    let encryptedPassword = this.userSecurityService.encryptTxt(password);
    // Assign encrypted password to user
    user.password = encryptedPassword;
    // user.validationStatus = true;
    let role = await this.roleRepository.findOne({
      where: {_id: user.roleId},
    });
    if (role?._id) {
      user.roleId = role?._id;
    }
    let info = {
      firstName: user.firstName,
      firstLastname: user.firstLastname,
      email: user.email,
      password: password,
      role: role?.name,
    };
    this.serviceNotifications.sendCredentialsByEmail(info);
    return this.userRepository.create(user);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuUserId, SecurityConfig.listAction],
  })
  @get('/user/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuUserId, SecurityConfig.listAction],
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

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuUserId, SecurityConfig.listAction],
  })
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

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuUserId, SecurityConfig.editAction],
  })
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

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuUserId, SecurityConfig.deleteAction],
  })
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
      let data = {
        destinyEmail: user.email,
        destinyName: user.firstName,
        emailBody: `Your 2FA Code is: ${code2FA}`,
        emailSubject: NotificationsConfig.emailSubject2FA,
      };
      let url = NotificationsConfig.urlNotifications2FA;
      this.serviceNotifications.sendNotification(data, url);
      return user;
    }
    return new HttpErrors[401]('Incorrect credentials');
  }

  @post('/validate-permissions')
  @response(200, {
    description: 'Validation of permissions of a user for business logic',
    content: {
      'application/json': {schema: getModelSchemaRef(MenuRolePermissions)},
    },
  })
  async validateUserPermissions(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MenuRolePermissions),
        },
      },
    })
    data: MenuRolePermissions,
  ): Promise<UserProfile | undefined> {
    let idRole = this.userSecurityService.getRoleFromToken(data.token);
    return this.serviceAuth.checkUserPermissionByRole(
      idRole,
      data.idMenu,
      data.action,
    );
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

  @post('/recovery-password')
  @response(200, {
    description: 'Recover password by SMS',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async recoveryPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecoveryPasswordCredentials),
        },
      },
    })
    credentials: RecoveryPasswordCredentials,
  ): Promise<object> {
    let user = await this.userRepository.findOne({
      where: {
        email: credentials.email,
      },
    });
    if (user) {
      let newPassword = this.userSecurityService.createTxt(5);
      console.log(newPassword);
      let encryptedPassword = this.userSecurityService.encryptTxt(newPassword);
      user.password = encryptedPassword;
      this.userRepository.updateById(user._id, user);
      // Send sms notification
      let info = {
        newPassword: newPassword,
        firstName: user.firstName,
        firstLastname: user.firstLastname,
        email: user.email,
        phone: user.phone,
      };
      this.serviceNotifications.RecoveryPasswordCredentials(info);

      return user;
    }
    return new HttpErrors[401]('Incorrect credentials');
  }
}
