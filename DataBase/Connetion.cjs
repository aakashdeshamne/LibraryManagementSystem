const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/LibraryManagementSystem';

mongoose.connect(url).then(() => {
    console.log('Connection successful');
}).catch((err) => { 
    console.log('Connection failed', err);
});

