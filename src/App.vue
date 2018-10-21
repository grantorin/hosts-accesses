<template>
    <div class="container">
        <form class="py-3" v-on:submit.prevent="searchAccess">
            <div class="input-group w-100 justify-content-end">
                <input type="search" id="search" list="search_answers" class="form-control trans w-50" placeholder="Search" aria-label="Username" aria-describedby="search__btn" autocomplete="off" v-model="searchValue">
                <span class="input-group-addon btn btn-dark search__btn" id="search__btn" v-on:click="searchAccess"><svg style="margin-bottom: -4px" xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 612 612"><path d="M598.221 531.586l-110.58-110.542c30.314-43.443 48.228-96.149 48.228-153.105C535.869 119.963 415.911.005 267.935.005S0 119.963 0 267.939s119.958 267.934 267.934 267.934c56.956 0 109.662-17.913 153.105-48.228l110.542 110.542c18.411 18.41 48.229 18.41 66.64 0 18.372-18.373 18.372-48.19 0-66.601zM267.934 459.32c-105.681 0-191.381-85.7-191.381-191.381S162.254 76.558 267.934 76.558c105.681 0 191.381 85.701 191.381 191.381 0 105.681-85.7 191.381-191.381 191.381z" fill="#FFF"/></svg></span>
                <datalist id="search_answers" class="search_answers list-unstyled" v-if="isAnswerRezult">
                    <option class="search_answers__item" v-for="answer in listMatchWithSearch" v-html="answer"></option>
                </datalist>
            </div>
        </form>
        <div class="text-right my-3">
            <button class="btn btn-warning mr-2" data-toggle="collapse" data-target="#collapseExport" aria-expanded="false" aria-controls="collapseExport" v-on:click="exportAccesses">Export</button>
            <button class="btn btn-info mr-2" data-toggle="collapse" data-target="#collapseImport" aria-expanded="false" aria-controls="collapseImport">Import</button>
            <button class="btn btn-success" data-toggle="collapse" data-target="#collapseAdd" aria-expanded="false" aria-controls="collapseAdd">Add new Access</button>
        </div>
        <div class="bg-light bd-callout-info text-gray-dark p-3 mb-3" id="result" v-if="isResult">
            <table class="table table-striped table-bordered table-sm">
                <tbody>
                    <tr v-for="temp in template" v-html="temp"></tr>
                </tbody>
            </table>
            <div class="text-right">
                <button class="btn btn-danger" v-on:click="removeAccess">Delete</button>
            </div>
        </div>
        <div class="alert alert-danger text-center" role="alert" v-if="hasSearchError">
            <button type="button" class="close" v-on:click="hasSearchError = !hasSearchError" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            {{message.notResult}}
        </div>
        <div id="collapseExport" class="collapse" role="tabpanel" aria-labelledby="headingTwo" data-parent="#accordion">
            <h3 class="text-white bg-dark p-3">Export Access</h3>
            <div class="card-body bg-light text-gray-dark">
                <textarea class="w-100 p-2 text-secondary js-copytextarea" id="exporttArea" rows="15"></textarea>
                <div class="text-right mt-3">
                    <button type="button" class="btn btn-primary btn-lg trans btn_add px-5 js-textareacopybtn" v-on:click="copyToClipboard('.js-copytextarea')">Copy</button>
                    <a href="#" class="btn btn-primary btn-lg trans btn_add px-5 ml-2" v-on:click="saveFile">Save as file</a>
                </div>
            </div>
        </div>
        <div id="collapseImport" class="collapse" role="tabpanel" aria-labelledby="headingTwo" data-parent="#accordion">
            <h3 class="text-white bg-dark p-3">Import Access</h3>
            <div class="card-body bg-light text-gray-dark">
                <form v-on:submit.prevent="importAccesses">
                    <textarea class="w-100 p-2 text-secondary" id="importArea" rows="15" placeholder="Paste the data here  in the JSON format"></textarea>
                    <div class="text-right mt-3">
                        <input type="file" id="file-input" v-on:change="readFile($event)" />
                        <button type="reset" class="btn btn-danger btn-lg btn_add px-4 mr-3" v-on:click="resetField('#importArea')">Reset</button>
                        <button type="submit" class="btn btn-primary btn-lg trans btn_add px-5" title="Please file on load or paste data text" v-bind:class="{ 'btn-success': isImportAccesses }" v-bind:disabled="!isFileOnLoad">Import to storage</button>
                    </div>
                </form>
            </div>
        </div>
        <div id="collapseAdd" class="collapse" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion">
            <h3 class="text-white bg-dark p-3">Add New Access</h3>
            <div class="card-body bg-light text-gray-dark">
                <form v-on:submit.prevent="addAccess">
                    <div class="form-group row">
                        <label for="name" class="col-sm-2 col-form-label">Name</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="name" v-model.trim="project.name" placeholder="Name Project">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="domain_url" class="col-sm-2 col-form-label">Domain Url</label>
                        <div class="col-sm-10">
                            <input type="url" class="form-control" id="domain_url" v-model.trim="project.domain_url" placeholder="https://www">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <h4 class="mb-3"><strong>FTP</strong></h4>
                            <div class="form-group row">
                                <label for="server" class="col-sm-2 col-form-label">Server</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="server" v-model.trim="project.server" placeholder="Server">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="user" class="col-sm-2 col-form-label">User</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="user" v-model.trim="project.user" placeholder="User">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="password" class="col-sm-2 col-form-label">Pass</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="password" v-model.trim="project.password" placeholder="Password">
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <h4 class="mb-3"><strong>DB</strong></h4>
                            <div class="form-group row">
                                <label for="name_db" class="col-sm-2 col-form-label">Name</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="name_db" v-model.trim="project.name_db" placeholder="Name DB">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="server_db" class="col-sm-2 col-form-label">Server</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="server_db" v-model.trim="project.server_db" placeholder="Server" value="localhost">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="user_db" class="col-sm-2 col-form-label">User</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="user_db" v-model.trim="project.user_db" placeholder="User">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="password_db" class="col-sm-2 col-form-label">Pass</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="password_db" v-model.trim="project.password_db" placeholder="Password">
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr class="mt-5 mb-5">
                    <div class="row">
                        <div class="col-lg-6">
                            <h4 class="mb-3"><strong>CMS</strong></h4>
                            <div class="form-group row">
                                <label for="user_cms" class="col-sm-2 col-form-label">User</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="user_cms" v-model.trim="project.user_cms" placeholder="User">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="password_cms" class="col-sm-2 col-form-label">Pass</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="password_cms" v-model.trim="project.password_cms" placeholder="Password">
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <h4 class="mb-3"><strong>Hosting</strong></h4>
                            <div class="form-group row">
                                <label for="domain_host" class="col-sm-2 col-form-label">Domain</label>
                                <div class="col-sm-10">
                                    <input type="url" class="form-control" id="domain_host" v-model.trim="project.domain_host" placeholder="https://www">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="user_host" class="col-sm-2 col-form-label">User</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="user_host" v-model.trim="project.user_host" placeholder="User">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="password_host" class="col-sm-2 col-form-label">Pass</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="password_host" v-model.trim="project.password_host" placeholder="Password">
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="text-right">
                        <button type="reset" class="btn btn-danger btn-lg btn_add px-4 mr-3" v-on:click="resetFields">Reset</button>
                        <button type="submit" class="btn btn-primary btn-lg trans btn_add px-5" v-bind:class="{ 'btn-success': isStateSuccess }">{{lableBtn}}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'app',
    data() {
        return {
            importArea: '',
            searchValue: '',
            searchAnswers: [],
            listAccesses: ( function() {
                var arr = [];
                for ( var access in localStorage ) {
                  if (!localStorage.hasOwnProperty(access)) continue;
                  arr.push( access );
                }
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
            isImportAccesses: false,
            isAnswerRezult: false,
            isStateSuccess: false,
            isFileOnLoad: false,
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
        removeAccess: function() {
            if ( !confirm( 'Confirm the deletion?' ) ) return;
            localStorage.removeItem( this.searchValue );
            this.isResult = false;
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
            var importObj = JSON.parse( this.importArea );
            for ( var access in importObj ) {
                if ( importObj.hasOwnProperty( access ) ) {
                    localStorage.setItem( access, JSON.stringify( importObj[ access ] ) );
                }
            }
            this.isImportAccesses = true;
        },
        readFile: function( e ) {
            this.readSingleFile( e );
            this.isFileOnLoad = true;
        },
        exportAccesses: function() {
            var arr = [];
            for ( var access in localStorage ) {
                if ( localStorage.hasOwnProperty( access ) ) {
                    arr.push( '"' + access + '":' + localStorage[ access ] );
                }
            }
            // console.table( arr );
            $( '#exporttArea' ).val( '{' + arr.join( ', ' ) + '}' );
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
            var _this = this;
            var reader = new FileReader();
            reader.onload = function( e ) {
                var contents = e.target.result;
                _this.displayContents( contents );
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
        },
    }
}
</script>
<style lang="sass">
body, html
  height: 100%
body
  opacity: 0
  transition: opacity .1s
.trans
  -webkit-transition: .3s
  -moz-transition: .3s
  -ms-transition: .3s
  -o-transition: .3s
  transition: .3s
</style>