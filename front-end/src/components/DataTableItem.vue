<script>
import  { h } from 'vue'
export default {
  name: 'DataTableItem',
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    item: {},
    itemRender: {
      type: Function,
      //default: function(h, text, item, editable) {
      default: function() {
        // const { h } = Vue
        //return <span>{this.itemData}</span>
        return h('span',{},this.itemData)
      }
    },
    itemData: {
      default: ''
    }
  },
  render: function(h) {
    return this.itemRender(h, this.itemData, this.item, this.editable)
  }
}
</script>