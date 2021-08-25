import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Styles/Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../Store";
import { logoutUser } from "../actions/index";
import axios from "axios";

const Navigation = (): JSX.Element => {
	const history = useHistory();
	const dispatch = useDispatch();
	const userState = useSelector((state: RootReducerType) => state.userReducer);
	const [isLogin, setIsLogin] = useState(false);
	const [open, setOpen] = useState(true);
	const API_URL = process.env.REACT_APP_API_URL;

	const logInHandler = () => {
		if (userState.accessToken) setIsLogin(true);
	};

	const logOutHandler = async () => {
		if (userState.accessToken) {
			await axios({
				method: "GET",
				url: `${API_URL}/user/logout`,
				headers: {
					authorization: `Bearer ${userState.accessToken}`,
				},
			})
				.catch(err => {
					console.log(err);
				})
				.finally(() => {
					setIsLogin(false);
					dispatch(logoutUser());
					window.location.replace("/");
				});
		}
	};

	const openChange = () => {
		setOpen(!open);
	}

	const mypageHandler = () => {
		if (userState.accessToken) history.push("/mypage");
		else history.push("/login");
	};
	useEffect(() => {
		logInHandler();
	}, [isLogin]);

	useEffect(() => {
		openChange();
	}, [])

	return (
		<>
			<nav className="navigation">
				<div className="nav-container">
					<div className="left-nav-bar">
						<img className="nav-logo" src="logo_w.png" alt="logo" onClick={() => window.location.replace("/")} />
					</div>
					<ul className="right-nav-bar">
						<li>
							<a onClick={() => window.location.replace("/main")}>Main</a>
						</li>
						<li>
							<a onClick={() => window.location.replace("/palette")}>Palette</a>
						</li>
						<li>
							<a onClick={mypageHandler}>Mypage</a>
						</li>
						{isLogin ? (
							<li>
								<a className="nav-login-btn" onClick={logOutHandler}>
									Logout
								</a>
							</li>
						) : (
							<li>
								<a className="nav-login-btn" onClick={() => window.location.replace("/login")}>
									Login
								</a>
							</li>
						)}
					</ul>
					{open ? (
						<div className="nav-hamburger">
							<button className="nav-close-btn" onClick={openChange}></button>
							<ul className="nav-hamburger-bar">
								<li>
									<a onClick={() => window.location.replace("/main")}>Main</a>
								</li>
								<li>
									<a onClick={() => window.location.replace("/palette")}>Palette</a>
								</li>
								<li>
									<a onClick={mypageHandler}>Mypage</a>
								</li>
								<li>
									<hr className="nav-hr"></hr>
								</li>
								{isLogin ? (
								<>
									<li>
										<a><img className="nav-user-img" src={userState.profileImage}></img>{userState.nickname}</a>
									</li>
									<li>
										<a className="nav-login-btn" onClick={logOutHandler}>
											Logout
										</a>
									</li>
								</>
							) : (
								<li>
									<a className="nav-login-btn" onClick={() => window.location.replace("/login")}>
										Login
									</a>
								</li>
							)}
							</ul>
						</div>
					): (
						<button className="nav-hamburger-btn" onClick={openChange}></button>
					)}
				</div>
			</nav>
		</>
	);
};

export default Navigation;
