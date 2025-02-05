import Map2 from "../Components/Map2";
import PageNav from "../Components/PageNav";
import Sidebar from "../Components/Sidebar";
import User from "../Components/User";
// import styles from "./appLayout.module.css";
import styles from "./LayoutApp.module.css";

function LayoutApp() {
  return (
    <div className={styles.app}>
      <Sidebar></Sidebar>
      <Map2></Map2>
      <User></User>
    </div>
  );
}

export default LayoutApp;
