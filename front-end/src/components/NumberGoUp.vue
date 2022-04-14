<template>
  <div class="game">
    <div class="heroBox">
      <h3 v-if="this.rngManip > 0.01">Level: {{ Math.floor(this.rngManip * 100) }} </h3>
      <h2>Score: {{ score }}</h2>
      <p><button class="makeGoUpButton" v-on:click.prevent="makeGoUp">{{ buttonLabel }}</button></p>
      <p>
        <input v-model="username" placeholder="username">
        <button class="submitButton" v-if="username !== ''" v-on:click.prevent="submit">Submit score</button>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "NumberGoUp",
  data() {
    return {
      score: 0,
      username: "",
      buttonLabel: "Number Goes Up",
      rngManip: 0.01,
      levelUp: 100
    }
  },
  methods: {
    async submit() {
      try {
        await axios.post("/api/scores/", {
          username: this.username,
          score: this.score
        })
      } catch (error) {
        this.error = "Error: " + error.response.data.message
      }
    },
    makeGoUp() {
      if (this.score > this.levelUp) {
        this.rngManip += 0.01
        let xpNeeded = Math.floor((Math.random() * 500) + 500)
        this.levelUp += xpNeeded
        if (this.rngManip == 0.02) alert("Level up!")
      }
      let rng = Math.random() + this.rngManip
      if (rng > 0.8) this.score += Math.ceil(Math.exp(this.rngManip * 100))
      else this.score += this.rngManip * 100
    }
  }
}
</script>

<style scoped>
.heroBox {
  justify-content: center;
}

p {
  padding-top: 1.7em;
}
</style>