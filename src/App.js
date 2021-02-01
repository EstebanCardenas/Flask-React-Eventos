import Login from './components/Login'
import Register from './components/Register'
import Eventos from './components/Eventos'
import {Switch, Route} from 'react-router-dom'
import './app.css'

export default function App() {
    return (
        <div className="App">
            <Switch>
                <Route exact path='/' component={Login} />
                <Route path='/registro' component={Register} />
                <Route path='/gestor' component={Eventos} />
            </Switch>
        </div>
    )
}