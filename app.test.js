const request = require('supertest');
const { app, startServer } = require('./app');

let server;

beforeAll(done => {
    server = startServer();
    done();
});

afterAll(done => {
    server.close(done);
});

describe('Application Tests', () => {
    it('should serve the index.html file at /', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        // Check if the HTML contains a specific string
        expect(response.text).toContain('Scale-Up SaaS');
    });

    it('should return health status 200 at /health', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
    });
});
