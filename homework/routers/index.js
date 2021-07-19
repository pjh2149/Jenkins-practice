const express = require("express");
const Users = require("../schemas/user");
const Comments = require("../schemas/comment");
const Posting = require("../schemas/posting");
const router = express.Router();
const Joi = require("joi");
const authMiddleware = require("../middlewares/auth-middleware");
const jwt = require("jsonwebtoken")


const registerSchema = Joi.object({
  nickname: Joi.string()
      .alphanum()
      .min(3)
      .required(),
  password: Joi.string()
      .alphanum()
      .min(4),
  confirmPassword: Joi.string()
      .alphanum()
      .min(4),
})



//회원가입 API
router.post("/register", async(req,res)=>{
  const{nickname, password, confirmPassword} = req.body
  try{
    const{nickname, password, confirmPassword} = await registerSchema.validateAsync(req.body)


  if(password !== confirmPassword){
    res.send({
      result: "passwordError"
    })
    return;
  }

  if(password.includes(nickname)){
    
    res.send({
      result: "existError"
    })
    return;
  }

  const existUsers = await Users.find({nickname});
  if (existUsers.length){
    res.send({
        result: "nicknameExist"
    });
    return;
}
const user = new Users({nickname, password});
await user.save();

res.send({ result: "success" });
} catch (err){
  res.send({result:"formatError"})
}
});

//로그인 API
router.post("/auth", async(req, res)=>{
  const{ nickname, password } = req.body;
  const user = await Users.findOne({nickname, password}).exec();
  

  if (!user){
    res.send({result:"notExist"});
    return;
  }
const userId = user.userId
const token = jwt.sign({userId: user.userId}, "my-secret-key");
res.send({
  result:"success",
  userId,
  token
});
});

//게시글 작성 API
router.post("/posting", authMiddleware, async(req,res) =>{
  const { title, content} = req.body;
 const { user } =res.locals;
 const name = user.nickname  

  
  await Posting.create({title: title, name: name, content : content});
  
  res.send({ result: "success" });
});

//게시글 조회 API
router.get("/contents", async(req, res)=>{
  const postings = await Posting.find();
    res.json({ postings: postings });
})

//댓글 작성 API
router.post("/comment/:postId",authMiddleware ,async(req,res)=>{
  const {postId} = req.params;
  const {comment} = req.body;
  const { user } =res.locals;
  const nickname = user.nickname  

  await Comments.create({postId: postId, nickname: nickname, comment: comment});

  res.send({result:"success"})
})

//댓글 조회 API
router.get("/comment2/:postId", async(req,res)=>{
  const {postId} = req.params;

  const comment2 = await Comments.find({postId}).exec();


  res.send({comment2:comment2})
})

//게시글 상세 조회 API
router.get("/comment3/:postId", async(req,res)=>{
  const {postId} = req.params;
  const comment3 = await Posting.find({_id: postId}).exec();

  res.send({comment3:comment3})
})

//수정 페이지 조회 API
router.get("/modify/:commentId",authMiddleware, async(req,res)=>{
  const {commentId} = req.params;
  const comments = await Comments.findOne({_id: commentId}).exec();
  const comment = comments.comment

  res.send({comment:comment})
})

//수정 페이지 수정 API
router.put("/modify2/:commentId", authMiddleware, async(req,res)=>{
  const {commentId} = req.params;
  const {comment} = req.body;
  const comment2 = await Comments.findOne({_id: commentId}).exec();
  const targetName = comment2.nickname;
  const postId = comment2.postId;
  
  const { user } =res.locals;
  const compareName = user.nickname
 
 if (targetName == compareName){
   await Comments.updateOne({_id: commentId}, {$set:{comment:comment}})
   res.send({result:"success", postId:postId})
 }
 
})

//삭제 API
router.delete("/delete/:commentId", authMiddleware, async(req,res)=>{
  const {commentId} = req.params;
  const comment2 = await Comments.findOne({_id: commentId}).exec();
  const targetName = comment2.nickname;
  const postId = comment2.postId;
  
  const { user } =res.locals;
  const compareName = user.nickname
 
 if (targetName == compareName){
   await Comments.deleteOne({_id: commentId})
   res.send({result:"success", postId:postId})
 }
 
})






module.exports = router;