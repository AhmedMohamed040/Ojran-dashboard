<template>
    <div class="text-center">
        <v-dialog v-model="dialog" width="500" scrollable>
            

            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    {{ $t('common.Attachments') }} / {{ $t('common.Images') }}
                </v-card-title>

                <v-card-text>
                    <v-list>
                        <v-list-item v-for="item, i in data" :key="i">
                            <v-list-item-icon >
                                <v-icon color="indigo">
                                    mdi-attachment
                                </v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>
                                    ({{i+1}})
                                    <v-btn class="ma-2" outlined :href="item.url" download target="_blank">
                                        {{$t('common.download')}}
                                    </v-btn>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="$emit('close')">
                        {{$t('common.close')}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'AttachmentDialog',
    props: ['dialog', 'data'],
    data() {
        return {
        }
    },
}
</script>