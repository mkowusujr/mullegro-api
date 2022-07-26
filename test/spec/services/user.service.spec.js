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
        it('can create a user', async() => {
            let userObject = {
                name:'John Doe',
                username: "fake_user",
                address: "America",
                email: 'notreal@email.com',
                password: 'safeAndSecurePassword'
            };

            let response = await userService.createUser(userObject);

            expect(response.name).toBe(userObject.name);
            expect(response.username).toBe(userObject.username);
            expect(response.address).toBe(userObject.address);
            expect(response.email).toBe(userObject.email);
            expect(response.password).toBeTruthy();
        });        
        it('', async() => {
            
            try {
                User.create({
                    name:'John Doe',
                    username: "fake_user",
                    address: "America",
                    email: 'notreal@email.com',
                    password: 'safeAndSecurePassword'
                })
    
                let userObject = {
                    name:'John Doe',
                    username: "fake_user",
                    address: "America",
                    email: 'notreal@email.com',
                    password: 'safeAndSecurePassword'
                };
                
                let response = await userService.createUser(userObject);
                if (response || !response) fail('Didn\'t throw error');
            } catch (error) {
                expect(console.error).toHaveBeenCalled();
            }
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