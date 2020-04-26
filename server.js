const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const querystring = require('querystring');
let server = http.createServer(handleRequest);

let usersPath = path.join(__dirname , "users/");
function handleRequest(req, res) {
    let parsedUrl = url.parse(req.url, true);
    let store = '';
    req.on('data', (chunks) => store+=chunks);
    req.on('end', ()=>{
        if(req.method === 'POST' && parsedUrl.pathname === "/users"){
            console.log(store);
            let username = JSON.parse(store).username;
            console.log(username);
            console.log(usersPath + username + '.json');
            fs.open(usersPath + username + '.json', 'wx', (err,fd) =>{   // Open file for writing. The file is created (if it does not exist) or Open file for writing. The file is created (if it does not exist) or truncated (if it exists).

                if(err) {console.log(err.code); return;}
                fs.writeFile(fd, store, (err) =>{
                    fs.close(fd, (err) =>{
                        if(err) {console.log(err);  return;}
                        else
                            res.end(username + ' created successfully');
                    });
                });
                console.log(err, fd);
            });
            res.end('User Posted');
        }
        else if(req.method === 'GET') {
            // console.log('HERE');
            //http://localhost:8080/users?username=Anshu
            const queryObject = parsedUrl.query;
            console.log((queryObject.username));
            
            let username = queryObject.username;
            console.log(username);
            console.log(usersPath + username + '.json');
            fs.open(usersPath + username + '.json', 'r', (err,fd) =>{
                if(err) {console.log(err.code);  res.end('No user found');}
                fs.readFile(fd, (err,data) =>{
                    fs.close(fd, (err) =>{
                        if(err) {console.log(err);  res.end('Error')}
                        else{
                            res.end(data);
                        }
                    });
                });
                console.log(err, fd);
            });
            //res.end('User GEtted');
            // let str = 'http://google.com:80/register?name=xyz&name=abc';
            // console.log(url.parse(str, true));          //true so query is also parsed default false
        }
        else if(req.method === 'PUT') {
            const queryObject = parsedUrl.query;
            console.log((queryObject.username));
            
            let username = queryObject.username;
            console.log(store);
            let userNameJSON = JSON.parse(store).username;
            
            
            if(userNameJSON !== username){
                res.end("username can't be modified");
            }
            else{
                fs.open(usersPath + username + '.json', 'r+', (err,fd) =>{      //Open file for reading and writing. An exception occurs if the file does not exist.
                    if(err) {console.log(err.code); return;}
                    fs.writeFile(fd, store, (err) =>{
                        fs.close(fd, (err) =>{
                            if(err) {console.log(err);  return;}
                            else
                                res.end(username + ' created successfully');
                        });
                    });
                    console.log(err, fd);
                });
                res.end('User Posted');
            }
            res.end('PUT');
        }
        else if(req.method === 'DELETE') {

        }
        else {
            res.statusCode = 404;
            res.end('Page not Found');
        }
    });
}
server.listen(3000, () => console.log('Server started'));