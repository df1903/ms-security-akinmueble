import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Menu, MenuRelations, MenuRole, Role} from '../models';
import {MenuRoleRepository} from './menu-role.repository';
import {RoleRepository} from './role.repository';

export class MenuRepository extends DefaultCrudRepository<
  Menu,
  typeof Menu.prototype._id,
  MenuRelations
> {
  public readonly roles: HasManyThroughRepositoryFactory<
    Role,
    typeof Role.prototype._id,
    MenuRole,
    typeof Menu.prototype._id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('MenuRoleRepository')
    protected menuRoleRepositoryGetter: Getter<MenuRoleRepository>,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,
  ) {
    super(Menu, dataSource);
    this.roles = this.createHasManyThroughRepositoryFactoryFor(
      'roles',
      roleRepositoryGetter,
      menuRoleRepositoryGetter,
    );
    this.registerInclusionResolver('roles', this.roles.inclusionResolver);
  }
}
