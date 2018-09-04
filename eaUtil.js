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
dajNote=function(schema,nazwaObj)
{
   return "select note from `" + schema + "`.t_object where name='"+nazwaObj+"'";
}

dajTag= function(schema,nazwa,tag)
{
   return "select value from `" + schema + "`.t_object o, "+
    "`" + schema + "`.t_objectproperties p where o.name='" + nazwa + "'" +
    " and p.Property='" + tag + "' and p.Object_ID = o.Object_ID";  
}



/////////////// funkcje wysokopoziomowe ////////////
dajNazweProjektu =async function(pool,schema)
{
    let r=await pool.query(dajNote(schema,"Projekt-Nazwa"));
    return r[0].note;
}

dajSD= async function(pool,schema,typ)
{
    let tag="Imię i Nazwisko";
    let nazwa="SD "+typ;    //IT/NT
    let r= await pool.query(dajTag(schema,nazwa,tag))
    return r[0].value;
}