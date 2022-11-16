//original one
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const session = require('express-session');
const TodosArr = [];
const startDb = require('./database/init');
const userModel = require('./database/models/user');
const todoModel = require('./database/models/todos');
startDb();

app.use(cors());
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
		isLoggedIn: false,

		username: '',
	})
);

app.set('view engine', 'ejs');

app.get('/', Home);
app.route('/todo').get(getTodo).post(upload.single('profilePic'), postTodo);
app.post(`/todo/checked`, checked);
app.post(`/todo/deleteTodo`, deleteTodo);

app.get('/logout', logoutUser);

app
	.route('/login')
	.get(function (req, res) {
		if (req.session.isLoggedIn) {
			res.redirect('/');
			return;
		}
		res.render('login', { error: 'Login' });
	})
	.post(function (req, res) {
		getUser(
			req.body.username,
			req.body.email,
			req.body.password,
			function (err, user) {
				if (user.length) {
					req.session.isLoggedIn = true;
					req.session.username = req.body.username;
					res.redirect('/');
				} else {
					res.render('login', {
						error: 'Invalid credentials ! Please Enter Correct details',
					});
				}
			}
		);
	});

app
	.route('/signup')
	.get(function (req, res) {
		res.render('signup', { error: 'Sign up' });
	})
	.post(function (req, res) {
		getUser(
			req.body.username,
			req.body.email,
			req.body.password,
			function (user) {
				if (user == null) {
					saveUser(req.body, function (err) {
						if (err) {
							res.end(err);
						} else {
							res.render('login', { error: 'Login' });
						}
					});
				} else {
					res.render('signup', { error: 'User already exists' });
					console.log('Error in signup');
				}
			}
		);
	});

//server start
app.listen(5500, function () {
	console.log('server is running ');
});

function Home(req, res) {
	if (req.session.isLoggedIn) {
		todoModel.find({}, function (err, todos) {
			res.render('index', { username: req.session.username, data: todos });
		});
	} else {
		res.redirect('/login');
	}
}
//issue here
function getTodo(req, res) {
	getFromDb(function (err, todos) {
		console.log('Todos in getTodo ', todos);
		// res.json(todos);
		res.render('index', todos);
	});
}

function postTodo(req, res) {
	let { textarea } = JSON.parse(JSON.stringify(req.body));
	//Handle image input
	let profilePic = req.file != undefined ? req.file.filename : '';

	//generate unique id
	var id = 'id' + new Date().getTime();

	if (profilePic !== '' && textarea.length) {
		let todo = {
			id: id,
			todo: textarea,
			checked: false,
			profilePic,
		};
		saveTodo(todo, function () {
			console.log('Written');
			res.redirect('/');
		});
		// TodosArr.push(todo);
	}
}

function checked(req, res) {
	let { id } = req.body;
	todoModel.find({ id }).then((data) => {
		console.log('HEre in find ', data);
		todoModel.updateOne(
			{ id },
			{ $set: { checked: !data.checked } },
			function (err, result) {
				if (err) {
					console.log(err);
				} else {
					console.log('Data updated ', result);
				}
			}
		);
	});

	// TodosArr.forEach((todo) => {
	// 	if (todo.id == parseInt(id)) {
	// 		todo.checked = !todo.checked;
	// 	}
	// });
	res.end();
}

function deleteTodo(req, res) {
	let { id } = req.body;
	todoModel.findOneAndDelete({ id }, function (err, docs) {
		if (err) {
			console.log(err);
		} else {
			console.log('Deleted User : ', docs);
		}
	});
	res.end();
}

function saveUser(user, callback) {
	// getUsers(function (users) {
	// 	users.push(user);
	// 	fs.writeFile('./users.txt', JSON.stringify(users), function () {
	// 		callback();
	// 	});
	// });
	console.log('Running in main');
	userModel
		.create(user)
		.then(function () {
			callback(null);
		})
		.catch(function () {
			callback("Can't save user details");
		});
}

function getUser(username, email, password, callback) {
	// fs.readFile('users.txt', 'utf-8', function (err, data) {
	// 	if (data) {
	// 		callback(JSON.parse(data));
	// 	}
	// });
	userModel
		.find({ username: username, password: password })
		.then(function (data) {
			callback(null, data);
		})
		.catch(function (err) {
			callback('user not found');
		});
}

function logoutUser(req, res) {
	req.session.destroy();
	res.redirect('/');
}

function saveTodo(todo, callback) {
	todoModel
		.create(todo)
		.then(function () {
			callback(null);
		})
		.catch(function (err) {
			callback('Cant save todo');
		});
}
function getFromDb(callback) {
	console.log('getFromDb function running ');
	todoModel
		.find({})
		.then(function (todos) {
			callback(null, todos);
		})
		.catch(function () {
			callback("Couldn't get todos from db");
		});
}
// function readFileData(callback) {
// 	fs.readFile('data.json', 'utf8', (err, data) => {
// 		if (err) {
// 			console.log('Data.json File read failed:', err);
// 			return;
// 		}
// 		console.log('Data.json File data at line 194 :', data);
// 		callback(JSON.parse(data));
// 	});
// }

// function writeFileData(todo, callback) {
// 	readFileData((mytodo) => {
// 		if (mytodo.length) {
// 			TodosArr.push(mytodo);
// 		}
// 		fs.writeFile('data.json', JSON.stringify(TodosArr), (err) => {
// 			if (err) console.log('Error writing file:', err);
// 		});
// 	});
// }
