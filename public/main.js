// Wait until all element-objects are present:
document.addEventListener('DOMContentLoaded', function(eve) {

  
  // Choose any element which content's you want to show in a BookLook:
  var ele = document.getElementById('example-book-content')
  

  // Choose optional parameters, too:
  var pagesPerBookWidth = null
  var pageWidth = 333
  var pageHeight = 444
  
  
  // Execute:
  BookLook(ele, pagesPerBookWidth, pageWidth, pageHeight)



}); // DOM loaded
