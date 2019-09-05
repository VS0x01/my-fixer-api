const chai = require('chai')
    , chaiHttp = require('chai-http')
    , should = chai.should();
const app = require('../app');

chai.use(chaiHttp);

describe('Accounts', () => {
    describe('#users.signIn()', () => {
        it('should login user and return his data with auth tokens', (done) => {
            chai.request(app)
                .post('/accounts/sign-in')
                .send({
                    email: 'vadim.shesterikov@example.com',
                    password: 'sdcddscscdsd',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('user').that.has.keys(['fullName', 'email', 'photo']);
                    res.body.should.have.property('accessToken');
                    res.body.should.have.property('refreshToken');
                    done();
                });
        });
    });
});
