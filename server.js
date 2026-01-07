const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom middleware for Auth
server.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    const db = router.db;
    const user = db.get('users').find({ email, password }).value();

    if (user) {
        // Return dummy token
        res.jsonp({
            access_token: 'fake-jwt-token-' + user.id,
            token_type: 'bearer',
            user: user
        });
    } else {
        res.status(401).jsonp({ error: 'Email hoặc mật khẩu không đúng' });
    }
});

server.post('/auth/register', (req, res) => {
    const { email, password, full_name } = req.body;
    const db = router.db;
    
    const existingUser = db.get('users').find({ email }).value();
    if (existingUser) {
        return res.status(400).jsonp({ error: 'Email đã tồn tại' });
    }

    const newUser = {
        id: crypto.randomUUID(),
        email,
        password,
        name: full_name || email.split('@')[0],
        role: 'user',
        createdAt: new Date().toISOString()
    };

    db.get('users').push(newUser).write();

    res.jsonp({
        access_token: 'fake-jwt-token-' + newUser.id,
        token_type: 'bearer',
        user: newUser
    });
});

server.get('/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return res.status(401).jsonp({ error: 'Missing token' });
    }

    // In a real app we decode token. Here we simulate valid token.
    // For testing, we just return the first user or based on some logic if we encoded ID in token.
    const token = authHeader.split(' ')[1];
    const userId = token.replace('fake-jwt-token-', '');
    
    const db = router.db;
    const user = db.get('users').find({ id: userId }).value();

    if (user) {
        res.jsonp(user);
    } else {
        // Fallback for simple testing if ID parsing fails
        const firstUser = db.get('users').first().value();
        if (firstUser) res.jsonp(firstUser);
        else res.status(401).jsonp({ error: 'Invalid token' });
    }
});

server.use(router);
server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
});
