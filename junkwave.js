/*

    J U N K W A V E 
    A floating trash simulation for 5Gyres.org
    
    Developer : Alistair MacDonald, @F1LT3R, http://hyper-metrix.com
    License   : Liscenced to Brannan Novak & 5Gyres.org
    Usage     : JQuery must be loaded before junkwave.js!

*/

(function(){

  //////////////////////////////////////////////////////////////////////////////
  // GLOBAL DEFAULTS
  //////////////////////////////////////////////////////////////////////////////

  var defs = {
    imgPath           : "img/junkwave/", // Path to images
    imgResorceCount   : 6,     // Number of images available in imgPath. Up to 100, from: "junk_[00].gif" to: "junk_[99].gif"    
    imgSize           : 64,    // Size of images
    imgMaxSize        : 100,   // Max size of images, used to clip junk to bounds
    junkCount         : 40,    // Number of pieces of junk floating around
    junkCountIE       : 20,
    wave              : {      // Wave properties
                           count      : 2,  // 2 means 4 -> 1 = 1x, 1y, 2 waves contain 4 axes
                            zAmp      : 3,  // Amplitude of Z waves
                            freq: { min: 0.1, max: 5   },
                             amp: { min: 1  , max: 10  },
                           phase: { min: 0.1, max: 1.0 }
                        },
    viscosity         : 2,     // Viscosity, LOW = Oil, HIGH = Water
    radius            : 100,   // Radius of effect, ( how big a hand stirs the water )    
    radenv            : 500,   // Attack/Decay envelope speed of radius when mouse leaves DIV
    speed             : 30     // Speed of animation ( milliseconds per frame )
  };
 


  //////////////////////////////////////////////////////////////////////////////
  // JUNKWAVE OBJECT
  //////////////////////////////////////////////////////////////////////////////

  // The Junkwave porototype object
  function Junkwave( elem, type, w, h ){
  
    this.id = 'JunkWave_' + nf( instances.length, 2 );
    elem.junkwave = this;
    
    // Set up the .junkwave DIV element
    this.elem = elem;
    this.elem.style.overflow = 'hidden';
    this.elem.style.position = 'relative';
    this.elem.mouseX = 0;
    this.elem.mouseY = 0;
    
    // Store internal properties
    this.radius   = 0;
    this.type     = type;
    this.width    = w;
    this.height   = h;
    this.ticker   = 0;
    this.centerX  = w / 2;
    this.centerY  = h / 2;
    
    this.halfWidth = w / 2;
    
    // Build the junkwave
    this.junk = [];
    this.addJunk();
    this.wave = [];
    this.setWave();
        
    // Frame step animation
    var backlink  = this;
    var runframe  = function(){ backlink.frame() };
    var interval  = setInterval( runframe, defs.speed );
    
    // Mouse attachments
    this.mouseOver = this.type == 'local' ? false : true ;
    bindMousemove.call( this, this.elem, this.mousemove );      
    bindMouseout.call( this, this.elem, this.mouseout );
  }



  // F R A M E - D O // ********************************************************
  Junkwave.prototype.frame = function frame(){
  
    this.ticker += .1;
    
    // Step through junk array
    var l = this.junk.length;
    for( var i = 0; i < l; i++ ){

      // Alias current junk for conveinence
      var junk = this.junk[ i ];

      // Simplify for positions for readability
      var x1 = this.type == 'local' ? this.elem.mouseX : document.mouseX - this.elem.offsetLeft ;
      var y1 = this.type == 'local' ? this.elem.mouseY : document.mouseY - this.elem.offsetTop ;
      var x2 = junk.realX;
      var y2 = junk.realY;
      
      // Get distance between junk and mouse
      var distance = dist( x1, y1, x2, y2 );

      // Get the angle in radians from junk to the mouse
      var angle = Math.atan2( x2 - x1, y2 - y1 );
      
      // Offset junk from the mouse position
      junk.realX = junk.originX + Math.sin( angle ) * this.radius;
      junk.realY = junk.originY + Math.cos( angle ) * this.radius;

            // Decay or Attack radius if the mouse leaves or enters the DIV
            if( !this.mouseOver ){

              // Affect the radius
              this.radius -= parseInt( this.radius ) > 0 ? this.radius / defs.radenv : 0 ;

            }else{
              
              // Affect the radius
              this.radius += parseInt( this.radius ) < defs.radius ? defs.radius / defs.radenv : 0 ;

              // Wave distortion of junk position ( disiabled for IE due to painfuly slow image resizing )
              if( !$.browser.msie && defs.wave.zAmp ){
              
                var wl = defs.wave.count;
                for( var w = 0; w < wl; w++ ){
                  
                  // Alias wave axes
                  var wx = this.wave[ w ].x;
                  var wy = this.wave[ w ].y;
                  
                  // Distort position with wave
                  junk.realX += Math.sin( wx.freq + ( wx.phase * this.ticker ) ) * wx.amp;
                  junk.realY += Math.cos( wy.freq + ( wy.phase * this.ticker ) ) * wy.amp;                
                                    
                  // Webkit can't resize an image decimally
                  var zBob = Math.cos( this.ticker + ( junk.originX / this.halfWidth ) ) * defs.wave.zAmp;
                  
                  // Make sure img never gets larger than it's origin
                  zBob = defs.wave.doubleZAmp + zBob;
                  
                  // Webkit can't resize an image decimally so parseInt()
                  if( $.browser.webkit ){ zBob = parseInt( zBob ) };

                  // Apply Z bob distortion
                  junk.width = junk.oWidth - zBob;
                  junk.width = junk.oWidth - zBob;

                }
              }
              
            }
     
      // Clip the images to the bounds of the DIV      
      if( junk.realX < junk.halfWidth ){ junk.realX = junk.halfWidth };
      if( junk.realY < junk.halfHeight ){ junk.realY = junk.halfHeight };
      if( junk.realX > this.width  - junk.halfWidth ){ junk.realX = this.width  - junk.halfWidth };
      if( junk.realY > this.height - junk.halfHeight ){ junk.realY = this.height - junk.halfHeight };
     
      // Junk tries to return to it's origin but is offset by human interaction, ah the patterns of life! ;)
      junk.realX += ( junk.originX - junk.realX ) / defs.viscosity;
      junk.realY += ( junk.originY - junk.realY ) / defs.viscosity;
      
      // Map co-ords to css properties
      junk.style.left = ( junk.realX - junk.halfWidth ) + 'px';
      junk.style.top = ( junk.realY - junk.halfHeight ) + 'px';

    }
  
  }
  
  // M O U S E - M O V E // ****************************************************
  Junkwave.prototype.mousemove = function mousemove( e ){
    this.mouseOver = true;
  }

  // M O U S E - O U T // ****************************************************
  Junkwave.prototype.mouseout = function mouseout( e ){
    // Mouse is alwas in 'over' state for a global instance, IE: mouse is 'over' the document
    this.mouseOver = this.type == 'local' ? false : true ;
  }  

  // S E T - W A V E // ********************************************************
  Junkwave.prototype.setWave = function setWave(){
    
    function randomize(){
      return {
        freq  : ( Math.random() * ( defs.wave.freq.max - defs.wave.freq.min ) ) + defs.wave.freq.min,
        amp   : ( Math.random() * ( defs.wave.amp.max - defs.wave.amp.min ) ) + defs.wave.amp.min,
        phase : ( Math.random() * ( defs.wave.phase.max - defs.wave.phase.min ) ) + defs.wave.phase.min
      }
    }
    
    // Randomly generate some waves
    var l = defs.wave.count;
    for( var i = 0; i < l; i++ ){      
      this.wave[ i ] = { x: randomize(), y: randomize() }
    }
    
  }
    
  // A D D - J U N K // ********************************************************
  Junkwave.prototype.addJunk = function addJunk(){
    
    var l = $.browser.msie ? defs.junkCountIE : defs.junkCount ;
    
    for( var i = 0; i < l; i++ ){
      
      // Make a new img element for the junk
      var junkImg = document.createElement( 'img' );
      
      // Randomize an image for this piece'o-junk!
      var file = 'junk_';
      var numb = nf( parseInt( ( Math.random() * 6 ) ), 2 );
      junkImg.src = defs.imgPath + file + numb + '.gif';
      
     // console.log( junkImg.src );

      /* Set styles for the junk pieces:
            OriginX/Y           = the location the junk tries to return to
            realX/Y             = the current displaced x/y position
            style.left/top      = the css properties that map realX/Y */
      
      junkImg.style.position = 'absolute';
      junkImg.originX = Math.random() * ( this.width - defs.imgMaxSize ) + (defs.imgMaxSize/2);
      junkImg.originY = Math.random() * ( this.height - defs.imgMaxSize ) + (defs.imgMaxSize/2);
      junkImg.realX = junkImg.originX;
      junkImg.realY = junkImg.originY;
      junkImg.style.left = ( junkImg.realX - defs.imgHalfSize ) + 'px';
      junkImg.style.top = ( junkImg.realY  - defs.imgHalfSize ) + 'px';
                 
      junkImg.onload = function(){
        this.oWidth = this.width;
        this.oHeight = this.height;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.width / 2;
      }
      
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
  };

  var nf = function nf( num, pad ){
    var str = '' + num;
    while( pad - str.length ){
      str = '0' + str;
    }
    return str;
  };

  


  //////////////////////////////////////////////////////////////////////////////
  // INITIALIZATION
  //////////////////////////////////////////////////////////////////////////////
  
  // Fire init when document is ready
  $( document ).ready( function(){  init_junkwave() } );

  // Global vars...
  var instances = [];

  // Main init function that builds the waves
  function init_junkwave(){
    
    defs.wave.doubleZAmp = defs.wave.zAmp * 2;
     
    $( 'div.junkwave' ).each( function(){    
    
      var w = $( this ).outerWidth();
      var h = $( this ).outerHeight();
      var type = 'local';
      
      var classes = $( this ).attr( 'class' ).split( ' ' );
      for( var i in classes ){
        if( classes[ i ] == 'global' ){
          type = 'global';
        }
      }        
      
      return instances[ instances.length ] = new Junkwave( this, type, w, h );

    } );
    
    // Add global mouse move
    document.mouseX = 0;
    document.mouseY = 0;
    $( document ).mousemove( function( e ){
        document.mouseX = e.pageX;
        document.mouseY = e.pageY;
    } );
        
  };
  
  

  //////////////////////////////////////////////////////////////////////////////
  // EVENTS
  //////////////////////////////////////////////////////////////////////////////    
    
  var bindMousemove = function( elem, callback ){
    junkwaveInstance = this;
    $( elem ).mousemove( function( e ){
        this.junkwave.mouseOver = true;
        this.mouseX = e.pageX - this.offsetLeft;
        this.mouseY = e.pageY - this.offsetTop;
        callback ? callback.call( this.junkwave, { mouseX: this.mouseX, mouseY: this.mouseY } ) : 0 ;
    } );
  }

  var bindMouseout = function( elem, callback ){
    junkwaveInstance = this;
    $( elem ).mouseout( function( e ){
        this.junkwave.mouseOver = false;
        callback ? callback.call( this.junkwave ) : 0 ;
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
