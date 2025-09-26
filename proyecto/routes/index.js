var express = require('express');
var router = express.Router();
var db = require('../config/db')
const app = express();

router.get('/', function(req, res, next) {
  res.render('index', { title: "EpicForge" });
});

router.get('/empresa', (req, res, next) => {
  res.render('empresa', { title: 'Empresa' });
});

router.get('/saberMas', (req, res, next) => {
  res.render('saberMas', { title: 'Saber más' });
});

router.get('/soporte', (req, res, next) => {
  res.render('soporte', { title: 'Soporte' });
});

router.get('/videojuegos', function (req, res, next){
  const sql = 'SELECT * FROM videojuegos';
  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error al obtener videojuegos:', error);
    }

    res.render('videojuegos', {videojuegos :  results} )
  });
});

router.get('/formVideojuego' , function (req, res, next){
  res.render('formulario');
});


router.post('/nuevoVideojuego', (req, res, next) => {
    console.log(req.body);
    const {titulo, genero, plataforma, precio, clasificacion_edad, imagen_url} = req.body;
  const sql = "INSERT INTO videojuegos(titulo, genero, plataforma, precio, clasificacion_edad, imagen_url) VALUES( ? , ? , ? , ? , ?, ?)";

  db.query(sql, [titulo, genero, plataforma, precio, clasificacion_edad, imagen_url], (err, result) => {
    if (err){
      console.error("Error al guardar videojuego en BD", err);
      return res.status(500).send("Error al guardar");
    }else {
      console.log(result.insertId);
      res.render('creado', { nuevo : {
          id : result.insertId,
          titulo : titulo,
          genero : genero,
          plataforma : plataforma,
          precio : precio,
          clasificacion_edad : clasificacion_edad,
          imagen_url : imagen_url
        } });
    }
  } );

});

router.get('/detalleVideojuego', (req, res, next) => {
  const ID = req.query.id;

  if (!ID || isNaN(ID)) {
    return res.status(400).send('ID inválido');
  }
  const sql = "SELECT * FROM videojuegos WHERE id = ?";
  db.query(sql, [ID], (error, resultados) => {
    if (error) {
      console.error('Error al consultar la base de datos:', error);
      return res.status(500).send('Error interno del servidor');
    }

    if (resultados.length === 0) {
      return res.status(404).send('Videojuego no encontrado');
    }
    res.render('detalle', { videojuego: resultados[0] });
  });
});


router.get('/eliminarVideojuego', (req, res) => {
  const videojuegoId = req.query.id;
  const sql = "DELETE FROM videojuegos WHERE id = ?";
  db.query(sql, [videojuegoId], (error, result) => {
      if (error) {
          console.log(error);
          return res.status(500).send('Hubo un error al eliminar el videojuego');
      }
      res.redirect('/videojuegos');
  });
});

module.exports = router;
