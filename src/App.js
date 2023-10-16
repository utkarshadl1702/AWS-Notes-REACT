import logo from './logo.svg';
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
  Authenticator,
} from "@aws-amplify/ui-react";

function App() {
  return (
   <View>
    <Card>
      <Image src={logo} className='App-logo' alt='logo' />
      <Heading level={1}>We now have Auth</Heading>
    </Card>
    <Authenticator>
    {({ signOut, user }) => ( 
        <button onClick={signOut}>Sign out</button>
      )}
    </Authenticator>
   </View>
  );
}

export default withAuthenticator(App);
