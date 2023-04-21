import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
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
import {SecurityConfig} from '../config/security.config';
import {MenuRole} from '../models';
import {MenuRoleRepository} from '../repositories';

export class PermissionsController {
  constructor(
    @repository(MenuRoleRepository)
    public menuRoleRepository: MenuRoleRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPermissionsId, SecurityConfig.createAction],
  })
  @post('/permission')
  @response(200, {
    description: 'MenuRole model instance',
    content: {'application/json': {schema: getModelSchemaRef(MenuRole)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MenuRole, {
            title: 'NewMenuRole',
            exclude: ['_id'],
          }),
        },
      },
    })
    menuRole: Omit<MenuRole, '_id'>,
  ): Promise<MenuRole> {
    return this.menuRoleRepository.create(menuRole);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPermissionsId, SecurityConfig.listAction],
  })
  @get('/permission/count')
  @response(200, {
    description: 'MenuRole model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(MenuRole) where?: Where<MenuRole>): Promise<Count> {
    return this.menuRoleRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPermissionsId, SecurityConfig.listAction],
  })
  @get('/permission')
  @response(200, {
    description: 'Array of MenuRole model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MenuRole, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MenuRole) filter?: Filter<MenuRole>,
  ): Promise<MenuRole[]> {
    return this.menuRoleRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPermissionsId, SecurityConfig.editAction],
  })
  @patch('/permission')
  @response(200, {
    description: 'MenuRole PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MenuRole, {partial: true}),
        },
      },
    })
    menuRole: MenuRole,
    @param.where(MenuRole) where?: Where<MenuRole>,
  ): Promise<Count> {
    return this.menuRoleRepository.updateAll(menuRole, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPermissionsId, SecurityConfig.listAction],
  })
  @get('/permission/{id}')
  @response(200, {
    description: 'MenuRole model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MenuRole, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(MenuRole, {exclude: 'where'})
    filter?: FilterExcludingWhere<MenuRole>,
  ): Promise<MenuRole> {
    return this.menuRoleRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPermissionsId, SecurityConfig.editAction],
  })
  @patch('/permission/{id}')
  @response(204, {
    description: 'MenuRole PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MenuRole, {partial: true}),
        },
      },
    })
    menuRole: MenuRole,
  ): Promise<void> {
    await this.menuRoleRepository.updateById(id, menuRole);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPermissionsId, SecurityConfig.editAction],
  })
  @put('/permission/{id}')
  @response(204, {
    description: 'MenuRole PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() menuRole: MenuRole,
  ): Promise<void> {
    await this.menuRoleRepository.replaceById(id, menuRole);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuPermissionsId, SecurityConfig.deleteAction],
  })
  @del('/permission/{id}')
  @response(204, {
    description: 'MenuRole DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.menuRoleRepository.deleteById(id);
  }
}
