/*

    J U N K W A V E 
    A floating trash simulation for 5Gyres.com
    
    Developer : Alistair MacDonald, @F1LT3R, http://hyper-metrix.com
    License   : Liscenced to Brannan Novak & 5Gyres.org
    Usage     : JQuery must be loaded before junkwave.js!

*/

(function(){

  //////////////////////////////////////////////////////////////////////////////
  // GLOBAL SETTINGS
  //////////////////////////////////////////////////////////////////////////////

  var settings = {
    
    // Path to images
    imgPath          : "img/junkwave/",

    // Number of images available in imgPath
    imgResorceCount  : 1,

    // Number of pieces of junk floating around
    junkCount        : 20,

    // Number of waves
    waveCount        : 2
    
  };
  

  //////////////////////////////////////////////////////////////////////////////
  // JUNKWAVE OBJECT
  //////////////////////////////////////////////////////////////////////////////

  // The Junkwave porototype object
  function Junkwave( elem, type, w, h ){

    // Set up the .junkwave DIV element
    this.elem = elem;
    this.elem.style.overflow = 'hidden';
    this.elem.style.position = 'relative';
    
    // Store internal properties
    this.type = type;
    this.width = w;
    this.height = h;
    this.centerX = w / 2;
    this.centerY = h / 2;
    
    // Build the junkwave
    this.addJunk();
  }
    
  // Adds junk
  Junkwave.prototype.addJunk = function addJunk(){
    for( var i = 0; i < settings.junkCount; i++ ){
      var junkImg = document.createElement( 'img' );
      junkImg.src = settings.imgPath + 'junk_x64_01.gif';

      // Set styles for the junk pieces
      junkImg.style.position = 'absolute';
      junkImg.style.left = Math.random() * ( this.width - 64 ) + 'px';
      junkImg.style.top = Math.random() * ( this.width - 64 ) + 'px';

      this.elem.appendChild( junkImg );
    }
  }



  //////////////////////////////////////////////////////////////////////////////
  // INITIALIZATION
  //////////////////////////////////////////////////////////////////////////////
  
  // Fire init when document is ready
  $( document ).ready( function(){  init_junkwave() } );

  // Global vars...
  var mouseX = 0,
      mouseY = 0;
  

  // Main init function that builds the waves
  function init_junkwave(){
     
    $( 'div.junkwave' ).each( function(){
              
      var w = $( this ).width();
      var h = $( this ).height();
      var type = 'local';
      
      var classes = $( this ).attr( 'class' ).split( ' ' );
      for( var i in classes ){
        if( classes[ i ] == 'global' ){
          type = 'global';
        }
      }
            
      return new Junkwave( this, type, w, h );

    } );


    var debug = document.getElementById( 'debug' );    
    bindEvents();    
    
  };
  
  

  //////////////////////////////////////////////////////////////////////////////
  // EVENTS
  //////////////////////////////////////////////////////////////////////////////
    
  var mouseX = 0,
      mouseY = 0;
    
  var bindEvents = function(){    
    
    // Bind document mouseX, mouseY
    if( !$.browser.msie ){
      document.captureEvents( Event.MOUSEMOVE );
    }

    document.onmousemove = mouseMoved;
    
  }

  // When the mouse was moved...
  var mouseMoved = function mouseMoved( e ){    
    
    // Update the global mouse position variables
    if( $.browser.msie ){
      mouseX = event.clientX + document.body.scrollLeft;
      mouseY = event.clientY + document.body.scrollTop;
    }else{
      mouseX = e.pageX;
      mouseY = e.pageY;
    }
    
    debug.innerHTML = mouseX +','+ mouseY;
    
  }

  

})();

















