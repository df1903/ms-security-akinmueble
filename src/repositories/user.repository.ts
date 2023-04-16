import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Login, Role, User, UserRelations} from '../models';
import {LoginRepository} from './login.repository';
import {RoleRepository} from './role.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype._id,
  UserRelations
> {
  public readonly logins: HasManyRepositoryFactory<
    Login,
    typeof User.prototype._id
  >;

  public readonly role: BelongsToAccessor<Role, typeof User.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('LoginRepository')
    protected loginRepositoryGetter: Getter<LoginRepository>,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,
  ) {
    super(User, dataSource);
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
    this.logins = this.createHasManyRepositoryFactoryFor(
      'logins',
      loginRepositoryGetter,
    );
    this.registerInclusionResolver('logins', this.logins.inclusionResolver);
  }
}
