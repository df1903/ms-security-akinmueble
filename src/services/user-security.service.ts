import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Credentials, User} from '../models';
import {UserRepository} from '../repositories';
const generator = require('generate-password');
const MD5 = require('crypto-js/md5');

@injectable({scope: BindingScope.TRANSIENT})
export class UserSecurityService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  /**
   * Create random password with n characters
   * @param n password lenght
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
   * @returns User finded or null
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
}
