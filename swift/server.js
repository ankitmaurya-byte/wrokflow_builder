
const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
app.use(express.json());


const userSchema = new mongoose.Schema({
  id: Number,
  name: String,
  username: String,
  email: String
});
const PostSchema = new mongoose.Schema({
  userId: Number,
  id: Number,
  title:  String,
  body: String
});
const CommentSchema = new mongoose.Schema({
  postId: Number,
  id: Number,
  email: String,
  body: String, 
  name: String

});

const User = mongoose.model('Userdata', userSchema);
const Post = mongoose.model('Post', PostSchema);
const Comment = mongoose.model('Comment', CommentSchema);

async function fetchData(url,schema, fields) {
  const reponse = await fetch(url)
    const data = await reponse.json();
    const filteredData = data.map(item => {
        const obj = {};
        fields.forEach(field => {
          obj[field] = item[field];
        });
        return obj;
      })
       const user = await schema.create(filteredData);
}
app.get('/load', async(req, res) => {
  try {
    // Simulate loading data from a database
    await fetchData('https://jsonplaceholder.typicode.com/users', User,["id","name","username","email"])
    await fetchData('https://jsonplaceholder.typicode.com/posts', Post,["userId","id","title","body"])
    await fetchData('https://jsonplaceholder.typicode.com/comments', Comment,["postId","id","name","email","body"])

    res.status(200).json({" message": "Data loaded successfully" });

  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
})


app.delete('/user', (req, res) => {
  res.send('Hello World!')
})

let visitorsData=[] // { count :1 , uuid: 23, dateVisite=[]}
function findvisitor(uuid){
  return visitorsData.find((data)=>{
  return data.uuid==uuid;
  })
}
function updateVisitorCount(uuid){
  visitorsData= visitorsData.map((data)=>{
    if(data.uuid===uuid){
      data.count+=1
      data.dateVisite.push(new Date().getDate())
    }
    return data;
  })
}
function findUniqueVisitor(date){
  const uniqueVisitor=[];
  visitorsData.forEach((data)=>{
    if(data.dateVisite.includes(date)){
      uniqueVisitor.push(data)
    }
  })
  // loop visitorsData 
  // data ->  data.dateVisite.incliudes(date)
  // uniqueVisitor.push ( data)
  return uniqueVisitor;
}
app.post('/count', (req, res) => {
  const date =res.query.date
  if(req.cookies.visitdata){
    //checkc if cookies uuid is presenti n visitordata
    const visitor=findvisitor(req.cookies.visitdata.uuid);
    if(visitor){
        updateVisitorCount(visitor.uuid)
    }
  }else{
    //create new uuid and asign to user
    const date=new Date()
    const newVisitor={count:1 , uuid:23 ,dateVisite : [date] }
    visitorsData.push(newVisitor);
    res.cookies.visitdata=newVisitor

  }


  res.send(findUniqueVisitor(date))


  
})
function fetchPostsByUserId(userId) {
  return Post.find({ userId: userId });
}
fetchCommentsByPostId = (postId) => {
  return Comment.find({ postId: postId });
}
 feetchuserData = (userId) => {
  return User.findOne({ id: userId });
}
app.get('/users/:userId', (req, res) => {
  const userId = req.params.userId;
    console.log(userId);
  let userData=feetchuserData(userId).then(user=>{
    if(!user){
      return res.status(404).json({ error: "User not found" });
    }
    fetchPostsByUserId(userId).then(async posts => {
      const postsWithComments = await Promise.all(posts.map(async post => {
        const comments = await fetchCommentsByPostId(post.id);
        return {
          ...post.toObject(),
          comments: comments
        };
      }));
      userData={
        ...user.toObject(),
        posts: postsWithComments
      };
      res.status(200).json({ userData });
    }).catch(err => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
    );
  }).catch(err => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  });
   
})

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://market:market@cluster0.yof04ss.mongodb.net/?appName=Cluster0");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};
connectDB().then(
  () => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  }
);  