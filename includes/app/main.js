jQuery(document).ready(function ($) {

	const debug = false;
    if(location.protocol!=='https:') { RESTURL = 'http://africultures.com/wp-json/' }
    if(location.protocol=='https:') { RESTURL = 'https://africultures.com/wp-json/' }
	var pager = 1
	var current = 'posts'
	var mark = 0
	var cat = 0
	var kword = ''
	var desc = 'Actualités'

    var app = {
        
        init : function() {
			if(debug) { console.log("init") }
			this.getSiteData()
			this.getSiteAdd()
            this.loadPosts()
            this.loadEvents()        
        },
		
		goBack : function() {
			if(debug) { console.log("goBack") }
			current = 'posts'
			$( "#single-content" ).empty()			
			$( "#content" ).show()
			window.scrollTo(0,mark)
			$( "#bottom-load" ).show()
		},
		
		reset : function() {
			if(debug) { console.log("reset") }
			$( '.description' ).html( desc )
			cat = 0
			pager = 1
			$( '#main-content' ).html("")
			app.goBack()
			kword = ''
			app.loadPosts()
		},
        
        loadEvents : function() {
			if(debug) { console.log("loadEvents") }
			$(window).scroll(function() {
			   if(current != 'single' && $(window).scrollTop() + $(window).height() == $(document).height()) {
					pager++
					if(debug) { console.log(pager) }
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
			if(debug) { console.log("search") }
			$( '.description' ).hide()
			$( "#searchform" ).show()
			$( "#keyword" ).empty()
			$( "#keyword" ).focus()
		},

		close : function() {
			if(debug) { console.log("close") }
			$( "#keyword" ).val('')
			$( "#searchform" ).hide()
			$( '.description' ).show()
		},

		check : function() {
			if(debug) { console.log("check") }
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
				$( '.description' ).html( kword )
				$( '#main-content' ).html("")
				app.goBack()				
				app.loadPosts()
			}
		},				
		
		toggler : function() {
			if(debug) { console.log("toggler") }
			$( ".overall-menu" ).toggle()
		},
		
		catCall : function() {
			if(debug) { console.log("catCall") }	
			mark = 0
			var id = Math.abs( $( this ).data( 'id' ) )
			cat = id
			if(cat>0) {
				$.get( RESTURL+'wp/v2/categories/'+cat )
				.done( function( response ) {
					if(response.name!=''&&response.name!=undefined) {
						$( '.description' ).html( response.name )
					} 
				})
			} else {
					$( '.description' ).html( desc )
			}
			current = 'posts'
			app.toggler()	
			kword = ''
			app.loadPosts()
			app.goBack()
		},		
		
        getSiteData : function() {
			if(debug) { console.log("getSiteData") }
			$( '.site-title' ).html( 'Africultures' )
			$( '.description' ).html( desc )
        },
		
        getSiteAdd : function() {
			if(debug) { console.log("getSiteAdd") }
            $.get( RESTURL+'wp/v2/mpub' )
			.done( function( response ) {
				if(response[0].etat==1) {
				$( '#desk' ).html( '<a href="'+response[0].url+'"><img src="'+response[0].desk+'" /></a>' )
				$( '#mob' ).html( '<a href="'+response[0].url+'"><img src="'+response[0].mob+'" /></a>' )
				}
			})
			.fail( function() {
				alert( 'Aucun objet à montrer' )
			})
        },		
        
        loadPosts : function() {
			if(debug) { console.log("loadPosts") }
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
			if(debug) { console.log("loadMedias") }
			pager = 1
			$( '#main-content' ).html("")
			$( '.description' ).html( 'Africultures TV' )
			app.goBack()			
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
			if(debug) { console.log("loadSinglePost") }
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
				var template = $( '#single-post-template' ).html()
				var output = $( '#single-content' )
									
				var result = Mustache.to_html( template, response )
				
				output.html( result )
				
			})
			.fail( function() {
				alert( 'Rien de plus à ouvrir' )
			})
			setTimeout(
			  function() 
			  {
				const isMobileDevice = /Mobi/i.test(window.navigator.userAgent);
				if(isMobileDevice) {
					if (/iPad|iPhone|iPod/.test(window.navigator.userAgent) && !window.MSStream) {
						$( '#sharesms' ).hide();
					}
				}
			  }, 2000
			)			
            window.scrollTo(0,0)
			$( "#bottom-load" ).hide()
        }
   
    }

    app.init()

});
