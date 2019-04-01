/*
 * Dynamically load in YouTube videos based on 'data-id'
 * Used for bootstrap carousels & modals
 *
============================================================================================
//  Copyright Â© 2011-2019 WEO MEDIA (TouchPoint Communications LLC). All rights reserved.
//   UNAUTHORIZED USE IS STRICTLY PROHIBITED
//   FOR QUESTIONS AND APPROPRIATE LICENSING PLEASE CONTACT WEO MEDIA
//   www.weomedia.com | info@weomedia.com
//
//   Some portions of code (modified and unmodified) have been included from public,
//   or open source, sources and have been indicated as appropriate.
//
//   ***** LIMITATION OF LIABILITY *****
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
//  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
//  PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
//  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
//  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
//  OR OTHER DEALINGS IN THE SOFTWARE.
//   ***********************************
============================================================================================
*/

jQuery(document).ready(function($){

    // Auto-generate carousel indicator html
    var bootCarousel = $(".carousel");
    bootCarousel.append("<ol class='carousel-indicators'></ol>");
    var indicators = $(".carousel-indicators");
    bootCarousel.find(".carousel-inner").children(".item").each(function(index) {
        (index === 0) ?
        indicators.append("<li data-target='#video-carousel' data-slide-to='" + index + "' class='active'></li>") :
        indicators.append("<li data-target='#video-carousel' data-slide-to='" + index + "'></li>");
    });

});

    // Load the YouTube Iframe API
    // source: https://developers.google.com/youtube/iframe_api_reference

    var youtubeScriptId = "youtube-api";
    var youtubeScript = document.getElementById(youtubeScriptId);

    if (youtubeScript === null) {
      var tag = document.createElement("script");
      var firstScript = document.getElementsByTagName("script")[0];

      tag.src = "https://www.youtube.com/iframe_api";
      tag.id = youtubeScriptId;
      firstScript.parentNode.insertBefore(tag, firstScript);
    }

    // Object name for interacting with the videos in the rest of this code
    var videoArray = new Array();

    // Function: onYouTubePlayerAPIReady - Run when API is ready
    function onYouTubePlayerAPIReady() {
        
        // Look for video 'data-id' in these div's
        var videos = document.querySelectorAll('#video-carousel .TPembed-responsive-item', '.modal .TPembed-responsive-item');
        
        // For Carousels - Loop through each div found
        for (var i = 0; i < videos.length; i++) {

            // Create an array to hold the video IDs from 'data-id'
            dataset = videos[i].dataset.id;
            
            // Variable name for inserting videos into the HTML divs
            var divID = 'vid-carousel-' + i.toString();
            
            // Setup video object, configure how videos should be presented
            videoArray[i] = new YT.Player(divID, {
                playerVars: {
                    'autoplay': 0,
                    'controls': 1,
                    'modestbranding': 1,
                    'rel': 0,
                    'loop': 1,
                    'iv_load_policy': 3,
                    'playsinline': 1
                },
                videoId: dataset,
                events: {
                    'onReady': onPlayerReady
                }
            });
            
        }

        // For Modals - Loop through each div found
        for (var i = 0; i < videos.length; i++) {

            // Create an array to hold the video IDs from 'data-id'
            dataset = videos[i].dataset.id;
            
            // Variable name for inserting videos into the HTML divs
            var divID = 'vid-modal-' + i.toString();
            
            // Setup video object, configure how videos should be presented
            videoArray[i] = new YT.Player(divID, {
                height: '100%',
                width: '100%',
                playerVars: {
                    'autoplay': 0,
                    'controls': 1,
                    'modestbranding': 1,
                    'rel': 0,
                    'loop': 1,
                    'iv_load_policy': 3,
                    'playsinline': 1
                },
                videoId: dataset,
                events: {
                    'onReady': onPlayerReady
                }
            });
            
        }
    }

    // Function: onPlayerReady - Run when video player is ready
    function onPlayerReady(event) {

      jQuery(document).ready(function($){
        
        // pause video playback when carousel moves
        // http://stackoverflow.com/a/25069916
        $('#video-carousel').on('slide.bs.carousel', function () {

            $(this).find('iframe').each(function(){
                
                event.target.pauseVideo();
                
            });
        });

        // stop video playback on modal close
        // http://stackoverflow.com/a/25069916
        $('.modal').on('hidden.bs.modal', function () {

            $(this).find('iframe').each(function(){
                
                event.target.stopVideo();
                
            });
        });

        // stop video playback on modal close
        // http://stackoverflow.com/a/25069916
        //$(".modal").on('hidden.bs.modal', function (e) {

        //  console.log('hidden');

        //  var id = $(this).attr('id');
        //  var target = "#" + id + ".modal iframe";

        //  $(target).attr("src", $(target).attr("src"));
        //});

      });
    }
