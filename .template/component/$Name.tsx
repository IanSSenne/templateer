<%if($Styles){%>import styles from "./<%=$Name%>.module.scss";

<%}%>export function <%=$Name%>(props) {
  return <div<%if($Styles){%>className={styles.<%=$Name%>} <%}%>><%=$Name%></div>;
}
