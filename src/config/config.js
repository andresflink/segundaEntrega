
process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/asignaturas';
}
else {
	urlDB = 'mongodb+srv://afarboledac:zelda1235@nodejstdea-dbehn.mongodb.net/asignaturas?retryWrites=true'
}

process.env.URLDB = urlDB

process.env.SENDGRID_API_KEY = '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';