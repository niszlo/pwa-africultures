jQuery(document).ready(function ($) {

    const RESTURL = 'http://africultures.com/wp-json/'
	var pager = 1
	var current = 'posts'
	var mark = 0
	var cat = 0

    var app = {
        
        init : function() {          
			this.getSiteData()
            this.loadPosts()
            this.loadEvents()        
        },
		
		goBack : function() {
			current = 'posts'
			$( "#single-content" ).empty()			
			$( "#content" ).show()
			window.scrollTo(0,mark)
			$( "#bottom-load" ).show()
		},
        
        loadEvents : function() {            
			$(window).scroll(function() {
			   if(current != 'single' && $(window).scrollTop() + $(window).height() == $(document).height()) {
				   	pager++
					if (cat==0) var url = RESTURL + 'wp/v2/'+current+'?_embed&page='+pager
					else var url = RESTURL + 'wp/v2/'+current+'?_embed&page='+pager+'&categories='+cat				

					$.get( url )
						.done( function( response ) {
							
							if(current=='posts') {
								var posts = {
									posts: response
								}
								
								var template = $( '#blog-post-template' ).html()
								var output = $( '#main-content' )
													
								var result = Mustache.to_html( template, posts )
							}
							
							if(current=='medias') {
								var medias = {
									medias: response
								}
								
								var template = $( '#blog-post-template' ).html()
								var output = $( '#main-content' )
													
								var result = Mustache.to_html( template, medias )
							}							
							
							output.append( result )
							
						})
						.fail( function() {
							alert( 'Rien de plus à recharger' )
						})
				}
			})	
            $( '#main-content' ).on( 'click', '.blog-post h3', this.loadSinglePost )
            $( '#main-content' ).on( 'click', '.blog-post .thumbnail', this.loadSinglePost )
			$( '#single-content' ).on( 'click', '.blog-post .back-button', this.goBack )
			$( '.menu' ).on( 'click', '.site-title', this.loadPosts )
			$( '.top-bar-right' ).on( 'click', '#afritv', this.loadMedias )
			$( '.top-bar-right' ).on( 'click', '#newsletter', this.newsletter )
			$( '.top-bar-right' ).on( 'click', '#announce', this.announce )
			$( '.top-bar-right' ).on( 'click', '#search', this.search )
			$( '.top-bar-right' ).on( 'click', '#support', this.support )
			$( '.top-bar-right' ).on( 'click', '#hamburger', this.toggler )			
			$( '.overall-menu' ).on( 'click', '#left-menu', this.toggler )
			$( '#right-menu' ).on( 'click', '#outburger', this.toggler )
			$( '#right-menu' ).on( 'click', '.catmenu', this.catCall )
        },
		
		question : function() {
			window.open('http://africultures.com/qui-sommes-nous/','_blank')
		},
		
		newsletter : function() {
			window.open('http://africultures.com/lettredinfos','_blank')
		},

		announce : function() {
			window.open('http://www.sudplanete.net/auto/01_dev_trad/liste_auto_2.php?lng=_fr','_blank')
		},

		search : function() {
			alert('En développement ... merci de votre patience ...');
		},
		
		support : function() {
			window.open('http://africultures.com/soutenir/','_blank')
		},		
		
		toggler : function() {
			$( ".overall-menu" ).toggle()
		},
		
		catCall : function() {
			mark = 0
			var id = Math.abs( $( this ).data( 'id' ) )
			cat = id
			current = 'posts'
			app.toggler()	
			app.loadPosts()
			app.goBack()
		},		
		
        getSiteData : function() {
            $.get( RESTURL )
                .done( function( response ) {
                    $( '.site-title' ).html( response.name )
                    $( '.description' ).html( response.description )
                })
                .fail( function() {
                    alert( 'Rien de plus à afficher' )
                })
        },
        
        loadPosts : function() {
			app.goBack()
			pager = 1
			$( '#main-content' ).html("")
            current = 'posts'			
			if (cat==0) var url = RESTURL + 'wp/v2/'+current+'?_embed'
            else var url = RESTURL + 'wp/v2/'+current+'?_embed&categories='+cat
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
                    alert( 'Rien de plus à charger' )
                })
        },
		
        loadMedias : function() {
			app.goBack()
			pager = 1
			$( '#main-content' ).html("")
            current = 'medias'			
			url = RESTURL + 'wp/v2/'+current+'?page='+pager
            $.get( url )
                .done( function( response ) {
                    
                    var medias = {
                        medias: response
                    }
					
                    var template = $( '#blog-post-template' ).html()
                    var output = $( '#main-content' )
                    var result = Mustache.to_html( template, medias )
					
                    output.append( result )
                    
                })
                .fail( function() {
                    alert( 'Rien de plus à charger' )
                })
        },		
		              
        loadSinglePost : function() {
			mark = $(window).scrollTop()		
			$( "#content" ).hide()
            var id = Math.abs( $( this ).parent( '.blog-post' ).data( 'id' ) )
            current = 'single'			
            var url = RESTURL + 'wp/v2/posts/' + id + '?_embed'
            $.get( url )
                .done( function( response ) {

                    
                    var template = $( '#single-post-template' ).html()
                    var output = $( '#single-content' )
                                        
                    var result = Mustache.to_html( template, response )
					
                    output.html( result )
                    
                })
                .fail( function() {
                    alert( 'Rien de plus à ouvrir' )
                })
            window.scrollTo(0,0)
			$( "#bottom-load" ).hide()
        }
   
    }

    app.init()

});
