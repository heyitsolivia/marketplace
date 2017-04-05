import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import domready from 'domready'
import VeeValidate from 'vee-validate'

import { householdData } from './data'


Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VeeValidate)

const store = new Vuex.Store({
  state: {
    household: householdData
  },
  mutations: {
    addMember (state, member) {
      state.household.push(member)
    },
    updateMember (state, payload) {
      state.household.splice(payload.index, 1, payload.member)
    },
  },
})

const heroTemplate = `
  <section class="hero">
      <div class="row align-center">
          <div class="small-11 columns">
              <h1 class="heading heading--large">{{ title }}</h1>
              <p class="heading heading--small">{{ description }}</p>
          </div>
      </div>
  </section>
`

const summaryTemplate = `
<section class="section">
    <div class="row align-center">
        <div class="small-11 columns">
            <router-link tag="button" :to="{ name: 'addMember'}" class="button float-right">
                Add new member
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 22 16">
                  <circle fill="#ffffff" cx="14" cy="4" r="4"/>
                  <path fill="#ffffff" d="M5 6V3H3v3H0v2h3v3h2V8h3V6M14 10c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"/>
                </svg>
            </router-link>
        </div>
    </div>
    <div class="row align-center">
        <div class="small-11 columns">
            <table class="table">
                <thead>
                    <tr>
                        <th class="primary-cell" scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Favorite Fruit</th>
                    </tr>
                </thead>
                <tbody>
                        <router-link tag="tr" :to="{ name: 'editMember', params: { id: index } }" v-for="(member, index) in household">
                            <td class="primary-cell">
                                <router-link :to="{ name: 'editMember', params: { id: index } }">
                                    {{ member.fullName }}
                                </router-link>
                            </td>
                            <td>{{ member.description }}</td>
                            <td>{{ member.favoriteFruit }}</td>
                        </router-link>
                </tbody>
            </table>

        </div>
    </div>
</section>
`

const formTemplate = `
<form @submit.prevent="validateBeforeSubmit" class="form">
    <div class="form__section">
        <div class="row align-center">
            <div class="small-11 medium-8 large-4 columns">
                <label class="form__label">Full Name</label>
                <small>The full name as inscribed upon legal documents.</small>
            </div>
            <div class="small-11 medium-8 large-6 columns">
                <input v-model="fullName" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('name') }" name="name" type="text" placeholder="Full legal name">
                <span v-show="errors.has('name')" class="error is-invalid">{{ errors.first('name') }}</span>
            </div>
        </div>
    </div>
    <div class="form__section">
        <div class="row align-center">
            <div class="small-11 medium-8 large-4 columns">
                <label class="form__label">Description</label>
                <small>The role that this person plays in the household.</small>
            </div>
            <div class="small-11 medium-8 large-6 columns">
                <input v-model="description" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('description') }" name="description" type="text" placeholder="Role in household">
                <span v-show="errors.has('description')" class="error is-invalid">{{ errors.first('description') }}</span>
            </div>
        </div>
    </div>
    <div class="form__section">
        <div class="row align-center">
            <div class="small-11 medium-8 large-4 columns">
                <label class="form__label">Favorite Fruit</label>
                <small>The fruit most preferred above all others.</small>
            </div>
            <div class="small-11 medium-8 large-6 columns">
                <input v-model="favoriteFruit" v-validate="'required'" :class="{'input': true, 'is-invalid': errors.has('fruit') }" name="fruit" type="text" placeholder="i.e. apple">
                <span v-show="errors.has('fruit')" class="error is-invalid">{{ errors.first('fruit') }}</span>
            </div>
        </div>
    </div>
    <div>
        <div class="row align-center">
            <div class="small-11 medium-8 large-10 columns">
                <div class="float-right">
                    <button type="button" v-on:click="onCancel" class="button button--ghost">Cancel</button>
                    <button type="submit" class="button">{{ actionWord }} member</button>
                </div>
            </div>
        </div>
    </div>
</form>
`

// Route Components

const Hero = Vue.component('hero-component', {
  props: ['title', 'description'],
  template: heroTemplate
})

const Summary = Vue.component('summary-component', {
  computed: {
    household() {
      return this.$store.state.household
    }
  },
  template: summaryTemplate
})

const Form = Vue.component('form-component', {
  props: ['action'],
  data: function () {
    if (this.action === "add") {
      return {
        fullName: '',
        description: '',
        favoriteFruit: '',
        actionWord: 'Add'
      }
    }
    if (this.action === "edit") {
      return {
        fullName: this.$store.state.household[this.$route.params.id].fullName,
        description: this.$store.state.household[this.$route.params.id].description,
        favoriteFruit: this.$store.state.household[this.$route.params.id].favoriteFruit,
        actionWord: 'Update'
      }
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
    validateBeforeSubmit() {
      this.$validator.validateAll().then(() => {
        this.onSubmit()
        // console.log('validated')
      }).catch(() => {
        // console.log('There were errors in the form.')
      });
    },
    onSubmit() {
        const member = {}
        member.fullName = this.cleanFullName
        member.description = this.cleanDescription
        member.favoriteFruit = this.cleanFavoriteFruit

        if (this.action === "add") {
          store.commit('addMember', member)
        }

        if (this.action === "edit") {
          const payload = {
            index: this.$route.params.id,
            member: member
          }
          store.commit('updateMember', payload)
        }

        this.resetForm()
        router.push({ name: 'household' })
    },
    onCancel() {
      router.push({ name: 'household' })
    }
  }
})


// Create router instance
const router = new VueRouter({
  routes: [
    {
      path: '/household', name: 'household',
      components: { header: Hero, content: Summary },
      props: {
        header: {
          title: "Your Household",
          description: "Welcome to the Marketplace! Review your household below."
        }
      },
      alias: '/',
    },
    {
      path: '/member/new', name: 'addMember',
      components: { header: Hero, content: Form },
      props: {
        header: {
          title: "Add Member",
          description: "Add another person to your household to recieve marketplace benefits."
        },
        content: {
          action: "add"
        }
      }
    },
    {
      path: '/member/:id/edit', name: 'editMember',
      components: { header: Hero, content: Form },
      props: {
        header: {
          title: "Update Member",
          description: "Update this member's information."
        },
        content: {
          action: "edit"
        }
      }
    },
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

