import React from "react";

export default function ErrorBox({ error, styles }) {
    return (<div className={styles.errorBox}>
        <p>{error.message}</p>
    </div>);
} 