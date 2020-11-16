<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="11" sm="9" md="8" lg="7" class="text-capitalize">
        <v-data-table
          :headers="headers"
          :items="musics"
          :search="search"
          :items-per-page="10"
          class="elevation-2"
        >
          <template v-slot:top>
            <v-row align="end">
              <v-col cols="12" sm="5" md="5" class="pt-0 pb-0">
                <v-img src="/disc.jpg" height="150" width="100%" />
              </v-col>
              <v-col
                cols="12"
                sm="7"
                md="7"
                class="pt-sm-1 pb-sm-1 py-5 text-center"
              >
                <div
                  v-if="current.title"
                  class="subtitle-1 px-2 px-sm-0 text-truncate pb-2 scrollText"
                >
                  <span> {{ current.title }} - {{ current.artist }} </span>
                </div>
                <div v-else class="pb-1 font-weight-thin subtitle-2">
                  <i>Please select a song</i>
                </div>
                <div id="slider" class="py-1 px-5">
                  <v-slider
                    v-model="time"
                    :min="0"
                    :max="duration"
                    color="primary"
                    hide-details
                    height="25"
                    class="mx-2"
                    track-color="primary lighten-2"
                    @click="skip()"
                  >
                    <template v-slot:prepend>
                      <span class="caption font-weight-bold">
                        {{ time > 0 ? getCurrentMinSec : '0:00' }}
                      </span>
                    </template>
                    <template v-slot:append>
                      <span class="caption font-weight-bold">
                        {{ duration > 0 ? getDurationMinSec : '0:00' }}
                      </span>
                    </template>
                  </v-slider>
                </div>
                <div class="pb-2">
                  <v-btn
                    icon
                    color="black"
                    large
                    :disabled="firstSong"
                    @click="playPrevSong()"
                  >
                    <v-icon large>mdi-skip-backward</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="!playing || time === duration"
                    icon
                    color="black"
                    :disabled="cleared"
                    x-large
                    class="mx-3"
                    @click="play()"
                  >
                    <v-icon size="60">mdi-play-circle</v-icon>
                  </v-btn>
                  <v-btn
                    v-else
                    icon
                    color="black"
                    class="mx-3"
                    x-large
                    @click="pause()"
                  >
                    <v-icon size="60">mdi-pause-circle</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color="black"
                    large
                    :disabled="lastSong"
                    @click="playNextSong()"
                  >
                    <v-icon large>mdi-skip-forward</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            <v-divider />
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-btn
              v-if="item === current"
              icon
              color="error"
              @click="stopMusic()"
            >
              <v-icon>mdi-stop</v-icon>
            </v-btn>
            <v-btn v-else icon color="primary" @click="playMusic(item)">
              <v-icon>mdi-play</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    let musics = await $axios.$get('/')
    musics = musics.payload
    return { musics }
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Artistes', value: 'artist' },
        { text: 'Title', value: 'title' },
        { align: 'center', sortable: false, value: 'action' },
      ],
      current: {},
      player: '',
      playing: false,
      cleared: true,
      time: 0,
      duration: 0,
    }
  },
  computed: {
    firstSong() {
      const n = this.musics.indexOf(this.current)
      if (n === 0) {
        return true
      } else {
        return false
      }
    },
    lastSong() {
      const last = this.musics.length - 1
      const n = this.musics.indexOf(this.current)
      if (n === last) {
        return true
      } else {
        return false
      }
    },
    getCurrentMinSec() {
      const min = Math.floor(this.time / 60)
      const sec = this.time - min * 60
      return `${min}:${sec < 10 ? '0' : ''}${sec}`
    },
    getDurationMinSec() {
      const min = Math.floor(this.duration / 60)
      const sec = this.duration - min * 60
      return `${min}:${sec < 10 ? '0' : ''}${sec}`
    },
  },
  methods: {
    async playMusic(item) {
      this.current = item
      if (this.player === '') {
        this.player = await new Audio()
        this.player.src = await `http://localhost:5000/${this.current.music.path}`
        await this.play()
      } else {
        this.player.pause()
        this.player.src = await `http://localhost:5000/${this.current.music.path}`
        await this.play()
      }
      this.cleared = false
    },
    play() {
      if (this.current !== {}) {
        this.player.play()
        // this.player.loop = true
        this.playing = true
        this.getTime()
      }
    },
    pause() {
      this.player.pause()
      this.playing = false
    },
    playPrevSong() {
      let n = this.musics.indexOf(this.current)
      n = n - 1
      this.playMusic(this.musics[n])
    },
    playNextSong() {
      let n = this.musics.indexOf(this.current)
      n = n + 1
      this.playMusic(this.musics[n])
    },
    stopMusic() {
      this.player.mute = true
      this.player.src = ''
      this.playing = false
      this.current = {}
      this.cleared = true
    },
    getTime() {
      this.time = Math.floor(this.player.currentTime)
      setInterval(() => {
        this.time = Math.floor(this.player.currentTime)
      }, 1000)
      setTimeout(() => {
        this.duration = Math.floor(this.player.duration)
      }, 1050)
    },
    skip() {
      this.player.currentTime = this.time
      this.play()
    },
  },
  head() {
    return { title: 'Play and Listen to All Songs' }
  },
}
</script>

<style>
.v-slider--horizontal .v-slider__track-container {
  height: 6px;
}
.v-slider--horizontal .v-slider__track-background,
.v-slider--horizontal .v-slider__track-fill {
  border-radius: 50px;
}
</style>
