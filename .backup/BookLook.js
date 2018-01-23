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
  
  pagesPerBookWidth = null, // amounts of columns, if null defaults to 1 unless pageWidth is passed
  
  pageWidth = null,        // in px, if null default to bookWidth/pagesPerBookWidth

  pageHeight = null,       // in px, if null default to visible height of book-ele

  cssSelectorPrefix='book' // className set on book, we'll prepend all style-rules with it
  

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



var book = null         // we want to create a book

var page = null         // a book consists of pages

var paragraph = null    // a page consists of paragraphs



function addBook() {
  book = document.createElement('div')
  book.className = cssSelectorPrefix
  element.parentNode.insertBefore(book, element)
}
function addPage() {
  page = document.createElement('div')
  page.className = 'page'
  book.appendChild(page)
}
function addPage() {
  page = document.createElement('div')
  page.className = 'page'
  book.appendChild(page)
}
function getBottomSpaceHeight(ele) {
  var props = ['margin-bottom', 'border-bottom-width', 'padding-bottom']
  var height = getSumOfCssProps(ele, props)
  return height
}
function getStyle(ele, prop) {
  return parseFloat(window.getComputedStyle(ele).getPropertyValue(prop))
}
function getSumOfCssProps(ele, props) {
  var sum = 0
  for(var i=0; i < props.length; i++) {
    var prop = props[i]
    var value = parseFloat(getStyle(ele, prop))
    sum += value
  }
  return sum
}
function getTextHeight(ele) {
  // ele.clientHeight = inner height of an element in pixels, including padding
  //                 but not the horizontal scrollbar height, border, or margin
  var props = ['padding-top', 'padding-bottom']
  var height = getSumOfCssProps(ele, props) * -1
  height += ele.clientHeight
  return height
}
function getTopSpaceHeight(ele) {
  var props = ['margin-top', 'border-top-width', 'padding-top']
  var height = getSumOfCssProps(ele, props)
  return height
}
function handlePageBreak() {
  var visibleLinesAmount = getAmountOfVisibleLinesOfPara()
  paragraph = page.children[page.children.length-1]
  if(visibleLinesAmount > 0) {
    splitParaIntoTwoAtNthLineBreak(visibleLinesAmount)
  }
}
function fillBook(paragraphs) {
  for(var i=0; i < paragraphs.length; i++) {
    paragraph = document.createElement(element.children[i].tagName)
    paragraph.innerHTML = element.children[i].innerHTML
    page.appendChild(paragraph)
    if(page.clientHeight > pageHeight) {
      handlePageBreak(page)
    }
  }
}
function pageBroke(page) {
  return page.clientHeight > pageHeight
}
function setStyles() {
  
  var bookSelector = '.' + cssSelectorPrefix
  var pageSelector = bookSelector + ' .page'
  var paragraphSelector = pageSelector + ' > *'
  
  var styleEle = document.createElement('style')
  var styles = `



` + bookSelector + ` {
    background: #000;
    color: #fff;
    counter-reset: pagenr;
}



` + pageSelector + ` {
  counter-increment: pagenr;
  display: inline-block;
  margin: 1em;
  min-height: ` + pageHeight + `px;
  position: relative;
  top: 0;
  left: 0;
  outline: 1px dotted #555;
  vertical-align: top;
  width: ` + pageWidth + `px;
}


` + pageSelector + `:after {
  content: counter(pagenr);
  position: absolute;
  margin-top: -1em;
  left: ` + pageWidth / 2 + `px;
}


` + paragraphSelector + `:first-child {
  padding-top: 0;
  margin-top: 0;
}


` + paragraphSelector + `:last-child {
  padding-bottom: 0;
  margin-bottom: 0;
}


  ` // EO styles
  styleEle.innerHTML = styles
  document.head.appendChild(styleEle)
}
function setVariables() {
  // Set default values for the global-vars within the scope of BookLook()
  if(pagesPerBookWidth === null) {
    if(pageWidth === null) pagesPerBookWidth = 1
    else pagesAmount = element.width / pagesPerBookWidth
  }
  if(pageHeight === null) pageHeight = element.clientHeight
  if(pageWidth  === null) pageWidth  = element.clientWidth / pagesPerBookWidth
  addBook()
  addPage()
}
function getAmountOfVisibleLinesOfPara() {

  var visibleLinesAmount = 0

  var lineHeight = getStyle(paragraph, 'line-height')

  var pageContentHeight = getTextHeight(page)

  pageContentHeight -= getTextHeight(paragraph)

  while(pageContentHeight < pageHeight) {
    pageContentHeight  += lineHeight
    visibleLinesAmount += 1
  }

  return visibleLinesAmount
}
function splitParaIntoTwoAtNthLineBreak(n) {
// Refill para with text char by char until nth line breaks.
  var lineHeight = getStyle(paragraph, 'line-height')
  var text = paragraph.innerHTML
  var newText = ''
  var breakPos = text.length-1 // remember pos of last space for splitpoint at linebreak
  paragraph.innerHTML = ''
  for(var i=0; i < text.length; i++) {
    var character = text[i]
    if(character == ' ') breakPos = i
    paragraph.innerHTML += character
    if(paragraph.clientHeight > lineHeight * n) {i
      if(breakPos === null) {  // in case no space was found before pagebreak ...
        breakPos = i           // ... breakPos is current pos
      }
      break
    }
  }
  paragraph.innerHTML = text.slice(0, breakPos)
  paragraph = document.createElement(paragraph.tagName)
  paragraph.innerHTML = text.slice(breakPos)
  addPage()
  page.appendChild(paragraph)
}
function ini() {

  element.style.visibility = 'hidden'           // hide ele

  setVariables()

  setStyles()

  fillBook(element.children)

  element.innerHTML = ''                        // empty ele of content
  
  element.insertBefore(book, element.firstNode) // fill ele with book
  
  element.style.visibility = 'visible'          // show ele again

  
}

  ini()

} // End of global wrapper-function BookLook()
