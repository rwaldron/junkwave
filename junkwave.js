(function(){

  function init_junkwave(){

    if (arguments.callee.done){ return }

    arguments.callee.done = true;

    if (_timer) clearInterval(_timer);

    // do stuff
    alert("stuff!");
  };

  /* for Mozilla/Opera9 */
  if( document.addEventListener ){
    document.addEventListener( 'DOMContentLoaded', init_junkwave, false );
  }

  /* for Internet Explorer */
  /*@cc_on @*/
  /*@if (@_win32)
    document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
    var script = document.getElementById("__ie_onload");
    script.onreadystatechange = function() {
      if (this.readyState == "complete") {
        init_junkwave(); // call the onload handler
      }
    };
  /*@end @*/

  /* for Safari */
  if( /WebKit/i.test( navigator.userAgent ) ){ // sniff
    var _timer = setInterval( function(){
      if ( /loaded|complete/.test( document.readyState ) ){
        init_junkwave(); // call the onload handler
      }
    }, 10 );
  }

  /* for other browsers */
  window.onload = init;




  /*
 
  var settings = {
    imgPath   : "img/"
  };
  
  var Junkwave = function Junkwave( elem ){
    this.elem = elem;
  }

  this.init_Junkwave = function init_Junkwave(){
    //sd
  }      
  
  */

})();
