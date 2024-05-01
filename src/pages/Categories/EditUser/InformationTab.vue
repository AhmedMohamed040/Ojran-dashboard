<template>
  <div>
    <div class="my-5 content">
      <v-row class="my-4 mx-4">
        <v-col cols="12" class="center-content h createMerchent">
          <h2>{{ $t('Categories.createCategory') }}</h2>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            outlined
            v-model="NameEn"
            hint="Accept only Character"
            :label="$t('common.nameInEnglish')"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            outlined
            v-model="NameAr"
            hint="Accept only Character"
            :label="$t('common.nameInArabic')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-file-input
            outlined
            prepend-icon="mdi-camera"
            :label="$t('Categories.photo')"
            v-model="Image"
          ></v-file-input>
        </v-col>

        <v-col>
          <v-btn
            v-if="ParentCategoryId"
            color="primary"
            class="mx-2"
            @click="addsubCategory()"
            :loading="isLoading"
            :disabled="!NameEn || !NameAr || !Image"
          >
            {{ $t('common.add') }}
          </v-btn>
          <v-btn
            v-else
            color="primary"
            class="mx-2"
            @click="addCategory()"
            :loading="isLoading"
            :disabled="!NameEn || !NameAr || !Image"
          >
            {{ $t('common.add') }}
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  name: 'addCategory',
  data() {
    return {
      NameEn: null,
      NameAr: null,
      Image: null,
      ParentCategoryId: this.id,
      isLoading: false,
    }
  },

  methods: {
    ...mapActions('Categories', ['postsubCategory', 'postCategory']),
    addsubCategory() {
      this.isLoading = true;
      this.postsubCategory({
        NameEn: this.NameEn,
        NameAr: this.NameAr,
        Image: this.Image,
        ParentCategoryId: this.id
      }).then( () => this.isLoading = false )
    },
    addCategory() {
      this.isLoading = true;
      this.postCategory({
        NameEn: this.NameEn,
        NameAr: this.NameAr,
        Image: this.Image
      }).then( () => this.isLoading = false )
    },

  }
}
</script>
<style lang="scss">
.mapHeader {
  color: #fff;
  background-color: #042d4e;
  padding: 0.5rem;
}
.center-content {
  padding: 20px;
  width: 90%;
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 15px 2px #00000020;
}
.h {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px 10px 0 0;
}
</style>
