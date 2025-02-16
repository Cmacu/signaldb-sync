<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { Collection } from "@signaldb/core";
import createLocalStorageAdapter from "@signaldb/localstorage";
import vueReactivityAdapter from "@signaldb/vue";


type User = { id: string; name: string }
const users = new Collection<User>({
  reactivity: vueReactivityAdapter,
  persistence: createLocalStorageAdapter("users"),
})

const computedUsers = computed(() => users.find().fetch())

const watchEffectUsers = ref<User[]>([])
watchEffect(() => {
  watchEffectUsers.value = users.find().fetch()
})

const addUser = () => {
  users.insert({ name: name.value })
  name.value = ""
}

const name = ref("")

const codeWithoutWarnings = () => {
  for (let index = 0; index < 1000; index++) {
    const cursor = users.find()
    cursor.fetch()
    cursor.cleanup()
  }
}

const codeWithWarnings = () => {
  for (let index = 0; index < 1000; index++) {
    users.find().fetch()
  }
}


codeWithoutWarnings()
// codeWithWarnings()
</script>

<template>
  <main>
    <input v-model="name" />
    <button @click="addUser">Add User</button>
    <h2 align="center">Computed Users</h2>
    <ul class="user-list">
      <li v-for="user in computedUsers" :key="user.id">
        <strong>{{ user.name }} </strong>
        <button @click="users.removeOne({ id: user.id })">Remove</button>
      </li>
    </ul>
    <h2 align="center">Watch Effect Users</h2>
    <ul class="user-list">
      <li v-for="user in watchEffectUsers" :key="user.id">
        <strong>{{ user.name }} </strong>
        <button @click="users.removeOne({ id: user.id })">Remove</button>
      </li>
    </ul>
  </main>
</template>
