export namespace SecurityConfig {
  export const keyJWT = process.env.SECRET_KEY_JWT;
  export const menuUserId = '6411fafa143133172474bb03';
  export const menuRoleId = '6410139d5498361ef89d3bbc';
  export const menuPermissionsId = '643c98d6613af3403c979492';
  export const menuMenusId = '643dd6b90349685918540d76';
  export const menuLoginsId = '643dd6c40349685918540d77';
  export const listAction = 'list';
  export const saveAction = 'save';
  export const editAction = 'edit';
  export const deleteAction = 'delete';
  export const downloadAction = 'download';
  export const createAction = 'create';
  export const mongodbConnectionString = process.env.CONNECTION_STRING_MONGODB;
  export const privilegedAccess = process.env.PRIVILEGED_ACCESS;
}
