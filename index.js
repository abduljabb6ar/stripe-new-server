require("dotenv").config();
// const cors = require('cors');
var express=require('express');
const cors = require('cors');
const stripe=require('stripe')(process.env.STRIPE_SECRIT)
const port=8000||process.env.PORT;
var app=express();

app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.set('view engine','ejs');
app.get('/',(req,res)=>{
    res.render("index.ejs")
})


app.post('/checkout', async (req, res) => {
    try {
        // const price = req.body.price;

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'عسل السدر',
              },
              unit_amount: 100,
            },
            quantity: 1,
          }],
            mode: 'payment',
            // ui_mode: 'embedded',
            success_url: 'https://ghidhaalruwh.netlify.app/complate',
            cancel_url: 'https://ghidhaalruwh.netlify.app/cancel',
        });
      res.redirect(session.url); // توجيه المستخدم إلى صفحة الدفع في Stripe

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error occurred');
    }
});
app.get('/complate',async(req,res)=>{
    try{
      await  paypal.capturpayment(req.query.token)
     res.send('secessful')

    }catch(error){
        res.send('error : '+error)
    }
})
app.get('/cancel',(rez,res)=>{
    res.redirect('/')
    })
app.listen(port,(req,res)=>{console.log(`that is server ${port}`);});