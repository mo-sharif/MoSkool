import React, { useState } from "react";

import * as ROUTES from "../../../constants/routes";
import AppsIcon from "@material-ui/icons/Apps";
import { Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import styles from "./styles";
import Slide from "@material-ui/core/Slide";
import withStyles from "@material-ui/core/styles/withStyles";
import { IconButton } from "@material-ui/core";

const MoMenu = ({ authUser, classes }) => {
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<IconButton
				aria-label="View Topics Menu"
				aria-controls="topics-menu"
				aria-haspopup="true"
				onClick={handleClick}
			>
				<AppsIcon />
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center"
				}}
				elevation={2}
				getContentAnchorEl={null}
				id="topics-menu"
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
				transformOrigin={{
					vertical: "top",
					horizontal: "center"
				}}
				TransitionComponent={Slide}
			>
				{authUser && (
					<div>
						<MenuItem
							to={ROUTES.SUPER_EASY_QUESTIONS.path}
							component={Link}
							onClick={handleClose}
						>
							{ROUTES.SUPER_EASY_QUESTIONS.title}
						</MenuItem>
					</div>
				)}
			</Menu>
		</>
	);
};

export default withStyles(styles)(MoMenu);