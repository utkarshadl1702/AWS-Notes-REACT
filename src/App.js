
import React, { useState, useEffect } from "react";
import "./App.css";
// import { Storage } from "@aws-amplify/storage"
import "@aws-amplify/ui-react/styles.css";
import {
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";
import { API, Storage } from "aws-amplify";
await API.configure({
  aws_appsync_region: 'us-east-1'
});

const App = ({ signOut }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const url = await Storage.get(note.name);
          note.image = url;
        }
        return note;
      })
    );
    setNotes(notesFromAPI);
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
   
    const data = {
      name: form.get("name"),
      description: form.get("description"),// Check if image exists before accessing its name
    };
    try {
      await Storage.put(data);
  
      await API.graphql({
        query: createNoteMutation,
        variables: { input: data },
      });
  
      fetchNotes();
      event.target.reset();
    } catch (error) {
      console.error("Error creating note:", error);
    }
  }
  

  async function deleteNote({ id, name }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await Storage.remove(name);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  return (
    <View className="App">
      <Heading level={1}>My Notes App</Heading>
      <View as="form" margin="3rem 0" onSubmit={createNote}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Note Description"
            label="Note Description"
            labelHidden
            variation="quiet"
            required
          />
          <Button type="submit" variation="primary">
            Create Note
          </Button>
        </Flex>
      </View>
      <Heading level={2}>Current Notes</Heading>
      <View margin="3rem 0">
        {notes.map((note) => (
          <Flex
            key={note.id || note.name}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text as="strong" fontWeight={700}>
              {note.name}
            </Text>
           
            <Button variation="link" onClick={() => deleteNote(note)}>
              Delete note
            </Button>
          </Flex>
        ))}
      </View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};

export default withAuthenticator(App);









// import logo from './logo.svg';
// import "@aws-amplify/ui-react/styles.css";
// import {
//   withAuthenticator,
//   Button,
//   Heading,
//   Image,
//   View,
//   Card,
//   Authenticator,
// } from "@aws-amplify/ui-react";

// function App() {
//   return (
//    <View>
//     <Card>
//       <Image src={logo} className='App-logo' alt='logo' />
//       <Heading level={1}>We now have Auth</Heading>
//     </Card>
//     <Authenticator>
//     {({ signOut, user }) => ( 
//         <button onClick={signOut}>Sign out</button>
//       )}
//     </Authenticator>
//    </View>
//   );
// }

// export default withAuthenticator(App);

//iam credentials
//access key: AKIAWYMZ6RHMZN3QFKX7
//secret access key: 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