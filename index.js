const express = require('express')
const app = express()

const eaUtil = require('./eaUtil')
var pool = require('./DB')
var mysql = require('mysql')
const connectionConfig={
  host     : '10.22.23.82', 
  user     : 'eakzg',
  password : 'a',
  database : 'eakzg_schema'
  };

var connection = mysql.createConnection(connectionConfig);

connection.on('close', function(err) {
  if (err) {
    // Oops! Unexpected closing of connection, lets reconnect back.
    connection = mysql.createConnection(connectionConfig);
  } else {
    console.log('Connection closed normally.');
  }
});

var schema="PR-2215";
var sql = "select  * from `"	+ schema+"`.t_object o";


var wyn;
connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) 
{
   // if (err) throw err   
    console.log('The solution is: ', rows[0].solution)
})

  
connection.query(sql, function (err, rows, fields)
{
   // if (err) throw err  
    wyn=rows.name;
    console.log('schema: ', schema)
    console.log('sql: ', sql)
})
 
//connection.end();
//////////////////////////////////////////////


/////////////////////////////////////////////

var prefProj=['PR-','BR-','EU-'];
var status = " p.project_phase_id in (22,23,24,25,31,35) ";
status = true;
////////////


app.route('/api/projekty').get((req, res) => {

  let sql="select code as Symbol, p.name as Nazwa,"+
  " DATE_FORMAT(created_date,'%d-%m-%Y') as DataUtworzenia, p.id, solution_designer_id ,"+
  "f.NAME faza,a.NAME alert,t.NAME typ, u.first_name,u.last_name, p.INVOLVMENT,p.TOMORROW,p.NETWORK_SOLUTION,p.TRANSMISSION_ARCHITECTURE "+
  //", p.SHORT_DESC,p.STATUS_COMMENT "+
                  "from sdpd.project p ,information_schema.SCHEMATA s,"+
                  "sdpd.project_alert a,"+
                  "sdpd.project_type t,"+
                  "sdpd.project_phase f,"+
                  "sdpd.solution_designer sd,"+
                  "sdpd.user u "+
                   " where (p.code like 'PR-%' or p.code like 'EU-%' or p.code like 'BR-%') "+
                   "  and ( s.SCHEMA_NAME like 'eu-%' or s.SCHEMA_NAME like 'pr-%' or s.schema_name like 'br-%') "+
                   "and lower(p.code)=lower(s.schema_name) "+
                   "and a.id=p.PROJECT_ALERT_ID and t.ID = p.PROJECT_TYPE_ID and f.id=p.PROJECT_PHASE_ID " +
  "and p.SOLUTION_DESIGNER_ID=sd.ID and sd.user_id=u.id"+ " and "+status+ " order by 1 desc;" ;
  //connection.connect(function(err){});
  connection.query(sql, function (err, rows, fields)
  {
    if ( err )
    {
      console.log("!!!!!ERR !!!! ");
      console.log(err);
      console.log(sql);
      res.status(400).send('Error in database operation /api/projekty '+err);
      console.log("!!!!!ERR !!!! ");
    } else
    {
      let wynik=JSON.stringify(rows,null,4);
      res.send(wynik);
    }
  //  connection.end();
  });
});

app.route('/api/projekty/:id').get(asyncMiddleware(async (req, res) => {
  const schema = req.params['id'];
  let projNazwa;
  const N=await dajNotesObiektu(schema,"Projekt-Nazwa",connection,function(err,wynik)
  {
    projNazwa=wynik;
   // let sdit= dajTagX(schema,"SD IT","Imię i Nazwisko",connection);
  //  res.send({ id: schema, nazwa:projNazwa,SD_IT:sdit });
  });
 
 
  //await N;


  //let notes= dajNotesObiektu2(schema,"Projekt-Nazwa",connection);
  //await notes;
  //.then(function(result)
  //{
   // console.log('res: '+result); 
  //});
  //console.log('n: '+notes.); 
// res.send({ id: schema, nazwa:notes });

}));



app.route('/api/test/:id').get(async (req, res) => {
  const schema = req.params['id'];
  let projNazwa;
  let sdIT;
  let sdNT;
 
   try {
       projNazwa = await dajNazweProjektu(pool,schema);
       sdIT=await dajSD(pool,schema,"IT")
       sdNT=await dajSD(pool,schema,"NT")

       let k=await dajObiectIDNazwa(pool,schema,"Koncepcja")
        console.log(k);
        for(var e in k)
        {
          console.log(k[e].object_id);
          let a=await dajLinkedDocument(pool,schema,k[e].object_id);
        //  console.log(a);
        }
       //let a = dajLinkedDocument(pool,schema,k[0].object_id);
       //let b = dajLinkedDocument(pool,schema,k[1].object_id);

       let js={id:schema,projNazwa:projNazwa,SD_IT:sdIT,SD_NT:sdNT}

       res.send(JSON.stringify(js));
  } catch(err) {
      throw new Error(err)
  }

 });
 

app.get('/',
 (req, res) =>{

		res.send('Hello World! <br>'+JSON.stringify(wyn))
	}
)

app.post('/', function (req, res) {
  res.send('Got a POST request')
})

app.put('/user', function (req, res) {
  res.send('Got a PUT request at /user')
})

app.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

