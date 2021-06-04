jQuery(document).ready(function ($) {

    const RESTURL = 'http://africultures.com/wp-json/'
	var pager = 1
	var current = 'posts'
	var mark = 0
	var cat = 0
	var kword = ''
	var desc = '...'

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
		
		reset : function() {
			cat = 0
			app.goBack()
			kword = ''
			app.loadPosts()
		},
        
        loadEvents : function() {			
			$(window).scroll(function() {
			   if(current != 'single' && $(window).scrollTop() + $(window).height() == $(document).height()) {
				   	pager++
					if (kword!='') var url = RESTURL + 'wp/v2/'+current+'?_embed&page='+pager+'&search='+kword
					else if (cat==0) var url = RESTURL + 'wp/v2/'+current+'?_embed&page='+pager
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
			$( '.menu' ).on( 'click', '.site-title', this.reset )
			$( '.top-bar-right' ).on( 'click', '#afritv', this.loadMedias )
			$( '.top-bar-right' ).on( 'click', '#search', this.search )
			$( '.top-bar-right' ).on( 'click', '#hamburger', this.toggler )
			$( '.overall-menu' ).on( 'click', '#left-menu', this.toggler )
			$( '#right-menu' ).on( 'click', '#outburger', this.toggler )
			$( '#right-menu' ).on( 'click', '.catmenu', this.catCall )
			$( '#searchform' ).on( 'click', '#close', this.close )
			$( '#searchform' ).on( 'click', '#check', this.check )
        },		
		
		search : function() {
			$( '.description' ).hide()
			$( "#searchform" ).show()
			$( "#keyword" ).empty()
			$( "#keyword" ).focus()
		},

		close : function() {
			$( "#keyword" ).val('')
			$( "#searchform" ).hide()
			$( '.description' ).show()
		},

		check : function() {
			keyword = $( "#keyword" ).val()
			$( "#keyword" ).val('')
			$( "#searchform" ).hide()
			$( '.description' ).show()
			if(keyword=='') {
				alert('Veuillez entrer au moins 1 mot!')
			} else {
				cat = 0
				pager = 1
				kword = encodeURIComponent(keyword)
				$( '#main-content' ).html("")
				app.goBack()				
				app.loadPosts()
			}
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
			kword = ''
			app.loadPosts()
			app.goBack()
		},		
		
        getSiteData : function() {
            $.get( RESTURL )
			.done( function( response ) {
				$( '.site-title' ).html( response.name )
				desc = response.description
				$( '.description' ).html( desc )
			})
			.fail( function() {
				alert( 'Rien de plus à afficher' )
			})
        },
        
        loadPosts : function() {
			pager = 1
			$( '#main-content' ).html("")
            current = 'posts'
			if (kword!='') var url = RESTURL + 'wp/v2/'+current+'?_embed&search='+kword
			else if (cat==0) var url = RESTURL + 'wp/v2/'+current+'?_embed'
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
				
				var elink = encodeURIComponent(response.link)
				response.elink = elink
				var etitre = encodeURIComponent(response.title.rendered)
				response.etitle = etitre
				console.log('response: ', response)
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
