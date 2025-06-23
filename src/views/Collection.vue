<template>
  <div class="space-y-6">
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="p-5">
        <h3 class="text-lg leading-6 font-medium text-gray-900">数据采集状态</h3>
        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="bg-blue-50 overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <span class="text-2xl">📚</span>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">学术论文</dt>
                    <dd class="text-lg font-medium text-gray-900">1,250 条</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-green-50 overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <span class="text-2xl">🔬</span>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">专利数据</dt>
                    <dd class="text-lg font-medium text-gray-900">3,420 条</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
