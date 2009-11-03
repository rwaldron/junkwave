/*

    J U N K W A V E 
    A floating trash simulation for 5Gyres.org
    
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
    imgPath           : "img/junkwave/",

    // Number of images available in imgPath
    imgResorceCount   : 1,

    // Number of pieces of junk floating around
    junkCount         : 20,
    
    // Wave properties
    wave              : { 
                           count: 2,
                            freq: { min: 0.1, max: 10  },
                             amp: { min: 0.1, max: 1   },
                           phase: { min: 0.1, max: 0.4 }
                        },
    
    // Viscosity, LOW = Water-like, HIGH = Oil-esque
    viscosity         : 32,
    
    // Radius of effect, ( how big a hand stirs the water )
    radius            : 50,
    
    // Speed of animation ( milliseconds per frame )
    speed             : 30 
    
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
    this.junk = [];
    this.addJunk();
    this.wave = [];
    this.setWave();
    
    
    // Frame step animation
    var backlink  = this;
    var runframe  = function(){ backlink.frame() };
    var interval  = setInterval( runframe, settings.speed );
    
    // Mouse move attachment
    bindMousemove.call( this, this.elem, this.mousemove );
  }



  // F R A M E - D O // ********************************************************
  Junkwave.prototype.frame = function frame(){
  
    // Step through junk array
    var l = this.junk.length;
    for( var i = 0; i < l; i++ ){

      // Alias current junk for conveinence
      var junk = this.junk[ i ];

      // Simplify for positions for readability
      var x1 = this.elem.mouseX;
      var y1 = this.elem.mouseY;
      var x2 = junk.style.originX;
      var y2 = junk.style.originX;
      
      // Get distance between junk and mouse
      var distance = dist( x1, y1, x2, y2 );      
      
      // Junk tries to return to it's origin but is offset by human interaction, ah the patterns of life! ;)
      junk.realX += ( junk.originX - junk.realX ) / settings.viscosity;
      junk.realY += ( junk.originY - junk.realY ) / settings.viscosity; 
            
      // Map co-ords to css properties
      junk.style.left = junk.realX + 'px';
      junk.style.top = junk.realY + 'px';

    }
  
  }
  
  // M O U S E - M O V E // ****************************************************
  Junkwave.prototype.mousemove = function mousemove( e ){  
    var l = this.junk.length;
    for( var i = 0; i < l; i++ ){
          var junk = this.junk[ i ];
      junk.realX = this.elem.mouseX;
    }
  }

  // S E T - W A V E // ********************************************************
  Junkwave.prototype.setWave = function setWave(){
  
  }
    
  // A D D - J U N K // ********************************************************
  Junkwave.prototype.addJunk = function addJunk(){
    
    for( var i = 0; i < settings.junkCount; i++ ){
      
      // Make a new img element for the junk
      var junkImg = document.createElement( 'img' );
      
      // Decide which image is used for this piece of junk
      junkImg.src = settings.imgPath + 'junk_x64_01.gif';

      /* Set styles for the junk pieces:
            OriginX/Y       = the location the junk tries to return to
            realX/Y             = the current displaced x/y position
            style.left/top  = the css properties that map realX/Y */
      
      junkImg.style.position = 'absolute';
      junkImg.originX = Math.random() * ( this.width - 64 );
      junkImg.originY = Math.random() * ( this.width - 64 );
      junkImg.realX = junkImg.originX;
      junkImg.realY = junkImg.originY;
      junkImg.style.left = junkImg.realX + 'px';
      junkImg.style.top = junkImg.realY + 'px';
      
      // Add new junk peice to div
      this.elem.appendChild( junkImg );
      
      // Add new junk peice to array
      this.junk[ this.junk.length ] = junkImg;
    }
  }



  //////////////////////////////////////////////////////////////////////////////
  // COMMON FUNCTIONS
  //////////////////////////////////////////////////////////////////////////////

  // Gets one objects distance from another
  var dist = function dist( x1, y1, x2, y2 ){
    return Math.sqrt( Math.pow( x2 - x1, 2 ) + Math.pow( y2 - y1, 2 ) );
  }
  


  //////////////////////////////////////////////////////////////////////////////
  // INITIALIZATION
  //////////////////////////////////////////////////////////////////////////////
  
  // Fire init when document is ready
  $( document ).ready( function(){  init_junkwave() } );

  // Global vars...
  var instances = [];
    

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
      
      return instances[ instances.length ] = new Junkwave( this, type, w, h );

    } );
    
  };
  
  

  //////////////////////////////////////////////////////////////////////////////
  // EVENTS
  //////////////////////////////////////////////////////////////////////////////    
    
  var bindMousemove = function( elem, callback ){
    junkwaveInstance = this;
    $( elem ).mousemove( function( e ){
        this.mouseX = e.pageX - this.offsetLeft;
        this.mouseY = e.pageY - this.offsetTop;
        callback ? callback.call( junkwaveInstance, { mouseX: this.mouseX, mouseY: this.mouseY } ) : 0 ;
    } );
  }
  
  var debug = function( output ){
    if( $.browser.mozilla ){
      console.log( output );
    }else{
      document.getElementById( 'debug' ).innerHTML = output;
    }
  }
  

})();

















