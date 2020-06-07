import React from "react";

import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Button from "@material-ui/core/Button";
import styles from "./styles";
import withStyles from "@material-ui/core/styles/withStyles";

const MoButton = ({ classes, handleButtonClick, text }) => {
  return (
    <Button className={classes.link} onClick={() => handleButtonClick()}>
      {text}
      <ArrowForwardIcon className={`${classes.icon} arrow`} />
    </Button>
  );
};

export default withStyles(styles)(MoButton);
