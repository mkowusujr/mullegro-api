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
            expect(response.password).not.toBe(userObject.password);
        });        
        it('doesn\'t allow duplicate usernames in the database', async() => {
            
            try {
                await User.create({
                    name:'John Doe',
                    username: "fake_user",
                    address: "America",
                    email: 'notreal@email.com',
                    password: 'safeAndSecurePassword'
                })

                let userObject = {
                    name:'John Doe Jr',
                    username: "fake_user",
                    address: "America",
                    email: 'notreal@email.com',
                    password: 'safeAndSecurePassword'
                };

                let response = await userService.createUser(userObject);
                if (!response || response) fail('Didn\'t throw error');
            } catch (error) {
                expect(console.error).toHaveBeenCalled();
            }
        });
    });
    
    describe('getUser', () => {
        it('fetches a user from the database', async() => {
            let user = await User.create({
                name:'John Doe',
                username: "fake_user",
                address: "America",
                email: 'notreal@email.com',
                password: 'safeAndSecurePassword'
            });
            let userId = 1;

            let response = await userService.getUser(userId);

            expect(response.id).toEqual(userId)
            expect(response.name).toEqual(user.name);
        });        
        it('throws an error if there is an issue', async() => {
            try {
                let userId = 1;
                let response = await userService.getUser(userId);
                if (response || !response) fail('Didn\'t throw error');
              } catch (error) {
                expect(console.error).toHaveBeenCalled();
              }
        });
    });

    describe('getUserByEmail', () => {
        it('fetches a user from the database', async() => {
            let user = await User.create({
                name:'John Doe',
                username: "fake_user",
                address: "America",
                email: 'notreal@email.com',
                password: 'safeAndSecurePassword'
            });
            let userEmail = 'notreal@email.com';

            let response = await userService.getUserByEmail(userEmail);

            expect(response.email).toEqual(user.email);
            expect(response.name).toEqual(user.name);
        });        
        it('throws an error if there is an issue', async() => {
            try {
                let userEmail = 'notreal2@email.com';
                let response = await userService.getUserByEmail(userEmail);
                if (response || !response) fail('Didn\'t throw error');
              } catch (error) {
                expect(console.error).toHaveBeenCalled();
              }
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