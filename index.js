require("dotenv").config();
// const cors = require('cors');
var express=require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe=require('stripe')(process.env.STRIPE_SECRIT)
const port=8000||process.env.PORT;
var app=express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.set('view engine','ejs');
app.get('/',(req,res)=>{
    res.render("index.ejs")
})
// app.post('/checkout', async (req, res) => {
//   const {  amount,currency, customerId, email, line1,line2,city,state,postalCode,country } = req.body;

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount, // المبلغ بالدولار أو أي عملة أخرى
//       currency: currency, // العملة
//       metadata: {
//         firebaseUserId: customerId, // معرف المستخدم في Firebase
//       },
//       receipt_email: email, // البريد الإلكتروني
//       shipping: {
//         name: 'Customer Name',
//         address: {
//           line1: line1,
//           line2: line2,
//           city: city,
//           state: state,
//           postal_code: postalCode,
//           country: country,
//         },
//       },
//     });

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });
app.post('/checkout', async (req, res) => {
  try {
      const price = parseInt(req.body.price, 10);
      const itmename = req.body.itmename;
      const userId = req.body.userId; // معرف المستخدم من Firebase
      const userEmail = req.body.userEmail; // البريد الإلكتروني
      const line1 = req.body.shippingAddress; // عنوان الشحن
      // // const line2 = req.body.line2; // عنوان الشحن
      // const city = req.body.city; // عنوان الشحن
      // const state = req.body.state; // عنوان الشحن
      // const postalCode = req.body.postalCode; // عنوان الشحن
      // const country = req.body.country; // عنوان الشحن

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: itmename,
            },
            unit_amount: price,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: 'https://ghidhaalruwh.netlify.app',
        cancel_url: 'https://ghidhaalruwh.netlify.app',
        customer_email: userEmail, // تحديد البريد الإلكتروني هنا
        metadata: {
          userId: userId, // تخزين معرف المستخدم في metadata
          shippingAddress:shippingAddress
        },
        // shipping: {
        //   name: 'Customer Name',
        //   address: {
        //     shipping_rates: line1,
        //     // line2: line2,
        //     city: city,
        //     state: state,
        //     postal_code: postalCode,
        //     country: country,
        //   },
        // },
      });

      res.json({ url: session.url });

  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error occurred');
  }
});

// app.post('/checkout', async (req, res) => {
//     try {
//         const price = parseInt(req.body.price,10);
//         const itmename = req.body.itmename;

//         const session = await stripe.checkout.sessions.create({
//           payment_method_types: ['card'],
//           line_items: [{
//             price_data: {
//               currency: 'usd',
//               product_data: {
                
//                 name: itmename,
//               },
//               unit_amount: price,
//             },
//             quantity: 1,
//           }],
//             mode: 'payment',
//             // ui_mode: 'embedded',
//             success_url: 'https://ghidhaalruwh.netlify.app',
//             cancel_url: 'https://ghidhaalruwh.netlify.app',
//         });
//       // res.redirect(session.url); // توجيه المستخدم إلى صفحة الدفع في Stripe
//        res.json({ url: session.url });

//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Error occurred');
//     }
// });
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
