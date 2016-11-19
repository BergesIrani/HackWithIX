import React from 'react';
import AppBar from 'material-ui/AppBar';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */

class AppBarExt extends React.Component {
   getChildContext() {
     return { muiTheme: getMuiTheme(baseTheme) };
   }

    render() {
       return (
         <AppBar
           title="Title" style={{ margin : 0 }}/>
       );
    }
 }

AppBarExt.childContextTypes = {
   muiTheme: React.PropTypes.object.isRequired,
};

export default AppBarExt;
