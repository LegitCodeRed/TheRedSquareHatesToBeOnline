// player.vy = 0;
// ==ClosureCompiler==
// @output_file_name default.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @language ECMASCRIPT5
// @fileoverview
// @suppress {checkTypes | globalThis | checkVars}
// ==/ClosureCompiler==

/*
Ga plugins
==========
Weclome to the `plugins.js` file!
This file contains lots of extra tools that are really useful for making games,
but which are more specialized that than the universal tools in `ga.js` file.

How can use these plugins? The easiest way is just to link this entire file
with a `<script>` tag. Then you have immediate access to all this code
and you can decide later what you really need.

Your own custom plugins
-----------------------

If you wan to keep you game file size small, create
your own custom plugins file. Here's how:

1. Make a new JS file called `custom.js` (or an other name you want to give it.)
2. Add this:

    GA.custom = function(ga) {
      //Your own collection of plugins will go here
    };

3. Link `custom.js` to your game's main HTML document with a `<script>` tag.

4. Then just copy/paste any plugin functions from this
file (`plugins.js`) into your own `custom.js` file. Like this:

    GA.custom = function(ga) {
      //Create a random number within a specific range
      ga.randomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
    };

The `GA.custom` function is called by Ga as soon as the engine has
finished initializing, but before the game runs. This means you
can use it to run any other custom setup task that you want to
perform before any of the game code runs. You could also use the
`GA.custom` function to overwrite any of Ga's default properties
with your own. Go wild!

The plugins in this file
------------------------

The code in this `plugins.js` file is organized into chapters.
Use your text editor's search features to find what you're looking for.
Here's the table of contents to get you started:

### Prologue: Polyfills

- Necessary polyfills for some of the API's used in this file.

### Chapter 1: Utilities

`move`: Make a sprite or group move (or an array of them) by updating its velocity.
`distance`: The distance in pixels between the center point of two sprites.
`followEase`: Make a sprite ease to the position of another sprite.
`easeProperty`: Ease a single sprite property to another value.
`slide`: Ease a sprite to a specific position.
`fadeIn`: Fade in a sprite.
`fadeOut`: Fade out a sprite.
`fade`: Fades in or out.
`pulse`: Uses the `fade` method to make a sprite's alpha oscillate.
`follow`: Make a sprite follow another sprite at a fixed speed.
`rotateSprite`: Make a sprite rotate around the center of another sprite.
`rotatePoint`: Make any x/y point rotate around any other point.
`angle`: Get the angle between the center points of two sprites
`randomInt`: Generate a random integer within a range.
`randomFloat`: Generate a random floating point number within a range.
`wait`: Wait for a certain number of milliseconds and then execute a callback function.
`worldCamera`: A method that creates and returns a camera for a scrolling game world.
`scaleToWindow`: Automatically scales and centers the game to the maximum browser window area.
`shake`: Make a sprite or group shake. You can use it for a screen shake effect.

### Chapter 2: The tweening module

`tweens`: An array to store all of Ga's current tweens.
`updateTweens`: A function that updates all the tweens each frame inside Ga's game loop.
`ease`: An object that stores references to useful easing functions.
`tweenProperty`: A generic low-level method that tweens any sprite property.
`slide`: Make a sprite slide from one x/y position to another.
`fadeIn`: Fade a sprite in.
`fadeOut`: Fade a sprite out.
`pulse`: Make a sprite fade in and out in a loop.
`makeTween`: A low-level function to help construct complex tweens.
`scale`: Smoothly change the scale of a sprite.
`breathe`: A breathing effect that changes the sprite's scale in a continuous loop.
`strobe`: A psychedelic flashing scale effect.
`wobble`: Make a sprite wobble like a plate of jelly.
`removeTween`: A universal method for remove a tween from Ga's engine.
`followCurve`: Make a sprite follow a bezier curve that you can specify.
`followPath`: Make a sprite follow a path of connected waypoints.
`walkCurve`: Make a sprite follow a path of connected curves.

### Chapter 3: Sprite creation tools

`shoot`: A function for making sprites shoot bullets.
`grid`: Easily plot a grid of sprites. Returns a container full of sprite `children`.
`progressBar`: A loading progress bar you can use to display while game assets are loading.`
`particleEffect`: A versatile function for creating particles.
`emitter`: A particle emitter for creating a constant stream of particles.
`tilingSprite`: An easy way to create a seamless scrolling background effect.
`burst`: DEPRICATED. A particle explosion effect.

### Chapter 4: Collision

#### Boundary collisions

`outsideBounds`: Tells you if a sprite has exceeded the boundary of another sprite or container.
`contain`: Contains a sprite inside another sprite. Optional bounce if the sprite hits the edges.

#### Shape collisions

`hitTestPoint`: Returns `true` or `false` if an x/y point is intersecting a rectangle or circle.
`hitTestCircle`: Returns `true` if any two circular sprites overlap.
`hitTestRectangle`: Returns `true` if any two rectangular sprites overlap.
`hitTestCircleRectangle`: Returns `true` if rectangular and circular sprites overlap.
`hitTestCirclePoint`: Returns `true` if a point intersects a circle.
`rectangleCollision`: Prevents two colliding rectangles from overlapping and tells you the collision side
`circleCollision`: Makes a moving circle bounce away from a stationary circle.
`movingCircleCollision`: Makes two moving circles bounce apart.
`multipleCircleCollision`: Bounce apart any two circles that are in the same array.
`bounceOffSurface`: A helper method that's use internally by these collision functions.

#### 2D tile-based collision utilities

`getIndex`: Converts a sprite's x/y pixel coordinates into an array index number.
`getTile`: Converts a sprite's index number into x/y pixel coordinates.
`surroundingCells`: returns an array of 9 index numbers of cells surrounding a center cell.
`getPoints`: returns an object with the x/y positions of all the sprite's corner points.
`hitTestTile`: A versatile collision detection function for tile based games.
`updateMap`: Returns a new map array with the new index positions of sprites.

### Chapter 5: Sprite controllers

`keyControlFourWay`: Assign keyboard keys to make a sprite move at a fixed speed in 4 directions

### Chapter 6: Tiled editor importers

`makeTiledWorld`: Creates a game world using Tiled Editor's JSON export data.

### Chapter 7: The fullscreen module

`requestFullscreen`: Used by `enableFullscreen` to launch fullscreen mode.
`exitFullscreen`: used by `enableFullscreen` to exit fullsrcreen mode.
`alignFullscreen`: Used by `enableFullscreen` to scale and center the canvas in fullscreen mode.
`enableFullscreen`: Enables fullscreen mode when the user clicks or touches the canvas.

### Chapter 8: Sound

`ga.actx`: The audio context.
`makeSound`: a method for loading and controling sound files.
`sound`: a method that returns a sound file object.
`soundEffect`: a versatile method for generating sound effects from pure code.
`impulseResponse`: A helper method for adding reverb to sounds.

*/

/*
Prologue
--------

Some necessary polyfills for some of the newer APIs used in this file
*/

/*
### Fixing the WebAudio API.
The WebAudio API is so new that it's API is not consistently implemented properly across
all modern browsers. Thankfully, Chris Wilson's Audio Context Monkey Patch script
normalizes the API for maximum compatibility.

https://github.com/cwilso/AudioContext-MonkeyPatch/blob/gh-pages/AudioContextMonkeyPatch.js

It's included here.
Thank you, Chris!

*/

(function (global, exports, perf) {
  'use strict';

  function fixSetTarget(param) {
    if (!param)	// if NYI, just return
      return;
    if (!param.setTargetAtTime)
      param.setTargetAtTime = param.setTargetValueAtTime;
  }

  if (window.hasOwnProperty('webkitAudioContext') &&
      !window.hasOwnProperty('AudioContext')) {
    window.AudioContext = webkitAudioContext;

    if (!AudioContext.prototype.hasOwnProperty('createGain'))
      AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
    if (!AudioContext.prototype.hasOwnProperty('createDelay'))
      AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
    if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor'))
      AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;

    AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain;
    AudioContext.prototype.createGain = function() {
      var node = this.internal_createGain();
      fixSetTarget(node.gain);
      return node;
    };

    AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay;
    AudioContext.prototype.createDelay = function(maxDelayTime) {
      var node = maxDelayTime ? this.internal_createDelay(maxDelayTime) : this.internal_createDelay();
      fixSetTarget(node.delayTime);
      return node;
    };

    AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource;
    AudioContext.prototype.createBufferSource = function() {
      var node = this.internal_createBufferSource();
      if (!node.start) {
        node.start = function ( when, offset, duration ) {
          if ( offset || duration )
            this.noteGrainOn( when, offset, duration );
          else
            this.noteOn( when );
        }
      }
      if (!node.stop)
        node.stop = node.noteOff;
      fixSetTarget(node.playbackRate);
      return node;
    };

    AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor;
    AudioContext.prototype.createDynamicsCompressor = function() {
      var node = this.internal_createDynamicsCompressor();
      fixSetTarget(node.threshold);
      fixSetTarget(node.knee);
      fixSetTarget(node.ratio);
      fixSetTarget(node.reduction);
      fixSetTarget(node.attack);
      fixSetTarget(node.release);
      return node;
    };

    AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter;
    AudioContext.prototype.createBiquadFilter = function() {
      var node = this.internal_createBiquadFilter();
      fixSetTarget(node.frequency);
      fixSetTarget(node.detune);
      fixSetTarget(node.Q);
      fixSetTarget(node.gain);
      return node;
    };

    if (AudioContext.prototype.hasOwnProperty( 'createOscillator' )) {
      AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator = function() {
        var node = this.internal_createOscillator();
        if (!node.start)
          node.start = node.noteOn;
        if (!node.stop)
          node.stop = node.noteOff;
        fixSetTarget(node.frequency);
        fixSetTarget(node.detune);
        return node;
      };
    }
  }
}(window));

//### Fixing the Fullscreen API.
//The Fullscreen API is also in flux and has a quirky browser
//implementations. Here's a fix for it, thanks to Norman Paschke:
//https://github.com/neovov/Fullscreen-API-Polyfill/blob/master/fullscreen-api-polyfill.js

(function (doc) {
	// Use JavaScript script mode
	"use strict";

	/*global Element */

	var pollute = true,
		api,
		vendor,
		apis = {
			// http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html
			w3: {
				enabled: "fullscreenEnabled",
				element: "fullscreenElement",
				request: "requestFullscreen",
				exit:    "exitFullscreen",
				events: {
					change: "fullscreenchange",
					error:  "fullscreenerror"
				}
			},
			webkit: {
				enabled: "webkitIsFullScreen",
				element: "webkitCurrentFullScreenElement",
				request: "webkitRequestFullScreen",
				exit:    "webkitCancelFullScreen",
				events: {
					change: "webkitfullscreenchange",
					error:  "webkitfullscreenerror"
				}
			},
			moz: {
				enabled: "mozFullScreen",
				element: "mozFullScreenElement",
				request: "mozRequestFullScreen",
				exit:    "mozCancelFullScreen",
				events: {
					change: "mozfullscreenchange",
					error:  "mozfullscreenerror"
				}
			},
			ms: {
				enabled: "msFullscreenEnabled",
				element: "msFullscreenElement",
				request: "msRequestFullscreen",
				exit:    "msExitFullscreen",
				events: {
					change: "MSFullscreenChange",
					error:  "MSFullscreenError"
				}
			}
		},
		w3 = apis.w3;

	// Loop through each vendor's specific API
	for (vendor in apis) {
		// Check if document has the "enabled" property
		if (apis[vendor].enabled in doc) {
			// It seems this browser support the fullscreen API
			api = apis[vendor];
			break;
		}
	}

	function dispatch( type, target ) {
		var event = doc.createEvent( "Event" );

		event.initEvent( type, true, false );
		target.dispatchEvent( event );
	} // end of dispatch()

	function handleChange( e ) {
		// Recopy the enabled and element values
		doc[w3.enabled] = doc[api.enabled];
		doc[w3.element] = doc[api.element];

		dispatch( w3.events.change, e.target );
	} // end of handleChange()

	function handleError( e ) {
		dispatch( w3.events.error, e.target );
	} // end of handleError()

	// Pollute only if the API doesn't already exists
	if (pollute && !(w3.enabled in doc) && api) {
		// Add listeners for fullscreen events
		doc.addEventListener( api.events.change, handleChange, false );
		doc.addEventListener( api.events.error,  handleError,  false );

		// Copy the default value
		doc[w3.enabled] = doc[api.enabled];
		doc[w3.element] = doc[api.element];

		// Match the reference for exitFullscreen
		doc[w3.exit] = doc[api.exit];

		// Add the request method to the Element's prototype
		Element.prototype[w3.request] = function () {
			return this[api.request].apply( this, arguments );
		};
	}

	// Return the API found (or undefined if the Fullscreen API is unavailable)
	return api;

}(document));

GA = GA || {};
GA.plugins = function(ga) {

  /*
  Chapter 1: Utilities
  --------------------
  */

  //### move
  //Move a sprite or an array of sprites by adding its
  //velocity to its position
  ga.move = function(sprites) {
    if (sprites instanceof Array === false) {
      internal_move(sprites)
    } else {
      for (var i = 0; i < sprites.length; i++) {
        internal_move(sprites[i])
      }
    }
  };


  ga.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };



  //### scaleToWindow
  //Center and scale the game engine inside the HTML page
  ga.scaleToWindow = function(backgroundColor) {

    backgroundColor = backgroundColor || "#2C3539";
    var scaleX, scaleY, scale, center;

    //1. Scale the canvas to the correct size
    //Figure out the scale amount on each axis
    scaleX = window.innerWidth / ga.canvas.width;
    scaleY = window.innerHeight / ga.canvas.height;

    //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
    scale = Math.min(scaleX, scaleY);
    ga.canvas.style.transformOrigin = "0 0";
    ga.canvas.style.transform = "scale(" + scale + ")";

    //2. Center the canvas.
    //Decide whether to center the canvas vertically or horizontally.
    //Wide canvases should be centered vertically, and
    //square or tall canvases should be centered horizontally
    if (ga.canvas.width > ga.canvas.height) {
      if (ga.canvas.width * scale < window.innerWidth) {
        center = "horizontally";
      } else {
        center = "vertically";
      }
    } else {
      if (ga.canvas.height * scale < window.innerHeight) {
        center = "vertically";
      } else {
        center = "horizontally";
      }
    }

    //Center horizontally (for square or tall canvases)
    var margin;
    if (center === "horizontally") {
      margin = (window.innerWidth - ga.canvas.width * scale) / 2;
      ga.canvas.style.marginLeft = margin + "px";
      ga.canvas.style.marginRight = margin + "px";
    }

    //Center vertically (for wide canvases)
    if (center === "vertically") {
      margin = (window.innerHeight - ga.canvas.height * scale) / 2;
      ga.canvas.style.marginTop = margin + "px";
      ga.canvas.style.marginBottom = margin + "px";
    }

    //3. Remove any padding from the canvas  and body and set the canvas
    //display style to "block"
    ga.canvas.style.paddingLeft = 0;
    ga.canvas.style.paddingRight = 0;
    ga.canvas.style.paddingTop = 0;
    ga.canvas.style.paddingBottom = 0;
    ga.canvas.style.display = "block";

    //4. Set the color of the HTML body background
    document.body.style.backgroundColor = backgroundColor;

    //5. Set the game engine and pointer to the correct scale.
    //This is important for correct hit testing between the pointer and sprites
    ga.pointer.scale = scale;
    ga.scale = scale;

    //It's important to set `canvasHasBeenScaled` to `true` so that
    //the scale values aren't overridden by Ga's check for fullscreen
    //mode in the `update` function (in the `ga.js` file.)
    ga.canvas.scaled = true;

    //Fix some quirkiness in scaling for Safari
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("safari") != -1) {
      if (ua.indexOf("chrome") > -1) {
        // Chrome
      } else {
        // Safari
        ga.canvas.style.maxHeight = "100%";
        ga.canvas.style.minHeight = "100%";
      }
    }
  };


  ga.fourKeyController = function(s, speed, up, right, down, left) {

      //Create a `direction` property on the sprite
      s.direction = "";

      //Create some keyboard objects
      leftArrow = ga.keyboard(left);
      upArrow = ga.keyboard(up);
      rightArrow = ga.keyboard(right);
      downArrow = ga.keyboard(down);

      //Assign key `press` and release methods
      leftArrow.press = function() {
        s.vx = -speed;
        s.vy = 0;
        s.direction = "left";
      };
      leftArrow.release = function() {
        if (!rightArrow.isDown && s.vy === 0) {
          s.vx = 0;
        }
      };
      upArrow.press = function() {
        s.vy = -speed;
        s.direction = "up";
        air = true;
      };
      upArrow.release = function() {
        if (!downArrow.isDown && s.vx === 0) {
          s.vy = 0;
        }
      };
      rightArrow.press = function() {
        s.vx = speed;
        s.vy = 0;
        s.direction = "right";
      };
      rightArrow.release = function() {
        if (!leftArrow.isDown && s.vy === 0) {
          s.vx = 0;
        }
      };
      downArrow.press = function() {
        s.vy = speed;
        s.vx = 0;
        s.direction = "down";
      };
      downArrow.release = function() {
        if (!upArrow.isDown && s.vx === 0) {
          s.vy = 0;
        }
      };
    };

    ga.rectangleCollision = function(r1, r2, bounce, global) {
      var collision, combinedHalfWidths, combinedHalfHeights,
          overlapX, overlapY, vx, vy;

      //Set `bounce` to a default value of `true`
      if(bounce === undefined) bounce = false;

      //Set `global` to a default value of `false`
      if(global === undefined) global = false;

      //Calculate the distance vector
      if(global) {
        vx = (r1.gx + r1.halfWidth) - (r2.gx + r2.halfWidth);
        vy = (r1.gy + r1.halfHeight) - (r2.gy + r2.halfHeight);
      } else {
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;
      }

      //Figure out the combined half-widths and half-heights
      combinedHalfWidths = r1.halfWidth + r2.halfWidth;
      combinedHalfHeights = r1.halfHeight + r2.halfHeight;

      //Check whether vx is less than the combined half widths
      if (Math.abs(vx) < combinedHalfWidths) {

        //A collision might be occurring!
        //Check whether vy is less than the combined half heights
        if (Math.abs(vy) < combinedHalfHeights) {

          //A collision has occurred! This is good!
          //Find out the size of the overlap on both the X and Y axes
          overlapX = combinedHalfWidths - Math.abs(vx);
          overlapY = combinedHalfHeights - Math.abs(vy);

          //The collision has occurred on the axis with the
          //*smallest* amount of overlap. Let's figure out which
          //axis that is

          if (overlapX >= overlapY) {

            //The collision is happening on the X axis
            //But on which side? vy can tell us
            if (vy > 0) {
              collision = "top";

              //Move the rectangle out of the collision
              r1.y = r1.y + overlapY;
            } else {
              collision = "bottom";

              //Move the rectangle out of the collision
              r1.y = r1.y - overlapY;
            }
            //Bounce
            if (bounce) {
              r1.vy *= -1;

              /*Alternative
              //Find the bounce surface's vx and vy properties
              var s = {};
              s.vx = r2.x - r2.x + r2.width;
              s.vy = 0;

              //Bounce r1 off the surface
              //bounceOffSurface(r1, s);
              */
            }
          } else {

            //The collision is happening on the Y axis
            //But on which side? vx can tell us
            if (vx > 0) {
              collision = "left";

              //Move the rectangle out of the collision
              r1.x = r1.x + overlapX;
            } else {
              collision = "right";

              //Move the rectangle out of the collision
              r1.x = r1.x - overlapX;
            }

            //Bounce
            if (bounce) {
              r1.vx *= -1;

              /*Alternative
              //Find the bounce surface's vx and vy properties
              var s = {};
              s.vx = 0;
              s.vy = r2.y - r2.y + r2.height;

              //Bounce r1 off the surface
              bounceOffSurface(r1, s);
              */
            }
          }
        } else {

          //No collision
        }
      } else {

        //No collision
      }

      //Return the collision string. it will be either "top", "right",
      //"bottom", or "left" depening on which side of r1 is touching r2.
      return collision;
    }

    ga.hitTestRectangle = function(r1, r2, global) {
      var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

      //Set `global` to a default value of `false`
      if(global === undefined) global = false;

      //A variable to determine whether there's a collision
      hit = false;

      //Calculate the distance vector
      if (global) {
        vx = (r1.gx + r1.halfWidth) - (r2.gx + r2.halfWidth);
        vy = (r1.gy + r1.halfHeight) - (r2.gy + r2.halfHeight);
      } else {
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;
      }

      //Figure out the combined half-widths and half-heights
      combinedHalfWidths = r1.halfWidth + r2.halfWidth;
      combinedHalfHeights = r1.halfHeight + r2.halfHeight;

      //Check for a collision on the x axis
      if (Math.abs(vx) < combinedHalfWidths) {

        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {

          //There's definitely a collision happening
          hit = true;
        } else {

          //There's no collision on the y axis
          hit = false;
        }
      } else {

        //There's no collision on the x axis
        hit = false;
      }

      //`hit` will be either `true` or `false`
      return hit;
    };

    ga.tilingSprite = function(width, height, source, x, y) {

      //Set the defaults.
      if (x === undefined) x = 0;
      if (y === undefined) y = 0;

      //Figure out the tile's width and height.
      var tileWidth, tileHeight;

      //If the source is a texture atlas frame, use its
      //`frame.w` and `frame.h` properties.
      if(ga.assets[source].frame) {
        tileWidth = ga.assets[source].frame.w;
        tileHeight = ga.assets[source].frame.h;
      }

      //If it's an image, use the image's
      //`width` and `height` properties.
      else {
        tileWidth = ga.assets[source].width;
        tileHeight = ga.assets[source].height;
      }

      //Figure out the rows and columns.
      //The number of rows and columns should always be
      //one greater than the total number of tiles
      //that can fit in the rectangle. This give us one
      //additional row and column that we can reposition
      //to create the infinite scroll effect.

      var columns, rows;

      //1. Columns
      //If the width of the rectangle is greater than the width of the tile,
      //calculate the number of tile columns.
      if (width >= tileWidth) {
        columns = Math.round(width / tileWidth) + 1;
      }

      //If the rectangle's width is less than the width of the
      //tile, set the columns to 2, which is the minimum.
      else {
        columns = 2;
      }

      //2. Rows
      //Calculate the tile rows in the same way.
      if (height >= tileHeight) {
        rows = Math.round(height / tileHeight) + 1;
      } else {
        rows = 2;
      }

      //Create a grid of sprites that's just one sprite larger
      //than the `totalWidth` and `totalHeight`.
      var tileGrid = ga.grid(
        columns, rows, tileWidth, tileHeight, false, 0, 0,
        function(){

          //Make a sprite from the supplied `source`.
          var tile = ga.sprite(source);
          return tile;
        }
      );

      //Declare the grid's private properties that we'll use to
      //help scroll the tiling background.
      tileGrid._tileX = 0;
      tileGrid._tileY = 0;

      //Create an empty rectangle sprite without a fill or stoke color.
      //Set it to the supplied `width` and `height`.
      var container = ga.rectangle(width, height, "none", "none");
      container.x = x;
      container.y = y;

      //Set the rectangle's `mask` property to `true`. This switches on `ctx.clip()`
      //In the rectangle sprite's `render` method.
      container.mask = true;

      //Add the tile grid to the rectangle container.
      container.addChild(tileGrid);

      //Define the `tileX` and `tileY` properties on the parent container
      //so that you can scroll the tiling background.
      Object.defineProperties(container, {
        tileX: {
          get: function() {
            return tileGrid._tileX;
          },

          set: function(value) {

            //Loop through all of the grid's child sprites.
            tileGrid.children.forEach(function(child){

              //Figure out the difference between the new position
              //and the previous position.
              var difference = value - tileGrid._tileX;

              //Offset the child sprite by the difference.
              child.x += difference;

              //If the x position of the sprite exceeds the total width
              //of the visible columns, reposition it to just in front of the
              //left edge of the container. This creates the wrapping
              //effect.
              if (child.x > (columns - 1) * tileWidth) {
                child.x = 0 - tileWidth + difference;
              }

              //Use the same procedure to wrap sprites that
              //exceed the left boundary.
              if (child.x < 0 - tileWidth - difference) {
                child.x = (columns - 1) * tileWidth;
              }
            });

            //Set the private `_tileX` property to the new value.
            tileGrid._tileX = value;
          },
          enumerable: true, configurable: true
        },
        tileY: {
          get: function() {
            return tileGrid._tileY;
          },

          //Follow the same format to wrap sprites on the y axis.
          set: function(value) {
            tileGrid.children.forEach(function(child){
              var difference = value - tileGrid._tileY;
              child.y += difference;
              if (child.y > (rows - 1) * tileHeight) child.y = 0 - tileHeight + difference;
              if (child.y < 0 - tileHeight - difference) child.y = (rows - 1) * tileHeight;
            });
            tileGrid._tileY = value;
          },
          enumerable: true, configurable: true
        }
      });

      //Return the rectangle container.
      return container;
    }

    ga.grid = function(
        columns, rows, cellWidth, cellHeight,
        centerCell, xOffset, yOffset,
        makeSprite,
        extra
      ){
      //Set the defaults
      if (columns === undefined) columns = 0;
      if (rows === undefined) rows = 0;
      if (cellWidth === undefined) cellWidth = 32;
      if (cellHeight === undefined) cellHeight = 32;
      if (xOffset === undefined) xOffset = 0;
      if (yOffset === undefined) yOffset = 0;
      if (centerCell === undefined) centerCell = false;

      /*
      if (!columns && columns !== 0) columns = 0;
      if (!rows && rows !== 0) rows = 0;
      if (!cellWidth && cellWidth !== 0) cellWidth = 32;
      if (!cellHeight && cellHeight !== 0) cellHeight = 32;
      if (!xOffset && xOffset !== 0) xOffset = 0;
      if (!yOffset && yOffset !== 0) yOffset = 0;
      centerCell = centerCell || false;
      */

      //Create an empty DisplayObjectContainer
      var container = ga.group();

      //The `create` method
      container.createGrid = function() {
        var length = columns * rows;
        for(var i = 0; i < length; i++) {
          var x = ((i % columns) * cellWidth),
              y = (Math.floor(i / columns) * cellHeight);

          //Use the `makeSprite` method supplied in the constructor
          //to make a sprite for the grid cell
          var sprite = makeSprite();
          container.addChild(sprite);

          //Should the sprite be centered in the cell?
          if (!centerCell) {
            sprite.x = x + xOffset;
            sprite.y = y + yOffset;
          }
          else {
            sprite.x = x + (cellWidth / 2 ) - sprite.halfWidth + xOffset;
            sprite.y = y + (cellHeight / 2) - sprite.halfHeight + yOffset;
          }

          //Run any optional extra code. This calls the
          //`extra` method supplied by the constructor
          if (extra) extra(sprite);
        }
      };
      container.createGrid();
      ga.stage.addChild(container);
      return container;
    };

    function internal_move(sprite) {
      sprite.x += sprite.vx | 0;
      sprite.y += sprite.vy | 0;
    }

};
