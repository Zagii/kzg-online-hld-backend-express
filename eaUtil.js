const zlib = require('zlib');


dajSQLsingle=async function async(sql,conn,cb)
{
    conn.query(sql, function (err, rows)
    {
        if(err)
            cb(err,"Brak");
        else
            cb(null,rows[0].note);

        console.log(rows[0].note);
    })
    
}

dajNotesObiektu2= async function(schema,nazwaObj,conn)
    {
        let sql="select note from `" + schema + "`.t_object where name='"+nazwaObj+"'";
        let wynik;
       const c= conn.query(sql,async function (err, rows)
        {
            if(err)
                 wynik="Brak";
            else
                wynik=rows[0].note;

                console.log(wynik);
               // return wynik;     
        });
        await c;
        console.log('w2: '+wynik);
        return wynik;
    };

dajNotesObiektu=async function(schema,nazwaObj,conn,cb)
    {
        let sql="select note from `" + schema + "`.t_object where name='"+nazwaObj+"'";
        conn.query(sql, function (err, rows)
        {
            if(err)
                cb(err,"Brak");
            else
                cb(null,rows[0].note);

            console.log(rows[0].note);
        })
        
    };
    asyncMiddleware = fn =>
    (req, res, next) => {
      Promise.resolve(fn(req, res, next))
        .catch(next);
  };

///////////////// funkcje elementarne /////////////////
dajNoteSQL=function(schema,nazwaObj)
{
   return "select note from `" + schema + "`.t_object where name='"+nazwaObj+"'";
}
dajObiectIDSQL=function(schema,nazwaObj)
{
   return "select object_id from `" + schema + "`.t_object where name='"+nazwaObj+"'";
}
dajTagSQL= function(schema,nazwa,tag)
{
   return "select value from `" + schema + "`.t_object o, "+
    "`" + schema + "`.t_objectproperties p where o.name='" + nazwa + "'" +
    " and p.Property='" + tag + "' and p.Object_ID = o.Object_ID";  
}

dajLinkedDocumentSQL=function(schema,obiektID)
{
    return "SELECT o.object_id,d.BinContent, o.Note FROM " +
            "`" + schema + "`.t_object o, " +
            "`" + schema + "`.t_document d  WHERE " +
            " o.Style LIKE '%MDoc=1%' and d.ElementType='ModelDocument' and d.elementid=o.ea_guid  " +
            " and o.object_id=" + obiektID;
}

/////////////// funkcje wysokopoziomowe ////////////
dajObiectIDNazwa=async function(pool,schema,nazwaObj)
{
    let r=await pool.query(dajObiectIDSQL(schema,nazwaObj));
    return r;
}
dajNazweProjektu =async function(pool,schema)
{
    let r=await pool.query(dajNoteSQL(schema,"Projekt-Nazwa"));
    return r[0].note;
}

dajSD= async function(pool,schema,typ)
{
    let tag="Imię i Nazwisko";
    let nazwa="SD "+typ;    //IT/NT
    let r= await pool.query(dajTagSQL(schema,nazwa,tag))
    return r[0].value;
}
dajLinkedDocument=async function(pool,schema,obiektID)
{
    let row=await pool.query(dajLinkedDocumentSQL(schema,obiektID));
   // console.log(row)
    if(row.length>0)
    {
        let b=row[0].BinContent;
        console.log("jest: "+obiektID);
      //  console.log(b);
     //   var buffer1 = new Buffer(b, 'base64');//"ascii");
        //console.log(buffer)

       // const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
       const buffer=Buffer.from(b, 'base64').toString('ascii')
       //const buffer = Buffer.from(b, 'base64');
        zlib.unzip(buffer, (err, buffer) => {
          if (!err) {
            console.log(buffer.toString());
            console.log(buffer.toString("ascii"));
          } else {
            // handle error
          }
        });

/*
        console.log("Buffer A");
        zlib.unzip(buffer, (err, buffer) => {
            if (!err) {
              console.log(buffer.toString());
            } else {
              // handle error
              console.log("error unzip: "+err);
            }
          });
          console.log("BinContent B");
          zlib.unzip(b, (err, b) => {
            if (!err) {
              console.log(b.toString());
            } else {
              // handle error
              console.log("error unzip: "+err);
            }
          });*/
        return b;
    }
    else
    {
        console.log("brak: "+obiektID)
        return "";
    }
}