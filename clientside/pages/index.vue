<template>
  <div>
    <v-container>
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="10" md="8" lg="7">
          <v-row>
            <v-col cols="12">
              <v-alert
                border="left"
                elevation="4"
                colored-border
                color="primary"
                dismissible
              >
                To Listen to your songs, Go to
                <v-btn text color="primary"> player </v-btn>
              </v-alert>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="search"
                solo
                append-icon="mdi-magnify"
                placeholder="Search for songs and artistes"
              />
            </v-col>
            <v-col cols="12" class="text-capitalize">
              <v-data-table
                :headers="headers"
                :items="musics"
                :search="search"
                :items-per-page="10"
                class="elevation-4"
              >
                <template v-slot:top>
                  <v-toolbar dense flat>
                    <v-toolbar-title
                      class="font-weight-bold hidden-sm-and-down"
                    >
                      All Musics
                    </v-toolbar-title>
                    <v-spacer />
                    <v-dialog v-model="newItem" max-width="500px" persistent>
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          depressed
                          small
                          color="primary"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon class="pr-1">mdi-plus-circle</v-icon>
                          New Song
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title>Add New Song</v-card-title>
                        <v-card-text class="pb-0">
                          <v-form v-model="formAdd">
                            <v-row>
                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="title"
                                  label="Title"
                                  prepend-inner-icon="mdi-file-edit"
                                  :rules="[
                                    (v) => !!v || 'Song title is required',
                                  ]"
                                />
                              </v-col>
                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="artist"
                                  prepend-inner-icon="mdi-account"
                                  label="Artiste"
                                  :rules="[(v) => !!v || 'Artist is required']"
                                />
                              </v-col>
                              <v-col cols="12">
                                <v-file-input
                                  id="music-file"
                                  show-size
                                  hint="File size must not be more than 10MB"
                                  persistent-hint
                                  label="Music file"
                                  prepend-icon="mdi-animation-play"
                                  :rules="[
                                    (v) => !!v || 'Music file is required',
                                  ]"
                                />
                              </v-col>
                            </v-row>
                          </v-form>
                        </v-card-text>
                        <v-card-actions class="pa-5">
                          <v-btn
                            color="primary"
                            :disabled="!formAdd"
                            :loading="loading"
                            @click="processAddNewSong()"
                          >
                            Add Music
                          </v-btn>
                          <v-btn text @click="newItem = false"> cancel </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-toolbar>
                </template>
                <template v-slot:[`item.action`]="{ item }">
                  <v-dialog
                    v-model="dialogDelete[musics.indexOf(item)]"
                    max-width="350px"
                  >
                    <template v-slot:activator="{ attrs, on }">
                      <v-btn icon color="error" v-bind="attrs" v-on="on">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <v-card class="pa-5">
                      <div class="subtitle-1 text-center">
                        Are you sure you want to delete
                        <span class="text-capitalize font-weight-bold">
                          {{ item.title }}
                        </span>
                        by
                        <span class="text-capitalize font-weight-bold">
                          {{ item.artist }}
                        </span>
                        ?
                      </div>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn text @click="closeDelete">No</v-btn>
                        <v-btn
                          text
                          color="error"
                          @click="processDeleteSong(item)"
                        >
                          Yes
                        </v-btn>
                        <v-spacer />
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </template>
                <template v-slot:[`item.created`]="{ item }">
                  {{ item.created.substr(0, 10) }}
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    let musics = await $axios.$get('/')
    musics = musics.payload
    return { musics }
  },
  data: () => ({
    search: '',
    headers: [
      { text: 'Artistes', value: 'artist' },
      { text: 'Title', value: 'title' },
      { text: 'Date Created', value: 'created' },
      { align: 'center', sortable: false, value: 'action' },
    ],
    title: '',
    artist: '',
    file: '',
    dialogDelete: [],
    formAdd: false,
    loading: false,
    newItem: false,
  }),
  watch: {
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },
  methods: {
    processAddNewSong() {
      this.loading = true
      const data = new FormData()
      data.append('title', this.title)
      data.append('artist', this.artist)
      data.append('music', document.getElementById('music-file').files[0])
      this.$axios
        .$post('/', data)
        .then((res) => {
          this.$store.commit('snackbar/show', {
            icon: 'success',
            text: res.message,
          })
          this.newItem = false
          this.$router.go(0)
        })
        .catch((err) => {
          const { response, message } = err
          this.$store.commit('snackbar/show', {
            icon: 'error',
            text: response.data.message || message,
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    closeDelete() {
      this.dialogDelete = []
    },
    async processDeleteSong(item) {
      try {
        const res = await this.$axios.delete(`/${item._id}`)
        this.$store.commit('snackbar/show', {
          icon: 'success',
          text: res.data.message,
        })
        this.$router.go(0)
        //
      } catch (error) {
        const { response, message } = error
        this.$store.commit('snackbar/show', {
          icon: 'error',
          text: response.data.message || message,
        })
      } finally {
        this.dialogDelete = []
      }
    },
  },
}
</script>
