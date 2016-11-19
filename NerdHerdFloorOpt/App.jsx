import React from 'react';
import AppBarExt from './Custom-Components/CustAppBar';
import {Tabs, Tab} from 'material-ui/Tabs';
import TabLayout from './Custom-Components/TabLayout'
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends React.Component {
   render() {
      return (
         <div>
          <AppBarExt />
          <TabLayout />
         </div>
      );
   }
}

export default App;
