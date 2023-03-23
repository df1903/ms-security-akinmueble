import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {MenuRole} from '../models';
import {MenuRoleRepository} from '../repositories';

export class PermissionsController {
  constructor(
    @repository(MenuRoleRepository)
    public menuRoleRepository : MenuRoleRepository,
  ) {}

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

  @get('/permission/count')
  @response(200, {
    description: 'MenuRole model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MenuRole) where?: Where<MenuRole>,
  ): Promise<Count> {
    return this.menuRoleRepository.count(where);
  }

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
    @param.filter(MenuRole, {exclude: 'where'}) filter?: FilterExcludingWhere<MenuRole>
  ): Promise<MenuRole> {
    return this.menuRoleRepository.findById(id, filter);
  }

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

  @del('/permission/{id}')
  @response(204, {
    description: 'MenuRole DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.menuRoleRepository.deleteById(id);
  }
}
