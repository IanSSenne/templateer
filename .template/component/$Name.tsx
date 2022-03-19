<%if($Styles){%>import styles from "./<%=$Name%>.module.scss";

<%}%>export function <%=$Name%>(props) {
  return <div className={styles.<%=$Name%>}><%=$Name%></div>;
}
