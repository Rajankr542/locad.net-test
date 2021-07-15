var express    =require("express"),
router         =express.Router();
const requireAuth = require('../../middlewares/requireAuth');
const Product = require('../../models/ProductModel');
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
 
    var results = await getProduct(searchObj , limit, skip , sortField, parseInt(sortOrder) );
    var count = await getProductCount(searchObj );
  
  res.status(201).send({
    status: 1,
    message: 'list of Product sucessfully processed',
    response: {
        data:results,
        count:count
    }
  });
});

router.get("/:id", async (req,res) => {
    var id = req.params.id;
    var oneproduct = await Product.findById(id).catch(err => {
      res.send(
          {
              status: 0,
              message:`error while getting City ${err.message}`
          }
      );
    });

  if(oneproduct){
    res.status(201).send({
        status: 1,
        message: 'request sucessfully processed',
        response: {
            data:oneproduct
        }
      });
  }

  else{
    res.status(201).send({
        status: 0,
        message: 'Product does not exist with this id',
      });
  }

  });

router.post("/", async (req,res) => {
var { name, imageurl,description } = req.body;
var documnet = {name:name, imageurl:imageurl, description:description};
    var createdpro = await Product.create(documnet).catch(err => {
      res.send(
          {
              status: 0,
              message:`error while creating City ${err.message}`
          }
      );
    });

  if(createdpro){
    res.status(201).send({
        status: 1,
        message: `Product created successfully ${name}`
      });
  }
  else{
    res.status(201).send({
        status: 0,
        message: 'Error creating Product',
      });
  }

  });

router.put("/:id", async (req,res) => {
    var { name, imageurl,description } = req.body;
    var documnet = {name:name, imageurl:imageurl, description:description};
    var pro = await Product.findByIdAndUpdate(req.params.id,documnet)
    .then((organise) => {
        res.status(201).send({
            status: 1,
            message: `Product updated successfully ${name}`
            });
    })
    .catch(err => {
        res.send(
            {
                status: 0,
                message:`error while updating City ${err.message}`
            }
        );
    });
    
    });
        
      
router.delete("/:id",function(req,res){
    Product.findByIdAndDelete(req.params.id,function(err){
if(err){
    res.send(
        {
            status: 0,
            message:`error while deleting City ${err.message}`
        }
    );
}else{
    res.status(201).send({
        status: 1,
        message: `Product deleted successfully`
        });
}
});
});


async function getProduct(filter, l , s,sort, order) {
    var results = await Product.find(filter)
    .sort({[sort]:order})
     .skip(parseInt(s)).limit(parseInt(l))
     .catch(error => console.log(error))
     return results;     
  }
  
  async function getProductCount(filter) {
  var results = await Product.count(filter)
  .catch(error => console.log(error))
  return results;     
  }
  

module.exports=router;