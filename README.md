# To-Do List App (Backend) for MAvha test

**Note:** [Click here to see the app hosted and running](https://mavha-test.web.app/)

Backend made in Nodejs in order to implement a To-Do list app

[Click here to go to Angular Frontend repository](https://github.com/itslesther/Mavha-main-app)

## API URL

[https://mavha-main-api.herokuapp.com](https://mavha-main-api.herokuapp.com)

## Functionalities

 - **Add Task: Add a task to the to-do list**
 *Method*: POST
 *route*: /tasks
 *Request Body Params*:
 	
|Param|type| Required | Default value | Description
|-- | -- | -- | -- | -- |
| `creator` | String |No |Null | user id of logged in user
| `title` | String |No |" " | Task Title
| `description` | String |No |" " | Task Description
|`dueDate` | Number | No | Null | Due Date
|`priority` | Number | No | Null | 1 = Low, 2 = Medium, 3 = High
| `files` | Array[TaskFile] | No | [] | Task File info

TaskFile follows the following interface: 
| Param | type | Required   | Default value | Description 
|--|--|--|--|--|
|`name`| String |Yes| - | File name (Ex: test.jpg
|`url`| String |Yes| - | File url (Ex: https://domain.com/test.jpg
|`path`| String |Yes (can be Null)| - | File path on Database

	
 - **Edit Task: Edit an already created task**
 *Method*: PUT
 *route*: /tasks/:id
 *Request Body Params*:
 	
|Param|type| Required | Default value | Description
|-- | -- | -- | -- | -- |
| `title` | String |No |" " | Task Title
|`dueDate` | Number | No | Null | Due Date
|`priority` | Number | No | Null | 1 = Low, 2 = Medium, 3 = High
| `description` | String |No |" " | Task Description
| `files` | Array[TaskFile] | No | [] | Task File info Explained above

 
 - **Delete Task: Delete an already created tasks**
  *Method*: DELETE
 *route*: /tasks/:id

 - **List Tasks: Lists all the tasks in the app. it also has the following functionalities:**
 - *Method*: GET
 *route*: /tasks
 *Request Query Params*:

|Param|type| Required | Default value | Description
|-- | -- | -- | -- | -- |
| `limit` | Number|No |10| Total tasks to return
| `startAfter` | String |No | Null | Task id of last task returned. This is only used for pagination
| `creator` | String |No | Null | User id of tasks to return
|`priority` | Number | No | Null | Task priority to return. 1 = Low, 2 = Medium, 3 = High
| `completed` | Boolean | No | Null | Task status to return
| `sortBy` | String | No | Null | Order of tasks to return. (Ex: priority, dueDate)
| `direction` | String | Only if `sortBy` set| Null | Order direction of tasks to return. (Ex: asc, desc)

Request example: [https://mavha-main-api.herokuapp.com/tasks?limit=5?completed=false?sortBy=dueDate?direction=desc](https://mavha-main-api.herokuapp.com/tasks?limit=5?completed=false?sortBy=dueDate?direction=desc)

 - **Get Task: Get an already created tasks**
  *Method*: GET
 *route*: /tasks/:id

 - **Update Task Status: Mark tas as completed/incomplete**
  *Method*: POST
 *route*: /tasks/:id/updateTaskStatus
 
|Param|type| Required | Default value | Description
|-- | -- | -- | -- | -- |
| `completed` | Boolean| Yes | - | Task Status to update


## Environment

This project was generated with Nodejs version 12.13.0.

## Development server
Run `npm install` in order to install required dependencies.

Run `npm start` for a dev server running on `http://localhost:8080/`. The frontend must be running so the interface can work.

## Author
Lesther Caballero