function BookLook(element,
//
// What
// ----
//
// Turn a passed ele's content into a book-look: Paginate all the children.
//
//
//
// Usage
// -----
//
// Off one of your Javascripts call BookLook and pass an element to it:
//
//    BookLook(element)
//
//
// Optionally pass these parameters, too:
  
  pagesPerBookWidth = null, // nr, defaults to 1 unless pageWidth is passed
  
  pageWidth = null,         // px, defaults to bookWidth/pagesPerBookWidth

  pageHeight = null,        // px, defaults to visible height of book-ele

  bookClassName = null      // str, defaults to 'book', used for styling


// Example
// -------
//
// Example for two-column-layout with fixed width and full visible height:
//
//    BookLook(element, 2, 333, null)
//
//
//
//
//
// That's it folks, interested developers may look at ini() to follow the flow.
//
///////////////////////////////////////////////////////////////////////////////

) {




function setParameterDefaults() {
// Set default values for all parameters of BookLook.


  // pagesPerBookWidth is not set:
  if(pagesPerBookWidth === null) {

    // if pageWidth is set...
    if(pageWidth !== null) {
      
      // ... pagesPerBookWidth is as much pages as fit into bookWidth:
      pagesPerBookWidth = element.width / pagesPerBookWidth
    }
    // otherwise default to one page per bookWidth:
    else {
      pagesPerBookWidth = 1
    
    }
  }


  // pageHeight is not set:
  if(pageHeight === null) {

    // default to visible bookHeight:
    pageHeight = element.clientHeight

  }
  

  // pageWidth is not set:
  if(pageWidth === null) {
    
    // default to possible max-width in rel to pagesPerBookWidth:
    pageWidth = element.clientWidth / pagesPerBookWidth

  }


  // bookClassName is not set or an empty string was passed:
  if(bookClassName == null || bookClassName == '') {
  
    // default to book:  
    bookClassName = 'book'
  
  }

}



function setStyles() {

  // Set style-class on book:
  element.className = bookClassName

  // Prepare selectors:
  var bookSelector = '.' + bookClassName
  var pageSelector = bookSelector + ' > *'
  var paragraphSelector = pageSelector + ' > *'
  var firstParagraphSelector = paragraphSelector + ':first-child'
  var lastParagraphSelector  = paragraphSelector + ':last-child'
  
  // Create style-ele:
  var styleEle = document.createElement('style')

  // Prepare styles-string:
  var styles =
    

    bookSelector + ` {
      background: #000;
      color: #fff;
    } ` +
    

    pageSelector + ` {

      display: inline-block;
      width: ` + pageWidth + `px;
      min-height: ` + pageHeight + `px;
      margin: 1em;
      outline: 1px dotted #555;
      vertical-align: top;

    } ` +
    


    firstParagraphSelector + ` {
      padding-top: 0;
      margin-top: 0;

    } ` +
    

    lastParagraphSelector + ` {
      padding-bottom: 0;
      margin-bottom: 0;

    } ` // EO styles


  // Insert styles into style-ele:
  styleEle.innerHTML = styles


  // Append style-ele into head-ele:
  document.head.appendChild(styleEle)

}


function pageBroke(page) {
  return page.clientHeight > pageHeight
}


function fillPage(page, paragraphs) {
// Fill page para by para until page breaks, return remaining paras.

  var paragraph = null
  var textOverflow = null

  // Until page breaks and there are paragraphs to process:
  while(pageBroke(page) === false && paragraphs.length > 0) {
    // Remove and return 1st item of array:
    paragraph = paragraphs.shift()
    // Append it to page:
    page.appendChild(paragraph)
  }


  // After page broke, switch context to latest paragraph of page:
  paragraph = page.children[page.children.length-1]
  
  
  // There's overflowing text:
  textOverflow = refillParagraph(paragraph)
  if(textOverflow.length > 0) {
    // Create and append new page:
    page.parentNode.insertBefore(document.createElement(page.tagName), page.nextElementSibling)
    // Switch context to new page:
    page = page.nextElementSibling
    // Create new paragraph:
    paragraph = document.createElement(paragraph.tagName)
    // Add textOverflow to new paragraph:
    paragraph.innerHTML = textOverflow
    // Append new paragraph to page:
    page.appendChild(paragraph)
    // Repeat this function, if there are paragraphs left to process:
    if(paragraphs.length > 0) {
      fillPage(page, paragraphs)
    }
  }
}
function refillParagraph(paragraph) {
// Empty para of text and refill char by char until page breaks.
// Return leftpver-text.
  var breakPos = null // last pos before pageBreak where we can split para
  var text = paragraph.innerHTML
  paragraph.innerHTML = ''
  for(var i=0; i < text.length; i++) {
    var chara = text[i]
    if(chara == ' ') breakPos = i
    paragraph.innerHTML += chara
    if(pageBroke(paragraph.parentNode) === true) {
      if(breakPos === null) breakPos = i
      break
    }
  }
  paragraph.innerHTML = text.slice(0, breakPos)
  return text.slice(breakPos, text.length-1)
}
function ini() {


  
  setParameterDefaults()

  setStyles()


  // Store paragraphs away before we change the DOM:
  var paragraphs = []
  for(var i=0; i < element.children.length; i++) {
    paragraphs.push(element.children.item(i))
  }

  // Create first page ad prepend it into book:
  var page = document.createElement('div')
  element.insertBefore(page, element.firstChild)


  // Fill it until unfinity:
  fillPage(page, paragraphs)
 
}

  ini()

} // End of global wrapper-function BookLook()
