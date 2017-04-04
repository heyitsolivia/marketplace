import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import domready from 'domready'

import { householdData } from './data'


Vue.use(VueRouter)
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    household: householdData
  },
  mutations: {
    addMember(state, member) {
      state.household.push(member)
    }
  }
})

const heroTemplate = `
  <section class="hero">
      <div class="row">
          <div class="small-12 columns">
              <h1 class="heading heading--large">{{ title }}</h1>
              <p class="heading heading--small">{{ description }}</p>
          </div>
      </div>
  </section>
`

const summaryTemplate = `
<section class="section">
    <div class="row">
        <div class="small-12 columns">
            <router-link tag="button" :to="{ name: 'addMember'}" class="button float-right">
                Add new member
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 22 16">
                  <circle fill="#ffffff" cx="14" cy="4" r="4"/>
                  <path fill="#ffffff" d="M5 6V3H3v3H0v2h3v3h2V8h3V6M14 10c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"/>
                </svg>
            </router-link>

            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Full Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Favorite Fruit</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="member in household">
                        <td>{{ member.fullName }}</td>
                        <td>{{ member.description }}</td>
                        <td>{{ member.favoriteFruit }}</td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>
</section>
`

const formTemplate = `
<form>
    <div class="row">
        <div class="medium-4 columns">
            <label>Full Name
                <input v-model="fullName" type="text" placeholder="Your full name">
            </label>
        </div>
        <div class="medium-4 columns">
            <label>Description
                <input v-model="description" type="text" placeholder="Your role">
            </label>
        </div>
        <div class="medium-4 columns">
            <label>Favorite Fruit
                <input v-model="favoriteFruit" type="text" placeholder="Apple">
            </label>
        </div>
    </div>
    <div class="row">
        <div class="medium-12 columns">
            <div class="float-right">
                <button v-on:click="cancel" class="button">Cancel</button>
                <button v-on:click="submit" class="button">Add member</button>
            </div>
        </div>
    </div>
</form>
`

// Components
Vue.component('hero-component', {
  props: ['title', 'description'],
  template: heroTemplate
})

// Route Components
const Summary = Vue.component('summary-component', {
  computed: {
    household() {
      return this.$store.state.household
    }
  },
  template: summaryTemplate
})

const Form = Vue.component('form-component', {
  data: function () {
    return {
      fullName: '',
      description: '',
      favoriteFruit: '',
    }
  },
  computed: {
    cleanFullName: function() {
      return this.fullName.trim()
    },
    cleanDescription: function() {
      return this.description.trim()
    },
    cleanFavoriteFruit: function() {
      return this.favoriteFruit.trim()
    },
  },
  template: formTemplate,
  methods: {
    resetForm() {
      this.fullName = '';
      this.description = '';
      this.favoriteFruit = '';
    },
    submit() {
      const member = {}
      member.fullName = this.cleanFullName
      member.description = this.cleanDescription
      member.favoriteFruit = this.cleanFavoriteFruit

      store.commit('addMember', member)
      this.resetForm()
      router.push({ name: 'household' })
    },
    cancel() {
      router.push({ name: 'household' })
    }
  }
})


// Create router instance
const router = new VueRouter({
  routes: [
    { path: '/household', name: 'household', component: Summary, alias: '/' },
    { path: '/member/new', name: 'addMember', component: Form },
    { path: '/member/edit', name: 'updateMember', component: Form }
  ]
})

// Create and mount the root instance
domready(() => {
  new Vue({
    el: '#app',
    store,
    router,
    methods: {},
  })
})

