/**
 * Archivo general de configuración.
 * Un simple objeto con distintas constantes, se puede importar para utilizar en cualquier componente que se necesite
 */

const appConfig = {
    API_BASE_URL: 'https://api-hotel-85iz.onrender.com/',
    GET_USERS_ENDPOINT: 'api/users',
    POST_USERS_LOGIN: 'api/users/login',
    PUT_USER_ENDPOINT: 'api/users',
    DEL_USER_ENDPOINT: 'api/users',
    POST_USERS_REGISTER: 'api/users/create',
    GET_ROOM_ENDPOINT: 'api/rooms',
    PUT_ROOM_ENDPOINT: 'api/rooms/admin',
    DEL_ROOM_ENDPOINT: 'api/rooms/admin',
    CREATE_ROOM: 'api/rooms/admin',
    RESERVATION_ROOM: 'api/rooms/reserved',
    RESERVED_ADMIN: 'api/reserved/admin/reservations',
    RESERVED_ROOM: 'api/reserved/reservation',
    DELETE_RESERVATION: 'api/reserved/admin/deletereservation',
}

export default appConfig