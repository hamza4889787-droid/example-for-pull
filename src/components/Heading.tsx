import styles from "../css/Heading.module.css"; // Your separate CSS file

function Heading() {
  return (
    <div>
      <header className={styles["landing-header"]}>
        <h1 className={styles["landing-logo"]}>
          Your LifePlan&nbsp;
          <span className="text-[#2E97E9]">Journey</span>
        </h1>
      </header>
    </div>
  );
}

export default Heading;
