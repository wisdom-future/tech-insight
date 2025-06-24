<template>
  <el-dialog v-model="visible" :title="dialogTitle" width="800px" @close="onClose">
    <el-table :data="pagedData" style="width: 100%">
      <el-table-column v-for="col in columns" :key="col.prop" :prop="col.prop" :label="col.label" show-overflow-tooltip />
    </el-table>
    <el-pagination
      v-if="total > pageSize"
      class="mt-4"
      background
      layout="prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="page"
      @current-change="page = $event"
    />
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  visible: Boolean,
  data: Array,
  columns: Array,
  dialogTitle: String,
  pageSize: { type: Number, default: 10 }
});
const emit = defineEmits(['update:visible']);

const page = ref(1);

const pagedData = computed(() =>
  props.data.slice((page.value - 1) * props.pageSize, page.value * props.pageSize)
);
const total = computed(() => props.data.length);

watch(() => props.visible, (val) => { if (!val) page.value = 1; });

function onClose() {
  emit('update:visible', false);
}
</script>
