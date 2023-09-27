/**
 * Archivo general de configuración.
 * Un simple objeto con distintas constantes, se puede importar para utilizar en cualquier componente que se necesite
 */

const appConfig = {
    API_BASE_URL: 'https://lastproyectbackend-production.up.railway.app/',
    GET_USERS_ENDPOINT: 'api/users',
    POST_USERS_LOGIN: 'api/users/login',
    PUT_USER_ENDPOINT: 'api/users',
    POST_USERS_REGISTER: 'api/users/create',
    PUT_USERS_UPDATE: 'api/users',
    GET_ROOM_ENDPOINT: 'api/rooms',
    ADD_CART_ENDPOINT: 'api/users/cart/add'
}

export default appConfig