<template>
  <div>

    <v-list nav class="mt-2 pa-0">
      <v-list-item to="/Workplan/tasks" active-class="primary--text" link>
        <v-list-item-icon>
          <v-icon small>mdi-checkbox-marked-circle-outline</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('menu.todo') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/Workplan/types" active-class="primary--text" link>
        <v-list-item-icon>
          <v-icon small>mdi-check</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>نوع خطة العمل</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| TODO Menu Component
|---------------------------------------------------------------------
|
| TODO application navigation
|
*/
export default {}
</script>
