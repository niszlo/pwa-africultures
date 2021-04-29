jQuery(document).ready(function ($) {

    const RESTURL = 'http://africultures.com/wp-json/'
	var pager = 1
	var current = 'home'
	var mark = 0
	var cat = 0

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
					if (cat==0) var url = RESTURL + 'wp/v2/posts?_embed&page='+pager
					else var url = RESTURL + 'wp/v2/posts?_embed&page='+pager+'&categories='+cat				

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
			$( '.top-bar-right' ).on( 'click', '#hamburger', this.toggler )
			$( '.overall-menu' ).on( 'click', '#left-menu', this.toggler )
			$( '#right-menu' ).on( 'click', '#outburger', this.toggler )
			$( '#right-menu' ).on( 'click', '.catmenu', this.catCall )
        },
        
		catCall : function() {
			var id = Math.abs( $( this ).data( 'id' ) )
			cat = id
			app.toggler()
			app.loadPosts()
		},		
		
		toggler : function() {
			$( ".overall-menu" ).toggle()
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
			pager = 1
			$( '#main-content' ).html("")
			if (cat==0) var url = RESTURL + 'wp/v2/posts?_embed'
            else var url = RESTURL + 'wp/v2/posts?_embed&categories='+cat
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
