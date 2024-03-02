const express = require('express')
const bodyparser = require('body-parser')
const app = express()
const port = 8000
const mysql = require('mysql2/promise')
const cor = require('cors')
let conn = null

app.use(cor())
const initDB = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'tutorial',
        port:'12306'
}) }
//set app obj k listen
app.listen(port, async (req,res) => {
    console.log(port)
    await initDB()
})
//set app obj k use
app.use(bodyparser.json())
//delete
app.delete("/user/:id",async (req,res) => {
    let id = req.params.id
    try {
        const result = await conn.query('DELETE FROM users Where id = ?',id)
        res.json({
            index: result[0],
            id: `${id} has been deleted`
        })
    } catch(error) {
        res.status(404).json({
            error: "x"
        })
    }

    // console.log(id)
    // let finduser = users.findIndex(x => x.id == id)
    // console.log(finduser)   
    //delete user and left null
    // delete users[finduser]
    //delete user and shift array
    // res.json({
    //     index: users.splice(finduser,1),
    //     id: `${id} has been deleted`
    // })
    
})

//patch update some fields
app.patch("/user/:id",(req,res) => {
    let id = req.params.id
    let updateUser = req.body
    let finduser = users.findIndex(x => x.id == id)
    if (updateUser.firstname) {
    users[finduser].firstname = updateUser.firstname
    }
    if (updateUser.lastname) {
        users[finduser].lastname = updateUser.lastname
        }
    res.json({
        message :"done",
        id: updateUser
    })
})
//put update all fields
app.put("/user/:id", async (req,res) => {
    let id = req.params.id
    let updateUser = req.body
    console.log(updateUser)
    try {
        const result = await conn.query('UPDATE users SET ? Where id = ?',[updateUser,id])
        res.json(result[0])
    } catch(error) {
        res.status(404).json({
            error: "x"
        })
    }
//     let findindex = users.findIndex(x => x.id == id)
//     if (findindex >= 0) {
//         users[findindex].firstname = updateUser.firstname || users[findindex].firstname 
//         users[findindex].lastname = updateUser.lastname || users[findindex].lastname
//         users[findindex].age = updateUser.age || users[findindex].age
//         users[findindex].gender = updateUser.gender || users[findindex].gender
//     res.json({
//         message : "done",
//         data: {
//             user:updateUser,
//             index:findindex
//         }
//     });
// } else {
//     res.status(404).json('Client Error');}
})
//return all users
// app.get("/users",(req,res) => {
//     let findall = users.map(x => {
//         return {
//             thisId : x.id,
//             name : `${x.firstname} ${x.lastname}`
//         }
//     })
//     res.json(findall)
// })

//return a user
app.get("/user/:id", async(req,res) => {
    let id = req.params.id
    try {
        const result = await conn.query('SELECT * FROM users WHERE id = ?', id)
        // if (result[0].length > 0) {
        //     res.json(result[0][0])
        // } else {
        //     res.status(404).json({
        //         'Status': 'error'})
        // }
        if (result[0].length == 0) {
            throw {statusCode:404,message : "not found"}
        }
        res.json(result[0][0])
    }catch (error) {
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({error:"something wrong",message:error.message})
    }
})
//set app obj k post
app.post("/user",async (req,res) => {
    try {
        let user = req.body
        //validation from backend side (no need in this case but I'll just leave it like this)
        const errors = validateData(user)
        if (errors.length > 0) {
            throw {
                message:"errorrr",
                errors:errors
            }
        }
        const result = await conn.query('INSERT INTO users SET ?', user)
        res.json(result)
    }catch (error) { 
        const errormessage = error.message || 'something wrong'
        const errors = error.errors || []
        res.status(500).json({
            message:errormessage,
            error: errors})
    }
});

app.get("/a",(req,res) => {
    let user = {
        x : 'x',
        y : 'y'
    }
    res.json(user)
})

///db
app.get('/users', async (req, res) => {
    try {
    const result = await conn.query('SELECT * FROM users')
    res.json(result[0])
}catch (error) {
    res.status(500).json({error:"fetching error"})
}
  })


  const validateData = (userdata) => {
    let errors = []
    if (!userdata.firstname) {
        errors.push("Please input firstname")
    }
    if (!userdata.lastname) {
        errors.push("Please input lastname")
    }
    if (!userdata.age) {
        errors.push("Please input valid age")
    }  if (!userdata.gender) {
        errors.push("Please input gender")
    }  if (!userdata.interest) {
        errors.push("Please input interests")
    }if (!userdata.description) {
        errors.push("Please input description")
    }
    return errors
}