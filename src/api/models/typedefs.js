/**
 * @typedef {Object} User The User data object
 * @property {number} id The user's id
 * @property {string} name The user's name
 * @property {string} address The user's address
 * @property {string} username The user's username
 * @property {string} email The user's email
 * @property {string} password The user's password
 * @property {string} bio The user's bio
 * @property {string} profile_picture The user's profile_picture
 * @property {Cart} cart The user's cart
 */

/**
 * @typedef {Object} Post The Post data object
 * @property {number} id The post's id
 * @property {string} title The post's title
 * @property {string} price The post's price
 * @property {string} description The post's description
 * @property {string} condition The post's condition
 * @property {string} category The post's category
 * @property {string} status The post's status
 * @property {string} display_picture The post's display_picture
 */

/**
 * @typedef {Object} Cart The Cart data object
 * @property {number} id The cart's id
 * @property {number} totalAmount The cart's totalAmount
 * @property {number} itemCount The cart's itemCount
 * @property {Post[]} posts The cart's posts
 */

/**
 * @typedef {Object} Transaction The Transaction data object
 * @property {number} id The transaction's id
 * @property {number} dateString The transaction's dateString
 * @property {number} totalAmount The transaction's totalAmount
 * @property {number} itemCount The transaction's itemCount
 * @property {Post[]} posts The transaction's posts
 */

/**
 * @typedef {Object} loginObject The loginObject data object
 * @property {string} emailOrUsername Either the user's email or username
 * @property {string} password The user's password
 */

/**
 * @typedef {Object} Review The Review data object
 * @property {number} id The review's id
 * @property {string} dateString The review's dateString
 * @property {number} rating The review's numeric rating
 * @property {string} description The review's description
 * @property {User} user The review's owner
 * @property {Post} post The review's post
 */