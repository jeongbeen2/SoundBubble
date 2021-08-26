import React, { useState, useEffect } from "react";
import "./Styles/BubbleDetail.css";
import "./Styles/Reset.css";
import axiosInstance from "../axios";
import { useHistory } from "react-router-dom";
import backIcon from "./Styles/back.png";
import trashcan from "./Styles/trashcan.png";
import Swal from "sweetalert2";

import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../Store";

const BubbleDetail = (): JSX.Element => {
	const dispatch = useDispatch();
	const userState = useSelector((state: RootReducerType) => state.userReducer);
	const tokenState = useSelector((state: RootReducerType) => state.tokenReducer);
	const API_URL = process.env.REACT_APP_API_URL;
	const history = useHistory();

	const [commentInput, setCommentInput] = useState("");
	const [bubbleComments, setBubbleComments] = useState([]);
	const [isPlaying, setIsPlaying] = useState(false);

	const getBubbleId = (): string => {
		return window.location.pathname.split("/")[2];
	};
	const bubbleId = Number(getBubbleId());

	const [bubbleData, setBubbleData] = useState({
		id: "",
		image: "",
		sound: "",
		textContent: "",
		user: { email: "", nickname: "" },
	});

	const getBubbleData = async () => {
		await axiosInstance({
			method: "GET",
			url: `${API_URL}/bubble/${bubbleId}`,
		}).then(res => {
			setBubbleData(res.data.data.bubble);
			setBubbleComments(res.data.data.comments);
		});
	};

	useEffect(() => {
		getBubbleData();
	}, []);

	const handleSubmitComment = async (text: string) => {
		await axiosInstance({
			method: "POST",
			url: `${API_URL}/bubble/${bubbleId}/comment`,
			data: { textContent: text },
			headers: {
				authorization: `Bearer ${tokenState.accessToken}`,
			},
		}).then(() => {
			setCommentInput("");
			getBubbleData();
		});
	};

	const handleDeleteComment = async id => {
		Swal.fire({
			icon: "warning",
			text: "댓글을 삭제하시겠습니까?",
			showCancelButton: true,
			cancelButtonColor: "#f17878",
			confirmButtonColor: "rgb(119, 112, 255)",
			confirmButtonText: "삭제하기",
			cancelButtonText: "아니오",
		}).then(result => {
			if (result.isConfirmed) {
				axiosInstance({
					method: "DELETE",
					url: `${API_URL}/bubble/${bubbleId}/comment`,
					data: { commentId: id },
					headers: {
						authorization: `Bearer ${tokenState.accessToken}`,
					},
				}).then(() => {
					getBubbleData();
				});
			}
		});
	};

	const handleDeleteBubble = async () => {
		Swal.fire({
			text: "버블을 삭제하시겠습니까?",
			icon: "warning",
			showCancelButton: true,
			cancelButtonColor: "#f17878",
			confirmButtonColor: "rgb(119, 112, 255)",
			confirmButtonText: "삭제하기",
			cancelButtonText: "아니오",
		}).then(result => {
			if (result.isConfirmed) {
				Swal.fire({
					icon: "success",
					text: "버블이 삭제되었습니다.",
				}).then(() => {
					axiosInstance({
						method: "DELETE",
						url: `${API_URL}/bubble/${bubbleId}`,
						headers: {
							authorization: `Bearer ${tokenState.accessToken}`,
						},
					}).then(() => {
						history.push("/palette");
					});
				});
			}
		});
	};
	const audio = new Audio(`${bubbleData.sound}`);

	const handleStopSound = () => {
		window.location.replace(`/bubble/${bubbleId}`);
	};
	const handlePlaySound = () => {
		audio.play();
		setIsPlaying(true);
	};

	return (
		<>
			<div className="bubbleDetail-container">
				<div>
					<img
						src={backIcon}
						className="backIcon"
						alt="뒤로 가기"
						onClick={() => window.location.replace("/palette")}
					/>
					{bubbleData.user.email === userState.user.email ? (
						<img src={trashcan} className="deleteBtn" alt="버블 삭제" onClick={handleDeleteBubble} />
					) : null}
				</div>
				<div className="comment-container">
					{bubbleComments.map((comment: any, i: number) => {
						console.log("댓글 맵함수", comment);
						const commentId = comment.id;
						if (comment.user.email === userState.user.email) {
							return (
								<p key={i} className="my-comment" onDoubleClick={() => handleDeleteComment(commentId)}>
									{comment.textContent}
									<span className="comment-user-nickname">삭제하려면 더블클릭하세요.</span>
								</p>
							);
						} else {
							return (
								<p key={i} onDoubleClick={() => Swal.fire("  ", "본인이 쓴 댓글만 삭제할 수 있습니다.")}>
									{comment.textContent}
									<span className="comment-user-nickname">{comment.user.nickname}</span>
								</p>
							);
						}
					})}
				</div>
				{/* <video className="video" id="background-video" autoPlay muted loop>
					<source src="Particles.mp4" type="video/mp4" />
				</video> */}
				<div className="bubbleDetail-bubble">
					{isPlaying ? (
						<img src={bubbleData.image} onClick={handleStopSound} className="bubbleImg isPlaying" />
					) : (
						<img src={bubbleData.image} onClick={handlePlaySound} className="bubbleImg" />
					)}
					<p>{bubbleData.textContent}</p>
				</div>
				<div className="form">
					<label>
						<input
							type="text"
							name="comment"
							placeholder="댓글을 남겨주세요 (댓글 + Enter)"
							onChange={e => setCommentInput(e.target.value)}
							value={commentInput}
							onKeyPress={e => {
								if (e.key === "Enter") {
									handleSubmitComment(commentInput);
								}
							}}
						/>
					</label>
				</div>
				<div className="bubble-user">{bubbleData.user.nickname}님의 Sound Bubble</div>
			</div>
		</>
	);
};

export default BubbleDetail;
