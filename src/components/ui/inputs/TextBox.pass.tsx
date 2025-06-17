import { BaseProperties } from "./TextBox";
import styles from "./TextBox.module.scss";

export interface Properties extends BaseProperties {
  type: "password";
  showPassword: BooleanIsh;
  setShowPassword?: (v: boolean) => void;
}

export default function _TextBoxForPass({
  id,
  type: _type,
  showPassword,
  setShowPassword,
  ...props
}: Properties) {
  return (
    <div className={styles["tbox-wrapper"]}>
      <label htmlFor={id}>Test</label>
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder=" "
        {...props}
      />
      {setShowPassword && (
        <button
          type="button"
          aria-controls={`#${id}`}
          className={`${styles["tbox-btn-toggle"]} ${styles["tbox-btn-toggle-visibility"]}`}
          onClick={() => setShowPassword(!showPassword)}
        ></button>
      )}
    </div>
  );
}
