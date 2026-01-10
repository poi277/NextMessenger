import styles from "@/../css/PostDetailCommentUpdate.module.css"

export default function PostDetailCommentUpdate({ editValue, setEditValue,handleUpdate}) {
  return (
        <div className={styles.registerFormRowOther}>
            <div className={styles.registerRowInputContainerButtonon}>
                  <div className={styles.inputButtoncontainer}>
                    <div className={styles.inputFieldButtonon}>
                      <input
                        className={styles.inputLabel}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                      />
                    </div>
                    <button type="button" className={styles.registerMiddleButton} onClick={handleUpdate}>
                      확인
                    </button>
                  </div>
            </div>
        </div>
  );
}
