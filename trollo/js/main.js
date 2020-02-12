var token = localStorage.getItem('token');

function setNewList() {
    var namelist = $('#new_list').val();
    var listboard = $('#list_creator');
    var token = localStorage.getItem('token');
    $.ajax({
        type: 'POST',
        url: 'https://apitrello.herokuapp.com/list',
        data: {
            'name': namelist
        },
        headers: {
            AUTHORIZATION: 'Bearer ' + token
        },
        success: function(result) {
            getLists();
            removeElement(listboard);
        },
        error: function(xhr, status, thrown) {
            console.log(xhr.statusText);
            console.log(xhr);
        }
    });
}

function getLists() {
    //La direccion de la api, esta mal, es list no lists
    $.ajax({
        type: 'GET',
        url: 'https://apitrello.herokuapp.com/list',
        data: {},
        headers: {
            AUTHORIZATION: 'Bearer ' + token
        },
        success: function(result) {
            printList(result);
        },
        error: function(xhr, status, thrown) {
            console.log(xhr.statusText);
            console.log(xhr);
        }
    });
}

function printList(list) {
    var element = document.getElementById('list_card_body');
    removeElement(element);
    for (let item of list) {
        element.innerHTML += '<div><a class="btn" onclick="getAll(' + item.id + ')"><li style="margin-top:10px;"class=""> ' + item.name + '</li></a>' + '<a onclick="createTask(' + item.id + ')" class="btn btn-success  btn-sm">+</a><a onclick="deleteList(' + item.id + ')" class="btn btn-danger  btn-sm" id="delete_list">-</a></div>'
    }
}

function removeElement(element) {
    element.innerHTML = '';
}

function createTask(id) {
    list_id = id;
    var taskpanel = document.getElementById('taskpanel');
    taskpanel.innerHTML = '<div class="card col-9 mt-3 float-right" id="task_panel"><div class="card-body"><h5 class="card-title"> Añadir tarea</h5> <div class="card-body"><label for="task">¿Que tienes que hacer?</label><input style = "margin-left:10px;" type="text" name="task" id="new_task" placeholder="Nueva tarea."><a onclick="setTask(' + id + ')" class="btn btn-success btn-sm" id="new_task" style = "margin-left:5px;">Crear tarea</a></div></div></div>';
}

function setTask(list_id, task) {
    var task = $('#new_task').val();
    var panel = document.getElementById('taskpanel');
    $.ajax({
        type: 'POST',
        url: 'https://apitrello.herokuapp.com/tasks',
        data: {
            'idlist': list_id,
            'task': task
        },
        success: function(result) {
            getAll(list_id);
        },
        error: function(xhr, status, thrown) {
            console.log(xhr.statusText);
            console.log(xhr);
        }
    });
}

function getAll(id) {
    $.ajax({
        type: 'GET',
        url: 'https://apitrello.herokuapp.com/list/tasks/' + id,
        data: {},
        success: function(result) {
            var taskpanel = document.getElementById('taskpanel');
            if (result == undefined) {
                removeElement(taskpanel);
                taskpanel.innerHTML += '<div class="card col-9 mt-3 float-right"><li style="margin-top:10px;"class=""> Aun no has creado ninguna tarea, añade tareas pulsando el boton + </li></div></div><br>';
            } else {
                var taskpanel = document.getElementById('taskpanel');
                removeElement(taskpanel);
                for (let item of result) {
                    taskpanel.innerHTML += '<div class="card col-9 mt-3 float-right"><li style="margin-top:10px;"class=""> ' + item.task + '</li></p><div class="row"><a class="btn btn-outline-warning mb-3 btn-sm " onclick="editTask()"> editar</a><a class="btn btn-danger mb-3 btn-sm " onclick="deleteTask(' + item.id + ')"> eliminar</a> </div></div><br>';
                }
            }
        },
        error: function(xhr, status, thrown) {
            console.log(xhr.statusText);
            console.log(xhr);
        }
    });
}

function deleteList(id) {
    var token = localStorage.getItem('token');
    $.ajax({
        type: 'DELETE',
        url: 'https://apitrello.herokuapp.com/list/' + id,
        data: {},
        headers: {
            AUTHORIZATION: 'Bearer ' + token
        },
        success: function(result) {
            console.log(result);
            getLists();
        },
        error: function(xhr, status, thrown) {
            console.log(xhr.statusText);
            console.log(xhr);
        }
    });
}

function deleteTask(id) {
    //Recibo un error Internal Server error = SequelizeDatabaseError, aunque la petición 
    //la resuelve como exitosa y salta el Succes.
    var token = localStorage.getItem('token');
    console.log(id);
    $.ajax({
        type: 'DELETE',
        url: 'https://apitrello.herokuapp.com/list/tasks/' + id,
        data: {},
        headers: {
            AUTHORIZATION: 'Bearer ' + token
        },
        success: function(result) {
            alert('success');
            getAll();
        },
        error: function(xhr, status, thrown) {
            console.log(xhr.statusText);
            console.log(xhr);
        }
    });
}