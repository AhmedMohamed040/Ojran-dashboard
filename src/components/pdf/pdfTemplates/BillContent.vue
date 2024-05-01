<template>
  <div class="invoice-box">
    <header>
      <h1>{{ $t('common.accountStatement') }}</h1>
      <address contenteditable v-if="merchant">
        <p class="text">{{ $t('common.address') + ' : ' }}<bdi class="rtl">{{ String(merchant.address) }}</bdi></p>
        <p class="text">{{ $t('joinRequest.phone') + ' : ' }}<bdi class="rtl" >{{ String(merchant.phone) }}</bdi></p>
        <p class="text">{{ $t('profile.email') + ' : ' }}<bdi class="rtl">{{ String(merchant.email) }}</bdi></p>
        <p class="text">{{ $t('joinRequest.companyName') + ' : ' }}<bdi class="rtl">{{ String(merchant.companyName) }}</bdi></p>
        <!--  <p>الحساب: {{ 'item.taxAccount' }}</p>
        <p>الرقم الضريبى: {{ 'item.taxNumber' }}</p>
        <p>السجل التجارى: {{ 'item.commercialRegister' }}</p> -->
      </address>
      <span><img class="logo" alt="" :src="require('@/assets/images/ojranLogo.png')"> </span>

    </header>
    <article>

      <table class="meta">
        <tr>
          <th><span contenteditable>{{ $t('Bills.numberOfMovements') }}</span></th>
          <td><span contenteditable>{{ bills.numberOfMovements }}</span></td>
        </tr>
        <tr>
          <th><span contenteditable>{{ $t('common.total') }}</span></th>
          <td><span contenteditable>{{ bills.total }}</span></td>
        </tr>
        <tr>
          <th><span contenteditable>{{ $t('Bills.balance') }}</span></th>
          <td><span> {{ bills.balance ? bills.balance.toFixed(2) : '--'}}</span></td>
        </tr>
      </table>
      <div class="float-left ">

        <h1 class="text"><span class="ltr">{{ bills.merchantName }}</span>{{ ' - ' + $t('Merchant.merchantName') }}</h1>
        <br>
        <br>
       <!--  <address contenteditable>
          <p>شركة الفردوس<br> محمد على</p>
        </address> -->
      </div>
      <table class="inventory">
        <thead>
          <tr>
            <th><span contenteditable>{{ $t('Bills.balance') }}</span></th>
            <th><span contenteditable>{{ $t('Bills.creditor') }}</span></th>
            <th><span contenteditable>{{ $t('Bills.debtor') }}</span></th>
            <th><span contenteditable>{{ $t('Invoices.paymentMethod') }}</span></th>
            <th><span contenteditable>{{ $t('Invoices.movementDate') }}</span></th>
            <th><span contenteditable>{{ $t('Invoices.typeOfMovement') }}</span></th>
            <th><span contenteditable>{{ $t('Invoices.documentId') }}</span></th>
            <th><span contenteditable>{{ $t('Invoices.id') }}</span></th>
            <!-- <th><span contenteditable>{{ $t('Invoices.id') }}</span></th> -->
          </tr>
        </thead>
        <tbody v-if="bills.payments">
          <tr v-for="bill in bills.payments.model" :key="bill.sid">
            <td><span> {{   bill.balance ? bill.balance.toFixed(2) : 0}}</span></td>
            <td><span> {{ bill.creditor ? bill.creditor.toFixed(2) : 0 }}</span></td>
            <td><span contenteditable> {{ bill.debtor ? bill.debtor.toFixed(2) : 0  }}</span></td>
            <td><span contenteditable>{{  bill.paymentMethod ? bill.paymentMethod.name : $t('common.doesnotExist') }}</span></td>
            <td><span contenteditable>{{ bill.createdAt ? bill.createdAt.substr(0, 10) : '' }}</span></td>
            <td><span contenteditable>{{ bill.paymentType ? bill.paymentType.name : $t('common.doesnotExist') }}</span></td>
            <td><span contenteditable>{{ bill.invoiceSid }}</span></td>
            <td><span contenteditable>{{ bill.sid }}</span></td>


          </tr>
        </tbody>
      </table>
      <table class="balance">

      </table>

    </article>
    <aside>
      <h3><span contenteditable class="ltr"></span></h3>
      <div contenteditable v-if="bills.payments">
       <!--  <p>{{ bills.payments.currentPage }}</p> -->
      </div>
    </aside>
  </div>
</template>
<script>
export default {

  name: 'BillContent',

  props: ['bills', 'info'],
  data() {
    return {
      merchant: ''
    }
  },

  mounted() {

    this.check()

  },

  methods: {
    check() {
      console.log(this.info)
      this.info ?  this.merchant = JSON.parse(localStorage.getItem('merchantInfo')) : this.merchant = this.info

    }
  }
}
</script>
<style scoped>
/* reset */
.invoice-box{
  padding: 10px 30px;

}

*
{
  direction: ltr;
border: 0;
box-sizing: content-box;
color: inherit;
font-family: inherit;
font-size: inherit;
font-style: inherit;
font-weight: inherit;
line-height: inherit;
list-style: none;
/* margin: 0;
padding: 0; */
text-decoration: none;
vertical-align: top;
}

/* content editable */
.ltr-dir{
direction: ltr;
}
*[contenteditable] { border-radius: 0.25em; min-width: 1em; outline: 0; }

*[contenteditable] { cursor: pointer; }

*[contenteditable]:hover, *[contenteditable]:focus, td:hover *[contenteditable], td:focus *[contenteditable], img.hover { background: #DEF; box-shadow: 0 0 1em 0.5em #DEF; }

span[contenteditable] { display: inline-block; }
.text {

}
.ltr{
  unicode-bidi: embed; direction: ltr;
}
.rtl{
  unicode-bidi: embed; direction: rtl;
}
/* heading */

h1 { font: bold 100% sans-serif; letter-spacing: 0em; text-align: center; text-transform: uppercase; }

/* table */

table { font-size: 68%; table-layout: fixed; width: 100%; }
table { border-collapse: separate; border-spacing: 2px; }
th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: center; }
th, td { border-radius: 0.25em; border-style: solid; }
th { background: #EEE; border-color: #BBB; }
td { border-color: #DDD; }

/* page */

html { font: 16px/1 'Open Sans', sans-serif; overflow: auto; padding: 0.5in; }
html { background: #999; cursor: default; }

body { box-sizing: border-box; height: 11in; margin: 0 auto; overflow: hidden; padding: 0.5in; width: 8.5in; }
body { background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }

/* header */

header { margin: 0 0 2em; }
header:after { clear: both; content: ""; display: table; }

header h1 { background: #000; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }
header address { float: left; font-size: 68%; font-style: normal; line-height: 1.25; margin:  1em 0 0 1em ; }
header address p { margin: 0 0 0.1em; }
header span, header img { display: block; float: right; }
header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }
header img { max-height: 100%; max-width: 100%; }
header input { cursor: pointer; -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)"; height: 100%; left: 0; opacity: 0; position: absolute; top: 0; width: 100%; }

/* article */
article, article address, table.meta, table.inventory { margin: 0 0 1em; }
article:after { clear: both; content: ""; display: table; }
article h1 { clip: rect(0 0 0 0); position: absolute; }

article address { float: right; font-size: 100%; font-weight: bold; }

/* table meta & balance */

table.meta { text-align: right; direction: rtl; float: right; width: 35%; }
.float-left {float: left}
table.balance { text-align: right; direction: rtl; float: left; width: 40%; }
table.balance-2 { text-align: right; direction: rtl;  float: right; width: 40%; }
table.meta:after, table.balance:afterو table.balance-2:after { clear: both; content: ""; display: table; }

/* table meta */

table.meta th { width: 40%; }
table.meta td { width: 60%; }

/* table items */

table.inventory { clear: both; width: 100%; }
table.inventory th { font-weight: bold; text-align: center; }

table.inventory td:nth-child(1) { width: 26%; }
table.inventory td:nth-child(2) { width: 38%; }
table.inventory td:nth-child(3) { text-align: center; width: 12%; }
table.inventory td:nth-child(4) { text-align: center; width: 12%; }
table.inventory td:nth-child(5) { text-align: center; width: 12%; }

/* table balance */
table.balance th{ width: 70%; }
table.balance td { width: 30%; }
table.balance td { text-align: center; }
table.balance-2 th{ width: 70%; }
table.balance-2 td { width: 30%; }
table.balance-2 td, table.balance-2 { text-align: center; }

/* aside */

aside h3 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
aside h3 { border-color: #999; border-bottom-style: solid; }

/* javascript */

.add, .cut
{
border-width: 1px;
display: block;
font-size: .6rem;
padding: 0.25em 0.5em;
float: right;
text-align: center;
width: 0.6em;
}

.add, .cut
{
background: #9AF;
box-shadow: 0 1px 2px rgba(0,0,0,0.2);
background-image: -moz-linear-gradient(#00ADEE 5%, #0078A5 100%);
background-image: -webkit-linear-gradient(#00ADEE 5%, #0078A5 100%);
border-radius: 0.5em;
border-color: #0076A3;
color: #FFF;
cursor: pointer;
font-weight: bold;
text-shadow: 0 -1px 2px rgba(0,0,0,0.333);
}

.add { margin: -2.5em 0 0; }

.add:hover { background: #00ADEE; }

.cut { opacity: 0; position: absolute; top: 0; left: -1.5em; }
.cut { -webkit-transition: opacity 100ms ease-in; }

tr:hover .cut { opacity: 1; }

@media print {
* { -webkit-print-color-adjust: exact; }
html { background: none; padding: 0; }
body { box-shadow: none; margin: 0; }
span:empty { display: none; }
.add, .cut { display: none; }
}

@page { margin: 0; }
</style>
