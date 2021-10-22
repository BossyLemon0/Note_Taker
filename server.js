const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require ('./db/db.json');
const { parse } = require('path');

const PORT = 3001;

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));

// the two functions below connect the uses pages up.
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, '/public/assets/index.html'));
});

app.get('/notes',(req,res)=>{
    res.sendFile(path.join(__dirname, '/public/assets/notes.html'))
});

//routes
// app.get('/api/notes', (req,res)=>{
//     res.status(200).json(notes);
// });

app.get('/api/notes', (req,res)=>{
    fs.readFile('./db/db.json', 'utf-8', (err,data)=>{
        err ? console.error(err) : res.send(data);
    })
});

//add notes

app.post('/api/notes',(req,res)=>{
    fs.readFile('./db/db.json', 'utf-8', (err,data)=>{
       if (err) console.error(err);
       
           let parsedNotes = JSON.parse(data);


           const previousnote = parsedNotes[parsedNotes.length - 1];
           const id = previousnote ? previousnote.id + 1 : 1;


           parsedNotes.push({...req.body, id });

           fs.writeFile('./db/db.json', JSON.stringify(parsedNotes),(err,data)=>{
               if(err)console.error(err);
               console.log('worked');
           })
       
    })
});

//delete notes
app.delete('/api/notes/:id',(req,res)=>{
    fs.readFile('./db/db.json', 'utf-8', (err,data)=>{
        if(err) console.error(err);

        let parsedNotes = JSON.parse(data);

        let filterednotes = parsedNotes.filter((note)=>{
            return note.id != req.params.id;
        })

        fs.writeFile('./db/db.json', JSON.stringify(filterednotes),(err,data)=>{
            if(err)console.error(err);
            console.log(`success`);
        })
        
    })
});

//This function listens for connections made
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);



/*
GIVEN a note-taking application
WHEN I open the Note Taker
THEN I am presented with a landing page with a link to a notes page
WHEN I click on the link to the notes page
THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
WHEN I enter a new note title and the note’s text
THEN a Save icon appears in the navigation at the top of the page
WHEN I click on the Save icon
THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
WHEN I click on an existing note in the list in the left-hand column
THEN that note appears in the right-hand column
WHEN I click on the Write icon in the navigation at the top of the page
THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column
*/

