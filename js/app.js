'use strict';
document.body.style.opacity = 1;

var translit = new Vue( {
    el: '#translit',
    data: {
        inText: ''
    },
    computed: {
        translitToURL: function() {
            this.inText = slugify( this.inText );
        }
    }
} );

/**
 * Test support your browser web ctorage
 */
if ( typeof( Storage ) === "undefined" ) {
    alert( "Sorry, your browser does not support web storage..." );
    throw "stop";
}

var vm = new Vue( {
    el: '#app',
    data: {
        importArea: '',
        searchValue: '',
        searchAnswers: [],
        listAccesses: ( function() {
            var arr = [];
            for ( var access in localStorage ) arr.push( access );
            return arr;
        } )(),
        project: {
            name: '',
            domain_url: '',
            server: '',
            user: '',
            password: '',
            name_db: '',
            server_db: 'localhost',
            user_db: '',
            password_db: '',
            user_cms: '',
            password_cms: '',
            domain_host: '',
            user_host: '',
            password_host: ''
        },

        isResult: false,
        isAnswerRezult: false,
        isStateSuccess: false,
        hasSearchError: false,

        listMatchWithSearch: [],
        labels: [
            'Name Project',
            'Domain Url',
            'FTP Server',
            'FTP User',
            'FTP Pass',
            'DB Name',
            'DB Server',
            'DB User',
            'DB Pass',
            'CMS User',
            'CMS Pass',
            'HOST Url',
            'HOST User',
            'HOST Pass'
        ],
        template: {},

        message: {
            notResult: 'Sorry! Not result...'
        }
    },
    computed: {
        lableBtn: function() {
            return this.isStateSuccess ? 'Ok' : 'Add';
        }
    },
    methods: {
        getListAccess: function() {
            var arr = [];
            for ( var access in localStorage ) arr.push( access );
            return arr;
        },
        addAccess: function() {
            if ( this.isExistAccess( this.project.name ) ) {
                if ( !confirm( 'Access with the name { ' + this.project.name + ' } exists, overwrite it?' ) ) return;
                localStorage.setItem( this.project.name, JSON.stringify( this.project ) );
                this.listAccesses = this.getListAccess();
            } else {
                localStorage.setItem( this.project.name, JSON.stringify( this.project ) );
                this.listAccesses = this.getListAccess();
            }
            this.resetProjectData( this );

            this.isStateSuccess = true;

            // check if there is an added new value in the localStoradge
            if ( this.isExistAccess( this.project.name ) ) {
                var _this = this;
                setTimeout( function() {
                    _this.isStateSuccess = false;
                }, 3000 );
            }
        },
        searchAccess: function() {
            this.isResult = false;
            this.template = {};
            if ( this.isExistAccess( this.searchValue ) ) {
                var result_db = JSON.parse( localStorage.getItem( this.searchValue ) );

                if ( result_db ) {

                    var i = 0;
                    for ( var key in result_db ) {

                        if ( result_db[ key ] ) {

                            if ( this.labels[ i ] === 'Domain Url' ) this.template[ key ] = '<td class="alert alert-danger"><b>' + this.labels[ i ] + ':</b></td>' + '<td class="alert alert-danger"><a class="text-dark" href="' + result_db[ key ] + '" target="_blank" rel="noopener">' + result_db[ key ] + '</a></td>';
                            else {
                                switch ( this.labels[ i ] ) {
                                    case 'FTP Server':
                                    case 'FTP User':
                                    case 'FTP Pass':
                                        this.template[ key ] = '<td class="text-light bg-dark"><b>' + this.labels[ i ] + ':</b></td><td class="text-light bg-dark">' + result_db[ key ] + '</td>';
                                        break;

                                    case 'DB Name':
                                    case 'DB Server':
                                    case 'DB User':
                                    case 'DB Pass':
                                        this.template[ key ] = '<td class="alert alert-dark"><b>' + this.labels[ i ] + ':</b></td><td class="alert alert-dark">' + result_db[ key ] + '</td>';
                                        break;

                                    case 'CMS User':
                                    case 'CMS Pass':
                                        this.template[ key ] = '<td class="alert alert-success"><b>' + this.labels[ i ] + ':</b></td><td class="alert alert-success">' + result_db[ key ] + '</td>';
                                        break;

                                    case 'HOST Url':
                                    case 'HOST User':
                                    case 'HOST Pass':
                                        this.template[ key ] = '<td class="alert alert-info"><b>' + this.labels[ i ] + ':</b></td><td class="alert alert-info">' + result_db[ key ] + '</td>';
                                        break;

                                    default:
                                        this.template[ key ] = '<td class="alert alert-primary"><b>' + this.labels[ i ] + ':</b></td><td class="alert alert-primary">' + result_db[ key ] + '</td>';
                                        break;
                                }
                            }

                        }
                        i++;
                    }

                    this.isResult = true;
                }

            } else {

                this.hasSearchError = true;
                var _this = this;
                setTimeout( function() {
                    _this.hasSearchError = false;
                }, 2000 );

            }
        },
        resetFields: function() {
            this.resetProjectData( this );
        },
        importAccesses: function() {
            if ( !$( '#importArea' ).val() ) return;
            this.importArea = $( '#importArea' ).val();
            var importArray = this.importArea.split( ', ' );
            importArray.forEach( function( item, i, arr ) {
                localStorage.setItem( JSON.parse( item ).name, item );
            } );
        },
        readFile: function( e ) {
            this.readSingleFile( e );
        },
        exportAccesses: function() {
            var arr = [];
            for ( var access in localStorage ) {
                if ( localStorage.hasOwnProperty( access ) )
                    arr.push( localStorage[ access ] );
            }
            $( '#exporttArea' ).val( arr.join( ', ' ) );
        },
        copyToClipboard: function( areaFromCopy ) {
            var copyTextarea = $( areaFromCopy );
            copyTextarea.select();

            try {
                var successful = document.execCommand( 'copy' );
            } catch ( err ) {
                console.log( 'Oops, unable to copy' );
            }
        },
        saveFile: function( event ) {
            var content = $( '#exporttArea' ).val();

            function download( text, name, type ) {
                var file = new Blob( [ text ], { type: type } );
                event.target.href = URL.createObjectURL( file );
                event.target.download = name;
            }
            download( content, 'host_accesses.txt', 'text/plain' );
        },
        resetField: function( element ) {
            $( element ).text( '' ).val( '' );
        },
        /**
         * Resets the object values
         * @param  {Object}
         * @return {nothing}
         */
        resetProjectData: function( obj ) {
            for ( var prop in obj.project ) {
                obj.project[ prop ] = '';
            }
        },
        /**
         * Checks for storage access
         * @param  {string}  name [name access]
         * @return {Boolean}
         */
        isExistAccess: function( name ) {
            return !!localStorage.getItem( name );
        },
        /**
         * Read and show content locale file
         */
        readSingleFile: function( e ) {
            var file = e.target.files[ 0 ];
            if ( !file ) {
                return;
            }
            var reader = new FileReader();
            reader.onload = function( e ) {
                var contents = e.target.result;
                this.displayContents( contents );
            };
            reader.readAsText( file );
        },
        /**
         * rendering display content file
         * @param  {string} contents file
         */
        displayContents: function( contents ) {
            var element = document.getElementById( 'importArea' );
            element.textContent = contents;
        }
    },
    watch: {
        searchValue: function() {
            this.isAnswerRezult = false;
            this.listMatchWithSearch.length = 0;

            if ( this.searchValue.trim() ) {
                var regexp = new RegExp( this.searchValue.trim() );
                var _this = this;

                this.listAccesses.forEach( function( item ) {
                    if ( regexp.test( item ) )
                        _this.listMatchWithSearch.push( item );
                } );

                if ( this.listMatchWithSearch.length )
                    this.isAnswerRezult = true;
            }
        }
    }
} );