import React from 'react';
import AppBar from 'material-ui/AppBar';
import {Tabs, Tab} from 'material-ui/Tabs';
import TabLayout from './Custom-Components/TabLayout'

class App extends React.Component {
   render() {
      return (
         <div>
           <TabLayout />
         </div>
      );
   }
}

const AppBarExampleIcon = () => (
  <AppBar
    title="Title"
    iconClassNameRight=""
    iconClassNameLeft=""
  />
);

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

export default App;
