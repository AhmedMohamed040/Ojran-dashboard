<template>
  <div>
    <vue-html2pdf
      ref="html2Pdf"
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="false"
      :paginate-elements-by-height="1400"
      filename="orjan"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="portrait"

      pdf-content-width="100%"
      @progress="onProgress($event)"
    >
      <section slot="pdf-content">
        <slot></slot>
      </section>
    </vue-html2pdf>
  </div>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf'

export default {
  name: 'DownloadPdf',
  components: {
    VueHtml2pdf
  },

  /* props: {
    message: {
      type: String,
      default: 'invoice-download'
    }
  }, */
  methods: {
    generateReport () {
      this.$refs.html2Pdf.generatePdf()
    },
    onProgress(event) {
      console.log(event)
    }
  }
}
</script>
