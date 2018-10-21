<template>
    <div class="container-fluid bg-info text-white py-3">
        <div class="container">
            <div class="input-group">
                <input class="form-control trans" type="text" placeholder="cyrilic string to url translation..." 
                @input="inText = $event.target.value"
                :value="translitToURL">
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'translit',
    data() {
        return {
            inText: ''
        }
    },
    computed: {
        translitToURL: function() {
            return slugify( this.inText );
        }
    }
}
</script>