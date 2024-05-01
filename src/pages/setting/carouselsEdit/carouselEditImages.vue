<template>
  <div>
    <template v-slot:[`item.gallery`]="{ item }">
      <v-dialog transition="dialog-top-transition" max-width="600">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" icon v-bind="attrs" v-on="on">
            <v-icon>mdi-image </v-icon>
          </v-btn>
        </template>
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar color="primary" dark>{{
              $t('Product.gallery')
            }}</v-toolbar>
            <v-card-text>
              <div class="Product_images my-5">
                <div
                  v-for="img in item.productImages"
                  :key="img.id"
                  class="single_img photo_content"
                >
                  <v-img
                    :src="img.imageUrl"
                    width="97"
                    height="97"
                    class="mx-2"
                  ></v-img>
                  <span
                    class="delete_img"
                    @click="
                      deletePhoto = true
                      photo_id = img.id
                    "
                  >x</span>
                </div>
              </div>
              <div v-if="deletePhoto" class="my-3">
                <v-btn
                  @click="
                    deleteThisPhoto(photo_id, item.productImages)
                    deletePhoto = false
                  "
                >{{ $t("image.delete") }}<v-icon color="red" dark>delete</v-icon></v-btn>
              </div>
              <v-divider></v-divider>
                  
              <div class="photo_content add_img">
                <v-file-input
                  v-model="ProductImages"
                  class="add_img_btn"
                  :prepend-icon="
                    ProductImages != null
                      ? 'mdi-camera primary'
                      : 'mdi-camera'
                  "
                  hide-input
                  multiple
                  @change="Product_id = item.id"
                ></v-file-input>
                <div v-if="ProductImages != null">
                  <v-btn :loading="uploadingImage" @click="addPhoto()"> {{ $t("image.upload") }}</v-btn>
                </div>
              </div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                text
                @click="
                  dialog.value = false
                  ;(photo_id = null), (deletePhoto = false)
                "
              >{{ $t('common.cancel') }}</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </template>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>