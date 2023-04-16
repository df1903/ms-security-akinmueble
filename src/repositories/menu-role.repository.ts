import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {MenuRole, MenuRoleRelations} from '../models';

export class MenuRoleRepository extends DefaultCrudRepository<
  MenuRole,
  typeof MenuRole.prototype._id,
  MenuRoleRelations
> {
  constructor(@inject('datasources.mongodb') dataSource: MongodbDataSource) {
    super(MenuRole, dataSource);
  }
}
