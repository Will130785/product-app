let eventBus = new Vue()

Vue.component("product", {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
            <img v-bind:src="image" :alt="description" />
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inventory > 10">In Stock</p>
            <p v-else-if="inventory <= 10 && inventory > 0">Almost Sold Out</p>
            <p v-else
                v-bind:class="{ outOfStock: !inventory }">Out of Stock</p>

            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>

            <div v-for="(variant, index) in variants" 
                    v-bind:key="variant.variantId"
                    class="color-box"
                    v-bind:style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct(index)">
            </div>

            <button v-on:click="addToCart" 
                    v-bind:disabled="!inStock"
                    :class="{ disabledButton: !inStock }">Add to Cart</button>
            

        </div>

        <product-tabs :reviews="reviews"></product-tabs>

    </div>
    `,
    data(){
        return {
            product: "Socks",
            brand: "Vue Mastery",
            selectedVariant: 0,
            description: "Picture of socks",
            docs: "https://vuejs.org/v2/guide/",
            inventory: 100,
            onSale: true,
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "./assets/images/socks_green.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./assets/images/socks_blue.jpg",
                    variantQuantity: 0
                }
            ],
            sizes: ["Large", "Medium", "Small"],
            reviews: []
        }
    },
    methods: {
        updateProduct(index){
            this.selectedVariant = index
            console.log(index);
        },
        addToCart(){
            this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId)
        },
        removeFromCart(){
            this.$emit("remove-from-cart")
        }
    },
    computed: {
        title(){
            return this.brand + " " + this.product
        },
        image(){
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        isOnSale(){
            return `${this.brand} ${this.product} is currently on sale`
        }
    },
    mounted(){
        eventBus.$on("review-submitted", productReview => {
            this.reviews.push(productReview)
        })
    }
});

Vue.component("product-review", {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
        <b>Please correct the following errors:</b>
        <ul>
            <li v-for="error in errors">{{ error }}</li>
        </ul>
    </p>

    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="name">
    </p>
    
    <p>
      <label for="review">Review:</label>      
      <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>
        
    <p>
      <input type="submit" value="Submit">  
    </p>    
  
  </form>
    `,
    data(){
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit(){
            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                eventBus.$emit("review-submitted", productReview)
                this.name = null
                this.review = null
                this.rating = null
                
            } else {
                if(!this.name) this.errors.push("Name required")
                if(!this.review) this.errors.push("Review required")
                if(!this.rating) this.errors.push("Rating required")
            }

            
        }
    }
})

Vue.component("shipping", {
    template: `
        <p>Shipping: {{ shipping }}</p>
    `,
    computed: {
        shipping(){
            if(this.premium){
                return "Free"
            }

            return 2.99
        }
    }
})

Vue.component("product-details", {
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `,
    data(){
        return {
            details: ["80% cotton", "20% polyester", "Gender-neutral"]
        }
    }
})

Vue.component("product-tabs", {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <span class="tab"
                    :class="{ activeTab: selectedTab === tab }"
                    v-for="(tab, index) in tabs" 
                    v-bind:key="index"
                    @click="selectedTab = tab">
                    {{ tab }}</span>

            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews yet</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>{{ review.review }}</p>
                        <p>{{ review.rating }}</p>
                    </li>
                </ul>
            </div>
        
                <product-review v-show="selectedTab === 'Make a review'"></product-review>
                <shipping v-show="selectedTab === 'Shipping'"></shipping>
                <product-details v-show="selectedTab === 'Product details'"></product-details>
        </div>
    `,
    data(){
        return {
            tabs: ["Reviews", "Make a review", "Shipping", "Product details"],
            selectedTab: "Reviews"
        }
    }
})


let app = new Vue({
    el: "#app",
    data: {
        premium: true,
        details: "These are the product detail",
        cart: []
    },
    methods: {
        updateCart(id){
            this.cart.push(id)
        },
        removeItem(){
            this.cart.pop()
        }
    }
});