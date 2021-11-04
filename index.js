const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
// const Blog =require('./modules/login')
const Blogg = require('./modules/regestre')


const dbURI = 'mongodb+srv://abdellatif:abde123@cluster0.axd9p.mongodb.net/test?retryWrites=true&w=majority';

const router = express.Router();

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected'))
    .catch((err) => console.log(err));

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(router)

app.get('/', (req, res) => {
    res.render('pege.ejs')
})




app.get('/registre', (req, res) => {
    res.render('registre.ejs')
})

app.post('/registre', async (req, res) => {


    try {
        const hashedPassword = await bcrypt.hash(req.body.password)
        const blogg = new Blogg({
            nom: req.body.nom,
            email: req.body.email,
            password: hashedPassword,
        });
        blogg.save((err, data) => {
            if (err)
                return res.send(err)

            res.send(data)
        })
        res.redirect('/login')
    } catch {
        res.redirect('/registre')
    }

})

app.get('/login', (req, res) => {
    res.render('login.ejs')

})
app.post('/login', async (req, res) => {
    // Blogg.find({email: req.body.email})
    // .then((result)=>{
    // if(Blogg.find({email: req.body.email})=== req.body.email){
    //  return   res.redirect('/')
    // }else{
    //     return   res.redirect('/registre')
    // }

    Blogg.find({ email: req.body.email }, async (err, data) => {
        console.log(data.length)
        if (err || data.length == 0)
            return res.redirect('/registre')
        console.log(data)
        console.log(data[0].password)
        try {
            console.log('ok1')
            bcrypt.compare(req.body.password, data[0].password, (erro, datao) => {
                //if error than throw error
                // if (erro) throw erro
                console.log(datao)
                console.log(data[0].password)
                console.log(req.body.password)
                //if both match than you can do anything
                if (datao) {
                    console.log('ok2')
                    return res.redirect('/')
                } else {
                    console.log('ok3')
                    return res.redirect('/login')
                }

            })
            // const match = await bcrypt.compare(req.body.password, data.password);
            // const hashsword = await bcrypt.hash(req.body.password, 10)

            // if(await bcrypt.compare(hashsword, data.password)){
            //     console.log('ok2')
            //       res.redirect('/')
            // }else{
            //     console.log('ok3')
            //      res.redirect('/login')
            // }
            console.log('ok4')
        } catch {
            console.log('ok5')
            console.log(err)
        }

    })
    // }).catch((err)=>{
    //     console.log('errourra')
})
// const blog = new Blog({
//     email: req.body.email,
//     password:req.body.password,
// });

// blog.save((err, data) => {
//     if(err)
//         return res.send(err)

//     res.send(data)
// })


app.get('/api', (req, res) => {
    res.json({
        messaages: 'welcome'
    })
})


app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'mtp', (err, authData) => {
        if (err) {
            console.log('1')
            res.sendStatus(403)
        } else {
            res.json({
                messaages: 'welcome',
                authData
            })
        }

    })
})
app.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        user: 'abde',
        email: 'abde@fd'
    }
    jwt.sign({ user }, 'mtp', (err, token) => {
        res.json({
            token
        })
    })
})

function verifyToken(req, res, next) {
    const beareerHeader = req.headers['authorization'];
    if (typeof beareerHeader !== 'undefined') {
        console.log('3');
        const bearer = beareerHeader.split(' ');
        console.log('4');
        const beareertoken = bearer[1];
        console.log('5');
        req.token = beareertoken;
        console.log('6');
        console.log(req.token)
        next();
    } else {
        console.log('2');
        res.sendStatus(403)
    }
}


router.get('/users', (req, res) => {
    res.send('Hello')
})
// router.post('/users', (req, res) => {
//     const user = new Blogg({
//         nom: req.body.nom,
//         email: req.body.email,
//         password: hashedPassword,
//     });
// })

router.get('/usersFind', (req, res) => {
    Blogg.find({}, (err, data) => {
        if (!err)
            res.send(data)
        else
            res.send(err)
    })
})

router.get('/usersFind/:id', (req, res) => {
    Blogg.findById(req.params.id, (err, data) => {
        if (!err)
            res.send(data)
        else
            res.send(err)
    })
})
//Problemmm!!!!!!!!!!!!!!!
router.put('/usersFind/edit/:id', (req, res) => {
    const edite = {
        nom: req.body.nom,
        email: req.body.email,
        password: req.body.password
    };
    console.log(edite)
    Blogg.findByIdAndUpdate(req.params.id, { $set: edite }, { new: true }, (err, data) => {
        if (!err) {
            res.send(data)
            console.log(data)
        } else {
            res.send(err)
        }
    })
})

router.delete('/usersFind/delete/:id', (req, res) => {
    Blogg.findByIdAndDelete(req.params.id, (err, data) => {
        if (!err) {
            res.send(data)
            console.log(data)
        } else {
            res.send(err)
        }
    })
})


const PORT = 5000

app.listen(PORT, () => console.log(`app is now listining at port ${PORT}`))

