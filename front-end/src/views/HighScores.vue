<template>
  <div class="leaderboard">
    <h2>High Scores</h2>
    <table class="pure-table">
      <tbody v-for="score in scores" v-bind:key="score._id">
        <tr>
          <td>{{ score.score }}</td>
          <td>{{ score.user.username }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "HighScores",
  data() {
    return {
      scores: [],
    };
  },
  created() {
    this.getScores();
  },
  methods: {
    async getScores() {
      try {
        this.response = await axios.get("/api/scores/")
        this.scores = this.response.data
      } catch (error) {
        this.error = error.response.data.message
      }
    },
  },
};
</script>