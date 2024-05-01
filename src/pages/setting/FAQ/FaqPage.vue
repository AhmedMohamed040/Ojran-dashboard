<template>
  <div class="d-flex flex-column flex-grow-1 ma-0">
    <div class="d-flex align-center py-3">
      <div>

        <div class="display-1">{{ $t('setting.faq') }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>

      </div>
    </div>

    <div>
      <v-card>

        <v-card-title class="font-weight-medium d-flex justify-space-between">
          {{ $t('setting.editFAQ') }}
          <v-dialog v-model="dialog" max-width="700">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="my-2"
                v-bind="attrs"

                v-on="on"
              >
                {{ $t('setting.addQuestion') }}
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="primary white--text">
                <span class="text-h5">{{ $t('setting.addQuestion') }}</span>
              </v-card-title>

              <v-card-text class="mt-2">

                <v-container>
                  <v-row class="my-3 d-flex justify-space-around">
                    <v-col cols="12" sm="12" md="6" class="d-flex  align-start">
                      <v-text-field
                        id="title"
                        v-model="editedQuestion.titleAr"
                        label="السؤال"
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" class="d-flex  align-start" >
                      <v-text-field
                        id="title"
                        v-model="editedQuestion.titleEn"
                        label="Question"
                        outlined
                      ></v-text-field>
                    </v-col>

                  </v-row>
                  <v-row class="my-3 d-flex justify-space-around">
                    <v-col cols="12" sm="12" md="6" class="d-flex  align-start">
                      <v-textarea
                        v-model="editedQuestion.answerAr"
                        outlined
                        name="input-7-4"
                        label="الاجابة"
                        :value="editedQuestion.answerAr"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" class="d-flex  align-end">
                      <v-textarea
                        v-model="editedQuestion.answerEn"

                        outlined
                        name="input-7-43"
                        label="The answer"
                        :value="editedQuestion.answerEn"
                      ></v-textarea>
                    </v-col>

                  </v-row>
                </v-container>
              </v-card-text>
              <hr class="header-divider primary" />
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" dark class="my-2 px-3 py-3" @click="add()">
                  {{ $t('common.save') }}
                </v-btn>

                <v-btn color="red darken-1" dark class="my-2 mx-2 px-3 py-3" @click="close()">
                  {{ $t('common.cancel') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-title>
        <v-card-text class="elevation-0">
          <v-expansion-panels>
            <v-expansion-panel
              v-for="(item,i) in getAllFAQ"
              :key="i"
            >

              <v-expansion-panel-header class="my-1 px-3 text-subtitle-1 ">
                <template v-slot:actions>
                  <v-icon color="error" @click.stop="removeQuestion(item)">
                    mdi-close-circle-outline
                  </v-icon>
                </template>

                <h6 class="text-h6 font-weight-medium">{{ item.titleAr + ' ' + ' | ' + item.titleEn }}</h6>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="my-2 text-body-2">

                <v-row class="my-3 d-flex justify-space-around">
                  <v-col cols="12" sm="12" md="5" class="d-flex  align-start">
                    <!-- <label for="title" class="text-h6">{{ $t('setting.questionTitle') + ':' }}</label> -->
                    <v-subheader class="font-weight-bold text-body-1 pr-0">السؤال</v-subheader>
                    <v-text-field
                      id="title"
                      v-model="item.titleAr"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="5" class="d-flex  align-start" >
                    <v-subheader class="font-weight-bold text-body-1 pr-0">Question</v-subheader>
                    <v-text-field
                      id="title"
                      v-model="item.titleEn"
                      outlined
                    ></v-text-field>
                  </v-col>

                </v-row>
                <v-row class="my-3 d-flex justify-space-around">
                  <v-col cols="12" sm="12" md="5" class="d-flex  align-start">
                    <v-textarea
                      v-model="item.answerAr"
                      outlined
                      name="input-7-4"
                      label="الاجابة"
                      :value="item.answerAr"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="12" md="5" class="d-flex  align-end">
                    <v-textarea
                      v-model="item.answerEn"

                      outlined
                      name="input-7-43"
                      label="The answer"
                      :value="item.answerEn"
                    ></v-textarea>
                  </v-col>

                </v-row>
                <v-card-actions>
                  <v-btn
                    color="primary"
                    @click="save(item)"
                  >
                    {{ $t("common.save") }}
                  </v-btn>
                </v-card-actions>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

        </v-card-text>

      </v-card>

    </div>

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      color="blue darken-1"
      bottom
      top
      text
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue darken-1" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      v-model="error"
      :timeout="timeout"
      color="error darken-1"
      bottom
      top
      text
    >
      {{ errorText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="error darken-1" text v-bind="attrs" @click="error = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import {  mapGetters, mapActions } from 'vuex'
export default {
  components: {
  },
  data() {
    return {
      dialog: false,
      editedQuestion: {
        titleAr: '',
        answerAr: '',
        answerEn: '',
        titleEn: ''
      },
      questions: [],

      error: false,
      snackbar: false,
      errorText: this.$i18n.t('setting.error'),
      snackbarText: this.$i18n.t('setting.dataSaved'),
      timeout: 2000,
      breadcrumbs: [
        {
          text: this.$i18n.t('menu.setting'),
          disabled: false,
          href: '#'
        },
        {
          text: this.$i18n.t('setting.faq')
        }
      ]
    }
  },
  computed: {
    ...mapGetters('AboutUs', ['getFAQ']),
    getAllFAQ() {

      return this.getFAQ
    }

  },
  mounted() {
    this.fetchQuestions()
  },

  methods: {
    ...mapActions('AboutUs', ['fetchQuestions', 'addQuestions', 'editQuestions', 'deleteQuestions']),
    save(item) {
      console.log(item)
      this.editQuestions({
        id: item.id,
        TitleAr: item.titleAr,
        TitleEn: item.titleEn,
        AnswerAr: item.answerAr,
        AnswerEn: item.answerEn

      }).then((res) => {
        if (res.status === 200 || res.statusText == 'OK') {
          this.snackbar = true
        }

      }).catch((err) => {
        if (err.name == 'AxiosError') {
          this.error = true
        }
      }).finally(() => {
        this.fetchQuestions()
      })

    },
    add() {
      this.addQuestions({
        TitleAr: this.editedQuestion.titleAr,
        TitleEn: this.editedQuestion.titleEn,
        AnswerAr: this.editedQuestion.answerAr,
        AnswerEn: this.editedQuestion.answerEn
      }).then((res) => {
        if (res.status === 201 || res.statusText == 'Created') {
          this.snackbar = true
        }

      }).catch((err) => {
        if (err.name == 'AxiosError') {
          this.error = true
        }
      }).finally(() => {
        this.fetchQuestions()
        this.close()
      })
    },
    removeQuestion(item) {
      this.deleteQuestions({
        id: item.id
      }).then((res) => {
        console.log(res)
        if (res.status === 200 || res.statusText == 'OK') {
          this.snackbar = true
        }

      }).catch((err) => {
        if (err.name == 'AxiosError') {
          this.error = true
        }
      }).finally(() => {
        this.fetchQuestions()
      })
    },
    close() {
      this.dialog = false

      this.editedQuestion.titleAr = ''
      this.editedQuestion.answerAr = ''
      this.editedQuestion.answerEn = ''
      this.editedQuestion.titleEn = ''
    }
  }

}
</script>

<style scoped>
.input{ outline: auto;}
.nowrap-overflow {
    flex-wrap: nowrap;
    overflow-x: auto;

}
</style>
