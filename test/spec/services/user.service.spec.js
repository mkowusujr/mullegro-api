const userService = require('../../../src/api/services/user.service');
let db;
let User;

describe('User Service', () => {
    it('should be created', () => {
        expect(userService).toBeTruthy();
    });

    beforeEach(async () => {
        db = require('../../../src/api/models/index');
        User = db.users;
        await db.sequelize.sync({ force: true });
        spyOn(console, 'error');
    });
});