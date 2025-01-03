const mongoose = require('mongoose');
const url = 'mongodb+srv://deshmaneakash100:<aakash2003>@cluster4.y4ofk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster4';

mongoose.connect(url).then(() => {
    console.log('Connection successful');
}).catch((err) => { 
    console.log('Connection failed', err);
});

