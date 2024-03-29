import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Menu, MenuRole, Role, RoleRelations, User} from '../models';
import {MenuRoleRepository} from './menu-role.repository';
import {MenuRepository} from './menu.repository';
import {UserRepository} from './user.repository';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype._id,
  RoleRelations
> {
  public readonly menus: HasManyThroughRepositoryFactory<
    Menu,
    typeof Menu.prototype._id,
    MenuRole,
    typeof Role.prototype._id
  >;

  public readonly users: HasManyRepositoryFactory<
    User,
    typeof Role.prototype._id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('MenuRoleRepository')
    protected menuRoleRepositoryGetter: Getter<MenuRoleRepository>,
    @repository.getter('MenuRepository')
    protected menuRepositoryGetter: Getter<MenuRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Role, dataSource);
    this.users = this.createHasManyRepositoryFactoryFor(
      'users',
      userRepositoryGetter,
    );
    this.registerInclusionResolver('users', this.users.inclusionResolver);
    this.menus = this.createHasManyThroughRepositoryFactoryFor(
      'menus',
      menuRepositoryGetter,
      menuRoleRepositoryGetter,
    );
    this.registerInclusionResolver('menus', this.menus.inclusionResolver);
  }
}
