const {Prohairesis} = require('prohairesis')
const env = require('./env')
const  express = require('express')
const morgan = require('morgan')
//const bodyParser = require('body-parser')

console.log(env)

const database = new Prohairesis(env.CLEARDB_DATABASE_URL);


const app = express()



app     
    .use(morgan('dev'))
    // parse application/x-www-form-urlencoded
    .use(express.urlencoded({extended: true}))
    .use(express.json()) // To parse the incoming requests with JSON payloads

    //creating a new user 
    .post('/api/user',async (req, res)=>{
        const {username, password} = req.body;
        console.log(req.body)
        
        try {
            await database.query(`
                INSERT INTO  User(
                    username,
                    password,
                    data_added
                ) VALUES (
                    @username,
                    SHA2(@password,256),
                    NOW()

                )  

            `,{
                username,
                password,             
            });
            res.status(200)
            res.end("Added  user")
        } catch (error) {
            console.error("Error adding user")
            res.status(500);
            res.end("Error adding user. Does this user exist already ?")
        }



    } )

    //logging a new user 
    .put('/api/user',async(req, res)=>{
        const {username, password} = req.body;

        console.log(username)
        console.log(username)
        
        try {
            const user = await database.query(`
                SELECT 
                    * 
                FROM   
                    User 
                WHERE 
                    username = @username
                    AND password = SHA2(@password,256)


            `,{
                username,
                password,       
            
            });
            res.status(200)
            res.json(user) 
        } catch (error) {
            console.error("Error retrieving  user")
            res.status(500);
            res.end("Error finding user. Does this user exist  ?")
        } } )
 
    //get users 
    .get('/api/user',async (req, res)=>{

    try {
        const user = await database.query(`      
        SELECT 
            username, 
            password         
        FROM User
        `)
        res.status(200)
        res.json(user) 
    } catch (error) {
        console.error("Error retrieving  users")
        res.status(500);
        res.end("Error finding users. Does this user exist  ?")
    }} )
 
 

    const port = process.env.PORT || "5000";
    
    app.listen(port, ()=>{console.log(`server is listening on port ${port}`)})
    
/* database
.query(`
    CREATE TABLE User(        
        Username VARCHAR(255) NOT NULL PRIMARY KEY,
        password VARCHAR(300) NOT NULL,
        data_added DATETIME
    )

`)
.then((res) => {
    console.log(res)

})
.catch((err) => {
    console.log(err)
}); */

/* database
.query(`
        
     SELECT * FROM User
`)
.then((res) => {
    console.log(res)

})
.catch((err) => {
    console.log(err)
})

.finally(()=>{

    database.close();

}) */

/* database
.query(`
    INSERT INTO User (
        username, 
        password, 
        data_added)
    VALUES (
        'hana',
        SHA2('password',256),
        NOW())

`)
.then((res) => {
    console.log(res)

})
.catch((err) => {
    console.log(err)
})

.finally(()=>{

    database.close();

}) */



