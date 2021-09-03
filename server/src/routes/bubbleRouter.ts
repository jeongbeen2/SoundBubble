import * as controller from "../controllers";
import express from "express";
import upload from "../middlewares/uploadResources";
import authUser from "../middlewares/authUser";

const bubbleRouter: express.Router = express.Router();

// 모든 버블 조회
bubbleRouter.get("/", controller.readAllBubble);

// 버블 상세 조회
bubbleRouter.get("/:id", controller.readBubble);

//* 미들웨어 등록: ↓ 로그인이 필요한 요청
bubbleRouter.use("/", authUser);

// 버블 업로드
bubbleRouter.post(
	"/upload",
	upload.fields([
		{ name: "image", maxCount: 1 },
		{ name: "sound", maxCount: 1 },
	]),
	controller.createBubble,
);

// 버블 삭제
bubbleRouter.delete("/:id", controller.deleteBubble);

// 버블 댓글 등록
bubbleRouter.post("/:id/comment", controller.createBubbleComment);

// 버블 댓글 삭제
bubbleRouter.delete("/:id/comment", controller.deleteBubbleComment);

export default bubbleRouter;
