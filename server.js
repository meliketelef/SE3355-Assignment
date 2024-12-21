const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/database'); 
const Listing = require('./models/listing');    
const { Op } = require('sequelize');

const app = express();
const port = process.env.PORT || 4000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const seedDatabase = async () => {
    try {
        const categories = ['Car', 'Villa', 'Bicycle', 'Telephone', 'Land'];
        const imageLinks = {
            Car: ['/images/car1.jpg', '/images/car2.jpg', '/images/car3.jpg'],
            Villa: ['/images/villa1.jpg', '/images/villa2.jpg', '/images/villa3.jpg'],
            Bicycle: ['/images/bicycle1.jpg', '/images/bicycle2.jpg', '/images/bicycle3.jpg'],
            Telephone: ['/images/telephone1.jpg', '/images/telephone2.jpg', '/images/telephone3.jpg'],
            Land: ['/images/land1.jpg', '/images/land2.jpg', '/images/land3.jpg']
        };

        const cities = [
            'New York',
            'Los Angeles',
            'Chicago',
            'Houston',
            'Phoenix',
            'Philadelphia',
            'San Antonio',
            'San Diego',
            'Dallas',
            'San Jose'
        ];

        for (const category of categories) {
            const links = imageLinks[category]; 

            for (let i = 0; i < links.length; i++) {
                
                const randomPrice = Math.floor(Math.random() * (200000 - 100000 + 1)) + 100000;
               
                const randomCity = cities[Math.floor(Math.random() * cities.length)];

                await Listing.create({
                    title: `${category} Advert ${i + 1}`,
                    description: `${category} description for ${i + 1}.`,
                    price: `${randomPrice} USD`, 
                    city: randomCity, 
                    category,
                    image: links[i] 
                });
            }
        }

        console.log('Seed data successfully added!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};


sequelize.sync({ force: true }) 
    .then(async () => {
        console.log('Database reset and synced successfully!');
        await seedDatabase(); 
    })
    .catch(err => console.error('Database connection error:', err));


app.get('/', async (req, res) => {
    try {
        const categories = ['Car', 'Villa', 'Bicycle', 'Telephone', 'Land'];
        const allListings = await Listing.findAll();
        res.render('index', { categories, allListings });
    } catch (error) {
        console.error('Homepage error:', error);
        res.status(500).send('An error occurred.');
    }
});


app.get('/search', async (req, res) => {
    try {
        const query = req.query.q; 
        let results = [];

        if (query) {
            results = await Listing.findAll({
                where: {
                    [Op.or]: [
                        { ad_no: { [Op.eq]: query } },
                        { title: { [Op.eq]: query } },
                        { description: { [Op.eq]: query } },
                        { price: { [Op.eq]: query } },
                        { city: { [Op.eq]: query } },
                        { category: { [Op.eq]: query } }
                    ]
                }
            });
            
        }

        res.render('search', { query, results }); 
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).send('An error occurred while processing the search.');
    }
});



app.get('/search/:category', async (req, res) => {
    try {
        const category = req.params.category.charAt(0).toUpperCase() + req.params.category.slice(1);
        const listings = await Listing.findAll({ where: { category } });

        if (!listings || listings.length === 0) {
            return res.status(404).send('No listings found for this category.');
        }

        res.render('category', { category, listings });
    } catch (error) {
        console.error('Category page error:', error);
        res.status(500).send('An error occurred.');
    }
});


app.get('/detail/:id', async (req, res) => {
    try {
        const listing = await Listing.findByPk(req.params.id);

        if (!listing) {
            return res.status(404).send('Listing not found.');
        }

        res.render('detail', { listing });
    } catch (error) {
        console.error('Detail page error:', error);
        res.status(500).send('An error occurred.');
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
