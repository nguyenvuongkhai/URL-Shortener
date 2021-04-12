const { compile } = require('ejs');
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
mongoose.connect('mongodb+srv://Day:12345@node-rest-shop.uft33.mongodb.net/urlShortener?retryWrites=true&w=majority', 
{useNewUrlParser: true,
 useUnifiedTopology: true, 
 'useCreateIndex': true,
'useFindAndModify': false
});



app.set('view engine','ejs');
app.use(express.urlencoded({extended: false}))

app.get('/', async (req, res)=>{
    const shortUrls = await ShortUrl.find()
    res.render('index',{shortUrls: shortUrls});

})
app.post('/shortUrls', async (req,res)=>{
   await ShortUrl.create({ full: req.body.fullUrl})
res.redirect('/')
})

app.get('/:shortUrl', async (req,res)=>{
   const shortUrl =  await ShortUrl.findOne({short: req.params.shortUrl})
   if(shortUrl == null) return res.sendStatus(404)
       shortUrl.clicks++
       shortUrl.save()

       res.redirect(shortUrl.full)

   
})
app.post("/delete", (req,res)=>{
    const checkedItemId=req.body.checkbox;
    ShortUrl.findByIdAndRemove(checkedItemId,(err)=>{
   if(err){
       console.log(err);
    }else{
        console.log('success deleted '+checkedItemId);
        res.redirect('/');
    }
    })
});
    



app.listen(process.env.PORT || 5000); 