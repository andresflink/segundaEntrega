process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/asignaturas';
}
else {
	urlDB = 'mongodb+srv://afarboledac:zelda1235!@nodejstdea-dbehn.mongodb.net/matriculas?retryWrites=true'
}

process.env.URLDB = urlDB