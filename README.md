# nodejs-blog-restapi
A blog rest api - with auth -  created with Nodejs, ExpressJS and MongoDB

### POST
Route name | Example
-----------|----------
/user/register | `{"username:"jon", "email":"jon@example.com", "password":"12345"}`
/user/login | `{"email":"jon@example.com", "password":"12345"}` (will return a token, which is needed for creating, updating and deleting blogs)
/blogs/create | `{"title:"blog title", "content":"some blog content"}` (when using Postman, in Headers there should be a key "auth-token" with the token as the value)

### GET

**Blogs list** - /blogs

**Single Blog** - /blogs/:id

### PUT
**Update a blog** - /blogs/:id (can send either title or content. Or both)

### DELETE
**Delete a blog** - /blogs/:id
