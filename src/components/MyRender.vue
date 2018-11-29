<script>
export default {
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number
  },
  render: (h, ctx) => {
    const { row, index, render } = ctx.props;
    return render(row, index, h);
  }
};
</script>