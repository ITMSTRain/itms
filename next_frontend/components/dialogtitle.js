// DialogTitle Component
function DialogTitle({ children }) {
    return (
      <h2 id="dialog-title" style={styles.title}>
        {children}
      </h2>
    );
  }
  
  const styles = {
    title: {
      margin: 0,
      paddingBottom: '10px',
      fontSize: '1.5rem',
    },
  };
  
  export default DialogTitle;
  