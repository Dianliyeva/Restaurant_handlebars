const express = require("express");
const { check, validationResult } = require('express-validator');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const populateDb = require('./bin/populateDb')

const Restaurant = require('./models/restaurant');
const Menu = require('./models/menu');
const MenuItem = require('./models/menuItem');
const Form = require('./models/form');


const initialiseDb = require('./initialiseDb');
initialiseDb();

const app = express();
const port = 3000;

//configure handlebars library to work well w/ express + sequelize model
const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

//tell this express app that we're using handlebars
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))

const restaurantChecks = [
    check('name').not().isEmpty().trim().escape(),
    check('image').isURL(),
    check('name').isLength({ max: 50 })
]

app.get('/restaurants', async (req, res) => {
    const restaurants = await Restaurant.findAll();
    res.render('restaurants', {restaurants});
});

app.get('/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {include: {
            model: Menu,
            include: MenuItem
        }
    });
    res.render('restaurant', {restaurant});
});

app.get('/menus', async (req, res) => {
    const menus = await Menu.findAll();
    res.render('menus', {menus});
});

app.get('/menus/:id', async (req, res) => {
    const menu = await Menu.findByPk(req.params.id, {include: MenuItem})
    res.render('menu', {menu});
});

app.post('/restaurants', restaurantChecks, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await Restaurant.create(req.body);
    res.sendStatus(201);
});

app.delete('/restaurants/:id', async (req, res) => {
    await Restaurant.destroy({
        where: {
            id: req.params.id
        }
    });
    res.sendStatus(200);
});

app.put('/restaurants/:id', restaurantChecks, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const restaurant = await Restaurant.findByPk(req.params.id);
    await restaurant.update(req.body);
    res.sendStatus(200);
});

app.patch('/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id);
    await restaurant.update(req.body);
    res.sendStatus(200);
});

app.get('/form', async (req, res) => {
    const form = await Form.findAll(req.params.id)
    res.render('form', {form});
});

app.delete('/restaurants/:id', async (req,res) => {
    const deletedRestaurant = await Restaurant.destroy({
        where: {id: req.params.id}})
    res.send({deletedRestaurant});
})

app.get('/restaurants/:id', async (req, res) => {
    console.log('hello world')
    const restaurant = await Restaurant.findByPk(req.params.id)
    // console.log("restaurant", restaurant);
    if(restaurant){
        res.render('restaurant', {restaurant})
    }else{
        res.send('404 RESTAURANT NOT FOUND');
    }
    
})

app.listen(port, () => {
    populateDb();
    console.log(`Server is listening at http://localhost:${port}`);
});
