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

    describe('createUser', () => {
        it('', async() => {
            pending();
        });        
        it('', async() => {
            pending();
        });
    });
    
    describe('getUser', () => {
        it('', async() => {
            pending();
        });        
        it('', async() => {
            pending();
        });
    });

    describe('getUserByEmail', () => {
        it('', async() => {
            pending();
        });        
        it('', async() => {
            pending();
        });
    });
    
    describe('getUserByUsername', () => {
        it('', async() => {
            pending();
        });        
        it('', async() => {
            pending();
        });
    });

    describe('getUserAcctDetails', () => {
        it('', async() => {
            pending();
        });        
        it('', async() => {
            pending();
        });
    });
    
    describe('getCurrentUser', () => {
        it('', async() => {
            pending();
        });        
        it('', async() => {
            pending();
        });
    });

    describe('findAll', () => {
        it('', async() => {
            pending();
        });        
        it('', async() => {
            pending();
        });
    });
    
    describe('deleteUser', () => {
        it('', async() => {
            pending();
        });        
        it('', async() => {
            pending();
        });
    });
});