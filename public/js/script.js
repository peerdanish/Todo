const textarea = document.getElementById('textarea');
const parent = document.getElementById('parent');
const removeBtn = document.getElementById('remove-btn');
// const usernamePara = document.getElementById('username');
const submitBtn = document.getElementById('submitTodo');
console.log(submitBtn);
//globals
let todosArr = [];

//event listeners
// submitBtn.addEventListener('click', setTodo);

//functions

// function setTodo(e) {
// 	if (textarea.value !== '' && textarea.value.length != 0) {
// 		let task = {
// 			id: todosArr.length + 1,
// 			todo: textarea.value,
// 			checked: false,
// 		};
// 		todosArr.push(task);
// 		let value = textarea.value;
// 		console.log(value);
// 		e.preventDefault();
// 		textarea.value = '';
// 		checkbox = document.querySelector('.checkbox');
// 		// const request = new XMLHttpRequest();
// 		// request.open('POST', 'http://127.0.0.1:5500/todo');
// 		// request.setRequestHeader('content-type', 'application/json');
// 		// let body = { text: value };
// 		// request.send(JSON.stringify(body));

// 		// request.addEventListener('load', function () {
// 		// 	if (request.status == 200) {
// 		let listItem = document.createElement('li');
// 		listItem.setAttribute('class', 'task');
// 		listItem.setAttribute('id', task.id);
// 		listItem.innerHTML = `
// 				<span class="task-title">${value}</span>
// 					<div class="icons">
// 					<input type="checkbox" class= "checkbox" onclick="addChecked(this)"/>
// 					<button id="remove-btn" onclick = "deleteTodo(this)">X</button>
// 				</div>
// 				`;
// 		parent.appendChild(listItem);
// 		// } else {
// 		// 	console.log('Error occured in POST');
// 		// }
// 		// });
// 	}
// }
function addChecked(e) {
	let id = e.parentElement.parentElement.id;
	console.log('Parent : ', e.parentElement.parentElement);
	const request = new XMLHttpRequest();
	request.open('POST', `http://127.0.0.1:5500/todo/checked`);
	request.setRequestHeader('content-type', 'application/json');
	let body = { id };
	request.send(JSON.stringify(body));

	request.addEventListener('load', function () {
		if (request.status == 200) {
			console.log('I ran');
			if (e.checked) {
				e.parentElement.parentElement.classList.toggle('checked');
			} else {
				e.parentElement.parentElement.classList.toggle('checked');
			}
		}
	});
}

function deleteTodo(e) {
	let id = e.parentElement.parentElement.id;
	const request = new XMLHttpRequest();
	request.open('POST', `http://127.0.0.1:5500/todo/deleteTodo`);
	request.setRequestHeader('content-type', 'application/json');
	let body = { id };
	request.send(JSON.stringify(body));
	request.addEventListener('load', function () {
		parent.removeChild(e.parentElement.parentElement);
	});
}
