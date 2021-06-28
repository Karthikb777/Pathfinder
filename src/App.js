import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import logo from './logo.svg';
import Grid from './Components/Grid'
import HelpAbout from './Components/Help-About'
import './Style.css';

function App() {
  return (
    <div className="container">
          {/* <h3 className="logo">Pathfinder</h3> */}
          {/* <p className="subTitle">A visualization of different pathfinding algorithms.</p> */}
          {/* <HelpAbout /> */}
          <Grid />
    </div>
  );
}

export default App;
