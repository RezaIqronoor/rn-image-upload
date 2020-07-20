var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var imageRouter = require('./routes/image');

const Routes = [
    indexRouter,
    usersRouter,
    imageRouter
]

module.exports = Routes
