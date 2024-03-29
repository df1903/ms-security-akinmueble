import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {SecurityConfig} from '../config/security.config';
import {Credentials, MenuRole, User, VerificationCode} from '../models';
import {
  LoginRepository,
  MenuRoleRepository,
  UserRepository,
} from '../repositories';

const generator = require('generate-password');
const MD5 = require('crypto-js/md5');
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class UserSecurityService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(LoginRepository)
    public loginRepository: LoginRepository,
    @repository(MenuRoleRepository)
    public menuRoleRepository: MenuRoleRepository,
  ) {}

  /**
   * Create random password with n characters
   * @param n password length
   * @returns random password with n characters
   */
  createTxt(n: number): string {
    let password = generator.generate({
      length: n,
      numbers: true,
    });
    return password;
  }

  /**
   * Encrypt text with MD5 method
   * @param txt Text to encrypt
   * @returns Encrypted text with MD5
   */
  encryptTxt(txt: string): string {
    let txtEncrypted = MD5(txt).toString();
    return txtEncrypted;
  }

  /**
   * Search an user with its credentials
   * @param credentials User credentials
   * @returns User found or null
   */
  async loginUser(credentials: Credentials): Promise<User | null> {
    let user = await this.userRepository.findOne({
      where: {
        email: credentials.email,
        password: credentials.password,
      },
    });
    return user as User;
  }

  /**
   * Validation of credentials with verification code
   * @param credentials Credentials by user with verification code
   * @returns User or null
   */
  async validateCode(credentials: VerificationCode): Promise<User | null> {
    let login = await this.loginRepository.findOne({
      where: {
        userId: credentials.userId,
        code2FA: credentials.code2FA,
        codeStatus: false,
      },
    });
    if (login) {
      let user = await this.userRepository.findById(credentials.userId);
      return user;
    }
    return null;
  }

  /**
   * Token JWT generator
   * @param user
   * @returns tokenJWT
   */
  createToken(user: User): string {
    let data = {
      name: `${user.firstName} ${user.secondName} ${user.firstLastname} ${user.secondLastname}`,
      role: user.roleId,
      email: user.email,
    };
    let token = jwt.sign(data, SecurityConfig.keyJWT);
    return token;
  }
  /**
   * validate and get token information
   * @param tk the token
   * @returns th _id of the role
   */
  getRoleFromToken(tk: string): string {
    let obj = jwt.verify(tk, SecurityConfig.keyJWT);
    return obj.role;
  }

  /**
   * Get permissions by role
   * @param idRol id role
   */
  async getPermissionsByUser(roleId: string): Promise<MenuRole[]> {
    let menu: MenuRole[] = await this.menuRoleRepository.find({
      where: {
        or: [{list: true}, {listClient: true}],
        roleId: roleId,
      },
    });
    console.log(menu);
    return menu;
  }
}
