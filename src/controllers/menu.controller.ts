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
import {Menu} from '../models';
import {MenuRepository} from '../repositories';

export class MenuController {
  constructor(
    @repository(MenuRepository)
    public menuRepository: MenuRepository,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuMenusId, SecurityConfig.createAction],
  })
  @post('/menu')
  @response(200, {
    description: 'Menu model instance',
    content: {'application/json': {schema: getModelSchemaRef(Menu)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Menu, {
            title: 'NewMenu',
            exclude: ['_id'],
          }),
        },
      },
    })
    menu: Omit<Menu, '_id'>,
  ): Promise<Menu> {
    return this.menuRepository.create(menu);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuMenusId, SecurityConfig.listAction],
  })
  @get('/menu/count')
  @response(200, {
    description: 'Menu model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Menu) where?: Where<Menu>): Promise<Count> {
    return this.menuRepository.count(where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuMenusId, SecurityConfig.listAction],
  })
  @get('/menu')
  @response(200, {
    description: 'Array of Menu model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Menu, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Menu) filter?: Filter<Menu>): Promise<Menu[]> {
    return this.menuRepository.find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuMenusId, SecurityConfig.editAction],
  })
  @patch('/menu')
  @response(200, {
    description: 'Menu PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Menu, {partial: true}),
        },
      },
    })
    menu: Menu,
    @param.where(Menu) where?: Where<Menu>,
  ): Promise<Count> {
    return this.menuRepository.updateAll(menu, where);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuMenusId, SecurityConfig.listAction],
  })
  @get('/menu/{id}')
  @response(200, {
    description: 'Menu model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Menu, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Menu, {exclude: 'where'}) filter?: FilterExcludingWhere<Menu>,
  ): Promise<Menu> {
    return this.menuRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuMenusId, SecurityConfig.editAction],
  })
  @patch('/menu/{id}')
  @response(204, {
    description: 'Menu PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Menu, {partial: true}),
        },
      },
    })
    menu: Menu,
  ): Promise<void> {
    await this.menuRepository.updateById(id, menu);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuMenusId, SecurityConfig.createAction],
  })
  @put('/menu/{id}')
  @response(204, {
    description: 'Menu PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() menu: Menu,
  ): Promise<void> {
    await this.menuRepository.replaceById(id, menu);
  }

  @authenticate({
    strategy: 'auth',
    options: [SecurityConfig.menuMenusId, SecurityConfig.deleteAction],
  })
  @del('/menu/{id}')
  @response(204, {
    description: 'Menu DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.menuRepository.deleteById(id);
  }
}
