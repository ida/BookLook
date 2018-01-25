function BookLook(element,
//
// What
// ----
//
// Turn a passed ele's content into a book-look: Paginate all the children.
//
//
// How
// ---
//
// Create a book-ele, prepend it to passed ele, add a page-ele in book-ele.
//
// For each child in passed ele, insert copy of child into current page,
// measure current page-height until page breaks after given page-height.
//
// Then create new page and repeat until all children are processed.
//
//
// Why
// ---
//
// https://twitter.com/ldanielswakman/status/953225103017435136
// "Looking for a way for a variable block of text to automatically
// flow to a required number of columns (...) Column height/width defined."
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

  bookClassName = 'book'    // str, we will prepend all css-rules with it
  

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
function splitParaIntoTwoAtNthLineBreak(page, paragraph, n) {
// Refill para with text char by char until nth line breaks,
// split text in two paras, create next page, add second para
// to new page.
  var lineHeight = getStyle(paragraph, 'line-height')
  var text = paragraph.innerHTML
  var breakPos = text.length-1 // pos of last space for splitpoint at linebreak
  paragraph.innerHTML = ''
  for(var i=0; i < text.length; i++) {
    var character = text[i]
    if(character == ' ') breakPos = i
    paragraph.innerHTML += character
    if(paragraph.clientHeight > lineHeight * n) {i
      if(breakPos === null) {  // in case no space was found before pagebreak...
        breakPos = i           // ...breakPos is current pos
      }
      break
    }
  }
  paragraph.innerHTML = text.slice(0, breakPos)
  paragraph = document.createElement(paragraph.tagName)
  paragraph.innerHTML = text.slice(breakPos)
/*DEV
                              page.style.height = pageHeight + 'px'
                              page.style.overflow = 'hidden'
*/
  page.appendChild(paragraph)
}








function getCurrentHeight(page) {
  return page.clientHeight
}
function pageBroke(page) {
  return getCurrentHeight(page) > pageHeight
}


function fillPage(page, paragraphs) {
// Fill page para by para until page breaks, return remaining paras.
  var paragraph = null
  while(pageBroke(page) === false) { // until page breaks
    paragraph = paragraphs.shift()  //  remove and return 1st item of array
    if(paragraph !== undefined) page.appendChild(paragraph)    //   append item to page
    else break
  }


  // After page broke, switch context to latest paragraph of page:
  paragraph = page.children[page.children.length-1]
  
  
  var textOverflow = refillParagraph(paragraph)
  if(textOverflow.length > 0) {
    // Add new page:
    page.parentNode.insertBefore(document.createElement(page.tagName), page.nextElementSibling)
    // Switch context to new page:
    page = page.nextElementSibling
    paragraph = document.createElement(paragraph.tagName)
    paragraph.innerHTML = textOverflow
    page.appendChild(paragraph)
    if(paragraphs.length > 0) {
      fillPage(page, paragraphs)
    }
  }
}
function refillParagraph(paragraph) {
// Empty para of text and refill char by char until page breaks.
// Return leftpver-text.
  var breakPos = null // last pos before pageBrea where we can split para
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

  var page = null     // current page we're operating in

  var paragraphs = [] // store paragraph-objects away before we change the DOM
  for(var i=0; i < element.children.length; i++) {
    paragraphs.push(element.children.item(i))
  }
  
  setParameterDefaults()

  setStyles()

  element.insertBefore(document.createElement('div'), element.firstChild) // add 1st page

  page = element.firstChild

  paragraphs = fillPage(page, paragraphs)
 
}

  ini()

} // End of global wrapper-function BookLook()
