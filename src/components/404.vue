<template>
    <div class="base">
        <div class="thanks-text">
            <h3 class="blk">404, Ouch!</h3>
            <p class="blk">
                The page you were looking for doens't exsit. But these creators do.
            </p>
        </div>

        <div class="uk-position-relative uk-visible-toggle uk-light uk-container" tabindex="-1" uk-slider>

            <ul class="uk-slider-items uk-child-width-1-2 uk-child-width-1-3@m uk-grid">
                
                <li v-for="(creator, i) in this.randomCreators" :key="i">
                    <div class="uk-panel">
                        
                        <a :href="'/cr/' + creator.username">
                            <div 
                                class="uk-background-cover uk-height-medium uk-panel uk-flex uk-flex-center uk-flex-middle bg-pic"
                                style="height: 380px;" 
                                v-lazy:background-image="{src: `https://drive.google.com/uc?export=view&id=${creator.picture_id}`}" >

                            </div>
                        </a>
                        <div class="uk-panel">
                            <h4 class="uk-text-break">{{ creator.username }} &mdash; <span>{{creator.craft_type}}</span> </h4>
                            
                            <p>{{ creator.summary }}</p>
                        </div>
                    </div>
                </li>
                <li id="loader">
                    <div class="uk-position-center" uk-spinner="ratio: 3"></div>
                </li>
            </ul>

            <a class="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous uk-slider-item="previous"></a>
            <a class="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next uk-slider-item="next"></a>

        </div>
        
    </div>
</template>
<script>
import axios from 'axios'
axios.defaults.withCredentials = true;
export default {
    name: "NotFoundErrorPage",
    data () {
        return {
            nickname: localStorage.getItem('shukran-supporter-nickname'),
            randomCreators: [{ // have a default value so the slider loads properly
                craft_type: "Media",
                picture_id: "1E5TvEgikWfv73EGXtAZDXqSWM8KjV90w",
                summary: "Your consistent interaction with the content we put out fuels our work. We have so many stories to tell. Please give us a tip. It means a lot.",
                username: "sheballstoo_"
            }]
        }
    },
    methods: {
        getRandomCreators() {
            axios.get(process.env.BASE_URL + `/api/randomcreators/${25}/`, {
                withCredentials: true
            })
            .then((res) => {
                this.randomCreators = res.data;
                document.getElementById('loader').style.display = 'none'; // later we'll load more creators when they get to the end of the list
            });
        }
    },
    beforeMount() {
      this.getRandomCreators()
    },
    mounted() {
    }
}
</script>
<style scoped>
.base {
  background-image: linear-gradient(135deg, #c63968 0%, #ff746c 100%);
  position: fixed;
  bottom: 0;
  right: 0;
  top: 0;
  left: 0;
  overflow: auto;
}
.blk {
    color: black;
}
.thanks-text {
    text-align: center;
    padding: 20px;
}
</style>
