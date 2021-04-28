jQuery(document).ready(function ($) {

    const RESTURL = 'http://africultures.com/wp-json/'
	var pager = 1
	var current = 'home'
	var mark = 0

    var app = {
        
        init : function() {            
			this.getSiteData()
            this.loadPosts()
            this.loadEvents()        
        },
		
		goBack : function() {
			current = 'home'
			$( "#single-content" ).empty()			
			$( "#content" ).show()
			window.scrollTo(0,mark)
			$( "#bottom-load" ).show()
		},
        
        loadEvents : function() {            
			$(window).scroll(function() {
			   if(current == 'home' && $(window).scrollTop() + $(window).height() == $(document).height()) {
				   	pager++
					var url = RESTURL + 'wp/v2/posts?_embed&page='+pager        

					$.get( url )
						.done( function( response ) {
							
							var posts = {
								posts: response
							}
							
							var template = $( '#blog-post-template' ).html()
							var output = $( '#main-content' )
												
							var result = Mustache.to_html( template, posts )
							output.append( result )
							
						})
						.fail( function() {
							alert( 'cannot reload posts' )
						})
				}
			})	
            $( '#main-content' ).on( 'click', '.blog-post h3', this.loadSinglePost )
            $( '#main-content' ).on( 'click', '.blog-post .thumbnail', this.loadSinglePost )
			$( '#single-content' ).on( 'click', '.blog-post .back-button', this.goBack )       
        },
        
        getSiteData : function() {
            $.get( RESTURL )
                .done( function( response ) {
                    $( '.site-title' ).html( response.name )
                    $( '.description' ).html( response.description )
                })
                .fail( function() {
                    alert( 'failed to call specified URL' )
                })
        },
        
        loadPosts : function() {
            var url = RESTURL + 'wp/v2/posts?_embed&page='+pager
            current = 'home'
            $.get( url )
                .done( function( response ) {
                    
                    var posts = {
                        posts: response
                    }
					
                    var template = $( '#blog-post-template' ).html()
                    var output = $( '#main-content' )
                    var result = Mustache.to_html( template, posts )
                    output.append( result )
                    
                })
                .fail( function() {
                    alert( 'cannot load posts' )
                })
        },
		              
        loadSinglePost : function() {
			mark = $(window).scrollTop()		
			$( "#content" ).hide()
            var id = Math.abs( $( this ).parent( '.blog-post' ).data( 'id' ) )
            var url = RESTURL + 'wp/v2/posts/' + id + '?_embed'
            current = 'single'
            $.get( url )
                .done( function( response ) {

                    
                    var template = $( '#single-post-template' ).html()
                    var output = $( '#single-content' )
                                        
                    var result = Mustache.to_html( template, response )
                    output.html( result )
                    
                })
                .fail( function() {
                    alert( 'cannot load post' )
                })
            window.scrollTo(0,0)
			$( "#bottom-load" ).hide()
        }
   
    }

    app.init()

});
