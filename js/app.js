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


var vm = new Vue( {
    el: '#app',
    data: {
        importArea: '',
        searchValue: '',
        searchAnswers: [],
        listAccesses: getListAccess(),
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
        addAccess: function() {
            if ( isExistAccess( this.project.name ) ) {
                if ( !confirm( 'Access with the name { ' + this.project.name + ' } exists, overwrite it?' ) ) return;
                localStorage.setItem( this.project.name, JSON.stringify( this.project ) );
                this.listAccesses = getListAccess();
            } else {
                localStorage.setItem( this.project.name, JSON.stringify( this.project ) );
                this.listAccesses = getListAccess();
            }
            resetProjectData( this );

            this.isStateSuccess = true;

            // check if there is an added new value in the localStoradge
            if ( isExistAccess( this.project.name ) ) {
                var _this = this;
                setTimeout( function() {
                    _this.isStateSuccess = false;
                }, 3000 );
            }
        },
        searchAccess: function() {
            this.isResult = false;
            this.template = {};
            if ( isExistAccess( this.searchValue ) ) {
                var result_db = JSON.parse( localStorage.getItem( this.searchValue ) );
                var i = 0;
                for ( var key in result_db ) {

                    if ( result_db[ key ] ) {
                        if ( i == 1 ) this.template[ key ] = '<b>' + this.labels[ i ] + ':</b> ' + '<a href="' + result_db[ key ] + '" target="_blank" rel="noopener">' + result_db[ key ] + '</a>';
                        else this.template[ key ] = '<b>' + this.labels[ i ] + ':</b> ' + result_db[ key ];
                        if ( i == 1 || i == 4 || i == 8 || i == 10 ) this.template[ key ] += '<br><br>';
                    }
                    i++;
                }

                this.isResult = true;

            } else {

                this.hasSearchError = true;
                var _this = this;
                setTimeout( function() {
                    _this.hasSearchError = false;
                }, 2000 );

            }
        },
        resetFields: function() {
            resetProjectData( this );
        },
        importAccesses: function() {
            if(!$('#importArea').val()) return;
            this.importArea = $('#importArea').val();
            var importArray = this.importArea.split(', ');
            importArray.forEach(function(item, i, arr){
                localStorage.setItem( JSON.parse(item).name, item );
            });
        },
        readFile: function(e) {
            readSingleFile(e);
        },
        exportAccesses: function() {
            var arr = [];
            for ( var access in localStorage ) {
                if (localStorage.hasOwnProperty(access))
                arr.push( localStorage[access] );
            }
            $('#exporttArea').val( arr.join(', ') );
        },
        copyToClipboard: function(areaFromCopy) {
            var copyTextarea = $(areaFromCopy);
            copyTextarea.select();

            try {
              var successful = document.execCommand('copy');
            } catch (err) {
              console.log('Oops, unable to copy');
            }
        },
        saveFile: function(event) {
            var content = $('#exporttArea').val();
            function download(text, name, type) {
              var file = new Blob([text], {type: type});
              event.target.href = URL.createObjectURL(file);
              event.target.download = name;
            }
            download(content, 'host_accesses.txt', 'text/plain');
        },
        resetField: function(element) {
            $(element).text('').val('');
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


/**
 * Resets the object values
 * @param  {Object}
 * @return {nothing}
 */
function resetProjectData( obj ) {
    for ( var prop in obj.project ) {
        obj.project[ prop ] = '';
    }
}
/**
 * Checks for storage access
 * @param  {string}  name [name access]
 * @return {Boolean}
 */
function isExistAccess( name ) {
    return !!localStorage.getItem( name );
}

/**
 * Get keys from locale Storage
 * @return {Array}
 */
function getListAccess() {
    var arr = [];
    for ( var access in localStorage ) arr.push( access );
    return arr;
}
/**
 * Read and show content locale file
 */
function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    displayContents(contents);
  };
  reader.readAsText(file);
}
/**
 * rendering display content file
 * @param  {string} contents file
 */
function displayContents(contents) {
  var element = document.getElementById('importArea');
  element.textContent = contents;
}