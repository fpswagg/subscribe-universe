export default function ErrorBox({ error }) {
    const style = {
        marginTop: "25px",
        padding: "10px",
        color: "red",
        border: "2px solid red",
        backgroundColor: "rgba(200, 0, 0, 25%)",
        textAlign: "center",
        fontSize: "1.5em",
        fontWeight: "150",
        backdropFilter: "blur(10px)"
    };

    return (<div style={style}>
        <p>{error.message}</p>
    </div>);
} 