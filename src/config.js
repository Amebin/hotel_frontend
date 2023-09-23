/**
 * Archivo general de configuración.
 * Un simple objeto con distintas constantes, se puede importar para utilizar en cualquier componente que se necesite
 */

const appConfig = {
    API_BASE_URL: 'http://localhost:5010/',
    POST_USERS_LOGIN: 'api/users/login',
    POST_USERS_REGISTER: 'api/users/create',
    GET_ROOM_ENDPOINT: 'api/rooms',
    ADD_CART_ENDPOINT: 'api/users/cart/add'
}

export default appConfig