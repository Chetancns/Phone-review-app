if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI:'Your mongoURI'}
  } else {
    module.exports = {mongoURI:'mongodb://localhost/phonereview'}
}