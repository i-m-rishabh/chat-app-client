import { Outlet } from 'react-router-dom';
import classes from './Layout.module.css';
const Layout = () => {

    return (
        <div className={classes.main}>
            <h3 className={classes.appTitle}>chat app</h3>
            <div className={classes.mainContent}>
                <Outlet />
            </div>
        </div>
    )
}

export default Layout;