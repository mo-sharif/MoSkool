const styles = (theme) => ({
  card: theme.card,
  disableCard: {
    backgroundColor: "#f2f2f2",
  },
  content: {
    padding: 20,
  },
  cardContent: {
    color: theme.grey.medium,
  },
  img: {
    backgroundSize: "contain",
    height: 280,
    width: 200,
  },
  link: {
    textDecorationLine: "none",
    "&:hover": {
      textDecorationLine: "none",
    },
  },
  disableLink: {
    pointerEvents: "none",
    textDecoration: "none",
    cursor: "default",
  },
  lockIcon: {
    color: theme.grey?.dark,
    position: "absolute",
    top: "10px",
    right: "10px",
  },
  checkIcon: {
    color: " #99bb33",
    position: "absolute",
    top: "10px",
    right: "10px",
  },
  heroIcon: {
    fontSize: theme.fontSize.xl,
    color: theme.blue.superLight,
  },
  editorFont: theme.editorFont,
});

export default styles;