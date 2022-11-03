const {UserModel} = require("../models");
const loginService = require("../services/login")

const UserController = {
    findOne: async (req,res) => {
        const found = await UserModel.findOne({username: req.params.username})
        res.json(found);
    },
    findMultiple: async (req,res) => {
        const found = await UserModel.find({username: req.params.username})
        res.json(found);
    },
    create: async(req, res) => {
        const _id = req.body.email
        const check = await UserModel.exists({_id: _id})
        if (check)
        {
            res.json("Object already exists")
        }
        else{
            const password = req.body.password
            const username = req.body.username
            const role = req.body.role
            const address = req.body.address
            const user = new UserModel({
                _id,
                password,
                username,
                address,
                role
            })

            user.save().then((data)=>{
                res.send(data)
            })
            }
        },
    delete: async(req, res) => {
        const nameDelete = req.body.email
        const output = await UserModel.deleteOne({_id: nameDelete})
        if (output.deletedCount == 1 ){
            res.json("deletion succesfull!")
       }
        else res.json("could not find object")
      },
    update: async(req, res) => {
        const email = req.body.email
        const newUsername = req.body.newUsername
        const newPassword = req.body.newPassword
        const newRole = req.body.newRole
        const output = await UserModel.findOneAndUpdate({_id: email},{
            username:newUsername,
            password: newPassword,
            role: newRole,
        })

        if (output !== null){
            res.json("update successfull!")
        }
        else res.json("could not find object")
    },
    changePassword: async(req, res) => {
        const id = req.session.username
        const newPassword = req.body.newPassword
        const oldPassword = req.body.oldPassword
        const output = await UserModel.findOneAndUpdate({_id: id,password:oldPassword}, {
            password: newPassword,
        })

        if (output !== null){
            res.json({status:"Success"})
        }
        else res.json({status:"Failed"})
    },
    login: async(req, res) => {
        const username = req.body.username 
        const password = req.body.password
        const result = await loginService.login(username, password)
        if (result) {
            req.session.username = username
            //res.redirect('/')
            res.json({status:"Success"})
        }
        else
        {
            //res.redirect('/login?error=1') ///// need to create
            res.json({status:"Failed"})
        }
        
    },
    isLoggedIn: async (req, res, next) => { // Checked
        console.log(req.session.username)
        if (!(await loginService.isAdmin(req.session.username)))
            res.redirect('/login');
        else
            res.json("Welcome!")
    },
    isAdmin: async (req, res, next) => { /// Checked
        if (!(await loginService.isAdmin(req.session.username)))
            res.json("Admin Only!")
        else
            res.json("Welcome!")
    },
    logout: async (req, res) => { // Checked
        req.session.destroy(() => {
          res.redirect('/login');
        });
      },
    foo: async (req, res) => {  // WTF
        res.json((await UserModel.find({_id: req.session.username}))[0].role)
       },
}


module.exports = UserController