var express    =require("express"),
router         =express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const requireAuth = require('../../middlewares/requireAuth');
const UserSchema = mongoose.model('User');

router.use(requireAuth);

router.get("/", async (req,res) => {
  var searchObj = req.query;
  limit = searchObj.limit || 10;
  skip = searchObj.skip || 0;
  sortField = searchObj.sortField || 'createdAt';
  sortOrder = searchObj.sortOrder || -1;

  if(searchObj.limit !== undefined){
      delete searchObj.limit;
  }

  if(searchObj.skip !== undefined){
      delete searchObj.skip;
  }

  if(searchObj.sortField !== undefined){
      delete searchObj.sortField;
  }

  if(searchObj.sortOrder !== undefined){
      delete searchObj.sortOrder;
  }
  var results = await getUserSchema(searchObj , limit, skip , sortField, parseInt(sortOrder) );
  var count = await getUserSchemaCount(searchObj );

res.status(201).send({
  status: 1,
  message: 'list of Users sucessfully processed',
  response: {
      data:results,
      count:count
  }
});


});

router.get("/:id", async (req,res) => {
    var id = req.params.id;
    var user = await UserSchema.findById(id).select(" -password ").catch(err => {
      res.send(
          {
              status: 0,
              message:`error while getting User ${err.message}`
          }
      );
    });

  if(user){
 res.status(201).send(
        {
          status: 1,
          message: 'requested user',
          response: {
            data: user
          }
        });
  }

  else{
    res.status(201).send({
        status: 0,
        message: 'User does not exist with this id',
      });
  }

  });

router.put("/:id", async (req,res) => {
  var id = req.params.id;
  const { email, password, username, status} = req.body;
  var user = await UserSchema.findById(id).catch(err => {
    res.send(
        {
            status: 0,
            message:`error while getting User ${err.message}`
        }
    );
  });
if(user){
try {
if(email !== undefined && email !=""){
user.email =email;
}
if(password !== undefined && password !=""){
user.password =password;
}
if(username !== undefined && username !=""){
user.username =username;
}
await user.save();
res.send({
status: 1,
message: 'User Updated succesfully',
});


  } catch (err) {
    return res.status(422).send({
      status: 0,
      message: err.message,
    });
  }
}

else{
  res.status(201).send({
      status: 0,
      message: 'User does not exist with this id',
    });
}

});

router.delete("/:id",async function(req,res){
  var id = req.params.id;
  UserSchema.findByIdAndDelete(req.params.id,function(err){
if(err){
    res.send(
        {
            status: 0,
            message:`error while deleting User ${err.message}`
        }
    );
}else{
    res.status(201).send({
        status: 1,
        message: `User deleted successfully`
        });
}
});
});

async function getUserSchema(filter, l , s,sort, order) {
  var results = await UserSchema.find(filter)
  .sort({[sort]:order})
  .select("-password")
   .skip(parseInt(s)).limit(parseInt(l))
   .catch(error => console.log(error))
   return results;     
}

async function getUserSchemaCount(filter) {
var results = await UserSchema.count(filter)
.catch(error => console.log(error))
return results;     
}
module.exports=router;